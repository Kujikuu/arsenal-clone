import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactionKind } from '@/lib/data/media';

interface Props {
  kind: ReactionKind;
  count: number;
  size?: number;
  color?: string;
}

export function ReactionIcon({ kind, size = 20, color = '#FFF' }: Omit<Props, 'count'>) {
  switch (kind) {
    case 'sad':
      return <MaterialCommunityIcons name="emoticon-sad-outline" size={size} color={color} />;
    case 'fire':
      return <Ionicons name="flame-outline" size={size} color={color} />;
    case 'clap':
      return <MaterialCommunityIcons name="hand-clap" size={size} color={color} />;
    default:
      return <MaterialCommunityIcons name="emoticon-happy-outline" size={size} color={color} />;
  }
}

/** Outline emoji + count (ref/video-news tab selected.jpeg). */
export function ReactionBadge({ kind, count, size = 20, color = '#FFF' }: Props) {
  return (
    <View className="flex-row items-center">
      <ReactionIcon kind={kind} size={size} color={color} />
      <Text className="font-body text-white" style={{ fontSize: 15, marginLeft: 6, color }}>
        {count}
      </Text>
    </View>
  );
}
