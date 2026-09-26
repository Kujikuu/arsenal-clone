import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Carousel } from '@/components/store/ui/Carousel';
import { Skeleton } from '@/components/store/ui/Misc';
import { ProductTile } from '@/components/store/ui/ProductTile';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { useWishlistIds } from '@/lib/api/store';
import { useBrowse, type BrowseParams } from '@/lib/api/storeCatalog';
import type { Currency } from '@/types/database';
import { STORE } from '@/theme/store';

const TILE = 170;

/** Horizontal row of product tiles for any browse query. */
export function ProductRow({
  currency,
  params,
  title,
  onQuickBuy,
}: {
  currency: Currency;
  params: BrowseParams;
  title?: string;
  onQuickBuy?: (id: string) => void;
}) {
  const router = useRouter();
  const wishlist = useWishlistIds();
  const result = useBrowse(currency, { limit: 12, ...params });
  const items = result.data?.products ?? [];
  if (!result.loading && !items.length) return null;
  return (
    <View>
      {title ? (
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <StoreHeading size={22}>{title}</StoreHeading>
        </View>
      ) : null}
      {!items.length ? (
        <View className="flex-row" style={{ paddingHorizontal: 16 }}>
          {[0, 1].map((i) => (
            <View key={i} style={{ width: TILE, marginRight: 14 }}>
              <Skeleton height={TILE * 1.05} radius={6} />
              <Skeleton height={14} width="80%" style={{ marginTop: 10 }} />
            </View>
          ))}
        </View>
      ) : (
        <Carousel
          data={items}
          itemWidth={TILE}
          keyOf={(p) => p.id}
          renderItem={(p) => (
            <ProductTile
              product={p}
              width={TILE}
              currency={currency}
              saved={wishlist.ids.includes(p.id)}
              onPress={() => router.push(`/store/${p.id}`)}
              onToggleSaved={() => wishlist.toggle(p.id)}
              onQuickBuy={onQuickBuy ? () => onQuickBuy(p.id) : undefined}
            />
          )}
        />
      )}
    </View>
  );
}

/** "20% OFF | NEW IN" switcher above a product row. */
export function ProductTabs({
  currency,
  tabs,
  onQuickBuy,
}: {
  currency: Currency;
  tabs: { label: string; source: string }[];
  onQuickBuy?: (id: string) => void;
}) {
  const [active, setActive] = useState(0);
  const source = tabs[active]?.source;
  const params: BrowseParams =
    source === 'sale'
      ? { onSale: true }
      : source === 'new'
        ? { sort: 'newest' }
        : { category: source };
  return (
    <View style={{ paddingTop: 40, paddingBottom: 12 }}>
      <View className="flex-row justify-center" style={{ marginBottom: 24 }}>
        {tabs.map((t, i) => (
          <Pressable
            key={t.label}
            onPress={() => setActive(i)}
            accessibilityRole="tab"
            accessibilityState={{ selected: i === active }}
            style={{
              height: 34,
              paddingHorizontal: 12,
              marginHorizontal: 4,
              borderRadius: 17,
              borderWidth: i === active ? 1 : 0,
              borderColor: STORE.divider,
            }}
            className="justify-center">
            <Text
              className="font-body-semibold"
              style={{ fontSize: 14, color: STORE.linkRed, letterSpacing: 0.4 }}>
              {t.label.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      <ProductRow currency={currency} params={params} onQuickBuy={onQuickBuy} />
    </View>
  );
}
