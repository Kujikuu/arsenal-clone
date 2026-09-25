// Maps football-data.org v4 responses onto the app's tables. Pure functions so
// they can be tested without the network (see mapping_test.ts).

export interface FdTeam {
  id: number;
  name: string;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string;
  venue?: string | null;
  competition: { code: string; name: string; emblem: string | null };
  season: { startDate: string };
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score: { fullTime: { home: number | null; away: number | null } };
  referees?: { name: string; type?: string }[];
}

export interface FdTableRow {
  position: number;
  team: FdTeam;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface FdStandings {
  competition: { code: string };
  season: { startDate: string };
  standings: { stage: string; type: string; table: FdTableRow[] }[];
}

/** Competitions on the free plan that the app knows about, by football-data code. */
export const COMPETITIONS: Record<string, { name: string; logo: string }> = {
  PL: { name: 'Premier League', logo: 'https://crests.football-data.org/PL.png' },
  CL: { name: 'UEFA Champions League', logo: 'https://crests.football-data.org/CL.png' },
};

/** '2026-08-15' -> '2026/27', matching the app's season labels. */
export function seasonLabel(startDate: string): string {
  const year = Number(startDate.slice(0, 4));
  return `${year}/${String((year + 1) % 100).padStart(2, '0')}`;
}

/** Season start year for "now": seasons roll over in July. */
export function currentSeasonYear(now = new Date()): number {
  return now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

export function teamName(team: FdTeam): string {
  return team.shortName || team.name;
}

/** Some crests are SVG, which React Native's Image can't draw; ask for the PNG. */
export function crestUrl(crest: string | null | undefined): string {
  return crest ? crest.replace(/\.svg$/i, '.png') : '';
}

export function mapStatus(status: string): 'scheduled' | 'live' | 'finished' | null {
  switch (status) {
    case 'IN_PLAY':
    case 'PAUSED':
    case 'LIVE':
      return 'live';
    case 'FINISHED':
    case 'AWARDED':
      return 'finished';
    case 'CANCELLED':
      return null;
    default:
      // SCHEDULED, TIMED, POSTPONED, SUSPENDED
      return 'scheduled';
  }
}

const STAGE_LABELS: Record<string, string> = {
  LEAGUE_STAGE: 'League Phase',
  PLAYOFFS: 'Knockout Play-offs',
  LAST_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter-finals',
  SEMI_FINALS: 'Semi-finals',
  FINAL: 'Final',
};

export function roundLabel(match: FdMatch): string {
  if (match.competition.code === 'PL') return `Matchday ${match.matchday ?? ''}`.trim();
  if (match.stage === 'LEAGUE_STAGE' && match.matchday) return `League Phase MD${match.matchday}`;
  return STAGE_LABELS[match.stage] ?? match.stage.replace(/_/g, ' ');
}

export interface Club {
  name: string;
  /** Used when the API gives no venue for one of the club's home matches. */
  stadium: string;
}

/** Row for public.matches, or null when the match should be skipped. */
export function mapMatch(match: FdMatch, club: Club) {
  const competition = COMPETITIONS[match.competition.code];
  const status = mapStatus(match.status);
  if (!competition || !status) return null;

  const home = teamName(match.homeTeam);
  const referee = match.referees?.find((r) => r.type === 'REFEREE') ?? match.referees?.[0];
  const hasScore = status !== 'scheduled';
  return {
    external_id: `fd:${match.id}`,
    team_type: 'men',
    competition: competition.name,
    competition_logo: crestUrl(match.competition.emblem) || competition.logo,
    season: seasonLabel(match.season.startDate),
    round: roundLabel(match),
    match_date: match.utcDate,
    home_team: home,
    away_team: teamName(match.awayTeam),
    home_team_logo: crestUrl(match.homeTeam.crest),
    away_team_logo: crestUrl(match.awayTeam.crest),
    home_score: hasScore ? match.score.fullTime.home : null,
    away_score: hasScore ? match.score.fullTime.away : null,
    status,
    stadium: match.venue || (home === club.name ? club.stadium : 'TBC'),
    referee: referee?.name ?? null,
  };
}

/**
 * Rows for public.standings from the overall league table. `previousRanks`
 * (team name -> rank before this sync) drives the up / down / same arrow.
 */
export function mapStandings(data: FdStandings, previousRanks: Map<string, number>) {
  const competition = COMPETITIONS[data.competition.code];
  const total = data.standings.find((s) => s.type === 'TOTAL');
  if (!competition || !total) return [];
  const season = seasonLabel(data.season.startDate);

  return total.table.map((row) => {
    const name = teamName(row.team);
    const before = previousRanks.get(name);
    const trend =
      before === undefined || before === row.position
        ? 'same'
        : row.position < before
          ? 'up'
          : 'down';
    return {
      team_type: 'men',
      season,
      competition: competition.name,
      rank: row.position,
      team_name: name,
      team_code: row.team.tla,
      team_logo: crestUrl(row.team.crest),
      played: row.playedGames,
      won: row.won,
      drawn: row.draw,
      lost: row.lost,
      goals_for: row.goalsFor,
      goals_against: row.goalsAgainst,
      goal_diff: row.goalDifference,
      points: row.points,
      trend,
      form: row.form,
    };
  });
}
