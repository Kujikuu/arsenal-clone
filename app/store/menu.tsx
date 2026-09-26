import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CannonLogo } from '@/components/store/ui/CannonLogo';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { StoreError } from '@/components/store/ui/StoreStates';
import { Skeleton } from '@/components/store/ui/Misc';
import { categoryHref, useStoreCategories } from '@/lib/api/storeCatalog';
import type { StoreCategoryRow } from '@/types/database';
import { STORE } from '@/theme/store';

interface Row {
  key: string;
  title: string;
  onPress: () => void;
  underline?: boolean;
  hasChildren?: boolean;
}

function Tile({ row }: { row: Row }) {
  return (
    <Pressable
      onPress={row.onPress}
      accessibilityRole="button"
      accessibilityLabel={row.title}
      style={{ backgroundColor: STORE.surface, marginBottom: 12, height: 80, paddingHorizontal: 8 }}
      className="flex-row items-center active:opacity-80">
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: STORE.divider,
        }}
        className="items-center justify-center">
        <CannonLogo width={40} color="#E3E5E8" />
      </View>
      <Text
        className="flex-1 font-body-bold"
        style={{
          marginLeft: 16,
          fontSize: 15,
          color: STORE.text,
          letterSpacing: 0.6,
          textDecorationLine: row.underline ? 'underline' : 'none',
        }}>
        {row.title.toUpperCase()}
      </Text>
      {row.hasChildren ? <Feather name="chevron-right" size={22} color={STORE.textMuted} /> : null}
    </Pressable>
  );
}

/** Full-screen shop menu: category tiles that open each level of the tree. */
export default function StoreMenuScreen() {
  const router = useRouter();
  const categories = useStoreCategories();
  const [trail, setTrail] = useState<StoreCategoryRow[]>([]);
  const all = useMemo(() => categories.data ?? [], [categories.data]);
  const current = trail[trail.length - 1] ?? null;

  const children = (parentId: string | null) =>
    all.filter((c) => c.parent_id === parentId).sort((a, b) => a.position - b.position);

  const open = (c: StoreCategoryRow) => {
    if (children(c.id).length) setTrail((t) => [...t, c]);
    else router.replace(categoryHref(c.slug) as never);
  };

  const rows: Row[] = children(current?.id ?? null).map((c) => ({
    key: c.id,
    title: c.title,
    hasChildren: children(c.id).length > 0,
    onPress: () => open(c),
  }));
  if (current?.slug === 'kit') {
    rows.push({
      key: 'players',
      title: 'Shop by Player',
      onPress: () => router.replace('/store/players'),
    });
  }
  if (current) {
    rows.push({
      key: 'all',
      title: `All ${current.title}`,
      underline: true,
      onPress: () => router.replace(categoryHref(current.slug) as never),
    });
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#F0F0F0' }}>
      <StoreHeader left="close" />
      {current ? (
        <Pressable
          onPress={() => setTrail((t) => t.slice(0, -1))}
          accessibilityRole="button"
          accessibilityLabel={`Back from ${current.title}`}
          style={{
            height: 60,
            backgroundColor: STORE.surface,
            borderBottomWidth: 1,
            borderBottomColor: STORE.divider,
          }}
          className="flex-row items-center justify-center">
          <Feather
            name="chevron-left"
            size={24}
            color={STORE.text}
            style={{ position: 'absolute', left: 12 }}
          />
          <StoreHeading size={15}>{current.title}</StoreHeading>
        </Pressable>
      ) : null}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {categories.error ? (
          <StoreError error={categories.error} onRetry={categories.refetch} />
        ) : !all.length ? (
          [0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={80} radius={0} style={{ marginBottom: 12 }} />
          ))
        ) : (
          rows.map((r) => <Tile key={r.key} row={r} />)
        )}
      </ScrollView>
    </View>
  );
}
