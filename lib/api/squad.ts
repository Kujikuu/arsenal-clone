import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { Player, TeamType } from '@/types/database';

export function useSquad(teamType: TeamType = 'men') {
  return useQuery(
    ['squad', teamType],
    async () =>
      unwrap(
        await supabase
          .from('players')
          .select('*')
          .eq('team_type', teamType)
          .order('shirt_number', { ascending: true })
      ) as Player[],
    { initialData: [] }
  );
}

export function usePlayer(id: string | undefined) {
  return useQuery(
    ['player', id],
    async () =>
      unwrap(
        await supabase.from('players').select('*').eq('id', id).maybeSingle()
      ) as Player | null,
    { enabled: Boolean(id) }
  );
}
