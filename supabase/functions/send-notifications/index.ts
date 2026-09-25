// Drains public.notification_events and delivers each event through Expo Push.
// Runs every minute from pg_cron (see README.md in this folder).
import { createClient } from 'npm:@supabase/supabase-js@2';

// Overridable for local testing against a mock server.
const EXPO_PUSH_URL = Deno.env.get('EXPO_PUSH_URL') ?? 'https://exp.host/--/api/v2/push/send';
/** Events older than this are dropped rather than sent late (e.g. after seeding or downtime). */
const MAX_AGE_MINUTES = 30;
const EVENTS_PER_RUN = 20;
/** Expo accepts at most 100 messages per request. */
const EXPO_CHUNK = 100;

interface NotificationEvent {
  id: number;
  category: string;
  title: string;
  body: string;
  url: string | null;
}

interface ExpoTicket {
  status: 'ok' | 'error';
  message?: string;
  details?: { error?: string };
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
);

async function sendToExpo(tokens: string[], event: NotificationEvent) {
  const accessToken = Deno.env.get('EXPO_ACCESS_TOKEN');
  const dead: string[] = [];
  let delivered = 0;
  const errors: string[] = [];

  for (let i = 0; i < tokens.length; i += EXPO_CHUNK) {
    const chunk = tokens.slice(i, i + EXPO_CHUNK);
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(
        chunk.map((to) => ({
          to,
          title: event.title,
          body: event.body,
          sound: 'default',
          channelId: 'default',
          data: { url: event.url, category: event.category },
        }))
      ),
    });
    if (!res.ok) {
      errors.push(`Expo ${res.status}: ${await res.text()}`);
      continue;
    }
    const { data } = (await res.json()) as { data: ExpoTicket[] };
    data.forEach((ticket, j) => {
      if (ticket.status === 'ok') delivered++;
      else if (ticket.details?.error === 'DeviceNotRegistered') dead.push(chunk[j]);
      else if (ticket.message) errors.push(ticket.message);
    });
  }

  if (dead.length) await supabase.from('push_tokens').delete().in('token', dead);
  return { delivered, error: errors.length ? errors.slice(0, 5).join('; ') : null };
}

Deno.serve(async (req) => {
  const secret = Deno.env.get('NOTIFY_CRON_SECRET');
  if (!secret || req.headers.get('Authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const kickoff = await supabase.rpc('enqueue_kickoff_reminders');
  if (kickoff.error) console.error('enqueue_kickoff_reminders failed', kickoff.error);

  const now = new Date();
  const cutoff = new Date(now.getTime() - MAX_AGE_MINUTES * 60_000).toISOString();
  await supabase
    .from('notification_events')
    .update({ sent_at: now.toISOString(), recipients: 0, error: 'expired' })
    .is('sent_at', null)
    .lt('created_at', cutoff);

  const { data: events, error } = await supabase
    .from('notification_events')
    .select('id, category, title, body, url')
    .is('sent_at', null)
    .order('created_at')
    .limit(EVENTS_PER_RUN);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = [];
  for (const event of (events ?? []) as NotificationEvent[]) {
    // Claim the event first so overlapping runs never send it twice.
    const { data: claimed } = await supabase
      .from('notification_events')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', event.id)
      .is('sent_at', null)
      .select('id');
    if (!claimed?.length) continue;

    const { data: rows, error: tokenError } = await supabase.rpc('notification_tokens', {
      p_event_id: event.id,
    });
    if (tokenError) {
      await supabase
        .from('notification_events')
        .update({ error: tokenError.message })
        .eq('id', event.id);
      continue;
    }
    const tokens = ((rows ?? []) as { token: string }[]).map((r) => r.token);
    const { delivered, error: sendError } = tokens.length
      ? await sendToExpo(tokens, event)
      : { delivered: 0, error: null };
    await supabase
      .from('notification_events')
      .update({ recipients: delivered, error: sendError })
      .eq('id', event.id);
    results.push({ id: event.id, tokens: tokens.length, delivered });
  }

  return Response.json({ kickoffsQueued: kickoff.data ?? 0, sent: results });
});
