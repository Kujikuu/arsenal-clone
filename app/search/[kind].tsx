import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { searchContent } from '@/lib/api/search';
import { resolveImage } from '@/lib/media/resolveImage';
import type { ContentTeamType, SearchResult } from '@/types/database';
import { PALETTE } from '@/theme/palette';

const PAGE_SIZE = 20;

/** Full, paged list of one kind of search result ("SEE MORE"). */
export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ kind: string; q?: string; team?: string }>();
  const kind = params.kind === 'article' ? 'article' : 'video';
  const query = params.q ?? '';
  const teamType = (params.team || null) as ContentTeamType | null;

  const [items, setItems] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(
    async (offset: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchContent({ query, kind, teamType, limit: PAGE_SIZE, offset });
        const page = kind === 'video' ? res.videos : res.articles;
        setTotal(kind === 'video' ? res.videoTotal : res.articleTotal);
        setItems((prev) => (offset === 0 ? page : [...prev, ...page]));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [query, kind, teamType]
  );

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const title = kind === 'video' ? 'Videos' : 'Articles';

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        left="back"
        backgroundColor={PALETTE.surface}
        bordered
        title={
          <Text className="font-body text-white" style={{ fontSize: 18 }}>
            {query ? `${title}: "${query}"` : title}
          </Text>
        }
      />
      {error && !items.length ? (
        <ErrorState error={error} onRetry={() => loadPage(0)} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListHeaderComponent={
            <Text
              className="font-body"
              style={{ fontSize: 14, color: '#9A9899', marginBottom: 14 }}>
              {total.toLocaleString('en-GB')} results
            </Text>
          }
          renderItem={({ item }) => (
            <MediaRowCard
              title={item.title}
              image={resolveImage(item.image_url) ?? { uri: item.image_url }}
              onPress={() =>
                router.push(item.kind === 'video' ? `/video/${item.id}` : `/article/${item.id}`)
              }
            />
          )}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (!loading && items.length < total) loadPage(items.length);
          }}
          ListEmptyComponent={
            loading ? null : <EmptyState icon="search-outline" title="No results" />
          }
          ListFooterComponent={loading ? <LoadingState /> : null}
        />
      )}
    </View>
  );
}
