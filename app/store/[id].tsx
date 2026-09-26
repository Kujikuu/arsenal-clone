import React, { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { BagButton } from '@/components/store/BagButton';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { SegmentedPills } from '@/components/ui/SegmentedPills';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { ZigzagPattern } from '@/components/ui/ZigzagPattern';
import { useSquad } from '@/lib/api/squad';
import { customisationPrice, productPrice, useStoreProduct, useWishlistIds } from '@/lib/api/store';
import { formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { MAX_LINE_QUANTITY, useCartStore } from '@/store/cartStore';
import { PALETTE } from '@/theme/palette';

const VIEW_MODES = ['PHOTOS', 'CUSTOMISE'] as const;
const LOW_STOCK = 5;
type ViewMode = (typeof VIEW_MODES)[number];

function shirtName(player: { known_as?: string | null; last_name: string }) {
  const name =
    player.known_as && !player.known_as.includes(' ') ? player.known_as : player.last_name;
  return name.replace(/\s*\(.*\)/, '').toUpperCase();
}

export default function ProductDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const { data: product, loading, error, refetch } = useStoreProduct(id);
  const squad = useSquad('men');
  const wishlist = useWishlistIds();
  const addToBag = useCartStore((s) => s.add);
  const bagLines = useCartStore((s) => s.lines);

  const [viewMode, setViewMode] = useState<ViewMode>('PHOTOS');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product?.is_customizable) setViewMode('CUSTOMISE');
  }, [product?.is_customizable]);

  if (!product) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="close" rightAction={<BagButton />} />
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState icon="bag-outline" title="Product not found" />
        )}
      </View>
    );
  }

  const currency = settings.currency;
  const price = productPrice(product, currency);
  const customPrice = customisationPrice(product, currency);
  const gallery = product.gallery_urls.length ? product.gallery_urls : [product.main_image_url];
  const heroHeight = width * 0.85;
  const presets = (squad.data ?? []).slice(0, 12);
  const variants = product.variants ?? [];
  const variant = variants.find((v) => v.id === variantId) ?? null;
  const soldOut = variants.length > 0 && variants.every((v) => v.stock <= 0);
  const personalised = product.is_customizable && Boolean(customName || customNumber);
  const saved = wishlist.ids.includes(product.id);

  // Stock left for this size after what is already in the bag.
  const inBag = variant
    ? bagLines.filter((l) => l.variantId === variant.id).reduce((n, l) => n + l.quantity, 0)
    : 0;
  const available = variant ? Math.max(0, variant.stock - inBag) : 0;
  const maxQuantity = Math.max(1, Math.min(MAX_LINE_QUANTITY, available));

  const selectVariant = (id: string) => {
    setVariantId(id);
    setQuantity(1);
    setAdded(false);
  };

  const add = () => {
    if (!variant || available < quantity) return;
    addToBag(
      {
        variantId: variant.id,
        productId: product.id,
        title: product.title,
        imageUrl: product.main_image_url,
        size: variant.size,
        priceGbp: product.price_gbp,
        priceUsd: product.price_usd,
        customPriceGbp: product.customisation_price_gbp,
        customPriceUsd: product.customisation_price_usd,
        customName: personalised && customName.trim() ? customName.trim() : null,
        customNumber: personalised && customNumber ? customNumber : null,
      },
      quantity
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setAdded(true);
    setQuantity(1);
  };

  const ctaLabel = soldOut
    ? 'SOLD OUT'
    : !variant
      ? 'SELECT A SIZE'
      : available <= 0
        ? 'NO MORE IN STOCK'
        : `ADD TO BAG · ${formatPrice((price + (personalised ? customPrice : 0)) * quantity, currency)}`;

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        left="close"
        title={<DisplayText size={13}>{product.category.toUpperCase()}</DisplayText>}
        rightAction={<BagButton />}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {product.is_customizable && (
          <View className="flex-row px-4" style={{ paddingVertical: 12 }}>
            <SegmentedPills
              options={VIEW_MODES}
              value={viewMode}
              onChange={setViewMode}
              height={34}
              fontSize={13}
            />
          </View>
        )}

        {viewMode === 'CUSTOMISE' && product.is_customizable ? (
          <View
            style={{
              height: heroHeight,
              marginHorizontal: 16,
              borderRadius: 8,
              backgroundColor: PALETTE.red,
            }}
            className="items-center justify-center overflow-hidden">
            <ZigzagPattern
              width={width - 32}
              height={heroHeight}
              run={40}
              rise={90}
              spacing={30}
              color="#FFFFFF"
              strokeWidth={0.8}
              opacity={0.15}
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 46,
                backgroundColor: '#F4F4F4',
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 46,
                backgroundColor: '#F4F4F4',
              }}
            />
            <DisplayText size={24}>{customName || 'YOUR NAME'}</DisplayText>
            <DisplayText size={110} style={{ marginTop: 6 }}>
              {customNumber || '00'}
            </DisplayText>
          </View>
        ) : (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width))
              }>
              {gallery.map((url, i) => (
                <Image
                  key={`${url}-${i}`}
                  source={resolveImage(url)}
                  style={{ width, height: heroHeight }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            {gallery.length > 1 && (
              <View className="flex-row justify-center" style={{ marginTop: 10 }}>
                {gallery.map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      marginHorizontal: 3,
                      backgroundColor: i === photoIndex ? PALETTE.red : PALETTE.chip,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ padding: 16 }}>
          {product.badge ? (
            <DisplayText size={11} color="#C8C6C7" heavy={false}>
              {product.badge.toUpperCase()}
            </DisplayText>
          ) : null}
          <View className="flex-row items-start" style={{ marginTop: 8 }}>
            <Text
              className="flex-1 font-body-semibold text-white"
              style={{ fontSize: 22, lineHeight: 26 }}>
              {product.title}
            </Text>
            <Pressable
              onPress={() => wishlist.toggle(product.id)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              style={{ marginLeft: 12, marginTop: 2 }}
              className="active:opacity-60">
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={26}
                color={saved ? PALETTE.red : '#FFF'}
              />
            </Pressable>
          </View>
          <DisplayText size={20} style={{ marginTop: 12 }}>
            {formatPrice(price, currency)}
          </DisplayText>
          <Text
            className="font-body"
            style={{ fontSize: 15.5, lineHeight: 22, color: '#C8C6C7', marginTop: 14 }}>
            {product.description}
          </Text>

          {product.is_customizable && (
            <View style={{ marginTop: 24 }}>
              <Text className="font-body-semibold text-white" style={{ fontSize: 16 }}>
                Add a name and number
              </Text>
              <Text
                className="font-body"
                style={{ fontSize: 13.5, color: PALETTE.textMuted, marginTop: 4 }}>
                Printed to order · +{formatPrice(customPrice, currency)}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 12, marginHorizontal: -16 }}
                contentContainerStyle={{ paddingHorizontal: 16 }}>
                {presets.map((p) => {
                  const name = shirtName(p);
                  const number = String(p.shirt_number);
                  const selected = customName === name && customNumber === number;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        setCustomName(name.replace(/[^A-Z .'-]/g, '').slice(0, 12));
                        setCustomNumber(number);
                        setViewMode('CUSTOMISE');
                        setAdded(false);
                      }}
                      accessibilityRole="button"
                      style={{
                        height: 34,
                        borderRadius: 17,
                        paddingHorizontal: 14,
                        marginRight: 8,
                        backgroundColor: selected ? PALETTE.red : PALETTE.chip,
                      }}
                      className="items-center justify-center">
                      <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
                        {name} {number}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View className="flex-row" style={{ marginTop: 12 }}>
                <TextInput
                  value={customName}
                  onChangeText={(t) => {
                    setCustomName(
                      t
                        .toUpperCase()
                        .replace(/[^A-Z .'-]/g, '')
                        .replace(/^[^A-Z]+/, '')
                        .slice(0, 12)
                    );
                    setAdded(false);
                  }}
                  onFocus={() => setViewMode('CUSTOMISE')}
                  placeholder="NAME"
                  placeholderTextColor="#8E8C8D"
                  autoCapitalize="characters"
                  className="flex-1 font-body-semibold text-white"
                  style={{
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: PALETTE.pill,
                    paddingHorizontal: 14,
                    fontSize: 15,
                  }}
                />
                <TextInput
                  value={customNumber}
                  onChangeText={(t) => {
                    setCustomNumber(t.replace(/[^0-9]/g, '').slice(0, 2));
                    setAdded(false);
                  }}
                  onFocus={() => setViewMode('CUSTOMISE')}
                  placeholder="No."
                  placeholderTextColor="#8E8C8D"
                  keyboardType="number-pad"
                  className="font-body-semibold text-white"
                  style={{
                    width: 80,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: PALETTE.pill,
                    marginLeft: 10,
                    textAlign: 'center',
                    fontSize: 15,
                  }}
                />
              </View>
            </View>
          )}

          <Text className="font-body-semibold text-white" style={{ fontSize: 16, marginTop: 24 }}>
            Size
          </Text>
          <View className="flex-row flex-wrap" style={{ marginTop: 12 }}>
            {variants.map((v) => {
              const selected = v.id === variantId;
              const out = v.stock <= 0;
              return (
                <Pressable
                  key={v.id}
                  onPress={() => selectVariant(v.id)}
                  disabled={out}
                  accessibilityRole="radio"
                  accessibilityLabel={out ? `${v.size}, sold out` : v.size}
                  accessibilityState={{ checked: selected, disabled: out }}
                  style={{
                    minWidth: 56,
                    height: 42,
                    borderRadius: 6,
                    marginRight: 8,
                    marginBottom: 8,
                    paddingHorizontal: 12,
                    backgroundColor: selected ? PALETTE.red : PALETTE.surfaceRaised,
                    opacity: out ? 0.4 : 1,
                  }}
                  className="items-center justify-center">
                  <Text
                    className="font-body-semibold text-white"
                    style={{ fontSize: 14, textDecorationLine: out ? 'line-through' : 'none' }}>
                    {v.size}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {variant && variant.stock > 0 && variant.stock <= LOW_STOCK ? (
            <Text
              className="font-body-semibold"
              style={{ fontSize: 13.5, color: PALETTE.formDown }}>
              Only {variant.stock} left in {variant.size}
            </Text>
          ) : null}

          {variant && available > 0 ? (
            <View style={{ marginTop: 18 }}>
              <Text className="font-body-semibold text-white" style={{ fontSize: 16 }}>
                Quantity
              </Text>
              <View style={{ marginTop: 12 }}>
                <QuantityStepper value={quantity} onChange={setQuantity} max={maxQuantity} />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12) + 6,
          borderTopWidth: 1,
          borderTopColor: PALETTE.divider,
        }}>
        {added ? (
          <View>
            <View className="flex-row items-center" style={{ marginBottom: 10 }}>
              <Ionicons name="checkmark-circle" size={20} color={PALETTE.formUp} />
              <Text
                className="font-body-semibold text-white"
                style={{ fontSize: 15, marginLeft: 8 }}>
                Added to your bag
              </Text>
            </View>
            <View className="flex-row">
              <PillButton
                label="KEEP SHOPPING"
                variant="outline"
                onPress={() => router.back()}
                style={{ flex: 1, marginRight: 10 }}
              />
              <PillButton
                label="VIEW BAG"
                onPress={() => router.push('/store/cart')}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <PillButton
            label={ctaLabel}
            disabled={soldOut || !variant || available <= 0}
            onPress={add}
          />
        )}
      </View>
    </View>
  );
}
