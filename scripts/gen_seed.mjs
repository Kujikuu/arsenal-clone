// Generates supabase/seed.sql from the club data below and supabase/data/*.json.
//
//   node scripts/gen_seed.mjs > supabase/seed.sql
//
// If supabase/data/arsenal_squad_2026-27.json exists (see scripts/fetch_pl_squad.mjs),
// the men's squad, stats and photos are synced with the Premier League roster.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- helpers
const q = (v) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (Array.isArray(v)) return `array[${v.map(q).join(', ')}]::text[]`;
  if (typeof v === 'object' && v.__json) return `${q(JSON.stringify(v.__json))}::jsonb`;
  return `'${String(v).replace(/'/g, "''")}'`;
};
const json = (v) => ({ __json: v });

const out = [];
const emit = (s = '') => out.push(s);

function insert(table, rows, { conflict = 'id', update = true, keep = [] } = {}) {
  if (!rows.length) return;
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  emit(`insert into public.${table} (${cols.join(', ')})\nvalues`);
  emit(rows.map((r) => `  (${cols.map((c) => q(r[c])).join(', ')})`).join(',\n'));
  if (conflict) {
    const set = cols.filter(
      (c) =>
        !conflict
          .split(',')
          .map((s) => s.trim())
          .includes(c) && !keep.includes(c)
    );
    emit(
      update && set.length
        ? `on conflict (${conflict}) do update set\n  ${set.map((c) => `${c} = excluded.${c}`).join(',\n  ')};`
        : `on conflict (${conflict}) do nothing;`
    );
  } else emit(';');
  emit();
}

const section = (title) => {
  emit('-- ' + '-'.repeat(64));
  emit(`-- ${title}`);
  emit('-- ' + '-'.repeat(64));
};

// ---------------------------------------------------------------- reference
const TEAM_LOGO = (id) => `https://media.api-sports.io/football/teams/${id}.png`;
const LEAGUE_LOGO = (id) => `https://media.api-sports.io/football/leagues/${id}.png`;

const TEAMS = {
  Arsenal: ['ARS', 42],
  Liverpool: ['LIV', 40],
  'Man City': ['MCI', 50],
  Chelsea: ['CHE', 49],
  "Nott'm Forest": ['NFO', 65],
  'Aston Villa': ['AVL', 66],
  Newcastle: ['NEW', 34],
  Tottenham: ['TOT', 47],
  Brighton: ['BHA', 51],
  Fulham: ['FUL', 36],
  Bournemouth: ['BOU', 35],
  Brentford: ['BRE', 55],
  'Man United': ['MUN', 33],
  'West Ham': ['WHU', 48],
  Everton: ['EVE', 45],
  'Crystal Palace': ['CRY', 52],
  Wolves: ['WOL', 39],
  'Ipswich Town': ['IPS', 57],
  'Leicester City': ['LEI', 46],
  Southampton: ['SOU', 41],
  Leeds: ['LEE', 63],
  Sunderland: ['SUN', 746],
  'Paris Saint-Germain': ['PSG', 85],
  'Bayern Munich': ['BAY', 157],
  'Real Madrid': ['RMA', 541],
  Inter: ['INT', 505],
  'Athletic Club': ['ATH', 531],
  Olympiacos: ['OLY', 553],
  'Atlético Madrid': ['ATM', 530],
  PSV: ['PSV', 197],
  'AC Milan': ['MIL', 489],
  Barcelona: ['BAR', 529],
  'HB Køge': ['HBK', 2070],
};

const COMP = {
  'Premier League': LEAGUE_LOGO(39),
  'UEFA Champions League': LEAGUE_LOGO(2),
  'FA Cup': LEAGUE_LOGO(45),
  'Carabao Cup': LEAGUE_LOGO(48),
  'Emirates Cup': TEAM_LOGO(42),
  Friendly: LEAGUE_LOGO(667),
  "Women's Super League": LEAGUE_LOGO(44),
  "UEFA Women's Champions League": LEAGUE_LOGO(525),
  'Premier League 2': LEAGUE_LOGO(39),
  'U18 Premier League': LEAGUE_LOGO(39),
  'UEFA Youth League': LEAGUE_LOGO(2),
};

const STADIUM = {
  Arsenal: 'Emirates Stadium',
  Liverpool: 'Anfield',
  'Man City': 'Etihad Stadium',
  Chelsea: 'Stamford Bridge',
  "Nott'm Forest": 'The City Ground',
  'Aston Villa': 'Villa Park',
  Newcastle: "St. James' Park",
  Tottenham: 'Tottenham Hotspur Stadium',
  Brighton: 'American Express Stadium',
  Fulham: 'Craven Cottage',
  Bournemouth: 'Vitality Stadium',
  Brentford: 'Gtech Community Stadium',
  'Man United': 'Old Trafford',
  'West Ham': 'London Stadium',
  Everton: 'Hill Dickinson Stadium',
  'Crystal Palace': 'Selhurst Park',
  Wolves: 'Molineux Stadium',
  'Ipswich Town': 'Portman Road',
  'Leicester City': 'King Power Stadium',
  Southampton: "St Mary's Stadium",
  Leeds: 'Elland Road',
  Sunderland: 'Stadium of Light',
  'Paris Saint-Germain': 'Parc des Princes',
  'Bayern Munich': 'Allianz Arena',
  'Real Madrid': 'Santiago Bernabéu',
  Inter: 'San Siro',
  'Athletic Club': 'San Mamés',
  Olympiacos: 'Karaiskakis Stadium',
  'Atlético Madrid': 'Riyadh Air Metropolitano',
  PSV: 'Philips Stadion',
};

// Strip age-group suffixes (Arsenal U21 -> Arsenal) for logo lookups.
const baseTeam = (name) => name.replace(/ (Women|U21|U19|U18)$/, '');
const logoFor = (name) => {
  const t = TEAMS[baseTeam(name)];
  return t ? TEAM_LOGO(t[1]) : TEAM_LOGO(42);
};

const TODAY = new Date('2026-09-24T12:00:00Z');

// [id, team_type, season, competition, round, isoDate, home, away, score|null, stadium?, referee?]
const M = [];
const addMatch = (
  id,
  team_type,
  season,
  competition,
  round,
  date,
  home,
  away,
  score,
  stadium,
  referee
) =>
  M.push({ id, team_type, season, competition, round, date, home, away, score, stadium, referee });

// ---- Men 2026/27
const men = (id, comp, round, date, home, away, score, ref, stadium) =>
  addMatch(id, 'men', '2026/27', comp, round, date, home, away, score, stadium, ref);
men(
  'm2627-01',
  'Friendly',
  'Pre-season',
  '2026-07-25T11:00:00Z',
  'Arsenal',
  'AC Milan',
  '1-0',
  'Clarence Chew',
  'National Stadium, Singapore'
);
men(
  'm2627-02',
  'Emirates Cup',
  'Final',
  '2026-08-01T14:00:00Z',
  'Arsenal',
  'Athletic Club',
  '3-0',
  'Tony Harrington'
);
men(
  'm2627-03',
  'Premier League',
  'Matchday 1',
  '2026-08-22T14:00:00Z',
  'Arsenal',
  'Wolves',
  '2-0',
  'Anthony Taylor'
);
men(
  'm2627-04',
  'Premier League',
  'Matchday 2',
  '2026-08-29T11:30:00Z',
  'Aston Villa',
  'Arsenal',
  '1-2',
  'Simon Hooper'
);
men(
  'm2627-05',
  'Premier League',
  'Matchday 3',
  '2026-09-12T16:30:00Z',
  'Arsenal',
  'Newcastle',
  '3-1',
  'Chris Kavanagh'
);
men(
  'm02',
  'Carabao Cup',
  'Round 3',
  '2026-09-15T18:45:00Z',
  'Ipswich Town',
  'Arsenal',
  '2-4',
  'Robert Jones'
);
men(
  'm01',
  'Premier League',
  'Matchday 4',
  '2026-09-19T16:00:00Z',
  'Brighton',
  'Arsenal',
  '3-0',
  'Stuart Attwell'
);
men(
  'm03',
  'Premier League',
  'Matchday 5',
  '2026-09-22T19:00:00Z',
  'Man City',
  'Arsenal',
  '2-2',
  'Michael Oliver'
);
men(
  'm04',
  'Premier League',
  'Matchday 6',
  '2026-09-26T14:00:00Z',
  'Arsenal',
  'Leicester City',
  null,
  'Paul Tierney'
);
men(
  'm2627-06',
  'UEFA Champions League',
  'League Phase MD1',
  '2026-09-30T19:00:00Z',
  'Arsenal',
  'Olympiacos',
  null,
  'Danny Makkelie'
);
men(
  'm2627-07',
  'Premier League',
  'Matchday 7',
  '2026-10-03T16:30:00Z',
  'Arsenal',
  'Chelsea',
  null,
  'Michael Oliver'
);
men(
  'm2627-08',
  'Premier League',
  'Matchday 8',
  '2026-10-17T11:30:00Z',
  'Liverpool',
  'Arsenal',
  null,
  'Anthony Taylor'
);
men(
  'm2627-09',
  'UEFA Champions League',
  'League Phase MD2',
  '2026-10-21T19:00:00Z',
  'Inter',
  'Arsenal',
  null,
  'Clément Turpin'
);
men(
  'm2627-10',
  'Premier League',
  'Matchday 9',
  '2026-10-24T14:00:00Z',
  'Arsenal',
  'Fulham',
  null,
  'Jarred Gillett'
);
men(
  'm2627-11',
  'Carabao Cup',
  'Round 4',
  '2026-10-28T19:45:00Z',
  'Arsenal',
  'Brentford',
  null,
  'Tim Robinson'
);
men(
  'm2627-12',
  'Premier League',
  'Matchday 10',
  '2026-10-31T17:30:00Z',
  'Tottenham',
  'Arsenal',
  null,
  'Simon Hooper'
);
men(
  'm2627-13',
  'UEFA Champions League',
  'League Phase MD3',
  '2026-11-04T20:00:00Z',
  'Arsenal',
  'PSV',
  null,
  'Slavko Vinčić'
);
men(
  'm2627-14',
  'Premier League',
  'Matchday 11',
  '2026-11-07T17:30:00Z',
  'Arsenal',
  'Man United',
  null,
  'Chris Kavanagh'
);
men(
  'm2627-15',
  'Premier League',
  'Matchday 12',
  '2026-11-21T15:00:00Z',
  'Everton',
  'Arsenal',
  null,
  'Craig Pawson'
);
men(
  'm2627-16',
  'UEFA Champions League',
  'League Phase MD4',
  '2026-11-25T20:00:00Z',
  'Bayern Munich',
  'Arsenal',
  null,
  'Szymon Marciniak'
);
men(
  'm2627-17',
  'Premier League',
  'Matchday 13',
  '2026-11-28T15:00:00Z',
  'Arsenal',
  'Crystal Palace',
  null,
  'Robert Jones'
);
men(
  'm2627-18',
  'Premier League',
  'Matchday 14',
  '2026-12-05T15:00:00Z',
  "Nott'm Forest",
  'Arsenal',
  null,
  'John Brooks'
);
men(
  'm2627-19',
  'UEFA Champions League',
  'League Phase MD5',
  '2026-12-09T20:00:00Z',
  'Arsenal',
  'Atlético Madrid',
  null,
  'François Letexier'
);
men(
  'm2627-20',
  'Premier League',
  'Matchday 15',
  '2026-12-13T14:00:00Z',
  'Arsenal',
  'West Ham',
  null,
  'Samuel Barrott'
);
men(
  'm2627-21',
  'Premier League',
  'Matchday 16',
  '2026-12-19T15:00:00Z',
  'Bournemouth',
  'Arsenal',
  null,
  'Peter Bankes'
);
men(
  'm2627-22',
  'Premier League',
  'Matchday 17',
  '2026-12-26T15:00:00Z',
  'Arsenal',
  'Sunderland',
  null,
  'Andy Madley'
);
men(
  'm2627-23',
  'Premier League',
  'Matchday 19',
  '2027-01-02T12:30:00Z',
  'Leeds',
  'Arsenal',
  null,
  'Stuart Attwell'
);
men(
  'm2627-24',
  'FA Cup',
  'Third Round',
  '2027-01-09T17:45:00Z',
  'Arsenal',
  'Southampton',
  null,
  'Darren England'
);
men(
  'm2627-25',
  'UEFA Champions League',
  'League Phase MD7',
  '2027-01-20T20:00:00Z',
  'Arsenal',
  'Real Madrid',
  null,
  'Daniele Orsato'
);
men(
  'm2627-26',
  'Premier League',
  'Matchday 22',
  '2027-01-23T17:30:00Z',
  'Man City',
  'Arsenal',
  null,
  'Michael Oliver'
);
men(
  'm2627-27',
  'Premier League',
  'Matchday 25',
  '2027-02-06T17:30:00Z',
  'Arsenal',
  'Liverpool',
  null,
  'Anthony Taylor'
);
men(
  'm2627-28',
  'Premier League',
  'Matchday 28',
  '2027-02-27T12:30:00Z',
  'Chelsea',
  'Arsenal',
  null,
  'Paul Tierney'
);
men(
  'm2627-29',
  'Premier League',
  'Matchday 30',
  '2027-03-13T15:00:00Z',
  'Arsenal',
  'Tottenham',
  null,
  'Chris Kavanagh'
);
men(
  'm2627-30',
  'Premier League',
  'Matchday 32',
  '2027-04-10T14:00:00Z',
  'Newcastle',
  'Arsenal',
  null,
  'Simon Hooper'
);
men(
  'm2627-31',
  'Premier League',
  'Matchday 38',
  '2027-05-23T15:00:00Z',
  'Arsenal',
  'Aston Villa',
  null,
  'Anthony Taylor'
);
// Other Premier League results (for the "All" teams filter)
men(
  'm2627-o1',
  'Premier League',
  'Matchday 4',
  '2026-09-19T14:00:00Z',
  'Liverpool',
  'Chelsea',
  '2-1',
  'Craig Pawson'
);
men(
  'm2627-o2',
  'Premier League',
  'Matchday 4',
  '2026-09-20T13:00:00Z',
  'Man United',
  'Tottenham',
  '1-2',
  'John Brooks'
);
men(
  'm2627-o3',
  'Premier League',
  'Matchday 5',
  '2026-09-23T19:00:00Z',
  'Newcastle',
  'Aston Villa',
  '1-1',
  'Robert Jones'
);
men(
  'm2627-o4',
  'Premier League',
  'Matchday 6',
  '2026-09-26T16:30:00Z',
  'Chelsea',
  'Man City',
  null,
  'Anthony Taylor'
);

