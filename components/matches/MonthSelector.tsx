import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { PALETTE } from '@/theme/palette';

const ITEM_WIDTH = 80;

export interface MonthOption {
  /** "2026-09" */
  key: string;
  /** "SEP" */
  month: string;
  year: string;
}

interface Props {
  months: readonly MonthOption[];
  selected: string | null;
  onSelect: (key: string) => void;
}

/** Horizontally scrolling month strip with vertical dividers (ref/match-fixtures.jpeg). */
export function MonthSelector({ months, selected, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const index = months.findIndex((m) => m.key === selected);
    if (index < 0) return;
    const x = index * ITEM_WIDTH - (width - ITEM_WIDTH) / 2;
    scrollRef.current?.scrollTo({ x: Math.max(0, x), animated: false });
  }, [months, selected, width]);

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#303030', paddingBottom: 18 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'stretch' }}>
        {months.map((option, index) => {
          const isSelected = option.key === selected;
          const textColor = isSelected ? PALETTE.white : '#BDBBBC';
          return (
            <View key={option.key} className="flex-row">
              {index > 0 && (
                <View style={{ width: 1, backgroundColor: '#3A3839', marginVertical: 0 }} />
              )}
              <Pressable
                onPress={() => onSelect(option.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={{
                  width: ITEM_WIDTH - 1,
                  height: 68,
                  paddingHorizontal: 2,
                }}
                className="items-center justify-center">
                <View
                  style={{
                    width: 75,
                    height: 68,
                    borderRadius: 2,
                    backgroundColor: isSelected ? PALETTE.red : 'transparent',
                  }}
                  className="items-center justify-center">
                  <Text className="font-body-medium" style={{ fontSize: 17, color: textColor }}>
                    {option.month}
                  </Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 17, color: textColor, marginTop: 1 }}>
                    {option.year}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
