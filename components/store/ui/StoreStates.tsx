import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export function StoreError({ error, onRetry }: { error?: Error | null; onRetry?: () => void }) {
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
