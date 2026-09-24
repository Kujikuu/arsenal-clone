import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Standing } from '@/types/database';

export async function fetchStandings(): Promise<{ data: Standing[]; error: any }> {
  try {
    const { data, error } = await supabase
      .from('standings')
      .select('*')
      .order('rank', { ascending: true });

    if (error) throw error;
    return { data: (data as Standing[]) || [], error: null };
  } catch (error) {
    console.warn('[fetchStandings] Supabase query error:', error);
    return { data: [], error };
  }
}

export function useStandings() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchStandings();
    setStandings(data);
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { standings, loading, error, refetch: load };
}
