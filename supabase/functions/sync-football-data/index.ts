// Imports the club's fixtures, live scores and the league table from
// football-data.org (free plan) into public.matches and public.standings.
// Runs from pg_cron (see README.md in this folder).
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  currentSeasonYear,
  mapMatch,
  mapStandings,
  seasonLabel,
  type Club,
  type FdMatch,
  type FdStandings,
} from './mapping.ts';

// Overridable for local testing against a mock server.
const API = Deno.env.get('FOOTBALL_DATA_API_URL') ?? 'https://api.football-data.org/v4';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
);

async function fdGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'X-Auth-Token': Deno.env.get('FOOTBALL_DATA_TOKEN') ?? '' },
  });
  if (!res.ok) throw new Error(`football-data ${path}: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

async function syncMatches(teamId: string, season: number, club: Club) {
  const { matches } = await fdGet<{ matches: FdMatch[] }>(
    `/teams/${teamId}/matches?season=${season}`
  );
  const rows = matches.map((m) => mapMatch(m, club)).filter((r) => r !== null);
  if (!rows.length) return 0;
  const { error } = await supabase.from('matches').upsert(rows, { onConflict: 'external_id' });
  if (error) throw error;
  return rows.length;
}

async function syncStandings(competition: string, season: number) {
  const data = await fdGet<FdStandings>(`/competitions/${competition}/standings?season=${season}`);
  const { data: existing, error: readError } = await supabase
    .from('standings')
    .select('team_name, rank')
    .eq('team_type', 'men')
    .eq('competition', 'Premier League')
    .eq('season', seasonLabel(`${season}-08-01`));
  if (readError) throw readError;
  const previous = new Map((existing ?? []).map((r) => [r.team_name as string, r.rank as number]));

  const rows = mapStandings(data, previous);
  if (!rows.length) return 0;
  const { error } = await supabase
    .from('standings')
    .upsert(rows, { onConflict: 'team_type,season,competition,team_name' });
  if (error) throw error;
  return rows.length;
}

Deno.serve(async (req) => {
  const secret = Deno.env.get('SYNC_CRON_SECRET');
  if (!secret || req.headers.get('Authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const teamId = Deno.env.get('FOOTBALL_DATA_TEAM_ID') ?? '57'; // Arsenal
  const season = Number(Deno.env.get('FOOTBALL_DATA_SEASON') ?? currentSeasonYear());
  const club: Club = {
    name: Deno.env.get('CLUB_NAME') ?? 'Arsenal',
    stadium: Deno.env.get('CLUB_STADIUM') ?? 'Emirates Stadium',
  };
  // Standings change far less often than live scores; ?standings=1 from a slower cron.
  const withStandings = new URL(req.url).searchParams.get('standings') === '1';

  try {
    const matches = await syncMatches(teamId, season, club);
    const standings = withStandings ? await syncStandings('PL', season) : 0;
    return Response.json({ season, matches, standings });
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 502 });
  }
});
