import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { Article, ContentTeamType } from '@/types/database';

/** `null` team means every team. */
export function useArticles(teamType: ContentTeamType | null = null) {
  return useQuery(
    ['articles', teamType],
    async () => {
      let query = supabase.from('articles').select('*').order('published_at', { ascending: false });
      if (teamType) query = query.eq('team_type', teamType);
      return unwrap(await query) as Article[];
    },
    { initialData: [] }
  );
}

export function useArticle(id: string | undefined) {
  return useQuery(
    ['article', id],
    async () =>
      unwrap(
        await supabase.from('articles').select('*').eq('id', id).maybeSingle()
      ) as Article | null,
    { enabled: Boolean(id) }
  );
}
