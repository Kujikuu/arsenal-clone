import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { FanPoll, PollOption } from '@/types/database';

/** Active polls, optionally for one match, with the signed-in user's vote. */
export async function fetchPolls({ matchId }: { matchId?: string } = {}): Promise<FanPoll[]> {
  let query = supabase
    .from('fan_polls')
    .select('*, options:poll_options(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (matchId) query = query.eq('match_id', matchId);
  const polls = unwrap(await query) as (Omit<FanPoll, 'total_votes'> & { options: PollOption[] })[];
  if (!polls.length) return [];

  const { data: auth } = await supabase.auth.getSession();
  const userId = auth.session?.user.id;
  const votes: Record<string, string> = {};
  if (userId) {
    const rows = unwrap(
      await supabase
        .from('poll_votes')
        .select('poll_id, option_id')
        .eq('user_id', userId)
        .in(
          'poll_id',
          polls.map((p) => p.id)
        )
    ) as { poll_id: string; option_id: string }[];
    rows.forEach((r) => (votes[r.poll_id] = r.option_id));
  }

  return polls.map((poll) => {
    const options = [...poll.options].sort((a, b) => a.id.localeCompare(b.id));
    return {
      ...poll,
      options,
      total_votes: options.reduce((sum, o) => sum + (o.votes_count || 0), 0),
      user_voted_option_id: votes[poll.id] ?? null,
    };
  });
}

/** The vote count is incremented by a database trigger. */
export async function castVote(pollId: string, optionId: string, userId: string) {
  const { error } = await supabase
    .from('poll_votes')
    .insert({ poll_id: pollId, option_id: optionId, user_id: userId });
  if (error) throw error;
}

export function usePolls(matchId?: string) {
  return useQuery(['polls', matchId], () => fetchPolls({ matchId }), { initialData: [] });
}

/** Optimistically apply a vote to a list of polls. */
export function applyVote(polls: FanPoll[], pollId: string, optionId: string): FanPoll[] {
  return polls.map((poll) =>
    poll.id !== pollId
      ? poll
      : {
          ...poll,
          total_votes: poll.total_votes + 1,
          user_voted_option_id: optionId,
          options: poll.options.map((o) =>
            o.id === optionId ? { ...o, votes_count: o.votes_count + 1 } : o
          ),
        }
  );
}
