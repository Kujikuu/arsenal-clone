import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ARSENAL } from '@/theme/arsenal';

interface Props<T extends string> {
  pills: readonly T[];
  active: T | null;
  onChange: (pill: T | null) => void;
}

const PILL_HEIGHT = 28;

/** NEWS / VIDEO / PHOTOS ... filter chips; a clear button appears once one is picked. */
export function MediaPills<T extends string>({ pills, active, onChange }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ paddingHorizontal: 9, paddingVertical: 12, alignItems: 'center' }}>
      {active !== null && (
        <>
          <Pressable
            onPress={() => onChange(null)}
            accessibilityLabel="Clear filter"
            style={{
              width: PILL_HEIGHT,
              height: PILL_HEIGHT,
              borderRadius: PILL_HEIGHT / 2,
              backgroundColor: ARSENAL.pill,
            }}
            className="items-center justify-center active:opacity-70">
            <Feather name="x" size={17} color="#FFF" />
          </Pressable>
          <View style={{ width: 1, height: 28, backgroundColor: '#444', marginHorizontal: 11 }} />
        </>
      )}
      {pills.map((pill) => {
        const selected = pill === active;
        return (
          <Pressable
            key={pill}
            onPress={() => onChange(selected ? null : pill)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={{
              height: PILL_HEIGHT,
              borderRadius: PILL_HEIGHT / 2,
              paddingHorizontal: 11,
              marginRight: 9,
              backgroundColor: selected ? ARSENAL.red : ARSENAL.pill,
            }}
            className="items-center justify-center active:opacity-75">
            <Text
              className="font-body-bold"
              style={{ fontSize: 12.5, letterSpacing: 0.6, color: selected ? '#FFF' : '#BABABA' }}>
              {pill}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
