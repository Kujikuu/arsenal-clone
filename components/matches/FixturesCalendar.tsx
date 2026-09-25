import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FixtureCard } from '@/components/matches/FixtureCard';
import type { Match } from '@/types/database';
import { PALETTE } from '@/theme/palette';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Props {
  /** "2026-09" */
  monthKey: string;
  matches: Match[];
  onMatchCentre: (id: string) => void;
}

/** Day of the month in UK time. */
function ukDay(iso: string): number {
  return Number(
    new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Europe/London', day: 'numeric' })
  );
}

/** Month grid; days with a fixture are ringed and tapping one shows its card. */
export function FixturesCalendar({ monthKey, matches, onMatchCentre }: Props) {
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // Monday-first offset of the 1st of the month.
  const leadingBlanks = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

  const byDay = useMemo(() => {
    const map = new Map<number, Match[]>();
    matches.forEach((m) => {
      const day = ukDay(m.match_date);
      map.set(day, [...(map.get(day) ?? []), m]);
    });
    return map;
  }, [matches]);

  const firstMatchDay = matches.length ? ukDay(matches[0].match_date) : 1;
  const [selectedDay, setSelectedDay] = useState(firstMatchDay);
  useEffect(() => setSelectedDay(firstMatchDay), [monthKey, firstMatchDay]);

  const cells = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const selected = byDay.get(selectedDay) ?? [];

  return (
    <View className="px-4 pt-4">
      <View style={{ backgroundColor: PALETTE.surface, borderRadius: 8 }} className="mb-4 p-3">
        <View className="mb-2 flex-row">
          {WEEKDAYS.map((d, i) => (
            <Text key={i} className="flex-1 text-center font-body-medium text-xs text-neutral-400">
              {d}
            </Text>
          ))}
        </View>
        <View className="flex-row flex-wrap">
          {cells.map((day, i) => {
            const hasMatch = day !== null && byDay.has(day);
            const isSelected = day === selectedDay;
            return (
              <Pressable
                key={i}
                disabled={day === null}
                onPress={() => day !== null && setSelectedDay(day)}
                accessibilityLabel={day ? `${day}${hasMatch ? ', match day' : ''}` : undefined}
                style={{ width: `${100 / 7}%`, height: 40 }}
                className="items-center justify-center">
                {day !== null && (
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: isSelected ? PALETTE.red : 'transparent',
                      borderWidth: hasMatch && !isSelected ? 1 : 0,
                      borderColor: PALETTE.red,
                    }}
                    className="items-center justify-center">
                    <Text
                      className="font-body-semibold text-sm"
                      style={{ color: hasMatch || isSelected ? '#FFF' : PALETTE.textDim }}>
                      {day}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      {selected.length ? (
        selected.map((m) => <FixtureCard key={m.id} match={m} onMatchCentre={onMatchCentre} />)
      ) : (
        <Text className="py-6 text-center font-body text-sm text-neutral-400">
          No fixture on this day.
        </Text>
      )}
    </View>
  );
}
