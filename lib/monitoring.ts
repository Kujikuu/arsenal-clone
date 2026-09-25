import * as Sentry from '@sentry/react-native';
import type { ComponentType } from 'react';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

/** Crash and error reporting is on only when a DSN is configured for the build. */
export const isMonitoringEnabled = Boolean(SENTRY_DSN) && !__DEV__;

if (isMonitoringEnabled) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_APP_ENV ?? 'production',
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}

/** Report a handled error; it still goes to the console in development. */
export function reportError(error: unknown, context?: Record<string, unknown>) {
  if (__DEV__) console.warn('[error]', error, context ?? '');
  if (isMonitoringEnabled) Sentry.captureException(error, context ? { extra: context } : undefined);
}

/** Wrap the root component so render crashes are captured. No-op without a DSN. */
export function withMonitoring(Component: ComponentType<Record<string, unknown>>) {
  return isMonitoringEnabled ? Sentry.wrap(Component) : Component;
}
