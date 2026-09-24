import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { MatchPrediction } from '@/types/database';

export function useMatchPrediction(matchId: string | undefined, userId: string | undefined) {
  const query = useQuery(
    ['prediction', matchId, userId],
    async () =>
      unwrap(
        await supabase
          .from('match_predictions')
          .select('*')
          .eq('match_id', matchId)
          .eq('user_id', userId)
          .maybeSingle()
      ) as MatchPrediction | null,
    { enabled: Boolean(matchId && userId) }
  );

  const submit = async (home: number, away: number, firstScorer: string) => {
    if (!matchId || !userId) throw new Error('Sign in to make a prediction.');
    const row = unwrap(
      await supabase
        .from('match_predictions')
        .upsert(
          {
            match_id: matchId,
            user_id: userId,
            home_score_pred: home,
            away_score_pred: away,
            first_scorer_pred: firstScorer,
          },
          { onConflict: 'match_id,user_id' }
        )
        .select()
        .single()
    ) as MatchPrediction;
    query.setData(row);
    return row;
  };

  return { ...query, submit };
}
