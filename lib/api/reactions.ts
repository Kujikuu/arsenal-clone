import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import { useAuth } from '@/lib/auth/AuthProvider';

export type ReactionTarget = 'article' | 'video' | 'reel';

export interface ReactionState {
  total: number;
  reacted: boolean;
}

type ReactionMap = Record<string, ReactionState>;

/**
 * Reaction totals for a set of items, plus a toggle that updates optimistically.
 * Guests are sent to sign in when they try to react.
 */
export function useReactions(targetType: ReactionTarget, ids: string[]) {
  const router = useRouter();
  const { user } = useAuth();
  const sortedIds = [...ids].sort();

  const query = useQuery(
    ['reactions', targetType, sortedIds, user?.id],
    async () => {
      const rows = unwrap(
        await supabase.rpc('get_reactions', { p_target_type: targetType, p_target_ids: sortedIds })
      ) as { target_id: string; total: number; reacted: boolean }[];
      return Object.fromEntries(
        rows.map((r) => [r.target_id, { total: r.total, reacted: r.reacted }])
      ) as ReactionMap;
    },
    { enabled: sortedIds.length > 0, initialData: {} }
  );
  const { setData, refetch } = query;

  const toggle = useCallback(
    async (id: string) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setData((prev = {}) => {
        const current = prev[id] ?? { total: 0, reacted: false };
        return {
          ...prev,
          [id]: {
            total: current.total + (current.reacted ? -1 : 1),
            reacted: !current.reacted,
          },
        };
      });
      const { data, error } = await supabase.rpc('toggle_reaction', {
        p_target_type: targetType,
        p_target_id: id,
      });
      if (error) {
        console.warn('[reactions] toggle failed:', error.message);
        refetch();
        return;
      }
      const row = (data as { total: number; reacted: boolean }[])?.[0];
      if (row)
        setData((prev = {}) => ({ ...prev, [id]: { total: row.total, reacted: row.reacted } }));
    },
    [user, router, targetType, setData, refetch]
  );

  const get = (id: string, fallback = 0): ReactionState =>
    query.data?.[id] ?? { total: fallback, reacted: false };

  return { get, toggle, refetch };
}
