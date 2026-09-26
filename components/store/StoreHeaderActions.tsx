import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { useCartCount } from '@/store/cartStore';
import { useRegionStore } from '@/store/regionStore';
import { PALETTE } from '@/theme/palette';

/** Bag button with item count, for the shared AppHeader's right slot. */
export function StoreHeaderActions() {
  const router = useRouter();
  const count = useCartCount();
  return (
    <Pressable
      onPress={() => router.push('/store/cart')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={count ? `Bag, ${count} item${count === 1 ? '' : 's'}` : 'Bag, empty'}
      className="active:opacity-60">
      <Ionicons name="bag-outline" size={26} color="#FFF" />
      {count > 0 && (
        <View
          style={{ backgroundColor: PALETTE.red, minWidth: 17, height: 17, paddingHorizontal: 4 }}
          className="absolute -right-2 -top-1.5 items-center justify-center rounded-full">
          <Text className="font-body-bold text-white" style={{ fontSize: 10 }}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/** Shop menu, search and delivery region, shown under the header on the shop tab. */
export function StoreBrowseBar() {
  const router = useRouter();
  const zone = useRegionStore((s) => s.zone);
  const { settings } = useSettings();
  const region = `${zone} (${settings.currency === 'GBP' ? '£' : '$'})`;

  return (
    <View className="flex-row items-center bg-black px-4" style={{ paddingBottom: 12, gap: 10 }}>
      <Pressable
        onPress={() => router.push('/store/menu')}
        accessibilityRole="button"
        accessibilityLabel="Shop menu"
        style={{
          height: 40,
          paddingHorizontal: 12,
          borderRadius: 20,
          backgroundColor: PALETTE.surfaceRaised,
        }}
        className="flex-row items-center active:opacity-70">
        <Feather name="menu" size={18} color="#FFF" />
        <Text className="font-body-semibold text-white" style={{ fontSize: 14, marginLeft: 8 }}>
          Shop
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/store/search')}
        accessibilityRole="search"
        accessibilityLabel="Search the shop"
        style={{
          height: 40,
          paddingHorizontal: 12,
          borderRadius: 20,
          backgroundColor: PALETTE.surfaceRaised,
        }}
        className="flex-1 flex-row items-center active:opacity-70">
        <Feather name="search" size={17} color="#8E8C8D" />
        <Text
          className="font-body"
          numberOfLines={1}
          style={{ fontSize: 14, color: '#8E8C8D', marginLeft: 8 }}>
          Search the shop
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/store/region')}
        accessibilityRole="button"
        accessibilityLabel={`Shipping to ${region}. Change region`}
        hitSlop={6}
        className="flex-row items-center active:opacity-70">
        <Ionicons name="globe-outline" size={18} color="#FFF" />
        <Text className="font-body-semibold text-white" style={{ fontSize: 13, marginLeft: 5 }}>
          {region}
        </Text>
      </Pressable>
    </View>
  );
}
