import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotifyMeSheet } from '@/components/store/NotifyMeSheet';
import { Gallery } from '@/components/store/pdp/Gallery';
import { Personalisation } from '@/components/store/pdp/Personalisation';
import { ProductInfo } from '@/components/store/pdp/ProductInfo';
import { Reviews } from '@/components/store/pdp/Reviews';
import { SizeGuideSheet } from '@/components/store/pdp/SizeGuideSheet';
import { ProductRow } from '@/components/store/home/ProductRow';
import { SizeGrid } from '@/components/store/SizeGrid';
import { SegmentedButtons, StoreButton } from '@/components/store/ui/Buttons';
import { Breadcrumb, Skeleton, type Crumb } from '@/components/store/ui/Misc';
import { PriceTag, StarRating } from '@/components/store/ui/PriceTag';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { parseShirtUrl } from '@/components/store/ui/ShirtArt';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { StoreFooter } from '@/components/store/ui/StoreFooter';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { StoreEmpty, StoreError } from '@/components/store/ui/StoreStates';
import { useWishlistIds } from '@/lib/api/store';
import {
  PROFILE_LABEL,
  categoryHref,
  useCategoryPath,
  useStoreProductPage,
} from '@/lib/api/storeCatalog';
import { formatPrice } from '@/lib/format';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { useCartStore, type LinePrint } from '@/store/cartStore';
import { useRecentlyViewed } from '@/store/recentStore';
import type { StoreProductVariant } from '@/types/database';
import { STORE } from '@/theme/store';

const KIT_ROLE_LABEL = {
  home: 'Home',
  away: 'Away',
  third: 'Third',
  goalkeeper: 'Goalkeeper',
} as const;

