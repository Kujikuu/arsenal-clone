// Receives Stripe events and settles store orders. This is the only place an
// order becomes paid: the app never reports payment success itself.
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@18';
import { sendReceipt } from '../_shared/receipt.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } }
);

async function paymentSucceeded(intent: Stripe.PaymentIntent) {
  const { data: outcome, error } = await admin.rpc('mark_order_paid', {
    p_payment_intent_id: intent.id,
    p_amount_minor: intent.amount_received || intent.amount,
    p_currency: intent.currency,
  });
  if (error) throw error;

  if (outcome === 'refund') {
    // Paid after the order expired and the stock sold out in the meantime.
    await stripe.refunds.create(
      { payment_intent: intent.id, reason: 'requested_by_customer' },
      { idempotencyKey: `refund-${intent.id}` }
    );
  } else if (outcome === 'mismatch') {
    console.error(`Payment ${intent.id} does not match its order total; not fulfilling.`);
  } else if (outcome === 'unknown') {
    console.warn(`Payment ${intent.id} has no store order.`);
  } else if (outcome === 'paid' && intent.metadata?.order_id) {
    await sendReceipt(admin, intent.metadata.order_id);
  }
  return outcome as string;
}

Deno.serve(async (req) => {
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const signature = req.headers.get('Stripe-Signature');
  if (!secret || !signature) return new Response('Unauthorized', { status: 401 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      signature,
      secret,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    return new Response(`Invalid signature: ${(err as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        return Response.json({ outcome: await paymentSucceeded(event.data.object) });
      case 'payment_intent.canceled': {
        const { error } = await admin.rpc('cancel_order_payment', {
          p_payment_intent_id: event.data.object.id,
        });
        if (error) throw error;
        return Response.json({ outcome: 'cancelled' });
      }
      default:
        // payment_failed leaves the intent open so the customer can retry;
        // abandoned orders are released by expire_pending_orders().
        return Response.json({ ignored: event.type });
    }
  } catch (err) {
    console.error(`Handling ${event.type} failed`, err);
    // Non-2xx makes Stripe retry the event later.
    return new Response('Webhook handler failed', { status: 500 });
  }
});
