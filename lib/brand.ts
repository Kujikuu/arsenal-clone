/**
 * Every club-specific name the app shows or matches on. Rebranding the app
 * means editing this file, `theme/palette.ts` and the identifiers in app.json.
 * Device storage keys (`arsenal.*`) and the calendar event marker stay fixed on
 * purpose so a rename does not wipe saved settings or orphan synced events.
 */
export const BRAND = {
  /** Club name as it appears in fixture data, e.g. "Arsenal" or "Arsenal Women". */
  club: 'Arsenal',
  /** App name shown in headers, share messages and the device calendar. */
  appName: 'The Arsenal',
  /** Wordmark in the top header, split around the bolt glyph. */
  wordmark: { before: 'THE', after: 'ARSENAL' },
  womenTeam: 'Arsenal Women',
  tv: 'Arsenal TV',
  shop: 'Arsenal Direct',
  calendarTitle: 'Arsenal Fixtures',
  /** YouTube channel handle used for "watch on YouTube" fallbacks. */
  youtubeHandle: 'arsenal',
} as const;

/** True when a team name from the matches table is one of the club's sides. */
export function isClubTeam(teamName: string): boolean {
  return teamName.startsWith(BRAND.club);
}

/** PostgREST `or` filter matching matches the club plays in. */
export const CLUB_MATCH_FILTER = `home_team.ilike.${BRAND.club}*,away_team.ilike.${BRAND.club}*`;
