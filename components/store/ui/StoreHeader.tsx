import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CannonLogo } from '@/components/store/ui/CannonLogo';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { useCartCount } from '@/store/cartStore';
import { useRegionStore } from '@/store/regionStore';
import { STORE } from '@/theme/store';

interface Props {
  left?: 'menu' | 'back' | 'close';
  /** Hides the promo strip, e.g. inside checkout. */
  promo?: string | null;
  /** Checkout-style header: logo only. */
  minimal?: boolean;
}

export const DEFAULT_PROMO = '20% OFF SELECTED LINES – SHOP NOW';

function IconButton({
  onPress,
  label,
  children,
}: {
  onPress: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: 36, height: 44 }}
      className="items-center justify-center active:opacity-60">
      {children}
    </Pressable>
  );
}

/** Navy promo strip + red header used on every shop screen. */
export function StoreHeader({ left = 'menu', promo = DEFAULT_PROMO, minimal = false }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const count = useCartCount();
  const zone = useRegionStore((s) => s.zone);
  const { settings } = useSettings();
  const region = `${zone} (${settings.currency === 'GBP' ? '£' : '$'})`;

  const back = () => (router.canGoBack() ? router.back() : router.replace('/store'));

  return (
    <View style={{ backgroundColor: promo ? STORE.promoNavy : STORE.headerRed }}>
      <View style={{ height: insets.top }} />
      {promo ? (
        <Pressable
          onPress={() => router.push('/store/region')}
          accessibilityRole="button"
          accessibilityLabel={`${promo}. Shipping to ${region}. Change region`}
          style={{ minHeight: 34, paddingHorizontal: 12 }}
          className="flex-row items-center">
          <Text
            className="flex-1 text-center font-body-bold"
            numberOfLines={2}
            style={{ color: '#FFF', fontSize: 11, letterSpacing: 0.6 }}>
            {promo}
          </Text>
          <View className="flex-row items-center" style={{ marginLeft: 8 }}>
            <Text className="font-body-bold" style={{ color: '#FFF', fontSize: 11 }}>
              {region}
            </Text>
            <Ionicons name="globe-outline" size={20} color="#FFF" style={{ marginLeft: 6 }} />
          </View>
        </Pressable>
      ) : null}
      <View
        style={{ height: 64, backgroundColor: STORE.headerRed, paddingHorizontal: 8 }}
        className="flex-row items-center">
        <View className="flex-row items-center" style={{ width: 96 }}>
          {minimal ? (
            <IconButton onPress={back} label="Back">
              <Feather name="chevron-left" size={28} color="#FFF" />
            </IconButton>
          ) : left === 'menu' ? (
            <IconButton onPress={() => router.push('/store/menu')} label="Shop menu">
              <Feather name="menu" size={24} color="#FFF" />
            </IconButton>
          ) : (
            <IconButton onPress={back} label={left === 'close' ? 'Close' : 'Back'}>
              <Feather
                name={left === 'close' ? 'x' : 'chevron-left'}
                size={left === 'close' ? 26 : 28}
                color="#FFF"
              />
            </IconButton>
          )}
          {!minimal && (
            <IconButton onPress={() => router.push('/store/search')} label="Search the shop">
              <Feather name="search" size={22} color="#FFF" />
            </IconButton>
          )}
        </View>
        <Pressable
          onPress={() => router.navigate('/store')}
          accessibilityRole="button"
          accessibilityLabel="Shop home"
          className="flex-1 items-center">
          <CannonLogo width={80} />
        </Pressable>
        <View className="flex-row items-center justify-end" style={{ width: 96 }}>
          {!minimal && (
            <>
              <IconButton onPress={() => router.push('/profile')} label="Account">
                <Feather name="user" size={22} color="#FFF" />
              </IconButton>
              <IconButton onPress={() => router.push('/account/wishlist')} label="Wishlist">
                <Feather name="heart" size={21} color="#FFF" />
              </IconButton>
            </>
          )}
          <IconButton
            onPress={() => router.push('/store/cart')}
            label={count ? `Bag, ${count} item${count === 1 ? '' : 's'}` : 'Bag, empty'}>
            <Feather name="shopping-bag" size={22} color="#FFF" />
            {count > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 16,
                  minWidth: 14,
                  alignItems: 'center',
                }}>
                <Text className="font-body-bold" style={{ color: '#FFF', fontSize: 9.5 }}>
                  {count > 99 ? '99+' : count}
                </Text>
              </View>
            )}
          </IconButton>
        </View>
      </View>
    </View>
  );
}
