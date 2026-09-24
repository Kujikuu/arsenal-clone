import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type {
  Article,
  FanPoll,
  Match,
  MatchEvent,
  MatchLineupPlayer,
  MatchStat,
  TeamType,
  Video,
} from '@/types/database';
import { fetchPolls } from '@/lib/api/polls';
import { ALL_COMPETITIONS } from '@/store/filterStore';

export interface FixtureFilters {
  teamType: TeamType;
  season: string;
  /** A competition name, or ALL_COMPETITIONS. */
  competition: string;
  /** Only matches involving an Arsenal side. */
  arsenalOnly: boolean;
}

export async function fetchFixtures(filters: FixtureFilters): Promise<Match[]> {
  let query = supabase
    .from('matches')
    .select('*')
    .eq('team_type', filters.teamType)
    .eq('season', filters.season)
    .order('match_date', { ascending: true });
  if (filters.competition !== ALL_COMPETITIONS)
    query = query.eq('competition', filters.competition);
  if (filters.arsenalOnly) query = query.or('home_team.ilike.Arsenal*,away_team.ilike.Arsenal*');
  return unwrap(await query) as Match[];
}

export function useFixtures(filters: FixtureFilters) {
  return useQuery(['fixtures', filters], () => fetchFixtures(filters), { initialData: [] });
}

export interface FixtureOptions {
  seasons: string[];
  competitions: string[];
}

/** Seasons (newest first) and competitions that have fixtures for a team. */
export function useFixtureOptions(teamType: TeamType) {
  return useQuery(['fixture-options', teamType], async (): Promise<FixtureOptions> => {
    const rows = unwrap(
      await supabase.from('matches').select('season, competition').eq('team_type', teamType)
    ) as Pick<Match, 'season' | 'competition'>[];
    return {
      seasons: [...new Set(rows.map((r) => r.season))].sort().reverse(),
      competitions: [...new Set(rows.map((r) => r.competition))].sort(),
    };
  });
}

/** Scheduled matches for the given teams, used by calendar sync. */
export async function fetchUpcomingMatches(teamTypes: TeamType[]): Promise<Match[]> {
  if (!teamTypes.length) return [];
  const rows = unwrap(
    await supabase
      .from('matches')
      .select('*')
      .in('team_type', teamTypes)
      .in('status', ['scheduled', 'live'])
      .gte('match_date', new Date().toISOString())
      .or('home_team.ilike.Arsenal*,away_team.ilike.Arsenal*')
      .order('match_date', { ascending: true })
  );
  return rows as Match[];
}

export interface MatchCentreData {
  match: Match | null;
  events: MatchEvent[];
  lineups: MatchLineupPlayer[];
  stats: MatchStat[];
  videos: Video[];
  articles: Article[];
  polls: FanPoll[];
}

export async function fetchMatchCentre(id: string): Promise<MatchCentreData> {
  const [match, events, lineups, stats, videos, articles, polls] = await Promise.all([
    supabase.from('matches').select('*').eq('id', id).maybeSingle(),
    supabase.from('match_events').select('*').eq('match_id', id).order('sort'),
    supabase.from('match_lineups').select('*').eq('match_id', id).order('sort'),
    supabase.from('match_stats').select('*').eq('match_id', id).order('sort'),
    supabase
      .from('videos')
      .select('*')
      .eq('match_id', id)
      .order('published_at', { ascending: false }),
    supabase
      .from('articles')
      .select('*')
      .eq('match_id', id)
      .order('published_at', { ascending: false }),
    fetchPolls({ matchId: id }),
  ]);
  return {
    match: unwrap(match) as Match | null,
    events: unwrap(events) as MatchEvent[],
    lineups: unwrap(lineups) as MatchLineupPlayer[],
    stats: (unwrap(stats) as MatchStat[]).map((s) => ({ ...s, home_share: Number(s.home_share) })),
    videos: unwrap(videos) as Video[],
    articles: unwrap(articles) as Article[],
    polls,
  };
}

export function useMatchCentre(id: string | undefined) {
  return useQuery(['match-centre', id], () => fetchMatchCentre(id as string), {
    enabled: Boolean(id),
  });
}
