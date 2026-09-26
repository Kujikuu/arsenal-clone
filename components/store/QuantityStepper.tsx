import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PALETTE } from '@/theme/palette';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  size?: 'sm' | 'md';
}

export function QuantityStepper({ value, onChange, min = 1, max, size = 'md' }: Props) {
  const h = size === 'sm' ? 32 : 42;
  const button = (icon: 'minus' | 'plus', next: number, disabled: boolean, label: string) => (
    <Pressable
      onPress={() => onChange(next)}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{ width: h, height: h, opacity: disabled ? 0.35 : 1 }}
      className="items-center justify-center active:opacity-60">
      <Feather name={icon} size={size === 'sm' ? 15 : 18} color="#FFF" />
    </Pressable>
  );
  return (
    <View
      accessibilityLabel={`Quantity ${value}`}
      style={{ height: h, borderRadius: h / 2, backgroundColor: PALETTE.pill }}
      className="flex-row items-center self-start">
      {button('minus', value - 1, value <= min, 'Decrease quantity')}
      <Text
        className="text-center font-body-semibold text-white"
        style={{ minWidth: 22, fontSize: size === 'sm' ? 14 : 16 }}>
        {value}
      </Text>
      {button('plus', value + 1, value >= max, 'Increase quantity')}
    </View>
  );
}
