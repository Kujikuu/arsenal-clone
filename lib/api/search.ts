import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { ContentTeamType, SearchResult } from '@/types/database';

export type SearchKind = 'all' | 'video' | 'article';

export interface SearchParams {
  query: string;
  kind: SearchKind;
  teamType: ContentTeamType | null;
  limit: number;
  offset?: number;
}

export interface SearchResponse {
  videos: SearchResult[];
  articles: SearchResult[];
  videoTotal: number;
  articleTotal: number;
}

export async function searchContent(params: SearchParams): Promise<SearchResponse> {
  const rows = unwrap(
    await supabase.rpc('search_content', {
      p_query: params.query,
      p_kind: params.kind,
      p_team_type: params.teamType,
      p_limit: params.limit,
      p_offset: params.offset ?? 0,
    })
  ) as SearchResult[];
  const videos = rows.filter((r) => r.kind === 'video');
  const articles = rows.filter((r) => r.kind === 'article');
  return {
    videos,
    articles,
    videoTotal: Number(videos[0]?.total ?? 0),
    articleTotal: Number(articles[0]?.total ?? 0),
  };
}

export function useSearch(params: SearchParams) {
  return useQuery(['search', params], () => searchContent(params));
}

export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
