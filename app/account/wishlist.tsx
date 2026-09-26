import React, { useState } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { QuickBuySheet } from '@/components/store/QuickBuySheet';
import { TileGridSkeleton } from '@/components/store/ui/Misc';
import { ProductTile } from '@/components/store/ui/ProductTile';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { StoreEmpty, StoreError } from '@/components/store/ui/StoreStates';
import { useWishlistIds } from '@/lib/api/store';
import { useBrowse } from '@/lib/api/storeCatalog';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { STORE } from '@/theme/store';
import { AppHeader } from '@/components/AppHeader';
import { StoreHeaderActions } from '@/components/store/StoreHeaderActions';
import { DisplayText } from '@/components/ui/DisplayText';

/** Products saved with the heart, most recently saved first. */
export default function WishlistScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const wishlist = useWishlistIds();
  const ids = [...wishlist.ids].reverse();
  const products = useBrowse(settings.currency, { ids, limit: 100 }, ids.length > 0);
  const [quickBuy, setQuickBuy] = useState<string | null>(null);
  const tile = (width - 16 * 2 - 14) / 2;
  // Hearts removed here disappear straight away.
  const list = ids.length
    ? (products.data?.products ?? []).filter((p) => wishlist.ids.includes(p.id))
    : [];

  const header = (
    <View
      style={{ backgroundColor: STORE.muted, paddingVertical: 14, marginBottom: 18 }}
      className="items-center">
      <StoreHeading size={16}>{`Wishlist (${wishlist.ids.length})`}</StoreHeading>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <AppHeader
        left="back"
        title={<DisplayText size={14}>WISHLIST</DisplayText>}
        rightAction={<StoreHeaderActions />}
      />
      {!user ? (
        authLoading ? null : (
          <StoreEmpty
            icon="heart-outline"
            title="Sign in to see your wishlist"
            message="Save products with the heart and find them here on any device."
            actionLabel="Sign in"
            onAction={() => router.push('/auth/login')}
          />
        )
      ) : (
        <FlatList
          data={list}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'space-between' }}
          ListHeaderComponent={header}
          ListEmptyComponent={
            products.error ? (
              <StoreError error={products.error} onRetry={products.refetch} />
            ) : ids.length && products.loading ? (
              <TileGridSkeleton tileWidth={tile} />
            ) : (
              <StoreEmpty
                icon="heart-outline"
                title="Nothing saved yet"
                message="Tap the heart on any product to keep it here."
                actionLabel="Browse the shop"
                onAction={() => router.navigate('/store')}
              />
            )
          }
          renderItem={({ item }) => (
            <View style={{ width: tile, marginBottom: 26 }}>
              <ProductTile
                product={item}
                width={tile}
                currency={settings.currency}
                saved
                onPress={() => router.push(`/store/${item.id}`)}
                onToggleSaved={() => wishlist.toggle(item.id)}
                onQuickBuy={() => setQuickBuy(item.id)}
              />
            </View>
          )}
        />
      )}
      <QuickBuySheet
        productId={quickBuy}
        currency={settings.currency}
        onClose={() => setQuickBuy(null)}
      />
    </View>
  );
}
