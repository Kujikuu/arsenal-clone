# Store payments (store-checkout + stripe-webhook)

The shop takes payment with [Stripe](https://stripe.com). Orders are priced,
validated and have their stock reserved in Postgres by `create_store_order()`
(`migrations/20260927090000_store_commerce.sql`); these functions only talk to
Stripe.

- **store-checkout** (user JWT required) places the order for the signed-in
  user, creates a PaymentIntent for the order total and returns the
  PaymentSheet parameters to the app.
- **stripe-webhook** (Stripe signature, no JWT) is the only thing that marks an
  order paid (`payment_intent.succeeded`). A payment that arrives after its
  order expired is re-reserved, or refunded automatically if the stock has
  gone. `payment_intent.canceled` releases the order's stock.

## Deploy

```sh
supabase functions deploy store-checkout
supabase functions deploy stripe-webhook --no-verify-jwt
supabase secrets set STRIPE_SECRET_KEY=sk_live_or_test_...
```

In the Stripe dashboard add a webhook endpoint for
`https://<project-ref>.supabase.co/functions/v1/stripe-webhook` with the events
`payment_intent.succeeded` and `payment_intent.canceled`, then:

```sh
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

The app needs the publishable key (and, for Apple Pay, the merchant ID) in
`.env`: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_STRIPE_MERCHANT_ID`.
The Stripe SDK is native, so build a new dev client after adding it.

## Release abandoned checkouts

Unpaid orders hold their stock for 30 minutes. Schedule the cleanup with
`pg_cron`:

```sql
select cron.schedule('expire-store-orders', '*/5 * * * *', $$ select public.expire_pending_orders() $$);
```

## Local testing

```sh
supabase functions serve --env-file supabase/.env.local
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

Pay with `4242 4242 4242 4242` (any future date / CVC). `4000 0000 0000 9995`
declines; the order stays pending so the customer can retry, and its stock is
released when it expires.

## Promo codes

Codes live in `public.promo_codes` (not readable by clients). For example:

```sql
insert into public.promo_codes (code, description, percent_off, ends_at, max_redemptions)
values ('MATCHDAY20', '20% off this weekend', 20, now() + interval '3 days', 500);
```
