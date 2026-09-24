import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MatchEvent } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const CHIP_WIDTH = 42;

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const EVENT_ICON: Partial<
  Record<MatchEvent['type'], { name: IconName; size: number; color: string }>
> = {
  whistle: { name: 'timer-outline', size: 20, color: '#FFF' },
  goal: { name: 'soccer', size: 18, color: '#FFF' },
  penalty_goal: { name: 'soccer', size: 18, color: '#FFF' },
  own_goal: { name: 'soccer', size: 18, color: ARSENAL.formDown },
  yellow_card: { name: 'cards', size: 18, color: '#F5C518' },
  red_card: { name: 'cards', size: 18, color: ARSENAL.formDown },
  sub: { name: 'swap-horizontal', size: 20, color: '#FFF' },
  var: { name: 'monitor-eye', size: 18, color: '#FFF' },
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ width: CHIP_WIDTH, height: 27, borderRadius: 3, backgroundColor: ARSENAL.chip }}
      className="items-center justify-center">
      {children}
    </View>
  );
}

function ThreadCard({ event }: { event: MatchEvent }) {
  const icon = EVENT_ICON[event.type];
  return (
    <View
      style={{ backgroundColor: ARSENAL.surface, borderRadius: 8, padding: 16, marginBottom: 17 }}>
      <View className="flex-row items-center">
        <Chip>
          <Text className="font-body text-white" style={{ fontSize: 12 }}>
            {event.minute_label}
          </Text>
        </Chip>
        <Text className="font-body-semibold text-white" style={{ fontSize: 19, marginLeft: 10 }}>
          {event.title}
        </Text>
      </View>
      <View className="flex-row" style={{ marginTop: icon ? 6 : 10 }}>
        {icon ? (
          <Chip>
            <MaterialCommunityIcons name={icon.name} size={icon.size} color={icon.color} />
          </Chip>
        ) : (
          <View style={{ width: CHIP_WIDTH }} />
        )}
        <Text
          className="flex-1 font-body text-white"
          style={{ fontSize: 15.5, lineHeight: 18, marginLeft: 10 }}>
          {event.body}
        </Text>
      </View>
    </View>
  );
}

/** Live commentary cards, newest first (ref/matchcenter-thread.jpeg). */
export function ThreadList({ events }: { events: MatchEvent[] }) {
  const newestFirst = [...events].sort((a, b) => b.sort - a.sort);
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
      {newestFirst.map((event) => (
        <ThreadCard key={event.id} event={event} />
      ))}
    </View>
  );
}
