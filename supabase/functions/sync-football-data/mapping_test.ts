import { assertEquals } from 'jsr:@std/assert@1';
import {
  crestUrl,
  currentSeasonYear,
  mapMatch,
  mapStandings,
  roundLabel,
  seasonLabel,
  type FdMatch,
} from './mapping.ts';

const club = { name: 'Arsenal', stadium: 'Emirates Stadium' };

function match(overrides: Partial<FdMatch> = {}): FdMatch {
  return {
    id: 5001,
    utcDate: '2026-08-22T14:00:00Z',
    status: 'TIMED',
    matchday: 1,
    stage: 'REGULAR_SEASON',
    competition: {
      code: 'PL',
      name: 'Premier League',
      emblem: 'https://crests.football-data.org/PL.png',
    },
    season: { startDate: '2026-08-21' },
    homeTeam: {
      id: 57,
      name: 'Arsenal FC',
      shortName: 'Arsenal',
      tla: 'ARS',
      crest: 'https://crests.football-data.org/57.png',
    },
    awayTeam: {
      id: 76,
      name: 'Wolverhampton Wanderers FC',
      shortName: 'Wolves',
      tla: 'WOL',
      crest: 'https://crests.football-data.org/76.svg',
    },
    score: { fullTime: { home: null, away: null } },
    referees: [{ name: 'Anthony Taylor', type: 'REFEREE' }],
    ...overrides,
  };
}

Deno.test('season labels', () => {
  assertEquals(seasonLabel('2026-08-21'), '2026/27');
  assertEquals(seasonLabel('2099-08-01'), '2099/00');
  assertEquals(currentSeasonYear(new Date('2027-03-01T00:00:00Z')), 2026);
  assertEquals(currentSeasonYear(new Date('2026-07-01T00:00:00Z')), 2026);
});

Deno.test('scheduled PL home match', () => {
  const row = mapMatch(match(), club)!;
  assertEquals(row.external_id, 'fd:5001');
  assertEquals(row.competition, 'Premier League');
  assertEquals(row.round, 'Matchday 1');
  assertEquals(row.season, '2026/27');
  assertEquals(row.home_team, 'Arsenal');
  assertEquals(row.away_team_logo, 'https://crests.football-data.org/76.png');
  assertEquals(row.status, 'scheduled');
  assertEquals(row.home_score, null);
  assertEquals(row.stadium, 'Emirates Stadium');
  assertEquals(row.referee, 'Anthony Taylor');
});

Deno.test('live away match keeps the running score', () => {
  const row = mapMatch(
    match({
      status: 'IN_PLAY',
      homeTeam: match().awayTeam,
      awayTeam: match().homeTeam,
      score: { fullTime: { home: 0, away: 2 } },
    }),
    club
  )!;
  assertEquals(row.status, 'live');
  assertEquals([row.home_score, row.away_score], [0, 2]);
  assertEquals(row.stadium, 'TBC');
});

Deno.test('Champions League rounds and skipped matches', () => {
  const cl = match({
    competition: { code: 'CL', name: 'UEFA Champions League', emblem: null },
    stage: 'LEAGUE_STAGE',
    matchday: 3,
  });
  assertEquals(roundLabel(cl), 'League Phase MD3');
  assertEquals(mapMatch(cl, club)!.competition_logo, 'https://crests.football-data.org/CL.png');
  assertEquals(roundLabel({ ...cl, stage: 'QUARTER_FINALS' }), 'Quarter-finals');
  assertEquals(mapMatch(match({ status: 'CANCELLED' }), club), null);
  assertEquals(
    mapMatch(match({ competition: { code: 'FAC', name: 'FA Cup', emblem: null } }), club),
    null
  );
});

Deno.test('standings with rank movement', () => {
  const team = (id: number, shortName: string) => ({
    id,
    name: shortName,
    shortName,
    tla: shortName.slice(0, 3).toUpperCase(),
    crest: null,
  });
  const row = (position: number, name: string) => ({
    position,
    team: team(position, name),
    playedGames: 5,
    form: 'W,W,D,W,L',
    won: 3,
    draw: 1,
    lost: 1,
    points: 10,
    goalsFor: 9,
    goalsAgainst: 4,
    goalDifference: 5,
  });
  const rows = mapStandings(
    {
      competition: { code: 'PL' },
      season: { startDate: '2026-08-21' },
      standings: [
        { stage: 'REGULAR_SEASON', type: 'HOME', table: [] },
        {
          stage: 'REGULAR_SEASON',
          type: 'TOTAL',
          table: [row(1, 'Arsenal'), row(2, 'Liverpool'), row(3, 'Chelsea')],
        },
      ],
    },
    new Map([
      ['Arsenal', 2],
      ['Liverpool', 1],
    ])
  );
  assertEquals(
    rows.map((r) => r.trend),
    ['up', 'down', 'same']
  );
  assertEquals(rows[0].season, '2026/27');
  assertEquals(rows[0].drawn, 1);
  assertEquals(crestUrl(null), '');
});
