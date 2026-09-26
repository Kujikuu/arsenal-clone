import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated, type DimensionValue } from 'react-native';
import { useRouter } from 'expo-router';
import { STORE } from '@/theme/store';

export interface Crumb {
  label: string;
  href?: string;
}

/** "HOME / FOOTBALL SHIRTS AND KIT / HOME" */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const router = useRouter();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: STORE.divider,
      }}
      className="flex-row flex-wrap">
      {items.map((c, i) => (
        <View key={`${c.label}-${i}`} className="flex-row">
          {i > 0 ? (
            <Text className="font-body-bold" style={{ fontSize: 12.5, color: STORE.text }}>
              {' / '}
            </Text>
          ) : null}
          <Text
            onPress={c.href ? () => router.push(c.href as never) : undefined}
            accessibilityRole={c.href ? 'link' : 'text'}
            className="font-body-bold"
            style={{ fontSize: 12.5, color: STORE.text, letterSpacing: 0.3 }}>
            {c.label.toUpperCase()}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Pulsing grey block shown while content loads. */
export function Skeleton({
  width = '100%',
  height,
  radius = 4,
  style,
}: {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: object;
}) {
  const [o] = useState(() => new Animated.Value(0.6));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(o, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [o]);
  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: '#E6E7EA', opacity: o },
        style,
      ]}
    />
  );
}

/** Two-column tile placeholders for listings and carousels. */
export function TileGridSkeleton({ tileWidth, count = 4 }: { tileWidth: number; count?: number }) {
  return (
    <View className="flex-row flex-wrap justify-between" style={{ paddingHorizontal: 16 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: tileWidth, marginBottom: 24 }}>
          <Skeleton height={tileWidth * 1.05} radius={6} />
          <Skeleton height={16} width="80%" style={{ marginTop: 12 }} />
          <Skeleton height={16} width="40%" style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>
  );
}

/** Red text links in a scrolling row (MENS KIT  KIDS KIT  WOMENS KIT ...). */
export function LinkRow({ links }: { links: { label: string; onPress: () => void }[] }) {
  if (!links.length) return null;
  return (
    <View
      style={{
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: STORE.divider,
        marginHorizontal: 16,
      }}
      className="flex-row flex-wrap">
      {links.map((l) => (
        <Pressable
          key={l.label}
          onPress={l.onPress}
          accessibilityRole="link"
          style={{ marginRight: 26, paddingVertical: 4 }}>
          <Text
            className="font-body-semibold"
            style={{ fontSize: 14, color: STORE.linkRed, letterSpacing: 0.4 }}>
            {l.label.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
