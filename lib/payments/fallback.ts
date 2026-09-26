// Stand-ins used when the Stripe SDK can't run: on web, and in native builds
// made before the SDK was added. The shop still works; card payment reports
// why it's unavailable instead of crashing the app.
import React from 'react';

export type PaymentsUnavailableReason = 'web' | 'no-key' | 'needs-update';

export const UNAVAILABLE_MESSAGE: Record<PaymentsUnavailableReason, string> = {
  web: 'Card payments are available in the mobile app.',
  'no-key': 'Card payments aren’t set up yet.',
  'needs-update': 'Update the app to pay by card.',
};

export function FallbackStripeProvider({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  return React.createElement(React.Fragment, null, children);
}

export function fallbackUseStripe(reason: PaymentsUnavailableReason) {
  const unsupported = async () => ({
    error: { code: 'Failed', message: UNAVAILABLE_MESSAGE[reason] },
  });
  return { initPaymentSheet: unsupported, presentPaymentSheet: unsupported };
}
