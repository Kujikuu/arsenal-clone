import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CannonLogo } from '@/components/store/ui/CannonLogo';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { STORE } from '@/theme/store';

/** Grey strip that slowly scrolls the store's promises ("Members get 10% off" ...). */
export function TrustTicker({ items }: { items: string[] }) {
  const [x] = useState(() => new Animated.Value(0));
  const width = useRef(0);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    const start = () => {
      if (!width.current) return;
      x.setValue(0);
      loop = Animated.loop(
        Animated.timing(x, {
          toValue: -width.current,
          duration: width.current * 28,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
    };
    const t = setTimeout(start, 300);
    return () => {
      clearTimeout(t);
      loop?.stop();
    };
  }, [x, items]);

  const row = (key: string) => (
    <View
      key={key}
      className="flex-row items-center"
      onLayout={key === 'a' ? (e) => (width.current = e.nativeEvent.layout.width) : undefined}>
      {items.map((t, i) => (
        <View key={i} className="flex-row items-center" style={{ paddingHorizontal: 18 }}>
          {i % 2 === 0 ? (
            <CannonLogo width={34} color={STORE.text} />
          ) : (
            <Feather name="package" size={16} color={STORE.text} />
          )}
          <Text className="font-body" style={{ fontSize: 14, color: STORE.text, marginLeft: 10 }}>
            {t}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View
      accessibilityLabel={items.join('. ')}
      style={{ height: 44, backgroundColor: '#E6E6E6', overflow: 'hidden' }}
      className="justify-center">
      <Animated.View className="flex-row" style={{ transform: [{ translateX: x }] }}>
        {row('a')}
        {row('b')}
      </Animated.View>
    </View>
  );
}

export interface TrustBadge {
  title: string;
  subtitle: string;
}

export const DEFAULT_TRUST_BADGES: TrustBadge[] = [
  { title: '100% Official Merchandise', subtitle: 'Show your pride, support directly' },
  { title: 'Worldwide Delivery', subtitle: 'Fast, safe and tracked' },
  { title: '10% Members Discount', subtitle: 'Discount applied on eligible products' },
];

/** Stacked grey promise blocks above the footer. */
export function TrustBadges({ badges = DEFAULT_TRUST_BADGES }: { badges?: TrustBadge[] }) {
  return (
    <View style={{ marginTop: 32 }}>
      {badges.map((b) => (
        <View
          key={b.title}
          style={{ backgroundColor: STORE.muted, paddingVertical: 34, marginBottom: 14 }}
          className="items-center px-6">
          <StoreHeading size={14}>{b.title}</StoreHeading>
          <Text
            className="text-center font-body-semibold"
            style={{ fontSize: 12.5, color: STORE.text, marginTop: 8, letterSpacing: 0.4 }}>
            {b.subtitle.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}
