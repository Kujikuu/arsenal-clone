import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FanPoll, PollOption } from '@/types/database';

export async function fetchActivePolls(): Promise<{ data: FanPoll[]; error: any }> {
  try {
    const { data: pollsData, error: pollsError } = await supabase
      .from('fan_polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (pollsError) throw pollsError;

    if (!pollsData || pollsData.length === 0) {
      return { data: [], error: null };
    }

    const pollIds = pollsData.map((p) => p.id);
    const { data: optionsData, error: optionsError } = await supabase
      .from('poll_options')
      .select('*')
      .in('poll_id', pollIds);

    if (optionsError) throw optionsError;

    // Check user vote if user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userVotesMap: Record<string, string> = {};
    if (user) {
      const { data: userVotes } = await supabase
        .from('poll_votes')
        .select('poll_id, option_id')
        .eq('user_id', user.id);

      if (userVotes) {
        userVotes.forEach((uv) => {
          userVotesMap[uv.poll_id] = uv.option_id;
        });
      }
    }

    const pollsWithNestedOptions: FanPoll[] = pollsData.map((poll) => {
      const options = (optionsData as PollOption[])?.filter((opt) => opt.poll_id === poll.id) || [];
      const total_votes = options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
      return {
        ...poll,
        options,
        total_votes,
        user_voted_option_id: userVotesMap[poll.id] || null,
      };
    });

    return { data: pollsWithNestedOptions, error: null };
  } catch (error) {
    console.warn('[fetchActivePolls] Supabase query error:', error);
    return { data: [], error };
  }
}

export async function castVote(
  pollId: string,
  optionId: string
): Promise<{ success: boolean; error: any }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: new Error('You must be signed in to vote.') };
    }

    // Insert vote
    const { error: voteError } = await supabase.from('poll_votes').insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id,
    });

    if (voteError) throw voteError;

    // Increment vote count on option (or fetch updated)
    try {
      await supabase.rpc('increment_poll_option_vote', { target_option_id: optionId });
    } catch {
      // fallback if RPC is not created
    }

    return { success: true, error: null };
  } catch (error) {
    console.warn('[castVote] error:', error);
    return { success: false, error };
  }
}

export function usePolls() {
  const [polls, setPolls] = useState<FanPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchActivePolls();
    setPolls(data);
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const vote = async (pollId: string, optionId: string) => {
    // optimistic update
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        return {
          ...poll,
          total_votes: poll.total_votes + 1,
          user_voted_option_id: optionId,
          options: poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes_count: opt.votes_count + 1 } : opt
          ),
        };
      })
    );
    const res = await castVote(pollId, optionId);
    if (!res.success) {
      load(); // roll back if failed
    }
    return res;
  };

  return { polls, loading, error, refetch: load, vote };
}
