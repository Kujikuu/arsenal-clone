import React from 'react';
import { Text, Pressable, ActivityIndicator, type ViewStyle, type StyleProp } from 'react-native';
import { ARSENAL } from '@/theme/arsenal';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/** Rounded call-to-action used across the app (APPLY, MATCH CENTRE, READ FULL ARTICLE ...). */
export function PillButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  height = 46,
  style,
}: Props) {
  const inactive = disabled || loading;
  const background =
    variant === 'primary'
      ? inactive
        ? ARSENAL.applyDisabled
        : ARSENAL.red
      : variant === 'secondary'
        ? ARSENAL.button
        : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: background,
          borderWidth: variant === 'outline' ? 1.2 : 0,
          borderColor: ARSENAL.red,
          paddingHorizontal: 20,
        },
        style,
      ]}
      className="flex-row items-center justify-center active:opacity-80">
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text
          className="font-body-semibold"
          style={{
            fontSize: height > 40 ? 15 : 13,
            letterSpacing: 0.5,
            color: variant === 'primary' && inactive ? '#F6CBD0' : '#FFF',
          }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
