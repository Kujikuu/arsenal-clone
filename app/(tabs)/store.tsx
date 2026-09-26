import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { BagButton } from '@/components/store/BagButton';
import { ProductCard } from '@/components/store/ProductCard';
import { StoreFilterSheet } from '@/components/store/StoreFilterSheet';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import {
  DEFAULT_STORE_FILTERS,
  STORE_CATEGORIES,
  isStoreFiltered,
  useStoreProducts,
  useWishlistIds,
  type StoreCategory,
  type StoreFilters,
} from '@/lib/api/store';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { PALETTE } from '@/theme/palette';

/** Club shop in the app's black & red style. */
export default function StoreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, update } = useSettings();
  const [category, setCategory] = useState<StoreCategory>('ALL');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_STORE_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currency = settings.currency;
  const products = useStoreProducts(category, filters, currency);
  const wishlist = useWishlistIds();
  const cardWidth = (width - 16 * 2 - 12) / 2;

  // Search as the fan types, without a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search: searchText })), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  const onRefresh = async () => {
    setRefreshing(true);
    await products.refetch();
    setRefreshing(false);
  };

  const toggleCurrency = () =>
    update({ currency: currency === 'GBP' ? 'USD' : 'GBP' }).catch(() => {});

  const items = products.data ?? [];
  const filtered = isStoreFiltered(filters);
  const searching = Boolean(filters.search.trim());

  return (
    <View className="flex-1 bg-black">
      <AppHeader rightAction={<BagButton />} />

      <UnderlineTabs
        tabs={STORE_CATEGORIES}
        value={category}
        onChange={setCategory}
        variant="inline"
        scrollable
        gap={27}
        fontSize={15}
        height={56}
      />

      <View className="flex-row items-center px-4" style={{ paddingTop: 12 }}>
        <View
          style={{ height: 40, borderRadius: 20, backgroundColor: PALETTE.pill, paddingLeft: 12 }}
          className="flex-1 flex-row items-center">
          <Ionicons name="search-outline" size={18} color={PALETTE.textMuted} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search the shop"
            placeholderTextColor={PALETTE.textDim}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search the shop"
            className="flex-1 font-body text-white"
            style={{ fontSize: 15, paddingHorizontal: 8, height: 40 }}
          />
          {searchText ? (
            <Pressable
              onPress={() => setSearchText('')}
              hitSlop={8}
              accessibilityLabel="Clear search"
              style={{ paddingHorizontal: 10 }}>
              <Ionicons name="close-circle" size={18} color={PALETTE.textMuted} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          onPress={() => setFiltersOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={filtered ? 'Sort and filter, filters applied' : 'Sort and filter'}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginLeft: 8,
            backgroundColor: filtered ? PALETTE.red : PALETTE.pill,
          }}
          className="items-center justify-center active:opacity-70">
          <Ionicons name="options-outline" size={20} color="#FFF" />
        </Pressable>
        <Pressable
          onPress={toggleCurrency}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Prices in ${currency}. Switch currency`}
          style={{
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 12,
            marginLeft: 8,
            backgroundColor: PALETTE.pill,
          }}
          className="items-center justify-center active:opacity-70">
          <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
            {currency === 'GBP' ? '£ GBP' : '$ USD'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.red} />
        }>
        {products.error ? (
          <ErrorState error={products.error} onRetry={products.refetch} />
        ) : products.loading && !items.length ? (
          <LoadingState />
        ) : !items.length ? (
          searching || filtered ? (
            <EmptyState
              icon="search-outline"
              title="No products match"
              message="Try a different search or clear your filters."
              actionLabel="CLEAR ALL"
              onAction={() => {
                setSearchText('');
                setFilters(DEFAULT_STORE_FILTERS);
              }}
            />
          ) : (
            <EmptyState icon="bag-outline" title="Nothing in this category yet" />
          )
        ) : (
          <View className="flex-row flex-wrap" style={{ paddingLeft: 16, paddingTop: 16 }}>
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={cardWidth}
                currency={currency}
                saved={wishlist.ids.includes(product.id)}
                onPress={() => router.push(`/store/${product.id}`)}
                onToggleSaved={() => wishlist.toggle(product.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <StoreFilterSheet
        visible={filtersOpen}
        value={filters}
        currency={currency}
        onChange={setFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </View>
  );
}
