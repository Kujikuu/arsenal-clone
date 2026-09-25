import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { SearchFilterSheet, type SearchFilters } from '@/components/search/SearchFilterSheet';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useDebounced, useSearch } from '@/lib/api/search';
import { resolveImage } from '@/lib/media/resolveImage';
import type { SearchResult } from '@/types/database';
import { PALETTE } from '@/theme/palette';
import { BRAND } from '@/lib/brand';

const PREVIEW_COUNT = 4;

function SectionHeader({
  title,
  count,
  onSeeMore,
}: {
  title: string;
  count: number;
  onSeeMore?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 17 }}>
      <Text className="font-body-semibold text-white" style={{ fontSize: 20 }}>
        {title}{' '}
        <Text className="font-body" style={{ color: '#9A9899' }}>
          ({count.toLocaleString('en-GB')})
        </Text>
      </Text>
      {onSeeMore ? (
        <Pressable
          onPress={onSeeMore}
          accessibilityRole="button"
          style={{
            height: 33,
            borderRadius: 17,
            paddingHorizontal: 20,
            backgroundColor: PALETTE.red,
          }}
          className="items-center justify-center active:opacity-80">
          <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
            SEE MORE
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Search (ref/search.jpeg). */
export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ kind: 'all', teamType: null });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debounced = useDebounced(query.trim());

  const search = useSearch({
    query: debounced,
    kind: filters.kind,
    teamType: filters.teamType,
    limit: PREVIEW_COUNT,
  });
  const filtered = filters.kind !== 'all' || filters.teamType !== null;

  const open = (item: SearchResult) =>
    router.push(item.kind === 'video' ? `/video/${item.id}` : `/article/${item.id}`);

  const seeMore = (kind: 'video' | 'article') =>
    router.push({
      pathname: '/search/[kind]',
      params: { kind, q: debounced, team: filters.teamType ?? '' },
    });

  const renderSection = (
    kind: 'video' | 'article',
    title: string,
    items: SearchResult[],
    total: number
  ) => (
    <View style={{ marginBottom: 30 }}>
      <SectionHeader
        title={title}
        count={total}
        onSeeMore={total > items.length ? () => seeMore(kind) : undefined}
      />
      {items.map((item) => (
        <MediaRowCard
          key={item.id}
          title={item.title}
          image={resolveImage(item.image_url) ?? { uri: item.image_url }}
          onPress={() => open(item)}
        />
      ))}
    </View>
  );

  const data = search.data;
  const nothing = data && data.videoTotal === 0 && data.articleTotal === 0;

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        left="close"
        backgroundColor={PALETTE.surface}
        rightAction={
          <Pressable
            onPress={() => setFiltersOpen(true)}
            hitSlop={8}
            accessibilityLabel="Search filters"
            className="active:opacity-60">
            <Ionicons name="options-outline" size={28} color={filtered ? '#FFF' : '#BDBBBC'} />
            {filtered && (
              <View
                style={{ backgroundColor: PALETTE.red }}
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
              />
            )}
          </Pressable>
        }
      />

      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' }}>
        <View
          style={{ height: 50, borderRadius: 8, backgroundColor: PALETTE.pill }}
          className="flex-row items-center px-4">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${BRAND.appName}`}
            placeholderTextColor="#C8C6C7"
            returnKeyType="search"
            autoCorrect={false}
            className="flex-1 font-body text-white"
            style={{ fontSize: 16 }}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={22} color="#C8C6C7" />
            </Pressable>
          ) : (
            <Ionicons name="search-outline" size={24} color="#C8C6C7" />
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 40 }}>
        {search.error ? (
          <ErrorState error={search.error} onRetry={search.refetch} />
        ) : !data ? (
          <LoadingState />
        ) : nothing ? (
          <EmptyState
            icon="search-outline"
            title="No results"
            message={debounced ? `Nothing matches "${debounced}".` : 'Try a different filter.'}
          />
        ) : (
          <>
            {filters.kind !== 'article' &&
              renderSection('video', 'Videos', data.videos, data.videoTotal)}
            {filters.kind !== 'video' &&
              renderSection('article', 'Articles', data.articles, data.articleTotal)}
          </>
        )}
      </ScrollView>

      <SearchFilterSheet
        visible={filtersOpen}
        value={filters}
        onChange={setFilters}
        onClose={() => setFiltersOpen(false)}
      />
    </View>
  );
}
