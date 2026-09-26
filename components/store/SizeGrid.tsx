import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StoreProductVariant } from '@/types/database';
import { STORE } from '@/theme/store';

interface Props {
  variants: StoreProductVariant[];
  value: string | null;
  onChange: (variantId: string) => void;
  /** Sold-out sizes show an envelope and ask to be told when they're back. */
  onNotify: (variant: StoreProductVariant) => void;
}

/** Four-up size buttons: black when chosen, envelope when sold out. */
export function SizeGrid({ variants, value, onChange, onNotify }: Props) {
  return (
    <View className="flex-row flex-wrap" style={{ marginHorizontal: -4 }}>
      {variants.map((v) => {
        const out = v.stock <= 0;
        const selected = v.id === value;
        return (
          <View key={v.id} style={{ width: '25%', padding: 4 }}>
            <Pressable
              onPress={() => (out ? onNotify(v) : onChange(v.id))}
              accessibilityRole="radio"
              accessibilityLabel={out ? `${v.size}, sold out. Email me when it's back` : v.size}
              accessibilityState={{ checked: selected }}
              style={{
                height: 42,
                borderRadius: 8,
                backgroundColor: selected ? STORE.selected : STORE.chip,
              }}
              className="flex-row items-center justify-center active:opacity-75">
              {out ? (
                <Ionicons
                  name="mail"
                  size={15}
                  color={selected ? '#FFF' : STORE.text}
                  style={{ marginRight: 5 }}
                />
              ) : null}
              <Text
                className="font-body-semibold"
                style={{ fontSize: 13, color: selected ? '#FFF' : STORE.text }}>
                {v.size}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