// ---- Men 2025/26
const men2526 = (id, comp, round, date, home, away, score) =>
  addMatch(id, 'men', '2025/26', comp, round, date, home, away, score);
men2526(
  'm2526-01',
  'Premier League',
  'Matchday 1',
  '2025-08-17T15:30:00Z',
  'Man United',
  'Arsenal',
  '0-1'
);
men2526(
  'm2526-02',
  'Premier League',
  'Matchday 2',
  '2025-08-23T16:30:00Z',
  'Arsenal',
  'Leeds',
  '5-0'
);
men2526(
  'm2526-03',
  'Premier League',
  'Matchday 3',
  '2025-08-31T15:30:00Z',
  'Liverpool',
  'Arsenal',
  '1-0'
);
men2526(
  'm2526-04',
  'Premier League',
  'Matchday 4',
  '2025-09-13T11:30:00Z',
  'Arsenal',
  "Nott'm Forest",
  '3-0'
);
men2526(
  'm2526-05',
  'UEFA Champions League',
  'League Phase MD1',
  '2025-09-16T16:45:00Z',
  'Athletic Club',
  'Arsenal',
  '0-2'
);
men2526(
  'm2526-06',
  'Premier League',
  'Matchday 5',
  '2025-09-21T15:30:00Z',
  'Arsenal',
  'Man City',
  '1-1'
);

// ---- Men 2024/25
const men2425 = (id, comp, round, date, home, away, score) =>
  addMatch(id, 'men', '2024/25', comp, round, date, home, away, score);
men2425(
  'm2425-01',
  'Premier League',
  'Matchday 1',
  '2024-08-17T14:00:00Z',
  'Arsenal',
  'Wolves',
  '2-0'
);
men2425(
  'm2425-02',
  'Premier League',
  'Matchday 2',
  '2024-08-24T16:30:00Z',
  'Aston Villa',
  'Arsenal',
  '0-2'
);
men2425(
  'm2425-03',
  'Premier League',
  'Matchday 4',
  '2024-09-15T13:00:00Z',
  'Tottenham',
  'Arsenal',
  '0-1'
);
men2425(
  'm2425-04',
  'Premier League',
  'Matchday 6',
  '2024-09-28T14:00:00Z',
  'Arsenal',
  'Leicester City',
  '4-2'
);
men2425(
  'm2425-05',
  'UEFA Champions League',
  'League Phase MD2',
  '2024-10-01T19:00:00Z',
  'Arsenal',
  'Paris Saint-Germain',
  '2-0'
);
men2425(
  'm2425-06',
  'Premier League',
  'Matchday 24',
  '2025-02-02T16:30:00Z',
  'Arsenal',
  'Man City',
  '5-1'
);
men2425(
  'm2425-07',
  'UEFA Champions League',
  'Quarter-final 2nd leg',
  '2025-04-16T19:00:00Z',
  'Real Madrid',
  'Arsenal',
  '1-2'
);
men2425(
  'm2425-08',
  'UEFA Champions League',
  'Semi-final 1st leg',
  '2025-04-29T19:00:00Z',
  'Arsenal',
  'Paris Saint-Germain',
  '0-1'
);

// ---- Women 2026/27
const women = (id, comp, round, date, home, away, score, stadium) =>
  addMatch(id, 'women', '2026/27', comp, round, date, home, away, score, stadium);
women(
  'w2627-01',
  "Women's Super League",
  'Matchday 1',
  '2026-09-06T13:00:00Z',
  'Chelsea Women',
  'Arsenal Women',
  '1-1',
  'Kingsmeadow'
);
women(
  'w2627-02',
  "Women's Super League",
  'Matchday 2',
  '2026-09-13T13:00:00Z',
  'Arsenal Women',
  'West Ham Women',
  '3-0',
  'Meadow Park'
);
women(
  'w2627-hbk',
  "UEFA Women's Champions League",
  'Qualifying Round 2',
  '2026-09-17T18:00:00Z',
  'Arsenal Women',
  'HB Køge',
  '1-0',
  'Meadow Park'
);
women(
  'w2627-03',
  "Women's Super League",
  'Matchday 3',
  '2026-09-20T11:30:00Z',
  'Arsenal Women',
  'Man United Women',
  '1-1',
  'Emirates Stadium'
);
women(
  'w2627-04',
  "Women's Super League",
  'Matchday 4',
  '2026-10-04T13:00:00Z',
  'Liverpool Women',
  'Arsenal Women',
  null,
  'St Helens Stadium'
);
women(
  'w2627-05',
  "UEFA Women's Champions League",
  'League Phase MD1',
  '2026-10-08T17:45:00Z',
  'Arsenal Women',
  'Bayern Munich Women',
  null,
  'Emirates Stadium'
);
women(
  'w2627-06',
  "Women's Super League",
  'Matchday 5',
  '2026-10-11T13:00:00Z',
  'Arsenal Women',
  'Tottenham Women',
  null,
  'Emirates Stadium'
);
women(
  'w2627-07',
  "Women's Super League",
  'Matchday 7',
  '2026-11-01T14:00:00Z',
  'Man City Women',
  'Arsenal Women',
  null,
  'Joie Stadium'
);
women(
  'w2627-08',
  "Women's Super League",
  'Matchday 8',
  '2026-11-15T12:30:00Z',
  'Arsenal Women',
  'Chelsea Women',
  null,
  'Emirates Stadium'
);
women(
  'w2627-09',
  "Women's Super League",
  'Matchday 10',
  '2026-12-13T12:00:00Z',
  'Arsenal Women',
  'Brighton Women',
  null,
  'Meadow Park'
);
women(
  'w2627-10',
  "Women's Super League",
  'Matchday 12',
  '2027-01-17T14:00:00Z',
  'Everton Women',
  'Arsenal Women',
  null,
  'Goodison Park'
);
// Women 2024/25
addMatch(
  'w2425-final',
  'women',
  '2024/25',
  "UEFA Women's Champions League",
  'Final',
  '2025-05-24T16:00:00Z',
  'Barcelona Women',
  'Arsenal Women',
  '0-1',
  'Estádio José Alvalade, Lisbon',
  'Ivana Martinčić'
);

// ---- Academy 2026/27
const academy = (id, comp, round, date, home, away, score, stadium) =>
  addMatch(id, 'academy', '2026/27', comp, round, date, home, away, score, stadium);
academy(
  'a2627-01',
  'Premier League 2',
  'Matchday 1',
  '2026-08-15T12:00:00Z',
  'Arsenal U21',
  'Chelsea U21',
  '2-1',
  'Meadow Park'
);
academy(
  'a2627-02',
  'Premier League 2',
  'Matchday 3',
  '2026-08-29T12:00:00Z',
  'Man City U21',
  'Arsenal U21',
  '0-3',
  'Joie Stadium'
);
academy(
  'a2627-03',
  'UEFA Youth League',
  'League Phase MD1',
  '2026-09-16T12:00:00Z',
  'Arsenal U19',
  'Olympiacos U19',
  '2-2',
  'Meadow Park'
);
academy(
  'a2627-04',
  'U18 Premier League',
  'Matchday 4',
  '2026-09-20T10:00:00Z',
  'Arsenal U18',
  'Tottenham U18',
  '4-1',
  'Hale End'
);
academy(
  'a2627-05',
  'Premier League 2',
  'Matchday 5',
  '2026-10-03T12:00:00Z',
  'Arsenal U21',
  'Liverpool U21',
  null,
  'Meadow Park'
);
academy(
  'a2627-06',
  'UEFA Youth League',
  'League Phase MD2',
  '2026-10-21T13:00:00Z',
  'Inter U19',
  'Arsenal U19',
  null,
  'Konami Youth Development Centre'
);
academy(
  'a2627-07',
  'U18 Premier League',
  'Matchday 9',
  '2026-11-07T11:00:00Z',
  'West Ham U18',
  'Arsenal U18',
  null,
  'Rush Green'
);
academy(
  'a2627-08',
  'Premier League 2',
  'Matchday 10',
  '2026-12-12T13:00:00Z',
  'Arsenal U21',
  'Man United U21',
  null,
  'Emirates Stadium'
);

const matchRows = M.map((m) => {
  const [hs, as] = m.score ? m.score.split('-').map(Number) : [null, null];
  const finished = new Date(m.date) < TODAY && m.score !== null;
  return {
    id: m.id,
    team_type: m.team_type,
    competition: m.competition,
    competition_logo: COMP[m.competition],
    season: m.season,
    round: m.round,
    match_date: m.date,
    home_team: m.home,
    away_team: m.away,
    home_team_logo: logoFor(m.home),
    away_team_logo: logoFor(m.away),
    home_score: hs,
    away_score: as,
    status: finished ? 'finished' : 'scheduled',
    minute: finished ? 90 : null,
    stadium: m.stadium ?? STADIUM[baseTeam(m.home)] ?? 'Emirates Stadium',
    referee: m.referee ?? null,
    audio_url: m.id === 'm01' || m.id === 'm03' ? 'https://www.arsenal.com/arsenal-radio' : null,
  };
});

