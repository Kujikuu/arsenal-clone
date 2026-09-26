import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DisplayText } from '@/components/ui/DisplayText';
import { isSoldOut, productPrice } from '@/lib/api/store';
import { formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import type { Currency, StoreProduct } from '@/types/database';
import { PALETTE } from '@/theme/palette';

interface Props {
  product: StoreProduct;
  width: number;
  currency: Currency;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
}

/** Shop grid tile: image, badge, wishlist heart, title and price. */
export function ProductCard({ product, width, currency, saved, onPress, onToggleSaved }: Props) {
  const soldOut = isSoldOut(product);
  const label = soldOut ? 'Sold out' : product.badge;
  // The heart sits beside the card's pressable, not inside it, so the two never nest.
  return (
    <View
      style={{
        width,
        marginRight: 12,
        marginBottom: 14,
        borderRadius: 6,
        backgroundColor: PALETTE.surfaceRaised,
      }}
      className="overflow-hidden">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${product.title}, ${formatPrice(productPrice(product, currency), currency)}`}
        className="active:opacity-85">
        <Image
          source={resolveImage(product.main_image_url)}
          style={{ width, height: width * 1.1, opacity: soldOut ? 0.5 : 1 }}
          resizeMode="cover"
        />
        {label ? (
          <View
            style={{
              position: 'absolute',
              left: 8,
              top: 8,
              backgroundColor: soldOut ? PALETTE.button : PALETTE.red,
              borderRadius: 3,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}>
            <Text className="font-body-semibold text-white" style={{ fontSize: 10.5 }}>
              {label.toUpperCase()}
            </Text>
          </View>
        ) : null}
        <View style={{ padding: 10, minHeight: 96 }} className="justify-between">
          <Text
            className="font-body-semibold text-white"
            style={{ fontSize: 14.5, lineHeight: 17 }}
            numberOfLines={3}>
            {product.title}
          </Text>
          <DisplayText size={13} style={{ marginTop: 10 }}>
            {formatPrice(productPrice(product, currency), currency)}
          </DisplayText>
        </View>
      </Pressable>
      <Pressable
        onPress={onToggleSaved}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
        className="items-center justify-center active:opacity-70">
        <Ionicons
          name={saved ? 'heart' : 'heart-outline'}
          size={19}
          color={saved ? PALETTE.red : '#FFF'}
        />
      </Pressable>
    </View>
  );
}
