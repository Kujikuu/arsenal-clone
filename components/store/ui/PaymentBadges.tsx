import React from 'react';
import { View, Text } from 'react-native';
import { STORE } from '@/theme/store';

const PAYMENT_BADGES: { label: string; bg: string; fg: string }[] = [
  { label: 'VISA', bg: '#1A1F71', fg: '#FFF' },
  { label: 'Mastercard', bg: '#FFFFFF', fg: '#EB001B' },
  { label: 'AMEX', bg: '#2E77BC', fg: '#FFF' },
  { label: ' Pay', bg: '#000000', fg: '#FFF' },
  { label: 'G Pay', bg: '#FFFFFF', fg: '#3C4043' },
  { label: 'PayPal', bg: '#FFFFFF', fg: '#003087' },
  { label: 'Gift card', bg: '#C8102E', fg: '#FFF' },
];

export function PaymentBadges({ dark = true }: { dark?: boolean }) {
  return (
    <View className="flex-row flex-wrap" accessibilityLabel="Accepted payment methods">
      {PAYMENT_BADGES.map((b) => (
        <View
          key={b.label}
          style={{
            width: 58,
            height: 34,
            borderRadius: 4,
            backgroundColor: b.bg,
            marginRight: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: dark ? '#555' : STORE.divider,
          }}
          className="items-center justify-center">
          <Text className="font-body-bold" style={{ fontSize: 11, color: b.fg }} numberOfLines={1}>
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