/** Product page in the club store layout. */
export default function ProductScreen() {
  const { id, player, personalise, edit } = useLocalSearchParams<{
    id: string;
    player?: string;
    personalise?: string;
    edit?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const currency = settings.currency;
  const page = useStoreProductPage(id, currency);
  const path = useCategoryPath(page.data?.category?.slug);
  const wishlist = useWishlistIds();
  const lines = useCartStore((s) => s.lines);
  const add = useCartStore((s) => s.add);
  const replace = useCartStore((s) => s.replace);
  const viewRecent = useRecentlyViewed((s) => s.view);
  const recentIds = useRecentlyViewed((s) => s.ids);
  const scroller = useRef<ScrollView>(null);
  const personaliseY = useRef(0);

  const editing = edit ? lines.find((l) => l.key === edit) : undefined;
  const [variantId, setVariantId] = useState<string | null>(editing?.variantId ?? null);
  const [print, setPrint] = useState<LinePrint | null>(editing?.print ?? null);
  const [notify, setNotify] = useState<StoreProductVariant | null>(null);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const data = page.data?.product.id === id ? page.data : null;

  useEffect(() => {
    if (id) viewRecent(id);
  }, [id, viewRecent]);

  // Shop by Player: preselect the player's print once the squad list arrives.
  useEffect(() => {
    if (!player || !data?.print || print) return;
    const p = data.print.players.find((x) => x.id === player);
    if (p) {
      setPrint({
        type: 'player',
        playerId: p.id,
        name: p.name,
        number: String(p.number),
        font: data.print.fonts[0],
      });
    }
  }, [player, data?.print, print]);

  // From quick buy's PERSONALISE: start a custom print and scroll to it.
  useEffect(() => {
    if (personalise && data?.print && !print) {
      setPrint({ type: 'custom', font: data.print.fonts[0] });
      setTimeout(
        () => scroller.current?.scrollTo({ y: personaliseY.current - 80, animated: true }),
        400
      );
    }
    // Only when the page first loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalise, data?.print]);

  const variant = data?.variants.find((v) => v.id === variantId) ?? null;
  const printPrice = useMemo(() => {
    if (!data?.print || !print) return 0;
    const base =
      print.type === 'player'
        ? print.playerId || print.specialId
          ? data.print.player_price
          : 0
        : (print.name ? data.print.name_price : 0) + (print.number ? data.print.number_price : 0);
    const patch = data.patches.find((p) => p.id === print.patchId)?.price ?? 0;
    return base + patch;
  }, [data, print]);

  if (!data) {
    return (
      <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
        <StoreHeader left="back" />
        {page.error ? (
          <StoreError error={page.error} onRetry={page.refetch} />
        ) : page.loading ? (
          <View>
            <Skeleton height={width} radius={0} />
            <View style={{ padding: 16 }}>
              <Skeleton height={22} width="80%" />
              <Skeleton height={22} width="30%" style={{ marginTop: 10 }} />
            </View>
          </View>
        ) : (
          <StoreEmpty
            icon="bag-outline"
            title="This product isn’t available"
            actionLabel="Shop home"
            onAction={() => router.replace('/store')}
          />
        )}
      </View>
    );
  }

  const { product } = data;
  const kitStyle = parseShirtUrl(product.main_image_url)?.style ?? null;
  const printIncomplete =
    print != null &&
    (print.type === 'player'
      ? !(print.playerId || print.specialId)
      : !(print.name || print.number));
  const soldOut = data.variants.length > 0 && data.variants.every((v) => v.stock <= 0);
  const inBag = variant
    ? lines
        .filter((l) => l.variantId === variant.id && l.key !== edit)
        .reduce((n, l) => n + l.quantity, 0)
    : 0;
  const noMore = variant ? variant.stock - inBag <= 0 : false;
  const saved = wishlist.ids.includes(product.id);
  const images = product.gallery_urls.length ? product.gallery_urls : [product.main_image_url];
  const playerName = player ? data.print?.players.find((p) => p.id === player) : null;

  const crumbs: Crumb[] = playerName
    ? [
        { label: 'Home', href: '/store' },
        { label: 'Shop by Player', href: '/store/players' },
        { label: `${playerName.name} ${playerName.number}` },
      ]
    : [
        { label: 'Home', href: '/store' },
        ...(path.data ?? []).map((c) => ({ label: c.title, href: categoryHref(c.slug) })),
      ];

  const cta = soldOut
    ? 'Sold out'
    : !variant
      ? 'Select a size'
      : printIncomplete
        ? print?.type === 'player'
          ? 'Choose a player'
          : 'Add a name or number'
        : noMore
          ? 'No more in stock'
          : editing
            ? 'Update bag'
            : 'Add to bag';
  const canAdd = Boolean(variant) && !printIncomplete && !noMore && !soldOut;

  const addToBag = () => {
    if (!variant || !canAdd) return;
    const line = {
      variantId: variant.id,
      productId: product.id,
      title: product.title,
      imageUrl: product.main_image_url,
      size: variant.size,
      print: print ? { ...print, font: print.font ?? data.print?.fonts[0] ?? null } : null,
      snapshotCurrency: currency,
      snapshotUnit: data.price + printPrice,
    };
    if (editing) {
      replace(editing.key, line, editing.quantity);
      router.back();
      return;
    }
    add(line);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setAdded(true);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <StoreHeader left="back" />
      <ScrollView ref={scroller} contentContainerStyle={{ paddingBottom: 0 }}>
        <Breadcrumb items={crumbs} />
        <View style={{ height: 24 }} />
        <Gallery
          images={images}
          width={width}
          kitStyle={kitStyle}
          preview={
            print && kitStyle
              ? {
                  name: print.name ?? null,
                  number: print.number ?? null,
                  font: print.font ?? data.print?.fonts[0] ?? 'premier_league',
                  patch: Boolean(print.patchId),
                }
              : null
          }
        />

        <View style={{ padding: 16 }}>
          {product.badge ? (
            <Text
              className="font-body-bold"
              style={{ fontSize: 12, color: STORE.linkRed, letterSpacing: 0.4, marginTop: 8 }}>
              {product.badge.toUpperCase()}
            </Text>
          ) : null}
          <Text
            className="font-body"
            style={{ fontSize: 22, lineHeight: 28, color: STORE.text, marginTop: 6 }}
            accessibilityRole="header">
            {product.title}
          </Text>
          <View style={{ marginTop: 4 }}>
            <PriceTag
              price={data.price}
              compareAt={data.compare_at}
              currency={currency}
              size={19}
            />
          </View>
          {data.rating ? (
            <Pressable
              onPress={() => scroller.current?.scrollToEnd({ animated: true })}
              accessibilityRole="link"
              accessibilityLabel={`${data.rating.average} out of 5, ${data.rating.total} reviews`}
              className="flex-row items-center"
              style={{ marginTop: 10 }}>
              <StarRating rating={data.rating.average} size={20} />
              <Text
                className="font-body"
                style={{
                  fontSize: 14,
                  color: STORE.text,
                  marginLeft: 8,
                  textDecorationLine: 'underline',
                }}>
                {data.rating.total} Reviews
              </Text>
            </Pressable>
          ) : null}
          {product.member_discount_eligible !== false && data.compare_at == null ? (
            <Text
              className="font-body"
              style={{ fontSize: 13, color: STORE.textMuted, marginTop: 6 }}>
              Members get 10% off at checkout
            </Text>
          ) : null}

          {data.family.length > 1 ? (
            <View style={{ marginTop: 26 }}>
              <StoreHeading size={12.5}>Select your match kit</StoreHeading>
              <View className="flex-row" style={{ marginTop: 10 }}>
                {data.family.map((f) => (
                  <Pressable
                    key={f.id}
                    onPress={() => f.id !== product.id && router.replace(`/store/${f.id}`)}
                    accessibilityRole="radio"
                    accessibilityLabel={`${KIT_ROLE_LABEL[f.kit_role]} kit`}
                    accessibilityState={{ checked: f.id === product.id }}
                    style={{
                      marginRight: 10,
                      borderWidth: 2,
                      borderColor: f.id === product.id ? STORE.cta : 'transparent',
                    }}>
                    <ProductImage uri={f.image_url} width={52} height={52} />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {data.profiles.length > 1 ? (
            <View style={{ marginTop: 22 }}>
              <StoreHeading size={12.5}>Select kit type</StoreHeading>
              <View style={{ marginTop: 10 }}>
                <SegmentedButtons
                  options={data.profiles.map((p) => p.profile)}
                  value={product.profile}
                  labels={PROFILE_LABEL}
                  onChange={(p) => {
                    const target = data.profiles.find((x) => x.profile === p);
                    if (target && target.id !== product.id) router.replace(`/store/${target.id}`);
                  }}
                  height={44}
                />
              </View>
            </View>
          ) : null}

          <View style={{ marginTop: 22 }}>
            <StoreHeading size={12.5}>Select size</StoreHeading>
            <View style={{ marginTop: 10 }}>
              <SizeGrid
                variants={data.variants}
                value={variantId}
                onChange={setVariantId}
                onNotify={setNotify}
              />
            </View>
            {variant && variant.stock > 0 && variant.stock <= 5 ? (
              <Text
                className="font-body-semibold"
                style={{ fontSize: 13.5, color: STORE.sale, marginTop: 6 }}>
                Only {variant.stock} left in {variant.size}
              </Text>
            ) : null}
            {data.size_chart ? (
              <Pressable
                onPress={() => setSizeGuide(true)}
                accessibilityRole="button"
                className="flex-row items-center"
                style={{ marginTop: 12, alignSelf: 'flex-start' }}>
                <Ionicons name="resize-outline" size={20} color={STORE.text} />
                <Text
                  className="font-body"
                  style={{
                    fontSize: 14,
                    color: STORE.text,
                    marginLeft: 6,
                    textDecorationLine: 'underline',
                  }}>
                  Size guide
                </Text>
              </Pressable>
            ) : null}
          </View>

          {data.print ? (
            <View
              style={{ marginTop: 28 }}
              onLayout={(e) => (personaliseY.current = e.nativeEvent.layout.y)}>
              <Personalisation
                options={data.print}
                patches={data.patches}
                currency={currency}
                value={print}
                onChange={setPrint}
              />
            </View>
          ) : null}

          <View style={{ height: 1, backgroundColor: STORE.divider, marginTop: 24 }} />
          <View className="flex-row items-center justify-between" style={{ marginTop: 22 }}>
            <Text className="font-body-medium" style={{ fontSize: 20, color: STORE.text }}>
              Subtotal
            </Text>
            <Text className="font-body-bold" style={{ fontSize: 20, color: STORE.text }}>
              {formatPrice(data.price + printPrice, currency)}
            </Text>
          </View>
          {printPrice > 0 ? (
            <Text
              className="font-body"
              style={{ fontSize: 13, color: STORE.textMuted, marginTop: 2, textAlign: 'right' }}>
              Includes {formatPrice(printPrice, currency)} personalisation
            </Text>
          ) : null}
          <StoreButton
            label={cta}
            variant={canAdd ? 'bright' : 'primary'}
            disabled={!canAdd}
            onPress={addToBag}
            style={{ marginTop: 18 }}
          />
          <StoreButton
            label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            variant="secondary"
            onPress={() => wishlist.toggle(product.id)}
            style={{ marginTop: 12 }}
          />

          <ProductInfo
            description={product.description}
            details={product.details ?? {}}
            returnable={product.returnable}
            currency={currency}
          />
        </View>

        {data.category ? (
          <View style={{ marginTop: 12 }}>
            <ProductRow
              currency={currency}
              title="You may also like"
              params={{ category: data.category.slug, exclude: product.id, limit: 10 }}
            />
          </View>
        ) : null}
        {recentIds.filter((x) => x !== product.id).length ? (
          <View style={{ marginTop: 32 }}>
            <ProductRow
              currency={currency}
              title="Recently viewed"
              params={{ ids: recentIds.filter((x) => x !== product.id).slice(0, 10) }}
            />
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 16 }}>
          <Reviews productId={product.id} rating={data.rating} />
        </View>
        <StoreFooter />
        <View style={{ height: insets.bottom }} />
      </ScrollView>

      <NotifyMeSheet
        variant={notify}
        productTitle={product.title}
        onClose={() => setNotify(null)}
      />
      <SizeGuideSheet
        chart={data.size_chart}
        visible={sizeGuide}
        onClose={() => setSizeGuide(false)}
      />
      <BottomSheet
        visible={added}
        onClose={() => setAdded(false)}
        title="Added to bag"
        footer={
          <View className="flex-row">
            <StoreButton
              label="Keep shopping"
              variant="secondary"
              onPress={() => setAdded(false)}
              style={{ flex: 1, marginRight: 10 }}
            />
            <StoreButton
              label="View bag"
              onPress={() => {
                setAdded(false);
                router.push('/store/cart');
              }}
              style={{ flex: 1 }}
            />
          </View>
        }>
        <View className="flex-row">
          <ProductImage uri={product.main_image_url} width={72} height={72} radius={4} />
          <View className="flex-1" style={{ marginLeft: 12 }}>
            <Text
              className="font-body"
              style={{ fontSize: 15, color: STORE.text }}
              numberOfLines={2}>
              {product.title}
            </Text>
            <Text
              className="font-body"
              style={{ fontSize: 13.5, color: STORE.textMuted, marginTop: 4 }}>
              Size {variant?.size}
              {print?.name || print?.number
                ? ` · ${[print.name, print.number].filter(Boolean).join(' ')}`
                : ''}
            </Text>
            <Text
              className="font-body-bold"
              style={{ fontSize: 15, color: STORE.text, marginTop: 4 }}>
              {formatPrice(data.price + printPrice, currency)}
            </Text>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
