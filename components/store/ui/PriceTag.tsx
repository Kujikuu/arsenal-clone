import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '@/lib/format';
import type { Currency } from '@/types/database';
import { STORE } from '@/theme/store';

/** "$60.00 $48.00": was-price struck through, sale price in red. */
export function PriceTag({
  price,
  compareAt,
  currency,
  size = 15,
}: {
  price: number;
  compareAt?: number | null;
  currency: Currency;
  size?: number;
}) {
  const onSale = compareAt != null && compareAt > price;
  return (
    <View className="flex-row flex-wrap items-baseline">
      {onSale ? (
        <Text
          className="font-body"
          style={{
            fontSize: size,
            color: STORE.textMuted,
            textDecorationLine: 'line-through',
            marginRight: 6,
          }}>
          {formatPrice(compareAt!, currency)}
        </Text>
      ) : null}
      <Text
        className="font-body-bold"
        style={{ fontSize: size, color: onSale ? STORE.sale : STORE.text }}>
        {formatPrice(price, currency)}
      </Text>
    </View>
  );
}

export function StarRating({
  rating,
  size = 16,
  color = STORE.star,
}: {
  rating: number;
  size?: number;
  color?: string;
}) {
  return (
    <View className="flex-row" accessibilityLabel={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={rating >= i - 0.25 ? 'star' : rating >= i - 0.75 ? 'star-half' : 'star-outline'}
          size={size}
          color={color}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}
