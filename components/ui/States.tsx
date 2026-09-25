import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE } from '@/theme/palette';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function LoadingState({ padded = true }: { padded?: boolean }) {
  return (
    <View className="items-center justify-center" style={{ paddingVertical: padded ? 48 : 0 }}>
      <ActivityIndicator color={PALETTE.red} />
    </View>
  );
}

interface MessageProps {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: MessageProps) {
  return (
    <View className="items-center px-6" style={{ paddingVertical: 56 }}>
      {icon && <Ionicons name={icon} size={38} color={PALETTE.textDim} />}
      <Text
        className="text-center font-body-semibold text-white"
        style={{ fontSize: 16, marginTop: icon ? 12 : 0 }}>
        {title}
      </Text>
      {message ? (
        <Text
          className="text-center font-body"
          style={{ fontSize: 14, lineHeight: 19, color: PALETTE.textMuted, marginTop: 6 }}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={{ backgroundColor: PALETTE.red, height: 38, borderRadius: 19, marginTop: 18 }}
          className="items-center justify-center px-6 active:opacity-80">
          <Text
            className="font-body-semibold text-white"
            style={{ fontSize: 13, letterSpacing: 0.4 }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Shown when a Supabase request fails. */
export function ErrorState({ error, onRetry }: { error?: Error | null; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="Couldn't load this right now"
      message={
        error?.message
          ? `Check your connection and try again.\n(${error.message})`
          : 'Check your connection and try again.'
      }
      actionLabel={onRetry ? 'TRY AGAIN' : undefined}
      onAction={onRetry}
    />
  );
}
