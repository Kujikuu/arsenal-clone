import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FiltersDrawer,
  NO_FILTERS,
  SortSheet,
  filterCount,
  type ListingFilterState,
} from '@/components/store/ListingFilters';
import { QuickBuySheet } from '@/components/store/QuickBuySheet';
import { StoreButton } from '@/components/store/ui/Buttons';
import { Breadcrumb, LinkRow, TileGridSkeleton, type Crumb } from '@/components/store/ui/Misc';
import { ProductTile } from '@/components/store/ui/ProductTile';
import { StoreEmpty, StoreError } from '@/components/store/ui/StoreStates';
import { useWishlistIds } from '@/lib/api/store';
import {
  BROWSE_SORTS,
  PROFILE_LABEL,
  VIRTUAL_LISTINGS,
  categoryHref,
  useCategoryPath,
  useInfiniteBrowse,
  useStoreCategories,
  type BrowseParams,
  type BrowseSort,
} from '@/lib/api/storeCatalog';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { STORE } from '@/theme/store';
import { AppHeader } from '@/components/AppHeader';
import { StoreHeaderActions } from '@/components/store/StoreHeaderActions';

const VIRTUAL_TITLES: Record<string, string> = { sale: '20% Off', new: 'New In', search: 'Search' };

/** Category listing: breadcrumb, filters, sort, product grid and paging. */
export default function CategoryListingScreen() {
  const { slug, q } = useLocalSearchParams<{ slug: string; q?: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const currency = settings.currency;
  const wishlist = useWishlistIds();
  const categories = useStoreCategories();
  const path = useCategoryPath(slug);

  const [sort, setSort] = useState<BrowseSort>(slug === 'new' ? 'newest' : 'relevance');
  const [filters, setFilters] = useState<ListingFilterState>(NO_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [quickBuy, setQuickBuy] = useState<string | null>(null);

  const virtual = slug in VIRTUAL_LISTINGS;
  const params: BrowseParams = {
    category: virtual ? null : slug,
    ...(virtual ? VIRTUAL_LISTINGS[slug] : {}),
    query: slug === 'search' ? (q ?? '') : null,
    sort,
    profiles: filters.profiles,
    sizes: filters.sizes,
    brands: filters.brands,
    maxPrice: filters.maxPrice,
  };
  const listing = useInfiniteBrowse(currency, params);

  const all = useMemo(() => categories.data ?? [], [categories.data]);
  const current = all.find((c) => c.slug === slug);
  const title =
    slug === 'search'
      ? `“${q ?? ''}”`
      : (VIRTUAL_TITLES[slug] ?? current?.title ?? path.data?.[path.data.length - 1]?.title ?? '');

  const crumbs: Crumb[] = [
    { label: 'Home', href: '/store' },
    ...(virtual
      ? [{ label: VIRTUAL_TITLES[slug] }]
      : (path.data ?? []).map((c, i, arr) => ({
          label: c.title,
          href: i < arr.length - 1 ? categoryHref(c.slug) : undefined,
        }))),
  ];

  // Sub-categories when there are any, otherwise quick profile filters.
  const subcategories = current ? all.filter((c) => c.parent_id === current.id) : [];
  const links = subcategories.length
    ? subcategories.map((c) => ({
        label: c.title,
        onPress: () => router.push(categoryHref(c.slug) as never),
      }))
    : (listing.facets?.profiles ?? []).length > 1 && !filters.profiles.length
      ? (listing.facets?.profiles ?? [])
          .filter((p) => p !== 'unisex')
          .map((p) => ({
            label: `${PROFILE_LABEL[p]} ${current?.title ?? ''}`.trim(),
            onPress: () => setFilters((f) => ({ ...f, profiles: [p] })),
          }))
      : [];

  const tile = (width - 16 * 2 - 14) / 2;
  const activeFilters = filterCount(filters);
  const sortLabel = BROWSE_SORTS.find((s) => s.value === sort)?.label;

  const header = (
    <View>
      <Breadcrumb items={crumbs} />
      <Text
        className="text-center font-body-bold"
        style={{ fontSize: 22, color: STORE.text, marginTop: 22, marginBottom: 18 }}
        accessibilityRole="header">
        {title}
      </Text>
      <View className="flex-row" style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Pressable
          onPress={() => setFiltersOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={activeFilters ? `Filters, ${activeFilters} applied` : 'Filters'}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            backgroundColor: STORE.chip,
            paddingHorizontal: 16,
            marginRight: 10,
          }}
          className="flex-row items-center justify-between">
          <Text className="font-body-medium" style={{ fontSize: 15.5, color: STORE.text }}>
            {activeFilters ? `FILTERS (${activeFilters})` : 'FILTERS'}
          </Text>
          <Ionicons name="options-outline" size={22} color={STORE.text} />
        </Pressable>
        <Pressable
          onPress={() => setSortOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${sortLabel ?? 'newest'}`}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            backgroundColor: STORE.chip,
            paddingHorizontal: 16,
          }}
          className="flex-row items-center justify-between">
          <Text
            className="font-body-medium"
            style={{ fontSize: 15.5, color: STORE.text }}
            numberOfLines={1}>
            {sort === 'relevance' || sort === 'newest'
              ? 'SORT BY'
              : (sortLabel ?? '').toUpperCase()}
          </Text>
          <Ionicons name="swap-vertical" size={22} color={STORE.text} />
        </Pressable>
      </View>
      <LinkRow links={links} />
      {activeFilters ? (
        <Pressable
          onPress={() => setFilters(NO_FILTERS)}
          accessibilityRole="button"
          style={{ alignSelf: 'flex-start', marginLeft: 16, marginBottom: 12 }}>
          <Text
            className="font-body-semibold"
            style={{ fontSize: 13.5, color: STORE.linkRed, textDecorationLine: 'underline' }}>
            Clear filters
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  const footer = (
    <View>
      {listing.products.length ? (
        <View className="items-center" style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text
            className="font-body-bold"
            style={{ fontSize: 12.5, color: STORE.text, letterSpacing: 0.5 }}>
            {`YOU'VE VIEWED ${listing.products.length} OF ${listing.total} PRODUCTS`}
          </Text>
          <View style={{ width: 220, height: 3, backgroundColor: STORE.divider, marginTop: 10 }}>
            <View
              style={{
                width: `${(listing.products.length / Math.max(listing.total, 1)) * 100}%`,
                height: 3,
                backgroundColor: STORE.cta,
              }}
            />
          </View>
          {listing.hasMore ? (
            <StoreButton
              label="Load more"
              variant="secondary"
              loading={listing.loading}
              onPress={listing.loadMore}
              style={{ marginTop: 18, alignSelf: 'stretch' }}
            />
          ) : null}
        </View>
      ) : null}
      <View style={{ height: 32 }} />
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <AppHeader left="back" rightAction={<StoreHeaderActions />} />
      <FlatList
        data={listing.products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 16, justifyContent: 'space-between' }}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={
          listing.error ? (
            <StoreError error={listing.error} onRetry={listing.refetch} />
          ) : listing.loading ? (
            <TileGridSkeleton tileWidth={tile} />
          ) : (
            <StoreEmpty
              icon={slug === 'search' ? 'search-outline' : 'bag-outline'}
              title={slug === 'search' ? 'No products match your search' : 'Nothing here yet'}
              message={
                activeFilters
                  ? 'Try removing some filters.'
                  : 'Browse our other categories from the menu.'
              }
              actionLabel={activeFilters ? 'Clear filters' : 'Shop menu'}
              onAction={() => (activeFilters ? setFilters(NO_FILTERS) : router.push('/store/menu'))}
            />
          )
        }
        onEndReachedThreshold={0.4}
        onEndReached={listing.loadMore}
        renderItem={({ item }) => (
          <View style={{ width: tile, marginBottom: 26 }}>
            <ProductTile
              product={item}
              width={tile}
              currency={currency}
              saved={wishlist.ids.includes(item.id)}
              onPress={() => router.push(`/store/${item.id}`)}
              onToggleSaved={() => wishlist.toggle(item.id)}
              onQuickBuy={() => setQuickBuy(item.id)}
            />
          </View>
        )}
      />
      <FiltersDrawer
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={setFilters}
        facets={listing.facets}
        total={listing.total}
        currency={currency}
      />
      <SortSheet
        visible={sortOpen}
        value={sort}
        onChange={setSort}
        onClose={() => setSortOpen(false)}
      />
      <QuickBuySheet productId={quickBuy} currency={currency} onClose={() => setQuickBuy(null)} />
    </View>
  );
}
