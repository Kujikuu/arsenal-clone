import React from 'react';
import { View, Text } from 'react-native';
import { DisplayText } from '@/components/ui/DisplayText';
import { formatPrice } from '@/lib/format';
import type { Currency } from '@/types/database';
import { PALETTE } from '@/theme/palette';

interface Props {
  currency: Currency;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  /** Shows "Spend X more for free delivery" while shipping is charged. */
  freeShippingThreshold?: number;
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 10 }}>
      <Text className="font-body" style={{ fontSize: 15, color: PALETTE.textMuted }}>
        {label}
      </Text>
      <Text
        className="font-body-semibold"
        style={{ fontSize: 15, color: accent ? PALETTE.formUp : '#FFF' }}>
        {value}
      </Text>
    </View>
  );
}

export function PriceSummary({
  currency,
  subtotal,
  discount,
  shipping,
  total,
  promoCode,
  freeShippingThreshold,
}: Props) {
  const toFree =
    freeShippingThreshold !== undefined && shipping > 0
      ? freeShippingThreshold - (subtotal - discount)
      : 0;
  return (
    <View>
      <Row label="Subtotal" value={formatPrice(subtotal, currency)} />
      {discount > 0 && (
        <Row
          label={promoCode ? `Discount (${promoCode})` : 'Discount'}
          value={`−${formatPrice(discount, currency)}`}
          accent
        />
      )}
      <Row label="Delivery" value={shipping > 0 ? formatPrice(shipping, currency) : 'Free'} />
      {toFree > 0 && (
        <Text
          className="font-body"
          style={{ fontSize: 13, color: PALETTE.textDim, marginBottom: 10 }}>
          Spend {formatPrice(toFree, currency)} more for free delivery
        </Text>
      )}
      <View style={{ height: 1, backgroundColor: PALETTE.divider, marginVertical: 6 }} />
      <View className="flex-row items-center justify-between" style={{ marginTop: 6 }}>
        <Text className="font-body-semibold text-white" style={{ fontSize: 16 }}>
          Total
        </Text>
        <DisplayText size={17}>{formatPrice(total, currency)}</DisplayText>
      </View>
    </View>
  );
}
