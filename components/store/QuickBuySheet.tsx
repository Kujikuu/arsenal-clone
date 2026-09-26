import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { NotifyMeSheet } from '@/components/store/NotifyMeSheet';
import { SizeGrid } from '@/components/store/SizeGrid';
import { StoreButton } from '@/components/store/ui/Buttons';
import { Skeleton } from '@/components/store/ui/Misc';
import { PriceTag } from '@/components/store/ui/PriceTag';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { useStoreProductPage } from '@/lib/api/storeCatalog';
import { useCartStore } from '@/store/cartStore';
import type { Currency, StoreProductVariant } from '@/types/database';
import { STORE } from '@/theme/store';

/** The listing "+" sheet: pick a size and add, or jump to personalisation. */
export function QuickBuySheet({
  productId,
  currency,
  onClose,
}: {
  productId: string | null;
  currency: Currency;
  onClose: () => void;
}) {
  const router = useRouter();
  const page = useStoreProductPage(productId ?? undefined, currency);
  const add = useCartStore((s) => s.add);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [notify, setNotify] = useState<StoreProductVariant | null>(null);

  const data = page.data && page.data.product.id === productId ? page.data : null;
  const variant = data?.variants.find((v) => v.id === variantId) ?? null;

  const close = () => {
    setVariantId(null);
    setAdded(false);
    onClose();
  };

  const addToBag = () => {
    if (!data || !variant) return;
    add({
      variantId: variant.id,
      productId: data.product.id,
      title: data.product.title,
      imageUrl: data.product.main_image_url,
      size: variant.size,
      print: null,
      snapshotCurrency: currency,
      snapshotUnit: data.price,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setAdded(true);
  };

  return (
    <>
      <BottomSheet
        visible={Boolean(productId) && !notify}
        onClose={close}
        title="Quick buy"
        banner
        footer={
          added ? (
            <View className="flex-row">
              <StoreButton
                label="Keep shopping"
                variant="secondary"
                onPress={close}
                style={{ flex: 1, marginRight: 10 }}
              />
              <StoreButton
                label="View bag"
                onPress={() => {
                  close();
                  router.push('/store/cart');
                }}
                style={{ flex: 1 }}
              />
            </View>
          ) : (
            <View>
              {data?.print ? (
                <StoreButton
                  label="Personalise"
                  variant="secondary"
                  onPress={() => {
                    close();
                    router.push(`/store/${productId}?personalise=1`);
                  }}
                  style={{ marginBottom: 10 }}
                />
              ) : null}
              <StoreButton
                label={variant ? 'Add to bag' : 'Select a size'}
                variant={variant ? 'bright' : 'primary'}
                disabled={!variant}
                onPress={addToBag}
              />
            </View>
          )
        }>
        {!data ? (
          <View>
            <Skeleton height={18} width="70%" />
            <Skeleton height={42} style={{ marginTop: 16 }} />
          </View>
        ) : added ? (
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={22} color={STORE.success} />
            <Text
              className="font-body-semibold"
              style={{ fontSize: 15, color: STORE.text, marginLeft: 8 }}>
              {data.product.title} ({variant?.size}) added to your bag
            </Text>
          </View>
        ) : (
          <View>
            <Text
              className="font-body"
              style={{ fontSize: 15, color: STORE.text }}
              numberOfLines={2}>
              {data.product.title}
            </Text>
            <View style={{ marginTop: 4, marginBottom: 16 }}>
              <PriceTag price={data.price} compareAt={data.compare_at} currency={currency} />
            </View>
            <StoreHeading size={12}>Select size</StoreHeading>
            <View style={{ marginTop: 10 }}>
              <SizeGrid
                variants={data.variants}
                value={variantId}
                onChange={setVariantId}
                onNotify={setNotify}
              />
            </View>
          </View>
        )}
      </BottomSheet>
      <NotifyMeSheet
        variant={notify}
        productTitle={data?.product.title ?? ''}
        onClose={() => setNotify(null)}
      />
    </>
  );
}
