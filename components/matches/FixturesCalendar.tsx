import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Fixture } from '@/lib/data/fixtures';
import { FixtureCard } from '@/components/matches/FixtureCard';
import { ARSENAL } from '@/theme/arsenal';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// September 2026 starts on a Tuesday.
const LEADING_BLANKS = 1;
const DAYS_IN_MONTH = 30;

interface Props {
  fixtures: Fixture[];
  onMatchCentre: (id: string) => void;
}

export function FixturesCalendar({ fixtures, onMatchCentre }: Props) {
  const [selectedDay, setSelectedDay] = useState(19);
  const cells = [
    ...Array.from({ length: LEADING_BLANKS }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  const selectedFixture = fixtures.find((f) => f.dayNumber === selectedDay);

  return (
    <View className="px-4 pt-4">
      <View style={{ backgroundColor: ARSENAL.surface, borderRadius: 8 }} className="mb-4 p-3">
        <View className="mb-2 flex-row">
          {WEEKDAYS.map((d, i) => (
            <Text key={i} className="flex-1 text-center font-body-medium text-xs text-neutral-400">
              {d}
            </Text>
          ))}
        </View>
        <View className="flex-row flex-wrap">
          {cells.map((day, i) => {
            const hasMatch = day !== null && fixtures.some((f) => f.dayNumber === day);
            const selected = day === selectedDay;
            return (
              <Pressable
                key={i}
                disabled={day === null}
                onPress={() => day !== null && setSelectedDay(day)}
                style={{ width: `${100 / 7}%`, height: 40 }}
                className="items-center justify-center">
                {day !== null && (
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: selected ? ARSENAL.red : 'transparent',
                      borderWidth: hasMatch && !selected ? 1 : 0,
                      borderColor: ARSENAL.red,
                    }}
                    className="items-center justify-center">
                    <Text
                      className="font-body-semibold text-sm"
                      style={{ color: hasMatch || selected ? '#FFF' : ARSENAL.textDim }}>
                      {day}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
      {selectedFixture ? (
        <FixtureCard fixture={selectedFixture} onMatchCentre={onMatchCentre} />
      ) : (
        <Text className="py-6 text-center font-body text-sm text-neutral-400">
          No fixture on this day.
        </Text>
      )}
    </View>
  );
}