// ---------------------------------------------------------------- standings
const table = (team_type, season, competition, rows, playedFallback) =>
  rows
    .map(([team, w, d, l, gf, ga, trend, form]) => ({ team, w, d, l, gf, ga, trend, form }))
    .sort((a, b) => b.w * 3 + b.d - (a.w * 3 + a.d) || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf)
    .map((r, i) => {
      const base = baseTeam(r.team);
      const [code, logoId] = TEAMS[base] ?? [base.slice(0, 3).toUpperCase(), 42];
      const slug = `${team_type}-${season.replace('/', '')}-${competition.replace(/[^A-Za-z0-9]/g, '').toLowerCase()}-${code.toLowerCase()}`;
      return {
        id: `st-${slug}`,
        team_type,
        season,
        competition,
        rank: i + 1,
        team_name: r.team,
        team_code: code,
        team_logo: TEAM_LOGO(logoId),
        played: r.w + r.d + r.l,
        won: r.w,
        drawn: r.d,
        lost: r.l,
        goals_for: r.gf,
        goals_against: r.ga,
        goal_diff: r.gf - r.ga,
        points: r.w * 3 + r.d,
        trend: r.trend,
        form: r.form ?? null,
      };
    });

const standingsRows = [
  ...table('men', '2026/27', 'Premier League', [
    ['Liverpool', 4, 1, 0, 11, 4, 'same', 'W,W,D,W,W'],
    ['Man City', 4, 0, 1, 12, 5, 'up', 'W,W,L,W,D'],
    ['Chelsea', 3, 1, 1, 10, 6, 'up', 'W,D,W,L,W'],
    ['Arsenal', 3, 1, 1, 9, 7, 'down', 'W,W,W,L,D'],
    ['Tottenham', 3, 0, 2, 8, 6, 'up', 'L,W,W,L,W'],
    ['Brighton', 2, 2, 1, 9, 6, 'up', 'D,L,W,D,W'],
    ['Newcastle', 2, 2, 1, 7, 6, 'same', 'W,D,L,W,D'],
    ['Aston Villa', 2, 1, 2, 6, 6, 'down', 'W,L,W,L,D'],
    ["Nott'm Forest", 2, 1, 2, 5, 6, 'same', 'L,W,D,W,L'],
    ['Fulham', 1, 3, 1, 5, 5, 'up', 'D,D,W,L,D'],
    ['Bournemouth', 2, 0, 3, 6, 8, 'down', 'W,L,L,W,L'],
    ['Man United', 1, 2, 2, 6, 7, 'down', 'D,W,L,D,L'],
    ['Brentford', 1, 2, 2, 5, 7, 'same', 'L,D,W,D,L'],
    ['Everton', 1, 2, 2, 4, 6, 'up', 'D,L,D,W,L'],
    ['Crystal Palace', 1, 1, 3, 4, 7, 'down', 'L,W,L,D,L'],
    ['West Ham', 1, 1, 3, 5, 9, 'same', 'L,L,W,D,L'],
    ['Leeds', 1, 1, 3, 4, 8, 'up', 'L,D,L,W,L'],
    ['Sunderland', 1, 0, 4, 3, 9, 'down', 'W,L,L,L,L'],
    ['Leicester City', 0, 2, 3, 3, 8, 'same', 'D,L,L,D,L'],
    ['Wolves', 0, 1, 4, 2, 10, 'down', 'L,L,D,L,L'],
  ]),
  ...table('men', '2024/25', 'Premier League', [
    ['Liverpool', 25, 9, 4, 86, 41, 'same'],
    ['Arsenal', 20, 14, 4, 69, 34, 'same'],
    ['Man City', 21, 8, 9, 72, 44, 'up'],
    ['Chelsea', 20, 9, 9, 64, 43, 'up'],
    ['Newcastle', 20, 6, 12, 68, 47, 'down'],
    ['Aston Villa', 19, 9, 10, 58, 51, 'same'],
    ["Nott'm Forest", 19, 8, 11, 58, 46, 'down'],
    ['Brighton', 16, 13, 9, 66, 59, 'up'],
    ['Bournemouth', 15, 11, 12, 58, 46, 'same'],
    ['Brentford', 16, 8, 14, 66, 57, 'up'],
    ['Fulham', 15, 9, 14, 54, 54, 'down'],
    ['Crystal Palace', 13, 14, 11, 51, 51, 'same'],
    ['Everton', 11, 15, 12, 42, 44, 'up'],
    ['West Ham', 11, 10, 17, 46, 62, 'same'],
    ['Man United', 11, 9, 18, 44, 54, 'down'],
    ['Wolves', 12, 6, 20, 54, 69, 'up'],
    ['Tottenham', 11, 5, 22, 64, 65, 'down'],
    ['Leicester City', 6, 7, 25, 33, 80, 'same'],
    ['Ipswich Town', 4, 10, 24, 36, 82, 'same'],
    ['Southampton', 2, 6, 30, 26, 86, 'same'],
  ]),
  // ref/match-table.jpeg
  ...table('women', '2026/27', "Women's Super League", [
    ['Man City Women', 3, 0, 0, 8, 1, 'up'],
    ['Tottenham Women', 2, 1, 0, 6, 2, 'up'],
    ['Chelsea Women', 2, 1, 0, 5, 2, 'up'],
    ['Leicester City Women', 2, 0, 1, 4, 3, 'same'],
    ['Everton Women', 2, 0, 1, 3, 3, 'up'],
    ['Arsenal Women', 1, 2, 0, 5, 2, 'down'],
    ['Liverpool Women', 1, 1, 1, 3, 3, 'down'],
    ['Crystal Palace Women', 1, 1, 1, 2, 3, 'down'],
    ['West Ham Women', 1, 0, 2, 2, 6, 'up'],
    ['Brighton Women', 0, 2, 1, 2, 4, 'same'],
    ['Man United Women', 0, 2, 1, 2, 3, 'down'],
    ['Aston Villa Women', 0, 0, 3, 1, 9, 'down'],
  ]),
  ...table('academy', '2026/27', 'Premier League 2', [
    ['Arsenal U21', 2, 0, 0, 5, 1, 'up'],
    ['Chelsea U21', 1, 1, 1, 5, 4, 'same'],
    ['Liverpool U21', 1, 1, 0, 3, 1, 'up'],
    ['Tottenham U21', 1, 0, 1, 3, 3, 'down'],
    ['Man United U21', 1, 0, 1, 2, 3, 'same'],
    ['Brighton U21', 0, 2, 0, 2, 2, 'up'],
    ['Man City U21', 0, 1, 2, 1, 6, 'down'],
    ['West Ham U21', 0, 1, 1, 2, 3, 'down'],
  ]),
];

// ---------------------------------------------------------------- players
// Base squad (bios, photos, stats) the seed started from; the PL sync overrides the men's team.
const ALL_PLAYERS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'supabase/data/base_players.json'), 'utf8')
);

const EXTRA = {
  p01: ['Barcelona, Spain', '2023-08-15'],
  p02: ['Ondarroa, Spain', '2025-07-26'],
  p03: ['Hoofddorp, Netherlands', '2024-07-01'],
  p04: ['Araxá, Brazil', '2025-02-03'],
  p05: ['Bondy, France', '2019-07-25'],
  p06: ['Douglas, Isle of Man', '2019-08-08'],
  p07: ['Poole, England', '2021-07-30'],
  p08: ['São Paulo, Brazil', '2020-09-01'],
  p09: ['Utrecht, Netherlands', '2023-07-14'],
  p10: ['Oświęcim, Poland', '2023-01-23'],
  p11: ['Radomyshl, Ukraine', '2022-07-22'],
  p12: ['Fukuoka, Japan', '2021-08-31'],
  p13: ['Rome, Italy', '2024-07-29'],
  p14: ['Krobo Odumase, Ghana', '2020-10-05'],
  p15: ['Drammen, Norway', '2021-08-20'],
  p16: ['Imbituba, Brazil', '2023-01-31'],
  p17: ['Pamplona, Spain', '2024-08-27'],
  p18: ['London, England', '2023-07-15'],
  p19: ['London, England', '2023-07-03'],
  p20: ['London, England', '2018-07-01'],
  p21: ['São Paulo, Brazil', '2022-07-04'],
  p22: ['Guarulhos, Brazil', '2019-07-02'],
  p23: ['Maasmechelen, Belgium', '2023-01-20'],
  p24: ['Aachen, Germany', '2023-06-28'],
  p25: ['Kingston, Jamaica', '2024-08-30'],
  pw01: ['Stockerau, Austria', '2019-07-01'],
  pw02: ['Milton Keynes, England', '2014-07-01'],
  pw03: ['Dublin, Ireland', '2015-01-06'],
  pw04: ['Aberdeen, Scotland', '2016-11-17'],
  pw05: ['Maidstone, England', '2023-07-01'],
  pw06: ['Whitby, England', '2017-01-01'],
  pa01: ['London, England', '2023-07-01'],
  pa02: ['London, England', '2024-07-01'],
};
const PANELS = { p01: 'local:extracted/panel_raya.png', p02: 'local:extracted/panel_kepa.png' };

const legacyRow = (p) => ({
  id: p.id,
  team_type: p.team_type,
  first_name: p.first_name,
  last_name: p.last_name,
  known_as: p.known_as ?? null,
  shirt_number: p.shirt_number,
  position: p.position,
  nationality: p.nationality,
  country_flag: p.country_flag,
  date_of_birth: p.date_of_birth,
  photo_url: p.photo_url,
  card_panel_url: PANELS[p.id] ?? null,
  bio: p.bio,
  appearances: p.appearances,
  goals: p.goals,
  assists: p.assists,
  clean_sheets: p.clean_sheets ?? 0,
  place_of_birth: EXTRA[p.id]?.[0] ?? null,
  signed_on: EXTRA[p.id]?.[1] ?? null,
});

// Official roster pulled from the Premier League data API (fetch_pl_squad.mjs).
const SQUAD_JSON =
  process.env.SQUAD_JSON ?? path.join(ROOT, 'supabase/data/arsenal_squad_2026-27.json');
const PL_SQUAD = fs.existsSync(SQUAD_JSON) ? JSON.parse(fs.readFileSync(SQUAD_JSON, 'utf8')) : null;

const norm = (s) =>
  (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ø/gi, 'o').toLowerCase().trim();
