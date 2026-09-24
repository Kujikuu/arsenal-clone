import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MatchPrediction } from '@/types/database';

export async function submitMatchPrediction(
  matchId: string,
  homeScore: number,
  awayScore: number,
  firstScorer: string
): Promise<{ success: boolean; error: any }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: new Error('Please sign in to submit your prediction.') };
    }

    const { error } = await supabase.from('match_predictions').upsert(
      {
        match_id: matchId,
        user_id: user.id,
        home_score_pred: homeScore,
        away_score_pred: awayScore,
        first_scorer_pred: firstScorer,
      },
      { onConflict: 'match_id, user_id' }
    );

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.warn('[submitMatchPrediction] error:', error);
    return { success: false, error };
  }
}

export async function fetchUserPrediction(
  matchId: string
): Promise<{ data: MatchPrediction | null; error: any }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: null };

    const { data, error } = await supabase
      .from('match_predictions')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return { data: (data as MatchPrediction) || null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export function useMatchPrediction(matchId: string) {
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!matchId) return;
    setLoading(true);
    const { data } = await fetchUserPrediction(matchId);
    setPrediction(data);
    setLoading(false);
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (homeScore: number, awayScore: number, firstScorer: string) => {
    const res = await submitMatchPrediction(matchId, homeScore, awayScore, firstScorer);
    if (res.success) {
      load();
    }
    return res;
  };

  return { prediction, loading, submit, refetch: load };
}
