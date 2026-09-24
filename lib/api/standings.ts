import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { Standing, TeamType } from '@/types/database';

/** League table for a team and season (a team plays in one league per season). */
export function useStandings(teamType: TeamType, season: string) {
  return useQuery(
    ['standings', teamType, season],
    async () =>
      unwrap(
        await supabase
          .from('standings')
          .select('*')
          .eq('team_type', teamType)
          .eq('season', season)
          .order('rank', { ascending: true })
      ) as Standing[],
    { initialData: [] }
  );
}
