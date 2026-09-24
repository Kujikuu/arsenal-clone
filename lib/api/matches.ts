import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Match } from '@/types/database';

export const FALLBACK_MATCHES: Record<string, Match> = {
  m01: {
    id: 'm01',
    competition: 'Premier League',
    competition_logo: 'https://media.api-sports.io/football/leagues/39.png',
    season: '2026/27',
    round: 'Matchday 5',
    match_date: '2026-09-19T16:00:00Z',
    home_team: 'Brighton',
    away_team: 'Arsenal',
    home_team_logo: 'https://media.api-sports.io/football/teams/51.png',
    away_team_logo: 'https://media.api-sports.io/football/teams/42.png',
    home_score: 3,
    away_score: 0,
    status: 'finished',
    minute: 90,
    stadium: 'American Express Stadium',
    referee: 'Stuart Attwell',
    lineups_json: null,
    timeline_events_json: null,
    match_stats_json: null,
  },
  m02: {
    id: 'm02',
    competition: 'Carabao Cup',
    competition_logo: 'https://media.api-sports.io/football/leagues/48.png',
    season: '2026/27',
    round: 'Round 3',
    match_date: '2026-09-15T19:45:00Z',
    home_team: 'Ipswich Town',
    away_team: 'Arsenal',
    home_team_logo: 'https://media.api-sports.io/football/teams/57.png',
    away_team_logo: 'https://media.api-sports.io/football/teams/42.png',
    home_score: 2,
    away_score: 4,
    status: 'finished',
    minute: 90,
    stadium: 'Portman Road',
    referee: 'Robert Jones',
    lineups_json: null,
    timeline_events_json: null,
    match_stats_json: null,
  },
  m03: {
    id: 'm03',
    competition: 'Premier League',
    competition_logo: 'https://media.api-sports.io/football/leagues/39.png',
    season: '2026/27',
    round: 'Matchday 6',
    match_date: '2026-09-22T15:30:00Z',
    home_team: 'Man City',
    away_team: 'Arsenal',
    home_team_logo: 'https://media.api-sports.io/football/teams/50.png',
    away_team_logo: 'https://media.api-sports.io/football/teams/42.png',
    home_score: 2,
    away_score: 2,
    status: 'finished',
    minute: 90,
    stadium: 'Etihad Stadium',
    referee: 'Michael Oliver',
    lineups_json: null,
    timeline_events_json: null,
    match_stats_json: null,
  },
  m04: {
    id: 'm04',
    competition: 'Premier League',
    competition_logo: 'https://media.api-sports.io/football/leagues/39.png',
    season: '2026/27',
    round: 'Matchday 7',
    match_date: '2026-09-28T14:00:00Z',
    home_team: 'Arsenal',
    away_team: 'Leicester City',
    home_team_logo: 'https://media.api-sports.io/football/teams/42.png',
    away_team_logo: 'https://media.api-sports.io/football/teams/46.png',
    home_score: 4,
    away_score: 2,
    status: 'finished',
    minute: 90,
    stadium: 'Emirates Stadium',
    referee: 'Paul Tierney',
    lineups_json: null,
    timeline_events_json: null,
    match_stats_json: null,
  },
};

export async function fetchMatches(
  filter: 'fixtures' | 'results' | 'all' = 'all'
): Promise<{ data: Match[]; error: any }> {
  try {
    let query = supabase.from('matches').select('*');

    if (filter === 'fixtures') {
      query = query.in('status', ['scheduled', 'live']).order('match_date', { ascending: true });
    } else if (filter === 'results') {
      query = query.eq('status', 'finished').order('match_date', { ascending: false });
    } else {
      query = query.order('match_date', { ascending: true });
    }

    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) {
      return { data: data as Match[], error: null };
    }
    return { data: Object.values(FALLBACK_MATCHES), error: null };
  } catch (error) {
    console.warn('[fetchMatches] Supabase query error, using fallback:', error);
    return { data: Object.values(FALLBACK_MATCHES), error };
  }
}

export async function fetchNextMatch(): Promise<{ data: Match | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .in('status', ['scheduled', 'live'])
      .order('match_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data) return { data: data as Match, error: null };
    return { data: FALLBACK_MATCHES.m01, error: null };
  } catch (error) {
    console.warn('[fetchNextMatch] Supabase query error, using fallback:', error);
    return { data: FALLBACK_MATCHES.m01, error };
  }
}

export async function fetchMatchById(id: string): Promise<{ data: Match | null; error: any }> {
  try {
    const { data, error } = await supabase.from('matches').select('*').eq('id', id).maybeSingle();

    if (error) throw error;
    if (data) {
      return { data: data as Match, error: null };
    }

    // Check fallback matches
    if (FALLBACK_MATCHES[id]) {
      return { data: FALLBACK_MATCHES[id], error: null };
    }

    // Default to m01 (Brighton vs Arsenal)
    return { data: FALLBACK_MATCHES.m01, error: null };
  } catch (error) {
    console.warn('[fetchMatchById] Supabase query error, using fallback:', error);
    const fallback = FALLBACK_MATCHES[id] || FALLBACK_MATCHES.m01;
    return { data: fallback, error };
  }
}

export function useMatches(filter: 'fixtures' | 'results' | 'all' = 'all') {
  const [matches, setMatches] = useState<Match[]>(Object.values(FALLBACK_MATCHES));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchMatches(filter);
    if (data && data.length > 0) {
      setMatches(data);
    }
    setError(err);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return { matches, loading, error, refetch: load };
}

export function useNextMatch() {
  const [nextMatch, setNextMatch] = useState<Match | null>(FALLBACK_MATCHES.m01);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchNextMatch();
    setNextMatch(data);
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { nextMatch, loading, error, refetch: load };
}

export function useMatch(id: string) {
  const [match, setMatch] = useState<Match | null>(FALLBACK_MATCHES[id] || FALLBACK_MATCHES.m01);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const { data, error: err } = await fetchMatchById(id);
      setMatch(data);
      setError(err);
      setLoading(false);
    }
    load();
  }, [id]);

  return { match, loading, error };
}
