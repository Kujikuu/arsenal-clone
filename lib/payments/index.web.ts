// The Stripe SDK is native-only. On web the shop can be browsed and the bag
// filled, but checkout asks the customer to use the mobile app.
import React from 'react';

export const STRIPE_PUBLISHABLE_KEY = '';
export const STRIPE_MERCHANT_ID = '';
export const paymentsSupported = false;

export function StripeProvider({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  return React.createElement(React.Fragment, null, children);
}

const unsupported = async () => ({
  error: { code: 'Failed', message: 'Payments are available in the mobile app.' },
});

export function useStripe() {
  return { initPaymentSheet: unsupported, presentPaymentSheet: unsupported };
}
