import { useEffect, useLayoutEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Watch {
  table: 'matches' | 'match_events';
  /** PostgREST-style filter, e.g. `id=eq.m04`. Omit to watch the whole table. */
  filter?: string;
}

/**
 * Refetch when watched rows change (live scores, new timeline entries).
 * Bursts of changes are collapsed into one refetch.
 */
export function useRealtimeRefetch(key: string, watches: Watch[], refetch: () => unknown) {
  const refetchRef = useRef(refetch);
  useLayoutEffect(() => {
    refetchRef.current = refetch;
  });
  const watchKey = JSON.stringify(watches);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => refetchRef.current(), 1000);
    };
    const channel = supabase.channel(`live:${key}`);
    for (const { table, filter } of JSON.parse(watchKey) as Watch[]) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table, filter }, onChange);
    }
    channel.subscribe();
    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [key, watchKey]);
}
