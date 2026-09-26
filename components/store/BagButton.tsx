import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartCount } from '@/store/cartStore';
import { PALETTE } from '@/theme/palette';

/** Header bag icon with the number of items in the bag. */
export function BagButton() {
  const router = useRouter();
  const count = useCartCount();
  return (
    <Pressable
      onPress={() => router.push('/store/cart')}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={count ? `Bag, ${count} item${count === 1 ? '' : 's'}` : 'Bag, empty'}
      className="active:opacity-60">
      <Ionicons name="bag-outline" size={26} color="#FFF" />
      {count > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -7,
            top: -5,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            paddingHorizontal: 4,
            backgroundColor: PALETTE.red,
          }}
          className="items-center justify-center">
          <Text className="font-body-bold text-white" style={{ fontSize: 11 }}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
