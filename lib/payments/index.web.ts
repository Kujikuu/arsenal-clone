// The Stripe SDK is native-only. On web the shop can be browsed and the bag
// filled, but checkout asks the customer to use the mobile app.
import {
  FallbackStripeProvider,
  UNAVAILABLE_MESSAGE,
  fallbackUseStripe,
  type PaymentsUnavailableReason,
} from '@/lib/payments/fallback';

export const STRIPE_PUBLISHABLE_KEY = '';
export const STRIPE_MERCHANT_ID = '';
export const paymentsSupported = false;
export const paymentsUnavailableReason: PaymentsUnavailableReason | null = 'web';
export { UNAVAILABLE_MESSAGE };

export const StripeProvider = FallbackStripeProvider;
export const useStripe = () => fallbackUseStripe('web');
