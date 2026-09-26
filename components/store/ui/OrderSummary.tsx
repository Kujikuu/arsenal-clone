import React from 'react';
import { View, Text } from 'react-native';
import { formatPrice } from '@/lib/format';
import type { Currency } from '@/types/database';
import { STORE } from '@/theme/store';

export interface SummaryValues {
  subtotal: number;
  member_discount?: number;
  discount?: number;
  promoCode?: string | null;
  shipping?: number | null;
  shippingLabel?: string;
  gift_card?: number;
  total: number;
  amount_due?: number;
}

function Row({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 8 }}>
      <Text
        className={bold ? 'font-body-bold' : 'font-body'}
        style={{ fontSize: bold ? 18 : 15, color: STORE.text }}>
        {label}
      </Text>
      <Text
        className={bold ? 'font-body-bold' : 'font-body-semibold'}
        style={{ fontSize: bold ? 18 : 15, color: accent ? STORE.success : STORE.text }}>
        {value}
      </Text>
    </View>
  );
}

/** Subtotal, discounts, delivery, gift card and total on the light shop theme. */
export function OrderSummary({
  values: v,
  currency,
}: {
  values: SummaryValues;
  currency: Currency;
}) {
  const f = (n: number) => formatPrice(n, currency);
  return (
    <View>
      <Row label="Subtotal" value={f(v.subtotal)} />
      {v.member_discount ? (
        <Row label="Members' discount" value={`−${f(v.member_discount)}`} accent />
      ) : null}
      {v.discount ? (
        <Row
          label={v.promoCode ? `Discount (${v.promoCode})` : 'Discount'}
          value={`−${f(v.discount)}`}
          accent
        />
      ) : null}
      {v.shipping === undefined ? null : (
        <Row
          label={v.shippingLabel ?? 'Delivery'}
          value={
            v.shipping === null ? 'Calculated at checkout' : v.shipping > 0 ? f(v.shipping) : 'Free'
          }
        />
      )}
      <View style={{ height: 1, backgroundColor: STORE.divider, marginVertical: 8 }} />
      <Row label="Total" value={f(v.total)} bold />
      {v.gift_card ? (
        <>
          <Row label="Gift card" value={`−${f(v.gift_card)}`} accent />
          <Row label="To pay" value={f(v.amount_due ?? v.total - v.gift_card)} bold />
        </>
      ) : null}
    </View>
  );
}
