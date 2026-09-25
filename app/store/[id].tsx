import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { SegmentedPills } from '@/components/ui/SegmentedPills';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { ZigzagPattern } from '@/components/ui/ZigzagPattern';
import { useSquad } from '@/lib/api/squad';
import { useStoreProduct } from '@/lib/api/store';
import { formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { PALETTE } from '@/theme/palette';
import { BRAND } from '@/lib/brand';

const VIEW_MODES = ['PHOTOS', 'CUSTOMISE'] as const;
type ViewMode = (typeof VIEW_MODES)[number];

function shirtName(player: { known_as?: string | null; last_name: string }) {
  const name =
    player.known_as && !player.known_as.includes(' ') ? player.known_as : player.last_name;
  return name.replace(/\s*\(.*\)/, '').toUpperCase();
}

export default function ProductDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const { data: product, loading, error, refetch } = useStoreProduct(id);
  const squad = useSquad('men');

  const [viewMode, setViewMode] = useState<ViewMode>('PHOTOS');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');

  useEffect(() => {
    if (product?.is_customizable) setViewMode('CUSTOMISE');
  }, [product?.is_customizable]);

  if (!product) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="close" />
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
  const price = currency === 'GBP' ? product.price_gbp : product.price_usd;
  const gallery = product.gallery_urls.length ? product.gallery_urls : [product.main_image_url];
  const heroHeight = width * 0.85;
  const presets = (squad.data ?? []).slice(0, 12);

  const buy = () => WebBrowser.openBrowserAsync(product.external_buy_url);

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        left="close"
        title={<DisplayText size={13}>{product.category.toUpperCase()}</DisplayText>}
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
          <Text
            className="font-body-semibold text-white"
            style={{ fontSize: 22, lineHeight: 26, marginTop: 8 }}>
            {product.title}
          </Text>
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
                        setCustomName(name);
                        setCustomNumber(number);
                        setViewMode('CUSTOMISE');
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
                  onChangeText={(t) => setCustomName(t.toUpperCase().slice(0, 12))}
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
                  onChangeText={(t) => setCustomNumber(t.replace(/[^0-9]/g, '').slice(0, 2))}
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
            {product.sizes.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSize(s)}
                accessibilityRole="radio"
                accessibilityState={{ checked: size === s }}
                style={{
                  minWidth: 56,
                  height: 42,
                  borderRadius: 6,
                  marginRight: 8,
                  marginBottom: 8,
                  paddingHorizontal: 12,
                  backgroundColor: size === s ? PALETTE.red : PALETTE.surfaceRaised,
                }}
                className="items-center justify-center">
                <Text className="font-body-semibold text-white" style={{ fontSize: 14 }}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
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
        <PillButton
          label={size ? `BUY ON ${BRAND.shop.toUpperCase()} · ${size}` : 'SELECT A SIZE'}
          disabled={!size}
          onPress={buy}
        />
      </View>
    </View>
  );
}
