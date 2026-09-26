// Starts checkout for the signed-in user: places the order through
// create_store_order() (which prices the bag and reserves stock), then creates
// a Stripe PaymentIntent for the order total and returns what the app's
// PaymentSheet needs. The order is marked paid only by stripe-webhook.
import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@18';
import { sendReceipt } from '../_shared/receipt.ts';
import { BadRequest, describeOrderError, parseCheckoutRequest, toMinorUnits } from './payload.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
});

const admin = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  currency: string;
  total: number | string;
  amount_due: number | string;
}

const fail = (status: number, message: string, reason?: string) =>
  Response.json({ error: message, reason }, { status });

/** Reuses the user's Stripe customer so saved cards appear in the PaymentSheet. */
async function stripeCustomerFor(userId: string, email: string | undefined): Promise<string> {
  const { data } = await admin
    .from('stripe_customers')
    .select('customer_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (data?.customer_id) return data.customer_id;

  const customer = await stripe.customers.create(
    { email, metadata: { user_id: userId } },
    { idempotencyKey: `customer-${userId}` }
  );
  const { error } = await admin
    .from('stripe_customers')
    .upsert({ user_id: userId, customer_id: customer.id }, { onConflict: 'user_id' });
  if (error) throw error;
  return customer.id;
}

/** Earlier unpaid checkouts are cancelled by create_store_order(); stop their payments too. */
async function cancelStalePaymentIntents(userId: string, keepOrderId: string) {
  const { data } = await admin
    .from('orders')
    .select('stripe_payment_intent_id')
    .eq('user_id', userId)
    .eq('status', 'cancelled')
    .neq('id', keepOrderId)
    .not('stripe_payment_intent_id', 'is', null)
    .gte('cancelled_at', new Date(Date.now() - 60_000).toISOString());
  for (const row of data ?? []) {
    try {
      await stripe.paymentIntents.cancel(row.stripe_payment_intent_id);
    } catch {
      // Already succeeded or cancelled: stripe-webhook reconciles it.
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return fail(405, 'Method not allowed');
  if (!Deno.env.get('STRIPE_SECRET_KEY')) return fail(503, 'Payments are not configured yet');

  const authorization = req.headers.get('Authorization');
  if (!authorization) return fail(401, 'Sign in to check out');

  // Runs as the caller so create_store_order() sees their auth.uid().
  const asUser = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false },
  });
  const {
    data: { user },
  } = await asUser.auth.getUser(authorization.replace(/^Bearer\s+/i, ''));
  if (!user) return fail(401, 'Sign in to check out');

  let request;
  try {
    request = parseCheckoutRequest(await req.json());
  } catch (err) {
    if (err instanceof BadRequest) return fail(400, err.message, err.reason);
    return fail(400, 'Invalid request');
  }

  const { data: order, error } = await asUser
    .rpc('create_store_order', {
      p_currency: request.currency,
      p_items: request.items,
      p_address_id: request.addressId,
      p_promo_code: request.promoCode,
      p_zone: request.zone,
      p_method: request.method,
      p_gift_card: request.giftCard,
    })
    .single<Order>();
  if (error || !order) {
    const described = describeOrderError(error ?? {});
    if (described.status >= 500) console.error('create_store_order failed', error);
    return fail(described.status, described.message, described.reason);
  }

  // A gift card covered everything: the order is already paid.
  if (order.status === 'paid') {
    await cancelStalePaymentIntents(user.id, order.id);
    await sendReceipt(admin, order.id);
    return Response.json({ orderId: order.id, orderNumber: order.order_number, paid: true });
  }

  try {
    const customer = await stripeCustomerFor(user.id, user.email);
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer },
      { apiVersion: Stripe.API_VERSION }
    );
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: toMinorUnits(order.amount_due),
        currency: order.currency.toLowerCase(),
        customer,
        automatic_payment_methods: { enabled: true },
        description: `Order ${order.order_number}`,
        metadata: { order_id: order.id, order_number: order.order_number, user_id: user.id },
      },
      { idempotencyKey: `order-${order.id}` }
    );

    const { error: attachError } = await admin
      .from('orders')
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq('id', order.id);
    if (attachError) throw attachError;

    await cancelStalePaymentIntents(user.id, order.id);

    return Response.json({
      orderId: order.id,
      orderNumber: order.order_number,
      paid: false,
      paymentIntentClientSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId: customer,
    });
  } catch (err) {
    console.error('Stripe checkout failed', err);
    // Put the stock back; the customer can simply try again.
    await admin.rpc('cancel_pending_order', { p_order_id: order.id });
    return fail(502, 'We couldn’t reach our payment provider. Please try again.');
  }
});
