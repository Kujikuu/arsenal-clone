import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PriceTag } from '@/components/store/ui/PriceTag';
import { ProductImage } from '@/components/store/ui/ProductImage';
import type { Currency } from '@/types/database';
import { STORE } from '@/theme/store';

export interface TileProduct {
  id: string;
  title: string;
  main_image_url: string;
  price: number;
  compare_at?: number | null;
  badge?: string | null;
  sold_out?: boolean;
}

interface Props {
  product: TileProduct;
  width: number;
  currency: Currency;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
  /** Shows the red "+" quick-buy button. */
  onQuickBuy?: () => void;
}

/** Listing tile: grey image well, heart, quick-buy "+", title and price. */
export function ProductTile({
  product,
  width,
  currency,
  saved,
  onPress,
  onToggleSaved,
  onQuickBuy,
}: Props) {
  const label = product.sold_out ? 'Sold out' : product.badge;
  return (
    <View style={{ width }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={product.title}
        className="active:opacity-85">
        <ProductImage
          uri={product.main_image_url}
          width={width}
          height={width * 1.05}
          radius={STORE_TILE}
          dimmed={product.sold_out}
        />
        {label ? (
          <Text
            className="font-body-bold"
            style={{ fontSize: 11, color: STORE.linkRed, marginTop: 8, letterSpacing: 0.4 }}>
            {label.toUpperCase()}
          </Text>
        ) : null}
        <Text
          className="font-body"
          numberOfLines={3}
          style={{ fontSize: 15, lineHeight: 20, color: STORE.text, marginTop: label ? 2 : 10 }}>
          {product.title}
        </Text>
        <View style={{ marginTop: 2 }}>
          <PriceTag price={product.price} compareAt={product.compare_at} currency={currency} />
        </View>
      </Pressable>
      <Pressable
        onPress={onToggleSaved}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        style={{ position: 'absolute', right: 8, top: 8 }}
        className="active:opacity-60">
        <Ionicons name={saved ? 'heart' : 'heart-outline'} size={24} color={STORE.cta} />
      </Pressable>
      {onQuickBuy && !product.sold_out ? (
        <Pressable
          onPress={onQuickBuy}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Quick buy ${product.title}`}
          style={{
            position: 'absolute',
            right: 8,
            top: width * 1.05 - 34,
            width: 26,
            height: 26,
            borderRadius: 5,
            backgroundColor: STORE.cta,
          }}
          className="items-center justify-center active:opacity-70">
          <Feather name="plus" size={20} color="#FFF" />
        </Pressable>
      ) : null}
    </View>
  );
}

const STORE_TILE = 6;