const slug = (s) =>
  norm(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const flagFromIso = (iso) =>
  iso && /^[A-Z]{2}$/.test(iso)
    ? String.fromCodePoint(...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
    : iso === 'GB-ENG'
      ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
      : iso === 'GB-SCT'
        ? '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
        : iso === 'GB-WLS'
          ? '🏴󠁧󠁢󠁷󠁬󠁳󠁿'
          : '🏳️';

/** Same person: equal display names, or equal surnames with a matching first name / known_as. */
function sameName(legacy, pl) {
  const known = norm(legacy.known_as);
  const full = norm(`${legacy.first_name} ${legacy.last_name}`);
  const plName = norm(pl.name);
  if (known === plName || full === plName) return true;
  return (
    norm(legacy.last_name) === norm(pl.last_name) && norm(legacy.first_name) === norm(pl.first_name)
  );
}

function factualBio(pl) {
  const parts = [`${pl.name} is a ${pl.position?.toLowerCase() ?? 'player'} for Arsenal`];
  if (pl.nationality) parts[0] += ` and a ${pl.nationality} international`;
  const joined = pl.joined
    ? ` He joined the club on ${new Date(pl.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}.`
    : '';
  return `${parts[0]}.${joined}`;
}

function rowFromPl(pl, legacy) {
  const base = legacy ? legacyRow(legacy) : {};
  return {
    ...base,
    id: legacy?.id ?? `p-${slug(pl.name)}`,
    team_type: 'men',
    first_name: pl.first_name ?? base.first_name,
    last_name: pl.last_name ?? base.last_name,
    known_as: pl.name ?? base.known_as ?? null,
    shirt_number: pl.shirt_number ?? base.shirt_number,
    position: pl.position ?? base.position,
    nationality: pl.nationality ?? base.nationality,
    country_flag: base.country_flag ?? flagFromIso(pl.nationality_iso),
    date_of_birth: pl.date_of_birth ?? base.date_of_birth,
    // Only the official photo; the legacy URLs were not reliably the right person.
    photo_url: pl.photo_url ?? null,
    card_panel_url: base.card_panel_url ?? null,
    bio: base.bio ?? factualBio(pl),
    appearances: pl.stats.appearances,
    goals: pl.stats.goals,
    assists: pl.stats.assists,
    clean_sheets: pl.stats.clean_sheets,
    place_of_birth: base.place_of_birth ?? pl.place_of_birth ?? null,
    signed_on: base.signed_on ?? pl.joined ?? null,
  };
}

let playerRows;
if (PL_SQUAD) {
  const men = PL_SQUAD.players.filter((p) => p.shirt_number != null && p.position);
  const menRows = men.map((pl) =>
    rowFromPl(
      pl,
      // Prefer the men's row; academy players promoted to the first team keep their id.
      ALL_PLAYERS.find((l) => l.team_type === 'men' && sameName(l, pl)) ??
        ALL_PLAYERS.find((l) => l.team_type === 'academy' && sameName(l, pl))
    )
  );
  const academyRows = ALL_PLAYERS.filter((p) => p.team_type === 'academy').map((l) => {
    // Promoted to the first-team list: that row wins.
    if (men.some((pl) => sameName(l, pl))) return null;
    const pl = PL_SQUAD.academy.find((a) => sameName(l, a));
    return pl?.photo_url ? { ...legacyRow(l), photo_url: pl.photo_url } : legacyRow(l);
  });
  const womenRows = ALL_PLAYERS.filter((p) => p.team_type === 'women').map(legacyRow);
  playerRows = [...menRows, ...academyRows.filter(Boolean), ...womenRows];
} else {
  playerRows = ALL_PLAYERS.map(legacyRow);
}

const dupes = playerRows.map((p) => p.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupes.length) throw new Error(`duplicate player ids: ${dupes.join(', ')}`);

/**
 * Official photo for a line-up name such as "B. SAKA", "J. VAN HECKE" or "CHEMA ANDRÉS",
 * looked up in that team's squad list. Ambiguous or unknown names return null.
 */
function plPhotoFor(lineupName, team) {
  const squad = PL_SQUAD?.lineup_squads?.[team];
  if (!squad) return null;
  const m = lineupName.match(/^([A-Z])\. (.+)$/);
  const initial = m ? norm(m[1]) : null;
  const key = norm(m ? m[2] : lineupName);
  const hits = squad.filter((p) => {
    const display = norm(p.name);
    // Registered first names can differ from the shirt (e.g. "José María" for "Chema").
    if (initial && !norm(p.first_name).startsWith(initial) && !display.startsWith(initial)) {
      return false;
    }
    return (
      norm(p.last_name) === key ||
      display === key ||
      // Shirt surname vs registered surname, e.g. "Rúben Dias" / "Santos Gato Alves Dias".
      display.split(' ').slice(1).join(' ') === key ||
      (!m && display.split(' ')[0] === key)
    );
  });
  return hits.length === 1 ? hits[0].photo_url : null;
}

// ---------------------------------------------------------------- match centre
const EV = [];
const events = (match_id, list) =>
  list.forEach(([minute_label, type, team, player, title, body], i) =>
    EV.push({
      id: `${match_id}-ev${String(i + 1).padStart(2, '0')}`,
      match_id,
      sort: i + 1,
      minute_label,
      type,
      team,
      player,
      title,
      body,
    })
  );

// Chronological; the app shows the newest first (ref/matchcenter-thread.jpeg).
events('m01', [
  ['-', 'whistle', null, null, 'Kick off', 'First Half begins at the American Express Stadium.'],
  [
    "12'",
    'chance',
    'away',
    'Bukayo Saka',
    'Chance',
    'Attempt saved. Bukayo Saka (Arsenal) left footed shot from the right side of the box is saved in the centre of the goal.',
  ],
  [
    "31'",
    'goal',
    'home',
    'P. Groß',
    'Goal!',
    'Goal! Brighton and Hove Albion 1, Arsenal 0. Pascal Groß (Brighton and Hove Albion) right footed shot from outside the box to the bottom left corner.',
  ],
  [
    "38'",
    'yellow_card',
    'away',
    'Declan Rice',
    'Booking',
    'Declan Rice (Arsenal) is shown the yellow card for a bad foul.',
  ],
  [
    "45'",
    'goal',
    'home',
    'C. Kostoulas',
    'Goal!',
    'Goal! Brighton and Hove Albion 2, Arsenal 0. Charalampos Kostoulas (Brighton and Hove Albion) header from very close range.',
  ],
  [
    "45+2'",
    'whistle',
    null,
    null,
    'Half time',
    'First Half ends, Brighton and Hove Albion 2, Arsenal 0.',
  ],
  [
    "46'",
    'sub',
    'away',
    'Leandro Trossard',
    'Substitution',
    'Substitution, Arsenal. Leandro Trossard replaces Gabriel Martinelli.',
  ],
  [
    "57'",
    'goal',
    'home',
    'Chema Andrés',
    'Goal!',
    'Goal! Brighton and Hove Albion 3, Arsenal 0. Chema Andrés (Brighton and Hove Albion) left footed shot from the centre of the box.',
  ],
  [
    "71'",
    'var',
    'away',
    'Kai Havertz',
    'VAR',
    'VAR Decision: No Goal Brighton and Hove Albion 3-0 Arsenal. Kai Havertz was offside in the build-up.',
  ],
  ["90+2'", 'corner', 'away', null, 'Corner', 'Corner, Arsenal. Conceded by Malick Yalcouyé.'],
  [
    "90+5'",
    'chance',
    'away',
    'Martín Zubimendi',
    'Miss',
    'Attempt missed. Martín Zubimendi (Arsenal) header from the centre of the box.',
  ],
  [
    "90+7'",
    'whistle',
    null,
    null,
    'Second Half',
    'Second Half ends, Brighton and Hove Albion 3, Arsenal 0.',
  ],
  ['-', 'whistle', null, null, 'Full time', 'Match ends, Brighton and Hove Albion 3, Arsenal 0.'],
]);
events('m03', [
  ['-', 'whistle', null, null, 'Kick off', 'First Half begins at the Etihad Stadium.'],
  [
    "9'",
    'goal',
    'home',
    'E. Haaland',
    'Goal!',
    'Goal! Manchester City 1, Arsenal 0. Erling Haaland (Manchester City) right footed shot from the centre of the box.',
  ],
  [
    "27'",
    'goal',
    'away',
    'B. Saka',
    'Goal!',
    'Goal! Manchester City 1, Arsenal 1. Bukayo Saka (Arsenal) left footed curler into the top corner. Assisted by Martin Ødegaard.',
  ],
  ["45+1'", 'whistle', null, null, 'Half time', 'First Half ends, Manchester City 1, Arsenal 1.'],
  [
    "58'",
    'goal',
    'away',
    'Gabriel',
    'Goal!',
    'Goal! Manchester City 1, Arsenal 2. Gabriel (Arsenal) header from a Declan Rice corner.',
  ],
  [
    "74'",
    'sub',
    'away',
    'Leandro Trossard',
    'Substitution',
    'Substitution, Arsenal. Leandro Trossard replaces Gabriel Martinelli.',
  ],
  [
    "90+8'",
    'goal',
    'home',
    'J. Stones',
    'Goal!',
    'Goal! Manchester City 2, Arsenal 2. John Stones (Manchester City) volley from close range after a goalmouth scramble.',
  ],
  ['-', 'whistle', null, null, 'Full time', 'Match ends, Manchester City 2, Arsenal 2.'],
]);
events('m02', [
  ['-', 'whistle', null, null, 'Kick off', 'First Half begins at Portman Road.'],
  [
    "14'",
    'goal',
    'away',
    'E. Nwaneri',
    'Goal!',
    'Goal! Ipswich Town 0, Arsenal 1. Ethan Nwaneri (Arsenal) left footed shot from outside the box.',
  ],
  [
    "33'",
    'goal',
    'home',
    'L. Delap',
    'Goal!',
    'Goal! Ipswich Town 1, Arsenal 1. Header from the centre of the box.',
  ],
  [
    "51'",
    'goal',
    'away',
    'G. Jesus',
    'Goal!',
    'Goal! Ipswich Town 1, Arsenal 2. Gabriel Jesus (Arsenal) right footed shot from close range.',
  ],
  [
    "66'",
    'goal',
    'away',
    'L. Trossard',
    'Goal!',
    'Goal! Ipswich Town 1, Arsenal 3. Leandro Trossard (Arsenal) curls one into the far corner.',
  ],
  [
    "78'",
    'goal',
    'home',
    'O. Hutchinson',
    'Goal!',
    'Goal! Ipswich Town 2, Arsenal 3. Low shot into the bottom right corner.',
  ],
  [
    "88'",
    'goal',
    'away',
    'M. Lewis-Skelly',
    'Goal!',
    'Goal! Ipswich Town 2, Arsenal 4. Myles Lewis-Skelly (Arsenal) finishes a counter-attack.',
  ],
  ['-', 'whistle', null, null, 'Full time', 'Match ends, Ipswich Town 2, Arsenal 4.'],
]);

// premierleague.com's current photo CDN, keyed by the numeric Opta id.
const PL = (id) =>
  `https://resources.premierleague.com/premierleague25/photos/players/110x140/${id.replace(/^p/, '')}.png`;
const AS = (id) => `https://media.api-sports.io/football/players/${id}.png`;
const LU = [];
/**
 * `team` names the squad in the PL data used for photos. Ref crops (`local:`) are kept;
 * with PL data present every other photo comes from the team's official squad list.
 */
const lineup = (match_id, side, starters, subs, team) => {
  [...starters.map((p) => [...p, true]), ...subs.map((p) => [...p, false])].forEach(
    ([shirt_number, name, position, photo, is_starter], i) =>
      LU.push({
        id: `${match_id}-${side}-${String(i + 1).padStart(2, '0')}`,
        match_id,
        side,
        shirt_number,
        name,
        position,
        photo_url: photo?.startsWith('local:') || !PL_SQUAD ? photo : plPhotoFor(name, team),
        is_starter,
        sort: i + 1,
      })
  );
};
// ref/matccenter-lineup.jpeg
const ARSENAL_XI = [
  [1, 'D. RAYA', 'Goalkeeper', 'local:extracted/lineup_raya.png'],
  [33, 'R. CALAFIORI', 'Defender', 'local:extracted/lineup_calafiori.png'],
  [6, 'GABRIEL', 'Defender', 'local:extracted/lineup_gabriel.png'],
  [15, 'E. KONSA', 'Defender', 'local:extracted/lineup_konsa.png'],
  [12, 'J. TIMBER', 'Defender', AS(444884)],
  [41, 'D. RICE', 'Midfielder', PL('p204480')],
  [8, 'M. ØDEGAARD', 'Midfielder', PL('p184029')],
  [29, 'K. HAVERTZ', 'Forward', PL('p219847')],
  [7, 'B. SAKA', 'Forward', PL('p223340')],
  [11, 'G. MARTINELLI', 'Forward', PL('p444145')],
  [19, 'L. TROSSARD', 'Forward', PL('p116216')],
];
const ARSENAL_SUBS = [
  [13, 'KEPA', 'Goalkeeper', PL('p109745')],
  [2, 'W. SALIBA', 'Defender', PL('p462424')],
  [36, 'M. ZUBIMENDI', 'Midfielder', null],
  [53, 'E. NWANERI', 'Midfielder', null],
  [49, 'M. LEWIS-SKELLY', 'Defender', null],
  [9, 'G. JESUS', 'Forward', null],
];
lineup('m01', 'away', ARSENAL_XI, ARSENAL_SUBS, 'arsenal');
lineup(
  'm01',
  'home',
  [
    [1, 'B. VERBRUGGEN', 'Goalkeeper', PL('p486672')],
    [34, 'J. VELTMAN', 'Defender', AS(2280)],
    [29, 'J. VAN HECKE', 'Defender', PL('p482609')],
    [5, 'L. DUNK', 'Defender', AS(18920)],
    [41, 'J. HINSHELWOOD', 'Defender', PL('p544837')],
    [20, 'C. BALÉBA', 'Midfielder', PL('p544836')],
    [13, 'P. GROß', 'Midfielder', PL('p60772')],
    [22, 'K. MITOMA', 'Forward', PL('p451340')],
    [14, 'G. RUTTER', 'Forward', PL('p466827')],
    [11, 'S. ADINGRA', 'Forward', PL('p510383')],
    [18, 'D. WELBECK', 'Forward', PL('p50175')],
  ],
  [
    [23, 'J. STEELE', 'Goalkeeper', null],
    [9, 'C. KOSTOULAS', 'Forward', null],
    [8, 'CHEMA ANDRÉS', 'Midfielder', null],
    [26, 'M. YALCOUYÉ', 'Midfielder', null],
  ],
  'brighton'
);
lineup('m03', 'away', ARSENAL_XI, ARSENAL_SUBS, 'arsenal');
lineup(
  'm03',
  'home',
  [
    [25, 'G. DONNARUMMA', 'Goalkeeper', null],
    [27, 'M. NUNES', 'Defender', null],
    [3, 'R. DIAS', 'Defender', null],
    [5, 'J. STONES', 'Defender', null],
    [24, 'J. GVARDIOL', 'Defender', null],
    [16, 'RODRI', 'Midfielder', null],
    [4, 'T. REIJNDERS', 'Midfielder', null],
    [47, 'P. FODEN', 'Midfielder', null],
    [10, 'R. CHERKI', 'Midfielder', null],
    [11, 'J. DOKU', 'Forward', null],
    [9, 'E. HAALAND', 'Forward', null],
  ],
  [
    [18, 'S. ORTEGA', 'Goalkeeper', null],
    [20, 'B. SILVA', 'Midfielder', null],
    [26, 'S. SAVINHO', 'Forward', null],
  ],
  'man-city'
);

const ST = [];
const stats = (match_id, list) =>
  list.forEach(([label, home_value, away_value, hv, av], i) =>
    ST.push({
      id: `${match_id}-st${i + 1}`,
      match_id,
      sort: i + 1,
      label,
      home_value,
      away_value,
      home_share: Math.round((hv / (hv + av || 1)) * 10000) / 10000,
    })
  );
// ref/matchcenter-stats.jpeg
stats('m01', [
  ['Possession', '40.5%', '59.5%', 40.5, 59.5],
  ['Expected Goals', '1.33', '1.47', 1.33, 1.47],
  ['Total Shots', '17', '10', 17, 10],
  ['Shots on Target', '5', '2', 5, 2],
  ['Big Chances', '3', '1', 3, 1],
  ['Corners', '5', '5', 5, 5],
  ['Pass Completion', '356 (76%)', '418 (84%)', 356, 418],
]);
stats('m03', [
  ['Possession', '52.1%', '47.9%', 52.1, 47.9],
  ['Expected Goals', '1.88', '1.61', 1.88, 1.61],
  ['Total Shots', '14', '11', 14, 11],
  ['Shots on Target', '6', '5', 6, 5],
  ['Big Chances', '3', '2', 3, 2],
  ['Corners', '7', '4', 7, 4],
  ['Pass Completion', '512 (89%)', '441 (86%)', 512, 441],
]);
stats('m02', [
  ['Possession', '38.4%', '61.6%', 38.4, 61.6],
  ['Expected Goals', '1.12', '2.74', 1.12, 2.74],
  ['Total Shots', '9', '19', 9, 19],
  ['Shots on Target', '4', '9', 4, 9],
  ['Corners', '3', '8', 3, 8],
]);

// ---------------------------------------------------------------- media
const U = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;
const IMG = {
  crowd: U('1508098682722-e99c43a406b2'),
  action: U('1574629810360-7efbbe195018'),
  ball: U('1522778119026-d647f0596c20'),
  training: U('1517466787929-bc90951d0974'),
  women: U('1518091043644-c1d4457512c6'),
  stadium: U('1577223625816-7546f13df25d'),
  keeper: U('1543326727-cf6c39e8f84c'),
};

const articles = [
  {
    id: 'a01',
    title: 'Full match: Arsenal Women 1-1 Manchester United',
    category: 'Video',
    team_type: 'women',
    subtitle:
      "A full match replay of Saturday's 1-1 draw at home to Manchester United in the Women's Super League is available to watch now.",
    content:
      'Julia Zigiotti opened the scoring for the away side in the second half, but Smilla Holmberg ensured the points were shared with a 95th-minute equaliser.\n\nPress play on the video above to see every kick of the game in N5.',
    image_url: 'local:media/news_1.jpg',
    author: 'Stephen Wright',
    read_time: '2 min read',
    published_at: '2026-09-21T09:00:00Z',
    video_duration: '01:44:09',
    reaction_kind: 'sad',
    reactions_base: 7,
    match_id: 'w2627-03',
    tag: 'Full Match',
    is_featured: false,
  },
  {
    id: 'a02',
    title: 'Five things to know about the international break',
    category: 'News',
    team_type: 'men',
    subtitle:
      'Where our players are heading, who they face and when they are back at Sobha Realty Training Centre.',
    content:
      'Twenty of our first-team players have been called up for international duty this month, with fixtures spread across four continents.\n\nBukayo Saka, Declan Rice and Myles Lewis-Skelly link up with England for two qualifiers at Wembley, while William Saliba joins France and Martin Ødegaard captains Norway.\n\nThe squad reconvenes at Sobha Realty Training Centre on Thursday before the trip to face Liverpool at Anfield.',
    image_url: 'local:media/news_2.jpg',
    author: 'Arsenal Media',
    read_time: '3 min read',
    published_at: '2026-09-23T08:00:00Z',
    reaction_kind: 'fire',
    reactions_base: 12,
    tag: 'First Team',
    is_featured: true,
  },
  {
    id: 'a03',
    title: "Watch all of Ian Wright's Premier League goals!",
    category: 'Video',
    team_type: 'club',
    subtitle: 'Every one of Wrighty’s 104 Premier League goals for Arsenal in one place.',
    content:
      'Ian Wright scored 185 goals in 288 appearances for the club between 1991 and 1998, breaking Cliff Bastin’s long-standing record on his way to becoming a legend at Highbury.\n\nRelive all 104 of his Premier League strikes, from poacher’s finishes to long-range screamers.',
    image_url: 'local:media/news_3.jpg',
    author: 'Arsenal Media',
    read_time: '1 min read',
    published_at: '2026-09-22T12:00:00Z',
    video_duration: '28:41',
    reaction_kind: 'clap',
    reactions_base: 11,
    tag: 'Legends',
    is_featured: false,
  },
  {
    id: 'a04',
    title: "Wrighty's Arsenal career in pictures",
    category: 'Gallery',
    team_type: 'club',
    subtitle: 'From his arrival from Crystal Palace to lifting the Double in 1998.',
    content:
      'Ian Wright joined from Crystal Palace in September 1991 and scored on his debut in the League Cup against Leicester City.\n\nHe went on to win the FA Cup, League Cup, European Cup Winners’ Cup and the 1997/98 Double. Browse our gallery of his greatest moments.',
    image_url: 'local:media/news_4.jpg',
    author: 'Arsenal Media',
    read_time: '2 min read',
    published_at: '2026-09-22T10:00:00Z',
    reaction_kind: 'fire',
    reactions_base: 14,
    tag: 'Legends',
    is_featured: false,
  },
  {
    id: 'a05',
    title: '13 things you may not know about Kai Havertz',
    category: 'Feature',
    team_type: 'men',
    subtitle: 'Discover some interesting facts about our German international.',
    content:
      'Kai Havertz became the youngest player to make 100 Bundesliga appearances when he did so for Bayer Leverkusen aged 20 years and 111 days.\n\nHe scored the winning goal in the 2021 Champions League final for Chelsea against Manchester City in Porto.\n\nKai is a keen horse rider and has a donkey called Toffee. He also plays the piano and grew up in Mariadorf, near Aachen.\n\nSince joining us in 2023 he has played in midfield, as a false nine and as a traditional centre forward.',
    image_url: 'local:media/reel_havertz.jpg',
    author: 'Arsenal Media',
    read_time: '5 min read',
    published_at: '2026-09-24T07:00:00Z',
    reaction_kind: 'happy',
    reactions_base: 10,
    tag: 'Feature',
    is_featured: true,
  },
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: 'Arteta after Etihad draw: "We showed the true character of this club"',
    category: 'Interview',
    team_type: 'men',
    subtitle:
      'Mikel Arteta reflected on a battling performance at Manchester City and praised the mentality of his players.',
    content:
      'Mikel Arteta spoke with pride after a 2-2 draw at the Etihad Stadium, pointing to the discipline, maturity and desire shown by every player on the pitch.\n\n"When you come to these grounds you have to be ready to suffer, you have to compete for every ball, and you have to take your moments," Mikel said after the game.\n\n"The supporters were unbelievable from the first minute to the last. To concede so late hurts, but the reaction after Brighton was exactly what we asked for."',
    image_url: IMG.crowd,
    author: 'Arsenal Media',
    read_time: '4 min read',
    published_at: '2026-09-22T22:00:00Z',
    reaction_kind: 'fire',
    reactions_base: 21,
    match_id: 'm03',
    tag: 'First Team',
    is_featured: true,
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    title: 'Report: Brighton 3-0 Arsenal',
    category: 'Match Report',
    team_type: 'men',
    subtitle:
      'A difficult afternoon on the south coast as goals from Groß, Kostoulas and Chema Andrés decide it.',
    content:
      'We suffered our first Premier League defeat of the season at the American Express Stadium.\n\nPascal Groß opened the scoring from distance on 31 minutes and Charalampos Kostoulas headed a second just before the break.\n\nChema Andrés added a third early in the second half, and although Kai Havertz had a goal ruled out by VAR, we could not find a way back.',
    image_url: IMG.action,
    author: 'Arsenal Media',
    read_time: '5 min read',
    published_at: '2026-09-19T19:10:00Z',
    reaction_kind: 'sad',
    reactions_base: 9,
    match_id: 'm01',
    tag: 'Match Report',
    is_featured: false,
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    title: 'Declan Rice on midfield chemistry and tactical evolution',
    category: 'Interview',
    team_type: 'men',
    subtitle: '"Every day on the training ground we push each other to higher standards."',
    content:
      'Declan Rice sat down with Arsenal Media to discuss how his role has changed this season.\n\n"Playing alongside Martin and Martín has taken my game to a different level. We understand when to speed the tempo up, when to control possession, and how to protect our back line.\n\n"The ambition in this group is contagious, and we are hungrier than ever to deliver silverware for our fans."',
    image_url: IMG.ball,
    author: 'Josh James',
    read_time: '3 min read',
    published_at: '2026-09-17T11:00:00Z',
    reaction_kind: 'clap',
    reactions_base: 6,
    tag: 'Exclusive',
    is_featured: false,
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    title: 'Report: Ipswich Town 2-4 Arsenal',
    category: 'Match Report',
    team_type: 'men',
    subtitle:
      'Nwaneri, Jesus, Trossard and Lewis-Skelly on target as we reach the Carabao Cup fourth round.',
    content:
      'A much-changed side booked our place in the fourth round with an entertaining win at Portman Road.\n\nEthan Nwaneri curled in the opener, and after Ipswich levelled, Gabriel Jesus and Leandro Trossard put us in control.\n\nMyles Lewis-Skelly sealed it late on with his first senior goal of the season.',
    image_url: IMG.training,
    author: 'Arsenal Media',
    read_time: '4 min read',
    published_at: '2026-09-15T21:45:00Z',
    reaction_kind: 'happy',
    reactions_base: 15,
    match_id: 'm02',
    tag: 'Carabao Cup',
    is_featured: false,
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    title: 'Arsenal Women edge past HB Køge to reach the league phase',
    category: 'Women',
    team_type: 'women',
    subtitle:
      'A single goal at Meadow Park books our place in the UEFA Women’s Champions League league phase.',
    content:
      'Arsenal Women are through to the league phase of the UEFA Women’s Champions League after a narrow 1-0 win over Danish champions HB Køge.\n\nAlessia Russo’s first-half header proved decisive on a tense night in Borehamwood, with Manuela Zinsberger making two key saves late on.',
    image_url: IMG.women,
    author: 'Sam Blitz',
    read_time: '4 min read',
    published_at: '2026-09-17T20:30:00Z',
    reaction_kind: 'fire',
    reactions_base: 8,
    match_id: 'w2627-hbk',
    tag: 'UWCL',
    is_featured: true,
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    title: 'Hale End report: U18s hit four against Tottenham',
    category: 'Academy',
    team_type: 'academy',
    subtitle:
      'Our under-18s produced a brilliant display at Hale End to win the north London derby.',
    content:
      'Jack Wilshere’s under-18s were in sparkling form on Sunday morning, beating Tottenham 4-1 at Hale End.\n\nTwo goals in each half, including a stunning free kick, kept the side top of the U18 Premier League South.',
    image_url: IMG.stadium,
    author: 'David Rogers',
    read_time: '3 min read',
    published_at: '2026-09-20T14:00:00Z',
    reaction_kind: 'clap',
    reactions_base: 4,
    match_id: 'a2627-04',
    tag: 'Hale End',
    is_featured: false,
  },
  {
    id: 'a07',
    title: 'Ticket news: Arsenal v Chelsea',
    category: 'News',
    team_type: 'men',
    subtitle: 'Red and Silver Members can apply for tickets for the London derby from Monday.',
    content:
      'Tickets for our Premier League match against Chelsea at Emirates Stadium on Saturday, October 3 go on sale to members next week.\n\nRed Members can apply in the ballot from 10am on Monday, September 28. Any remaining tickets will go on general sale.',
    image_url: IMG.stadium,
    author: 'Arsenal Ticketing',
    read_time: '2 min read',
    published_at: '2026-09-24T09:00:00Z',
    reaction_kind: 'happy',
    reactions_base: 2,
    match_id: 'm2627-07',
    tag: 'Tickets',
    is_featured: false,
  },
];

const collections = [
  { id: 'col-must-watch', title: 'Must Watch', team_type: 'club', match_id: null, sort: 0 },
  {
    id: 'col-hbk',
    title: 'Arsenal Women 1 - 0 HB Køge',
    team_type: 'women',
    match_id: 'w2627-hbk',
    sort: 1,
  },
  {
    id: 'col-men-highlights',
    title: "Men's highlights",
    team_type: 'men',
    match_id: null,
    sort: 2,
  },
  { id: 'col-academy', title: 'Hale End', team_type: 'academy', match_id: null, sort: 3 },
  { id: 'col-classics', title: 'Classics', team_type: 'club', match_id: null, sort: 4 },
];

const videos = [
  // ref/video-all.jpeg
  {
    id: 'v01',
    title: 'The special bond with our Emirates Stadium support',
    category: 'Features',
    team_type: 'club',
    collection_id: 'col-must-watch',
    duration: '0:43',
    thumbnail_url: 'local:media/must_watch_1.jpg',
    published_at: '2026-09-23T17:00:00Z',
    views_count: '48K views',
    sort: 1,
  },
  {
    id: 'v02',
    title: 'The Art of a Matchday: Vol.1',
    category: 'Behind The Scenes',
    team_type: 'club',
    collection_id: 'col-must-watch',
    duration: '0:34',
    thumbnail_url: 'local:media/must_watch_2.jpg',
    published_at: '2026-09-22T17:00:00Z',
    views_count: '31K views',
    sort: 2,
  },
  {
    id: 'v03',
    title: 'Chris Mepham: Ask Me Anything',
    category: 'Interviews',
    team_type: 'men',
    collection_id: 'col-must-watch',
    duration: '9:12',
    thumbnail_url: 'local:media/search_video_1.jpg',
    published_at: '2026-09-21T17:00:00Z',
    views_count: '22K views',
    sort: 3,
  },
  {
    id: 'v04',
    title: 'Highlights: Arsenal Women 1-0 HB Køge',
    category: 'Highlights',
    team_type: 'women',
    collection_id: 'col-hbk',
    match_id: 'w2627-hbk',
    duration: '2:15',
    thumbnail_url: 'local:media/hbk_1_top.jpg',
    published_at: '2026-09-17T21:00:00Z',
    views_count: '64K views',
    sort: 1,
  },
  {
    id: 'v05',
    title: 'Reaction: the win over HB Køge',
    category: 'Reaction',
    team_type: 'women',
    collection_id: 'col-hbk',
    match_id: 'w2627-hbk',
    duration: '3:40',
    thumbnail_url: 'local:media/hbk_2_top.jpg',
    published_at: '2026-09-17T22:00:00Z',
    views_count: '18K views',
    sort: 2,
  },
  // ref/search.jpeg
  {
    id: 'sv01',
    title: '😋 Hunger to win again',
    category: 'Features',
    team_type: 'men',
    collection_id: 'col-men-highlights',
    duration: '1:12',
    thumbnail_url: 'local:media/search_video_1.jpg',
    published_at: '2026-09-24T08:30:00Z',
    views_count: '12K views',
    sort: 1,
  },
  {
    id: 'sv02',
    title: '🫂 Wrighty welcomes Ebs',
    category: 'Behind The Scenes',
    team_type: 'club',
    collection_id: 'col-must-watch',
    duration: '0:58',
    thumbnail_url: 'local:media/search_video_2.jpg',
    published_at: '2026-09-23T12:00:00Z',
    views_count: '40K views',
    sort: 4,
  },
  {
    id: 'sv03',
    title: '🧱 How the points were bagged',
    category: 'Features',
    team_type: 'men',
    collection_id: 'col-men-highlights',
    duration: '2:02',
    thumbnail_url: 'local:media/search_video_3.jpg',
    published_at: '2026-09-13T10:00:00Z',
    views_count: '26K views',
    sort: 3,
  },
  {
    id: 'sv04',
    title: "Denilson's dazzler | Arsenal 3-0 Hull City | 2009/10",
    category: 'Classic',
    team_type: 'club',
    collection_id: 'col-classics',
    duration: '1:30',
    thumbnail_url: 'local:media/search_video_4.jpg',
    published_at: '2026-09-10T10:00:00Z',
    views_count: '9K views',
    sort: 2,
  },
  // Match highlights & features
  {
    id: 'v06',
    title: 'Highlights: Man City 2-2 Arsenal',
    category: 'Highlights',
    team_type: 'men',
    collection_id: 'col-men-highlights',
    match_id: 'm03',
    duration: '10:14',
    thumbnail_url: IMG.crowd,
    published_at: '2026-09-22T22:30:00Z',
    views_count: '450K views',
    sort: 0,
  },
  {
    id: 'v07',
    title: 'Mikel Arteta press conference | Leicester City preview',
    category: 'Interviews',
    team_type: 'men',
    collection_id: null,
    match_id: 'm04',
    duration: '14:22',
    thumbnail_url: IMG.action,
    published_at: '2026-09-24T12:30:00Z',
    views_count: '38K views',
    sort: 0,
  },
  {
    id: 'v08',
    title: 'Inside Hale End: the road to the first team',
    category: 'Features',
    team_type: 'academy',
    collection_id: 'col-academy',
    duration: '18:45',
    thumbnail_url: IMG.training,
    published_at: '2026-09-18T12:00:00Z',
    views_count: '90K views',
    sort: 1,
  },
  {
    id: 'v09',
    title: 'Classic: Chelsea 3-5 Arsenal | Van Persie hat-trick | 2011/12',
    category: 'Classic',
    team_type: 'club',
    collection_id: 'col-classics',
    duration: '8:50',
    thumbnail_url: IMG.ball,
    published_at: '2026-09-16T12:00:00Z',
    views_count: '820K views',
    sort: 1,
  },
  {
    id: 'v10',
    title: 'Highlights: Brighton 3-0 Arsenal',
    category: 'Highlights',
    team_type: 'men',
    collection_id: 'col-men-highlights',
    match_id: 'm01',
    duration: '7:35',
    thumbnail_url: IMG.women,
    published_at: '2026-09-19T19:30:00Z',
    views_count: '310K views',
    sort: 2,
  },
  {
    id: 'v11',
    title: 'Highlights: Ipswich Town 2-4 Arsenal',
    category: 'Highlights',
    team_type: 'men',
    collection_id: 'col-men-highlights',
    match_id: 'm02',
    duration: '6:05',
    thumbnail_url: IMG.stadium,
    published_at: '2026-09-15T22:00:00Z',
    views_count: '165K views',
    sort: 4,
  },
  {
    id: 'v12',
    title: 'U18 highlights: Arsenal 4-1 Tottenham',
    category: 'Highlights',
    team_type: 'academy',
    collection_id: 'col-academy',
    match_id: 'a2627-04',
    duration: '4:10',
    thumbnail_url: IMG.keeper,
    published_at: '2026-09-20T15:00:00Z',
    views_count: '21K views',
    sort: 2,
  },
].map((v) => ({ youtube_id: null, reactions_base: 0, match_id: null, ...v }));

const reels = [
  {
    id: 'r01',
    tag: 'FEATURE',
    title: '13 things you may not know about Kai Havertz',
    subtitle: 'Discover some interesting facts about our German international',
    image_url: 'local:media/reel_havertz.jpg',
    article_id: 'a05',
    team_type: 'men',
    is_featured: true,
    reactions_base: 10,
    published_at: '2026-09-24T07:00:00Z',
  },
  {
    id: 'r02',
    tag: 'INTERVIEW',
    title: 'Arteta: "We showed the true character of this club"',
    subtitle: 'The boss on a battling draw at the Etihad',
    image_url: IMG.crowd,
    article_id: 'a1111111-1111-1111-1111-111111111111',
    team_type: 'men',
    is_featured: true,
    reactions_base: 21,
    published_at: '2026-09-22T22:00:00Z',
  },
  {
    id: 'r03',
    tag: 'WOMEN',
    title: 'Into the league phase!',
    subtitle: 'Arsenal Women edge past HB Køge at Meadow Park',
    image_url: IMG.women,
    article_id: 'a5555555-5555-5555-5555-555555555555',
    team_type: 'women',
    is_featured: true,
    reactions_base: 8,
    published_at: '2026-09-17T20:30:00Z',
  },
  {
    id: 'r04',
    tag: 'NEWS',
    title: 'Five things to know about the international break',
    subtitle: 'Where our players are heading and when they are back',
    image_url: 'local:media/news_2.jpg',
    article_id: 'a02',
    team_type: 'men',
    is_featured: false,
    reactions_base: 12,
    published_at: '2026-09-23T08:00:00Z',
  },
  {
    id: 'r05',
    tag: 'HALE END',
    title: 'U18s hit four against Tottenham',
    subtitle: 'A sparkling derby display at Hale End',
    image_url: IMG.stadium,
    article_id: 'a6666666-6666-6666-6666-666666666666',
    team_type: 'academy',
    is_featured: false,
    reactions_base: 4,
    published_at: '2026-09-20T14:00:00Z',
  },
  {
    id: 'r06',
    tag: 'TICKETS',
    title: 'Arsenal v Chelsea tickets',
    subtitle: 'Member sales open on Monday',
    image_url: IMG.action,
    article_id: 'a07',
    team_type: 'men',
    is_featured: false,
    reactions_base: 2,
    published_at: '2026-09-24T09:00:00Z',
  },
];

const galleries = [
  {
    id: 'g01',
    title: 'Brighton v Arsenal: in pictures',
    team_type: 'men',
    cover_url: IMG.action,
    match_id: 'm01',
    published_at: '2026-09-19T20:00:00Z',
  },
  {
    id: 'g02',
    title: "Wrighty's Arsenal career in pictures",
    team_type: 'club',
    cover_url: 'local:media/news_4.jpg',
    match_id: null,
    published_at: '2026-09-22T10:00:00Z',
  },
  {
    id: 'g03',
    title: 'Arsenal Women v Man United: in pictures',
    team_type: 'women',
    cover_url: IMG.women,
    match_id: 'w2627-03',
    published_at: '2026-09-20T15:00:00Z',
  },
  {
    id: 'g04',
    title: 'Training: preparing for Leicester',
    team_type: 'men',
    cover_url: IMG.training,
    match_id: 'm04',
    published_at: '2026-09-24T13:00:00Z',
  },
];
const galleryImages = [];
const gi = (gallery_id, list) =>
  list.forEach(([image_url, caption], i) =>
    galleryImages.push({
      id: `${gallery_id}-${i + 1}`,
      gallery_id,
      image_url,
      caption,
      sort: i + 1,
    })
  );
gi('g01', [
  [IMG.action, 'Bukayo Saka takes on the Brighton defence'],
  [IMG.crowd, 'The travelling Gooners in full voice'],
  [IMG.ball, 'Martin Ødegaard lines up a free kick'],
  [IMG.keeper, 'David Raya claims a cross'],
  [IMG.stadium, 'The American Express Stadium before kick-off'],
]);
gi('g02', [
  ['local:media/news_4.jpg', 'Ian Wright celebrates at Highbury'],
  ['local:media/news_3.jpg', 'Breaking the club scoring record in 1997'],
  [IMG.crowd, 'The North Bank salutes its hero'],
  [IMG.stadium, 'Back at the Emirates as a club ambassador'],
]);
gi('g03', [
  [IMG.women, 'Smilla Holmberg celebrates her late equaliser'],
  [IMG.crowd, 'A bumper crowd at Emirates Stadium'],
  [IMG.ball, 'Kim Little dictates play in midfield'],
]);
gi('g04', [
  [IMG.training, 'Warm-ups at Sobha Realty Training Centre'],
  [IMG.ball, 'Rondo drills in the sunshine'],
  [IMG.keeper, 'Goalkeeper session with Iñaki Caña'],
]);

const quizzes = [
  {
    id: 'qz01',
    title: 'The Invincibles',
    description: 'How well do you know the 2003/04 season?',
    team_type: 'club',
    cover_url: IMG.stadium,
    published_at: '2026-09-20T09:00:00Z',
  },
  {
    id: 'qz02',
    title: 'Know your Emirates Stadium',
    description: 'Five questions about our home since 2006.',
    team_type: 'club',
    cover_url: IMG.crowd,
    published_at: '2026-09-15T09:00:00Z',
  },
  {
    id: 'qz03',
    title: 'Arsenal Women legends',
    description: 'Test your knowledge of our European champions.',
    team_type: 'women',
    cover_url: IMG.women,
    published_at: '2026-09-18T09:00:00Z',
  },
];
const questions = [];
const qq = (quiz_id, list) =>
  list.forEach(([prompt, options, correct_index, explanation], i) =>
    questions.push({
      id: `${quiz_id}-q${i + 1}`,
      quiz_id,
      sort: i + 1,
      prompt,
      options: json(options),
      correct_index,
      explanation,
    })
  );
qq('qz01', [
  [
    'In which season did Arsenal go unbeaten in the Premier League?',
    ['2002/03', '2003/04', '2004/05', '1997/98'],
    1,
    'The Invincibles went 38 league games unbeaten in 2003/04.',
  ],
  [
    'How many games did the Invincibles draw in that league season?',
    ['12', '6', '10', '8'],
    0,
    'We won 26 and drew 12 of our 38 matches.',
  ],
  [
    'Who was our top scorer that season?',
    ['Robert Pires', 'Dennis Bergkamp', 'Thierry Henry', 'Freddie Ljungberg'],
    2,
    'Thierry Henry scored 30 league goals and won the Golden Boot.',
  ],
  [
    'Which club ended the 49-game unbeaten run in October 2004?',
    ['Chelsea', 'Manchester United', 'Liverpool', 'Bolton Wanderers'],
    1,
    'The run ended at Old Trafford on 24 October 2004.',
  ],
  [
    'Who captained the Invincibles?',
    ['Tony Adams', 'Sol Campbell', 'Patrick Vieira', 'Ashley Cole'],
    2,
    'Patrick Vieira lifted the golden Premier League trophy.',
  ],
]);
qq('qz02', [
  [
    'In which year did we move to Emirates Stadium?',
    ['2004', '2005', '2006', '2008'],
    2,
    'We played our first game at the Emirates in July 2006.',
  ],
  [
    'Where did Arsenal play before the Emirates?',
    ['White Hart Lane', 'Highbury', 'Wembley', 'Craven Cottage'],
    1,
    'We spent 93 years at Highbury.',
  ],
  [
    'Which stand sits at the north end of the stadium?',
    ['Clock End', 'North Bank', 'East Stand', 'West Stand'],
    1,
    'The North Bank carries on the Highbury tradition.',
  ],
  [
    'Who were our opponents in the first competitive game at the Emirates?',
    ['Aston Villa', 'Chelsea', 'Wigan Athletic', 'Hamburg'],
    0,
    'It finished 1-1 against Aston Villa on 19 August 2006.',
  ],
  [
    'Roughly how many supporters can the stadium hold?',
    ['45,000', '52,000', '60,000', '75,000'],
    2,
    'Emirates Stadium holds just over 60,000.',
  ],
]);
qq('qz03', [
  [
    'In which year did Arsenal Women first win the UEFA Women’s Cup?',
    ['2003', '2007', '2011', '2015'],
    1,
    'We became the first English side to win it in 2007.',
  ],
  [
    'Who scored the winner in the 2025 Women’s Champions League final?',
    ['Stina Blackstenius', 'Alessia Russo', 'Beth Mead', 'Mariona Caldentey'],
    0,
    'Stina Blackstenius came off the bench to score against Barcelona.',
  ],
  [
    'In which city was the 2025 final played?',
    ['Lisbon', 'Bilbao', 'Turin', 'Eindhoven'],
    0,
    'The final was held at the Estádio José Alvalade in Lisbon.',
  ],
  [
    'Where do Arsenal Women play most of their home league games?',
    ['Meadow Park', 'Kingsmeadow', 'Leigh Sports Village', 'The Hive'],
    0,
    'Meadow Park in Borehamwood, alongside games at the Emirates.',
  ],
  [
    'Which Arsenal captain lifted Euro 2022 with England?',
    ['Leah Williamson', 'Kim Little', 'Katie McCabe', 'Beth Mead'],
    0,
    'Leah Williamson captained the Lionesses to the title at Wembley.',
  ],
]);

const experiences = [
  {
    id: 'ex01',
    category: 'tour',
    title: 'Emirates Stadium Tour',
    subtitle: 'Self-guided tour with audio guide',
    description:
      'Walk in the footsteps of your heroes. Visit the home dressing room, the tunnel, the dugouts and the Directors’ Box, with an audio guide narrated by club legends.',
    image_url: IMG.stadium,
    price_gbp: 30,
    duration_minutes: 90,
    schedule: 'Daily, 9:30am – 5:00pm (non-matchdays)',
    book_url: 'https://www.arsenal.com/tours',
    sort: 1,
  },
  {
    id: 'ex02',
    category: 'legends',
    title: 'Legends Tour',
    subtitle: 'Guided by an Arsenal legend',
    description:
      'Hear the stories behind the trophies from a former Arsenal player on an exclusive guided tour of the stadium, finished off with a photo and Q&A session.',
    image_url: IMG.crowd,
    price_gbp: 65,
    duration_minutes: 120,
    schedule: 'Selected dates, 11:00am',
    book_url: 'https://www.arsenal.com/tours',
    sort: 2,
  },
  {
    id: 'ex03',
    category: 'museum',
    title: 'Arsenal Museum',
    subtitle: 'Over 130 years of history',
    description:
      'From Dial Square to the Invincibles and beyond. See the golden Premier League trophy, historic kits and the stories that shaped the club.',
    image_url: IMG.ball,
    price_gbp: 12,
    duration_minutes: 60,
    schedule: 'Daily, 10:00am – 5:00pm',
    book_url: 'https://www.arsenal.com/museum',
    sort: 3,
  },
  {
    id: 'ex04',
    category: 'matchday',
    title: 'Matchday Hospitality',
    subtitle: 'Club Level dining and padded seats',
    description:
      'Enjoy a three-course meal, complimentary drinks and a padded seat on the halfway line for a men’s or women’s home match.',
    image_url: IMG.action,
    price_gbp: 295,
    duration_minutes: 300,
    schedule: 'Home matchdays',
    book_url: 'https://www.arsenal.com/hospitality',
    sort: 4,
  },
  {
    id: 'ex05',
    category: 'tour',
    title: 'Family Stadium Tour',
    subtitle: 'Two adults and two juniors',
    description:
      'The full Emirates Stadium tour experience at a family price, with an activity trail for younger Gooners.',
    image_url: IMG.training,
    price_gbp: 85,
    duration_minutes: 90,
    schedule: 'Weekends and school holidays',
    book_url: 'https://www.arsenal.com/tours',
    sort: 5,
  },
].map((e) => ({ team_type: 'club', ...e }));

const ticketSales = [
  {
    id: 'ts01',
    match_id: 'm04',
    phase: 'General Sale',
    opens_at: '2026-09-14T09:00:00Z',
    closes_at: '2026-09-26T12:00:00Z',
    price_from_gbp: 36,
    status: 'open',
    buy_url: 'https://www.arsenal.com/tickets',
  },
  {
    id: 'ts02',
    match_id: 'm2627-06',
    phase: 'Red Members Sale',
    opens_at: '2026-09-21T09:00:00Z',
    closes_at: '2026-09-29T12:00:00Z',
    price_from_gbp: 42,
    status: 'open',
    buy_url: 'https://www.arsenal.com/tickets',
  },
  {
    id: 'ts03',
    match_id: 'm2627-07',
    phase: 'Members Ballot',
    opens_at: '2026-09-28T09:00:00Z',
    closes_at: '2026-09-30T12:00:00Z',
    price_from_gbp: 58,
    status: 'upcoming',
    buy_url: 'https://www.arsenal.com/tickets',
  },
  {
    id: 'ts04',
    match_id: 'm2627-14',
    phase: 'Members Ballot',
    opens_at: '2026-10-12T09:00:00Z',
    closes_at: null,
    price_from_gbp: 58,
    status: 'upcoming',
    buy_url: 'https://www.arsenal.com/tickets',
  },
  {
    id: 'ts05',
    match_id: 'w2627-05',
    phase: 'General Sale',
    opens_at: '2026-09-10T09:00:00Z',
    closes_at: null,
    price_from_gbp: 12,
    status: 'open',
    buy_url: 'https://www.arsenal.com/tickets',
  },
  {
    id: 'ts06',
    match_id: 'm2627-10',
    phase: 'Red Members Sale',
    opens_at: '2026-10-05T09:00:00Z',
    closes_at: null,
    price_from_gbp: 36,
    status: 'upcoming',
    buy_url: 'https://www.arsenal.com/tickets',
  },
];

const legal = [
  {
    slug: 'terms',
    title: 'Terms Of Use',
    updated_at: '2026-09-01T00:00:00Z',
    body: `These terms apply to your use of The Arsenal app. By using the app you agree to them.

1. Your account
You must provide accurate details when you create an account and keep your password secure. You are responsible for activity on your account. You can delete your account at any time from Settings.

2. Content
Articles, videos, photos and match data in the app are provided for personal, non-commercial use. You may share links to content using the share options in the app, but you may not copy or redistribute the content itself.

3. Fan features
Reactions, polls, predictions and quizzes are for entertainment. We may remove votes or predictions that we believe were submitted unfairly.

4. Tickets and bookings
Ticket and tour purchases are subject to the terms shown at the point of sale. Seats allocated in the app are personal to you and may not be resold.

5. Changes
We may update these terms from time to time. The date at the top shows when they last changed.

Contact us from Settings if you have any questions.`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated_at: '2026-09-01T00:00:00Z',
    body: `This policy explains what we collect when you use The Arsenal app and how we use it.

What we collect
• Account details: your name, email address and any profile details you add, such as phone number, date of birth, country and postcode.
• Preferences: your notification choices, favourite team, currency, language and calendar sync settings.
• Activity: reactions, poll votes, predictions, quiz scores, bookmarks, tickets and tour bookings.
• Diagnostics: anonymous crash and performance data used to improve the app.

How we use it
We use your data to run your account, personalise what you see (for example the For You feed), send the notifications you have switched on and deliver tickets and bookings.

Marketing
We only send marketing messages if you opt in under Personal Details. You can opt out at any time.

Your rights
You can view and edit your details in the app. Deleting your account from Settings permanently removes your profile and all associated activity.

Contact us from Settings to ask about your data.`,
  },
];

const polls = [
  {
    id: 'fp01',
    title: 'Player of the Match: Man City 2-2 Arsenal',
    description: 'Who was our standout performer at the Etihad?',
    category: 'Matchday Vote',
    ends_at: '2026-10-01T23:00:00Z',
    is_active: true,
    match_id: 'm03',
  },
  {
    id: 'fp02',
    title: 'Goal of the Month — September',
    description: 'Choose your favourite Arsenal goal from September.',
    category: 'Goal of the Month',
    ends_at: '2026-10-05T23:00:00Z',
    is_active: true,
    match_id: null,
  },
  {
    id: 'fp03',
    title: 'Player of the Match: Ipswich Town 2-4 Arsenal',
    description: 'Who shone brightest at Portman Road?',
    category: 'Matchday Vote',
    ends_at: '2026-09-30T23:00:00Z',
    is_active: true,
    match_id: 'm02',
  },
];
const pollOptions = [
  {
    id: 'po01',
    poll_id: 'fp01',
    label: 'Bukayo Saka',
    sub_label: '1 goal, 4 key passes',
    image_url: PL('p223340'),
    votes_count: 1248,
  },
  {
    id: 'po02',
    poll_id: 'fp01',
    label: 'Gabriel',
    sub_label: '1 goal, 7 clearances',
    image_url: PL('p226597'),
    votes_count: 892,
  },
  {
    id: 'po03',
    poll_id: 'fp01',
    label: 'Declan Rice',
    sub_label: '1 assist, 94% pass accuracy',
    image_url: PL('p204480'),
    votes_count: 635,
  },
  {
    id: 'po04',
    poll_id: 'fp01',
    label: 'David Raya',
    sub_label: '5 saves',
    image_url: PL('p154561'),
    votes_count: 412,
  },
  {
    id: 'po05',
    poll_id: 'fp02',
    label: 'Saka vs Man City',
    sub_label: 'Curler into the top corner',
    image_url: PL('p223340'),
    votes_count: 1530,
  },
  {
    id: 'po06',
    poll_id: 'fp02',
    label: 'Nwaneri vs Ipswich',
    sub_label: 'Left-footed strike from distance',
    image_url: null,
    votes_count: 1890,
  },
  {
    id: 'po07',
    poll_id: 'fp02',
    label: 'Ødegaard vs Newcastle',
    sub_label: 'Free kick over the wall',
    image_url: PL('p184029'),
    votes_count: 940,
  },
  {
    id: 'po08',
    poll_id: 'fp03',
    label: 'Ethan Nwaneri',
    sub_label: '1 goal',
    image_url: null,
    votes_count: 811,
  },
  {
    id: 'po09',
    poll_id: 'fp03',
    label: 'Gabriel Jesus',
    sub_label: '1 goal, 1 assist',
    image_url: null,
    votes_count: 540,
  },
  {
    id: 'po10',
    poll_id: 'fp03',
    label: 'Myles Lewis-Skelly',
    sub_label: '1 goal',
    image_url: null,
    votes_count: 377,
  },
];

const products = [
  {
    id: 'sp01',
    category: 'Kits',
    title: 'Arsenal 26/27 Home Authentic Shirt',
    description:
      'Engineered for peak performance at the Emirates: the iconic red body, crisp white sleeves and moisture-wicking HEAT.RDY technology.',
    price_gbp: 115,
    price_usd: 145,
    main_image_url: IMG.ball,
    gallery_urls: [IMG.ball, IMG.action],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    is_customizable: true,
    badge: 'New Season',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp02',
    category: 'Kits',
    title: 'Arsenal 26/27 Away Shirt',
    description: 'A modern away shirt with breathable AEROREADY fabric and a tonal cannon pattern.',
    price_gbp: 85,
    price_usd: 110,
    main_image_url: IMG.action,
    gallery_urls: [IMG.action],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    is_customizable: true,
    badge: 'Away Kit',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp03',
    category: 'Kits',
    title: 'Arsenal 26/27 Third Shirt',
    description: 'A modern reimagining of 1990s flair with bold trims.',
    price_gbp: 85,
    price_usd: 110,
    main_image_url: IMG.crowd,
    gallery_urls: [IMG.crowd],
    sizes: ['S', 'M', 'L', 'XL'],
    is_customizable: true,
    badge: 'Third Kit',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp04',
    category: 'Training',
    title: 'Arsenal Pro Training Top',
    description:
      'As worn by the squad at Sobha Realty Training Centre. Quarter-zip collar with thumbholes.',
    price_gbp: 70,
    price_usd: 90,
    main_image_url: IMG.training,
    gallery_urls: [IMG.training],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    is_customizable: false,
    badge: 'Training Wear',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp05',
    category: 'Retro',
    title: 'Arsenal 1991/93 "Bruised Banana" Away Shirt',
    description: 'The cult classic retro jersey with its iconic zigzag pattern.',
    price_gbp: 65,
    price_usd: 85,
    main_image_url: IMG.stadium,
    gallery_urls: [IMG.stadium],
    sizes: ['S', 'M', 'L', 'XL'],
    is_customizable: false,
    badge: 'Heritage',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp06',
    category: 'Accessories',
    title: 'Arsenal Cannon Cuff Beanie',
    description: 'Knitted beanie with the embroidered Arsenal cannon.',
    price_gbp: 22,
    price_usd: 28,
    main_image_url: IMG.women,
    gallery_urls: [IMG.women],
    sizes: ['One Size'],
    is_customizable: false,
    badge: null,
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp07',
    category: 'Kits',
    title: 'Arsenal 26/27 Home Kids Kit',
    description:
      'Shirt, shorts and socks in the new home colours, sized for young Gunners. Add their name and number.',
    price_gbp: 60,
    price_usd: 78,
    main_image_url: IMG.ball,
    gallery_urls: [IMG.ball, IMG.crowd],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'],
    is_customizable: true,
    customisation_price_gbp: 10,
    customisation_price_usd: 13,
    badge: 'Kids',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp08',
    category: 'Training',
    title: 'Arsenal Training Shorts',
    description: 'Lightweight shorts with an elasticated waist and zipped side pocket.',
    price_gbp: 35,
    price_usd: 45,
    main_image_url: IMG.training,
    gallery_urls: [IMG.training, IMG.keeper],
    sizes: ['S', 'M', 'L', 'XL'],
    is_customizable: false,
    badge: null,
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp09',
    category: 'Retro',
    title: 'Arsenal 1971 Double Winners Jacket',
    description: 'A heritage track jacket celebrating the first league and cup double.',
    price_gbp: 75,
    price_usd: 95,
    main_image_url: IMG.stadium,
    gallery_urls: [IMG.stadium, IMG.crowd],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    is_customizable: false,
    badge: 'Limited',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp10',
    category: 'Accessories',
    title: 'Arsenal Home Bar Scarf',
    description:
      'Classic red and white bar scarf with woven crest, made for matchdays at the Emirates.',
    price_gbp: 18,
    price_usd: 24,
    main_image_url: IMG.crowd,
    gallery_urls: [IMG.crowd],
    sizes: ['One Size'],
    is_customizable: false,
    badge: null,
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp11',
    category: 'Accessories',
    title: 'Arsenal Crest Football',
    description: 'Size 5 training ball with the Arsenal crest and machine-stitched panels.',
    price_gbp: 20,
    price_usd: 26,
    main_image_url: IMG.action,
    gallery_urls: [IMG.action],
    sizes: ['Size 5'],
    is_customizable: false,
    badge: 'Bestseller',
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
  {
    id: 'sp12',
    category: 'Training',
    title: 'Arsenal Goalkeeper Gloves',
    description: 'Latex palm and negative cut for grip in all conditions.',
    price_gbp: 45,
    price_usd: 58,
    main_image_url: IMG.keeper,
    gallery_urls: [IMG.keeper],
    sizes: ['7', '8', '9', '10'],
    is_customizable: false,
    badge: null,
    external_buy_url: 'https://arsenaldirect.arsenal.com',
  },
];

// Stock per size. Most sizes are well stocked; a few are low or sold out so
// the shop shows "only N left" and disabled sizes.
const LOW_STOCK = {
  'sp01:2XL': 3,
  'sp03:XL': 0,
  'sp05:S': 2,
  'sp09:S': 0,
  'sp09:M': 4,
  'sp12:10': 0,
};
const variants = products.flatMap((p) =>
  p.sizes.map((size, i) => ({
    product_id: p.id,
    size,
    sku: `${p.id}-${size.replace(/\s+/g, '')}`.toUpperCase(),
    stock: LOW_STOCK[`${p.id}:${size}`] ?? 40,
    position: i + 1,
  }))
);

const PROMO_DEFAULTS = {
  percent_off: null,
  amount_off_gbp: null,
  amount_off_usd: null,
  free_shipping: false,
  min_subtotal_gbp: 0,
  min_subtotal_usd: 0,
};
const promoCodes = [
  { code: 'GOONER10', description: '10% off your order', percent_off: 10 },
  {
    code: 'NORTHLONDON',
    description: '£10 / $13 off orders over £60 / $80',
    amount_off_gbp: 10,
    amount_off_usd: 13,
    min_subtotal_gbp: 60,
    min_subtotal_usd: 80,
  },
  { code: 'FREESHIP', description: 'Free delivery', free_shipping: true },
];

// ---------------------------------------------------------------- write
emit('-- ================================================================');
emit('-- ARSENAL FC APP CLONE — SEED DATA');
emit('-- Club content for every screen of the app. Safe to re-run: rows are');
emit('-- upserted by id and match/gallery/quiz children are rebuilt.');
emit('-- ================================================================');
emit();
emit('begin;');
emit();
section('Retire rows from the first version of this seed');
emit(
  `delete from public.matches where id in ('m1111111-1111-1111-1111-111111111111', 'm2222222-2222-2222-2222-222222222222', 'm3333333-3333-3333-3333-333333333333', 'm4444444-4444-4444-4444-444444444444');`
);
emit(
  `delete from public.poll_options where id in ('po01','po02','po03','po04','po05','po06','po07') and poll_id not in (select id from public.fan_polls where id in ('fp01','fp02'));`
);
emit();
section('Matches');
insert('matches', matchRows);
section('Standings (rebuilt)');
emit('delete from public.standings;');
insert('standings', standingsRows);
section('Players');
if (PL_SQUAD) {
  const menIds = playerRows.filter((p) => p.team_type === 'men').map((p) => q(p.id));
  emit(
    `-- Men's squad synced with the Premier League (${PL_SQUAD.season}, fetched ${PL_SQUAD.fetched_at}).`
  );
  emit(`delete from public.players where team_type = 'men' and id not in (${menIds.join(', ')});`);
  emit();
}
insert('players', playerRows);
section('Match centre (rebuilt)');
emit('delete from public.match_events;');
emit('delete from public.match_lineups;');
emit('delete from public.match_stats;');
insert('match_events', EV, { conflict: null });
insert('match_lineups', LU, { conflict: null });
insert('match_stats', ST, { conflict: null });
section('Articles');
insert(
  'articles',
  articles.map((a) => ({ youtube_id: null, video_duration: null, match_id: null, ...a }))
);
section('Video collections & videos');
insert('video_collections', collections);
insert('videos', videos);
section('Reels');
insert('reels', reels);
section('Photo galleries (images rebuilt)');
insert('photo_galleries', galleries);
emit('delete from public.photo_gallery_images;');
insert('photo_gallery_images', galleryImages, { conflict: null });
section('Quizzes (questions rebuilt)');
insert('quizzes', quizzes);
emit('delete from public.quiz_questions;');
insert('quiz_questions', questions, { conflict: null });
section('Experiences & tickets');
insert('experiences', experiences);
insert('ticket_sales', ticketSales);
section('Fan polls');
insert('fan_polls', polls);
// Keep real vote counts on re-runs.
insert('poll_options', pollOptions, { keep: ['votes_count'] });
section('Store');
insert(
  'store_products',
  products.map((p) => ({
    customisation_price_gbp: 15,
    customisation_price_usd: 20,
    ...p,
  }))
);
// Keep live stock and redemption counts on re-runs.
insert('store_product_variants', variants, { conflict: 'product_id, size', keep: ['stock'] });
insert(
  'promo_codes',
  promoCodes.map((c) => ({ ...PROMO_DEFAULTS, ...c })),
  { conflict: 'code', keep: ['redemptions'] }
);
section('Legal');
insert('legal_documents', legal, { conflict: 'slug' });
emit('commit;');

process.stdout.write(out.join('\n') + '\n');
