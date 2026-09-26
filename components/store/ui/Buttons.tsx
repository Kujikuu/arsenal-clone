import React from 'react';
import {
  View,
  Pressable,
  Text,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { STORE } from '@/theme/store';

type Variant = 'primary' | 'bright' | 'secondary' | 'dark' | 'outline';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const BG: Record<Variant, string> = {
  primary: STORE.cta,
  bright: STORE.headerRed,
  secondary: STORE.chip,
  dark: STORE.selected,
  outline: 'transparent',
};

/** Pill button in the shop style: dark red CTA, grey secondary. */
export function StoreButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  height = 48,
  style,
  accessibilityLabel,
}: Props) {
  const inactive = disabled || loading;
  const light = variant === 'secondary' || variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[
        {
          height,
          borderRadius: height / 2,
          paddingHorizontal: 18,
          backgroundColor: BG[variant],
          opacity: disabled && !light ? 0.55 : 1,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: STORE.text,
        },
        style,
      ]}
      className="items-center justify-center active:opacity-80">
      {loading ? (
        <ActivityIndicator color={light ? STORE.text : '#FFF'} />
      ) : (
        <Text
          className="font-body-medium"
          numberOfLines={1}
          style={{
            color: light ? (disabled ? STORE.textFaint : STORE.text) : '#FFF',
            fontSize: height >= 44 ? 15 : 13,
            letterSpacing: 0.5,
          }}>
          {label.toUpperCase()}
        </Text>
      )}
    </Pressable>
  );
}

/** Black-when-selected segmented choice, e.g. MENS / WOMENS / KIDS. */
export function SegmentedButtons<T extends string>({
  options,
  value,
  onChange,
  height = 40,
  labels,
}: {
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
  height?: number;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <View className="flex-row">
      {options.map((o, i) => {
        const selected = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={{
              flex: 1,
              height,
              borderRadius: STORE_CHIP,
              marginLeft: i ? 8 : 0,
              backgroundColor: selected ? STORE.selected : STORE.chip,
              paddingHorizontal: 6,
            }}
            className="items-center justify-center">
            <Text
              className="text-center font-body-semibold"
              numberOfLines={2}
              style={{ color: selected ? '#FFF' : STORE.text, fontSize: 13, letterSpacing: 0.4 }}>
              {(labels?.[o] ?? o).toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const STORE_CHIP = 8;
