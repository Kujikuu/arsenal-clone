import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { Reel, TeamType } from '@/types/database';

export type ReelFeed = 'for_you' | 'latest';

/**
 * LATEST is every story, newest first. FOR YOU puts featured stories and
 * stories about the fan's favourite team (plus club-wide ones) first.
 */
export function useReels(feed: ReelFeed, favouriteTeam: TeamType) {
  return useQuery(
    ['reels', feed, feed === 'for_you' ? favouriteTeam : null],
    async () => {
      const reels = unwrap(
        await supabase.from('reels').select('*').order('published_at', { ascending: false })
      ) as Reel[];
      if (feed === 'latest') return reels;
      const score = (r: Reel) =>
        (r.is_featured ? 2 : 0) + (r.team_type === favouriteTeam || r.team_type === 'club' ? 1 : 0);
      return reels
        .filter((r) => score(r) > 0)
        .sort((a, b) => score(b) - score(a) || b.published_at.localeCompare(a.published_at));
    },
    { initialData: [] }
  );
}
