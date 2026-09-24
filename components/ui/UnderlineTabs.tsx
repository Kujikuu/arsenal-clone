import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ARSENAL } from '@/theme/arsenal';

interface Props<T extends string> {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
  /**
   * equal  - each tab takes an equal share, underline spans most of it (MEN / WOMEN / ACADEMY)
   * inline - tabs sit next to each other, underline matches the label (THREAD / LINE UPS ...)
   */
  variant?: 'equal' | 'inline';
  align?: 'start' | 'center';
  scrollable?: boolean;
  gap?: number;
  fontSize?: number;
  bordered?: boolean;
  height?: number;
}

export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
  variant = 'equal',
  align = 'center',
  scrollable = false,
  gap = 28,
  fontSize = 15,
  bordered = true,
  height = 60,
}: Props<T>) {
  const renderTab = (tab: T) => {
    const selected = tab === value;
    return (
      <Pressable
        key={tab}
        onPress={() => onChange(tab)}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        style={variant === 'equal' ? { flex: 1, height } : { height, marginRight: gap }}
        className="items-center justify-center">
        <Text
          className={selected ? 'font-body-semibold' : 'font-body-medium'}
          style={{ fontSize, color: selected ? ARSENAL.white : ARSENAL.textMuted }}>
          {tab}
        </Text>
        {selected && (
          <View
            className="absolute bottom-0"
            style={{
              height: 3,
              backgroundColor: ARSENAL.red,
              left: variant === 'equal' ? 12 : 0,
              right: variant === 'equal' ? 12 : 0,
            }}
          />
        )}
      </Pressable>
    );
  };

  const border = bordered ? { borderBottomWidth: 1, borderBottomColor: '#303030' } : undefined;

  if (variant === 'equal') {
    return (
      <View style={border} className="flex-row">
        {tabs.map(renderTab)}
      </View>
    );
  }

  if (scrollable) {
    return (
      <View style={border}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 - gap }}>
          {tabs.map(renderTab)}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[border, { paddingLeft: gap }]}
      className={`flex-row ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
      {tabs.map(renderTab)}
    </View>
  );
}
