import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ARSENAL } from '@/theme/arsenal';

interface Props<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (option: T) => void;
  height?: number;
  fontSize?: number;
}

/** Rounded track with a red selected pill (FIXTURES / TABLES / PLAYERS, BRIGHTON / ARSENAL). */
export function SegmentedPills<T extends string>({
  options,
  value,
  onChange,
  height = 36,
  fontSize = 14,
}: Props<T>) {
  return (
    <View
      style={{ height, borderRadius: height / 2, backgroundColor: ARSENAL.track }}
      className="flex-1 flex-row overflow-hidden">
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={{
              borderRadius: height / 2,
              backgroundColor: selected ? ARSENAL.red : 'transparent',
            }}
            className="flex-1 items-center justify-center">
            <Text
              className="font-body-semibold"
              style={{ fontSize, color: selected ? ARSENAL.white : '#B9B7B8', letterSpacing: 0.3 }}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
