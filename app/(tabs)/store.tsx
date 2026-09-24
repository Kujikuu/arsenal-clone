import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { DisplayText } from '@/components/ui/DisplayText';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { STORE_CATEGORIES, useStoreProducts, type StoreCategory } from '@/lib/api/store';
import { formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { ARSENAL } from '@/theme/arsenal';

/** Arsenal Direct shop in the app's black & red style. */
export default function StoreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, update } = useSettings();
  const [category, setCategory] = useState<StoreCategory>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const products = useStoreProducts(category);
  const currency = settings.currency;
  const cardWidth = (width - 16 * 2 - 12) / 2;

  const onRefresh = async () => {
    setRefreshing(true);
    await products.refetch();
    setRefreshing(false);
  };

  const toggleCurrency = () =>
    update({ currency: currency === 'GBP' ? 'USD' : 'GBP' }).catch(() => {});

  const items = products.data ?? [];

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader
        rightAction={
          <Pressable
            onPress={toggleCurrency}
            hitSlop={8}
            accessibilityLabel={`Prices in ${currency}. Switch currency`}
            style={{
              height: 30,
              borderRadius: 15,
              paddingHorizontal: 10,
              backgroundColor: ARSENAL.pill,
            }}
            className="items-center justify-center active:opacity-70">
            <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
              {currency === 'GBP' ? '£ GBP' : '$ USD'}
            </Text>
          </Pressable>
        }
      />

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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ARSENAL.red} />
        }>
        {products.error ? (
          <ErrorState error={products.error} onRetry={products.refetch} />
        ) : products.loading && !items.length ? (
          <LoadingState />
        ) : !items.length ? (
          <EmptyState icon="bag-outline" title="Nothing in this category yet" />
        ) : (
          <View className="flex-row flex-wrap" style={{ paddingLeft: 16, paddingTop: 18 }}>
            {items.map((product) => (
              <Pressable
                key={product.id}
                onPress={() => router.push(`/store/${product.id}`)}
                accessibilityRole="button"
                style={{
                  width: cardWidth,
                  marginRight: 12,
                  marginBottom: 14,
                  borderRadius: 6,
                  backgroundColor: ARSENAL.surfaceRaised,
                }}
                className="overflow-hidden active:opacity-85">
                <Image
                  source={resolveImage(product.main_image_url)}
                  style={{ width: cardWidth, height: cardWidth * 1.1 }}
                  resizeMode="cover"
                />
                {product.badge ? (
                  <View
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: 8,
                      backgroundColor: ARSENAL.red,
                      borderRadius: 3,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}>
                    <Text className="font-body-semibold text-white" style={{ fontSize: 10.5 }}>
                      {product.badge.toUpperCase()}
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
                    {formatPrice(
                      currency === 'GBP' ? product.price_gbp : product.price_usd,
                      currency
                    )}
                  </DisplayText>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
