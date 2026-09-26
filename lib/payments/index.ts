import { NativeModules, TurboModuleRegistry } from 'react-native';
import type * as StripeSdk from '@stripe/stripe-react-native';
import {
  FallbackStripeProvider,
  UNAVAILABLE_MESSAGE,
  fallbackUseStripe,
  type PaymentsUnavailableReason,
} from '@/lib/payments/fallback';

export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
export const STRIPE_MERCHANT_ID = process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID ?? '';

// Importing the SDK throws when the native binary doesn't include it (a build
// made before Stripe was added), which would crash the whole app. Look for the
// native module first and only load the SDK when it's there.
const nativeAvailable = Boolean(TurboModuleRegistry.get('StripeSdk') ?? NativeModules.StripeSdk);

const sdk: typeof StripeSdk | null = nativeAvailable
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@stripe/stripe-react-native')
  : null;

export const paymentsUnavailableReason: PaymentsUnavailableReason | null = !sdk
  ? 'needs-update'
  : !STRIPE_PUBLISHABLE_KEY
    ? 'no-key'
    : null;
export const paymentsSupported = paymentsUnavailableReason === null;
export { UNAVAILABLE_MESSAGE };

export const StripeProvider: typeof StripeSdk.StripeProvider =
  sdk?.StripeProvider ?? (FallbackStripeProvider as unknown as typeof StripeSdk.StripeProvider);

export const useStripe: typeof StripeSdk.useStripe =
  sdk?.useStripe ??
  ((() =>
    fallbackUseStripe(
      paymentsUnavailableReason ?? 'needs-update'
    )) as unknown as typeof StripeSdk.useStripe);
