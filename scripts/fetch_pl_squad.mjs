// Pull Arsenal's current Premier League squad, stats and official photos from the
// Premier League's public data API, then rebuild the seed:
//
//   node scripts/fetch_pl_squad.mjs
//   node scripts/gen_seed.mjs > supabase/seed.sql
//
// Writes supabase/data/arsenal_squad_2026-27.json. Behind an HTTP proxy, run with
// NODE_USE_ENV_PROXY=1 (Node >= 22.21).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../supabase/data');

const API = 'https://footballapi.pulselive.com/football';
const HEADERS = { Origin: 'https://www.premierleague.com', Accept: 'application/json' };
const ARSENAL_TEAM_ID = 1;
const SEASON_LABEL = '2026/27';
// Academy players already in the seed that may have a PL profile.
const ACADEMY_NAMES = ['Myles Lewis-Skelly', 'Ayden Heaven'];
const OUT = path.join(DATA_DIR, 'arsenal_squad_2026-27.json');
// Squads whose players appear in the seeded match line-ups, keyed as the seed refers to them.
// The previous season is included so players who have since left still get their photo.
const LINEUP_TEAMS = { arsenal: 1, brighton: 131, 'man-city': 11 };

// premierleague.com's current CDN keys photos by the numeric Opta id (no "p" prefix).
// 110x140 is a 220x280 @2x transparent cutout, which suits the player cards.
const PHOTO_CANDIDATES = [
  (opta) =>
    `https://resources.premierleague.com/premierleague25/photos/players/110x140/${opta.replace(/^p/, '')}.png`,
  (opta) =>
    `https://resources.premierleague.com/premierleague25/photos/players/500x500/${opta.replace(/^p/, '')}.png`,
];

const POSITION = { G: 'Goalkeeper', D: 'Defender', M: 'Midfielder', F: 'Forward' };

async function get(path) {
  const res = await fetch(`${API}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

async function isImage(url) {
  const res = await fetch(url, { method: 'HEAD' });
  return res.ok && (res.headers.get('content-type') ?? '').startsWith('image/');
}

async function photoFor(opta) {
  for (const build of PHOTO_CANDIDATES) {
    const url = build(opta);
    if (await isImage(url)) return url;
  }
  return null;
}

function statsMap(stats) {
  const out = {};
  for (const s of stats?.stats ?? []) out[s.name] = s.value;
  return out;
}

async function playerRecord(p, compSeasonId) {
  const opta = p.altIds?.opta;
  const stats = statsMap(
    await get(`/stats/player/${p.id}?comps=1&compSeasons=${compSeasonId}`).catch(() => null)
  );
  return {
    pl_id: p.id,
    opta,
    name: p.name?.display,
    first_name: p.name?.first,
    last_name: p.name?.last,
    shirt_number: p.info?.shirtNum ?? null,
    position: POSITION[p.info?.position] ?? null,
    nationality: p.nationalTeam?.country ?? p.birth?.country?.country ?? null,
    nationality_iso: p.nationalTeam?.isoCode ?? p.birth?.country?.isoCode ?? null,
    date_of_birth: p.birth?.date?.label
      ? new Date(p.birth.date.millis).toISOString().slice(0, 10)
      : null,
    place_of_birth: [p.birth?.place, p.birth?.country?.country].filter(Boolean).join(', ') || null,
    joined: p.joinDate?.millis ? new Date(p.joinDate.millis).toISOString().slice(0, 10) : null,
    photo_url: opta ? await photoFor(opta) : null,
    stats: {
      appearances: stats.appearances ?? 0,
      goals: stats.goals ?? 0,
      assists: stats.goal_assist ?? 0,
      clean_sheets: stats.clean_sheet ?? 0,
    },
  };
}

const seasons = await get('/competitions/1/compseasons?page=0&pageSize=20');
// Labels vary ("2025/26", "English Premier League Season 2026/2027").
const [startYear, endYY] = SEASON_LABEL.split('/');
const seasonMatch = [SEASON_LABEL, `${startYear}/20${endYY}`];
const found = seasons.content.find((s) => seasonMatch.some((l) => s.label.includes(l)));
const season = found && { ...found, id: Math.round(found.id) };
if (!season) throw new Error(`No PL comp season labelled ${SEASON_LABEL}`);

const staff = await get(
  `/teams/${ARSENAL_TEAM_ID}/compseasons/${season.id}/staff?pageSize=100&compSeasons=${season.id}&altIds=true&type=player`
);
const players = [];
for (const p of staff.players ?? []) players.push(await playerRecord(p, season.id));

const academy = [];
for (const name of ACADEMY_NAMES) {
  const hit = players.find((p) => p.name === name);
  if (hit) continue; // already in the first-team list
  const search = await get(
    `/players?pageSize=5&searchTerm=${encodeURIComponent(name)}&altIds=true`
  ).catch(() => null);
  const p = search?.content?.find((c) => c.name?.display === name);
  if (p) academy.push(await playerRecord(p, season.id));
}

// Photos for match line-ups: every player of the line-up teams, this season and last.
const previous = seasons.content.find(
  (s) => Math.round(s.id) !== season.id && s.label.includes(`${Number(startYear) - 1}/`)
);
const lineupSquads = {};
for (const [key, teamId] of Object.entries(LINEUP_TEAMS)) {
  const byOpta = new Map();
  for (const cs of [season.id, previous && Math.round(previous.id)].filter(Boolean)) {
    const res = await get(
      `/teams/${teamId}/compseasons/${cs}/staff?pageSize=100&compSeasons=${cs}&altIds=true&type=player`
    ).catch(() => null);
    for (const p of res?.players ?? []) {
      const opta = p.altIds?.opta;
      if (!opta || byOpta.has(opta)) continue;
      byOpta.set(opta, {
        name: p.name?.display,
        first_name: p.name?.first,
        last_name: p.name?.last,
        opta,
        photo_url: await photoFor(opta),
      });
    }
  }
  lineupSquads[key] = [...byOpta.values()];
}

const problems = [...players, ...academy]
  .filter((p) => !p.opta || !p.photo_url)
  .map((p) => `${p.name}: ${!p.opta ? 'no opta id' : 'no photo'}`);

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: 'footballapi.pulselive.com',
      season: SEASON_LABEL,
      comp_season_id: season.id,
      fetched_at: new Date().toISOString(),
      players,
      academy,
      lineup_squads: lineupSquads,
    },
    null,
    2
  ) + '\n'
);
console.log(
  `men: ${players.length}, academy: ${academy.length}, line-up squads: ${Object.entries(
    lineupSquads
  )
    .map(([k, v]) => `${k} ${v.length}`)
    .join(', ')}, problems: ${problems.length}`
);
problems.forEach((p) => console.log('  -', p));
