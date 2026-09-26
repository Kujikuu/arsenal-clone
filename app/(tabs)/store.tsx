import React, { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Hero } from '@/components/store/home/Hero';
import { ImageCarousel, type ImageCard } from '@/components/store/home/ImageCarousel';
import { PlayerCarousel } from '@/components/store/home/PlayerCarousel';
import { ProductRow, ProductTabs } from '@/components/store/home/ProductRow';
import { QuickBuySheet } from '@/components/store/QuickBuySheet';
import { Skeleton } from '@/components/store/ui/Misc';
import { StoreFooter } from '@/components/store/ui/StoreFooter';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { TrustBadges, TrustTicker } from '@/components/store/ui/Trust';
import { StoreError } from '@/components/store/ui/StoreStates';
import { useHomeModules } from '@/lib/api/storeCatalog';
import { useSettings } from '@/lib/settings/SettingsProvider';
import type { HomeModule } from '@/types/database';
import { STORE } from '@/theme/store';

/** Shop home in the club store's layout, driven by store_home_modules. */
export default function StoreScreen() {
  const { settings } = useSettings();
  const currency = settings.currency;
  const home = useHomeModules();
  const [quickBuy, setQuickBuy] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    await home.refetch();
    setRefreshKey((k) => k + 1);
    setRefreshing(false);
  };

  const render = (m: HomeModule) => {
    const p = m.payload ?? {};
    switch (m.kind) {
      case 'hero':
        return (
          <Hero key={m.id} title={m.title ?? ''} subtitle={p.subtitle} cta={p.cta} href={p.href} />
        );
      case 'ticker':
        return <TrustTicker key={m.id} items={p.items ?? []} />;
      case 'product_tabs':
        return (
          <ProductTabs
            key={m.id}
            currency={currency}
            tabs={p.tabs ?? []}
            onQuickBuy={setQuickBuy}
          />
        );
      case 'collection_carousel':
      case 'category_carousel':
        return (
          <ImageCarousel key={m.id} title={m.title ?? ''} items={(p.items ?? []) as ImageCard[]} />
        );
      case 'player_carousel':
        return (
          <PlayerCarousel
            key={m.id}
            title={m.title ?? 'Shop by Player'}
            teams={p.teams ?? ['men']}
            limit={p.limit}
            menProduct={p.men_product}
            womenProduct={p.women_product}
          />
        );
      case 'product_carousel':
        return (
          <View
            key={m.id}
            style={{ paddingTop: 32, borderTopWidth: 1, borderTopColor: STORE.divider }}>
            <ProductRow
              currency={currency}
              title={m.title ?? undefined}
              params={{ category: p.category ?? null }}
              onQuickBuy={setQuickBuy}
            />
          </View>
        );
      case 'trust':
        return <TrustBadges key={m.id} />;
      default:
        return null;
    }
  };

  const modules = home.data ?? [];

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <StoreHeader />
      <ScrollView
        key={refreshKey}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={STORE.cta} />
        }>
        {home.error ? (
          <StoreError error={home.error} onRetry={home.refetch} />
        ) : !modules.length && home.loading ? (
          <View style={{ padding: 16 }}>
            <Skeleton height={520} radius={0} />
            <Skeleton height={40} style={{ marginTop: 16 }} />
          </View>
        ) : (
          <View style={{ gap: 28 }}>{modules.map(render)}</View>
        )}
        <StoreFooter />
      </ScrollView>
      <QuickBuySheet productId={quickBuy} currency={currency} onClose={() => setQuickBuy(null)} />
    </View>
  );
}
