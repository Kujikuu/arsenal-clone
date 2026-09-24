/** Dates and scores as they appear across the app. Kick-offs are shown in UK time. */

const UK = { timeZone: 'Europe/London' } as const;

export const MONTH_CODES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const;

function valid(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "SAT 19 SEP" */
export function formatFixtureDate(iso: string): string {
  const date = valid(iso);
  if (!date) return '';
  return date
    .toLocaleDateString('en-GB', { ...UK, weekday: 'short', day: 'numeric', month: 'short' })
    .replace(',', '')
    .toUpperCase();
}

/** "15:00" */
export function formatKickOffTime(iso: string): string {
  const date = valid(iso);
  if (!date) return '';
  return date.toLocaleTimeString('en-GB', { ...UK, hour: '2-digit', minute: '2-digit' });
}

/** "SAT 19 SEP | 17:00" */
export function formatKickOff(iso: string): string {
  return `${formatFixtureDate(iso)} | ${formatKickOffTime(iso)}`;
}

/** "27 SEPT 2026" style label used above article titles. */
export function formatPublished(iso?: string | null): string {
  const date = valid(iso);
  if (!date) return '';
  return date
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();
}

/** "22 September 2026" */
export function formatLongDate(iso?: string | null): string {
  const date = valid(iso);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Month code and year of a date in UK time, e.g. { month: 'SEP', year: '2026' }. */
export function monthKey(iso: string): { month: string; year: string; key: string } {
  const date = valid(iso) ?? new Date(0);
  const parts = new Intl.DateTimeFormat('en-GB', { ...UK, month: 'numeric', year: 'numeric' })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  const month = MONTH_CODES[Number(parts.month) - 1];
  return { month, year: parts.year, key: `${parts.year}-${parts.month.padStart(2, '0')}` };
}

export function hasScore(match: { home_score?: number | null; away_score?: number | null }) {
  return match.home_score != null && match.away_score != null;
}

/** "3-0" for played matches, the kick-off time otherwise. */
export function scoreOrTime(match: {
  status: string;
  match_date: string;
  home_score?: number | null;
  away_score?: number | null;
}): string {
  if (match.status !== 'scheduled' && hasScore(match)) {
    return `${match.home_score}-${match.away_score}`;
  }
  return formatKickOffTime(match.match_date);
}

export function formatPrice(amount: number, currency: 'GBP' | 'USD'): string {
  return `${currency === 'GBP' ? '£' : '$'}${Number(amount).toFixed(2)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
}
