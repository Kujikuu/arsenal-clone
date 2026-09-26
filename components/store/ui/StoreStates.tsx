import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isSupabaseConfigured } from '@/lib/supabase';
import { StoreButton } from '@/components/store/ui/Buttons';
import { STORE } from '@/theme/store';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function StoreEmpty({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center px-6" style={{ paddingVertical: 48 }}>
      {icon ? <Ionicons name={icon} size={40} color={STORE.textFaint} /> : null}
      <Text
        className="text-center font-body-semibold"
        style={{ fontSize: 17, color: STORE.text, marginTop: icon ? 12 : 0 }}>
        {title}
      </Text>
      {message ? (
        <Text
          className="text-center font-body"
          style={{ fontSize: 14.5, lineHeight: 20, color: STORE.textMuted, marginTop: 6 }}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <StoreButton label={actionLabel} height={42} onPress={onAction} style={{ marginTop: 18 }} />
      ) : null}
    </View>
  );
}

const MISSING_SCHEMA_CODES = new Set(['PGRST202', 'PGRST205', '42P01', '42883']);

/** Why the shop can't load when the backend itself isn't ready, or null. */
export function storeSetupProblem(error?: Error | null): { title: string; message: string } | null {
  if (!isSupabaseConfigured)
    return {
      title: "Supabase isn't connected",
      message:
        'Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to .env, then restart Metro with "npx expo start -c".',
    };
  const code = (error as { code?: string } | null | undefined)?.code;
  if (
    error &&
    ((code && MISSING_SCHEMA_CODES.has(code)) ||
      /does not exist|could not find the (function|table)|schema cache/i.test(error.message))
  )
    return {
      title: "The shop database isn't set up",
      message:
        'Apply the latest migrations ("supabase db push") and load supabase/seed.sql into your project, then pull to refresh.',
    };
  return null;
}

export function StoreError({ error, onRetry }: { error?: Error | null; onRetry?: () => void }) {
  const setup = storeSetupProblem(error);
  if (setup)
    return (
      <StoreEmpty
        icon="construct-outline"
        title={setup.title}
        message={setup.message}
        actionLabel={onRetry ? 'Try again' : undefined}
        onAction={onRetry}
      />
    );
  return (
    <StoreEmpty
      icon="cloud-offline-outline"
      title="Couldn't load this right now"
      message={
        error?.message
          ? `Check your connection and try again.\n(${error.message})`
          : 'Check your connection and try again.'
      }
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
    />
  );
}
