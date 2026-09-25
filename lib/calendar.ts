import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar/legacy';
import { fetchUpcomingMatches } from '@/lib/api/matches';
import type { TeamType } from '@/types/database';
import { BRAND } from '@/lib/brand';
import { PALETTE } from '@/theme/palette';

const CALENDAR_TITLE = BRAND.calendarTitle;
const MATCH_MARKER = 'arsenal-match:';
const MATCH_LENGTH_MS = 2 * 60 * 60 * 1000;

async function findOrCreateCalendar(): Promise<string> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const existing = calendars.find((c) => c.title === CALENDAR_TITLE && c.allowsModifications);
  if (existing) return existing.id;

  const source =
    Platform.OS === 'ios'
      ? (await Calendar.getDefaultCalendarAsync()).source
      : { isLocalAccount: true, name: BRAND.appName, type: Calendar.SourceType.LOCAL };

  return Calendar.createCalendarAsync({
    title: CALENDAR_TITLE,
    color: PALETTE.red,
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: 'id' in source ? source.id : undefined,
    source,
    name: 'arsenal-fixtures',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

export interface SyncResult {
  added: number;
  updated: number;
  removed: number;
}

/**
 * Mirror upcoming fixtures for the chosen teams into the club fixtures
 * calendar. Re-running updates changed kick-offs and removes fixtures for
 * teams that were switched off.
 */
export async function syncFixturesToCalendar(teamTypes: TeamType[]): Promise<SyncResult> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Allow calendar access in Settings to sync fixtures.');
  }

  const calendarId = await findOrCreateCalendar();
  const matches = await fetchUpcomingMatches(teamTypes);

  const now = new Date();
  const horizon = new Date(now.getTime() + 400 * 24 * 60 * 60 * 1000);
  const existing = await Calendar.getEventsAsync([calendarId], now, horizon);
  const byMatch = new Map(
    existing
      .map((e) => [e.notes?.split(MATCH_MARKER)[1]?.trim(), e] as const)
      .filter(([id]) => Boolean(id)) as [string, Calendar.Event][]
  );

  const result: SyncResult = { added: 0, updated: 0, removed: 0 };
  const wanted = new Set<string>();

  for (const match of matches) {
    wanted.add(match.id);
    const start = new Date(match.match_date);
    const details = {
      title: `${match.home_team} v ${match.away_team}`,
      startDate: start,
      endDate: new Date(start.getTime() + MATCH_LENGTH_MS),
      location: match.stadium,
      timeZone: 'Europe/London',
      notes: `${match.competition} · ${match.round}\n${MATCH_MARKER}${match.id}`,
    };
    const event = byMatch.get(match.id);
    if (event) {
      await Calendar.updateEventAsync(event.id, details);
      result.updated += 1;
    } else {
      await Calendar.createEventAsync(calendarId, details);
      result.added += 1;
    }
  }

  for (const [matchId, event] of byMatch) {
    if (!wanted.has(matchId)) {
      await Calendar.deleteEventAsync(event.id);
      result.removed += 1;
    }
  }

  return result;
}
