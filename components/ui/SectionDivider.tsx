import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PALETTE } from '@/theme/palette';

interface Props {
  label: string;
  /** When set, shows a chevron and makes the divider tappable. */
  expanded?: boolean;
  onPress?: () => void;
}

/** "──── Goalkeepers ^ ────" / "──── Starting ────" */
export function SectionDivider({ label, expanded, onPress }: Props) {
  const content = (
    <View className="flex-row items-center">
      <View style={{ height: 1.5, backgroundColor: PALETTE.red }} className="flex-1" />
      <View className="mx-3 flex-row items-center">
        <Text className="font-body-semibold text-white" style={{ fontSize: 16 }}>
          {label}
        </Text>
        {expanded !== undefined && (
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#FFF"
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
      <View style={{ height: 1.5, backgroundColor: PALETTE.red }} className="flex-1" />
    </View>
  );

  if (!onPress) return <View className="py-2">{content}</View>;
  return (
    <Pressable onPress={onPress} className="py-2 active:opacity-70" accessibilityRole="button">
      {content}
    </Pressable>
  );
}
