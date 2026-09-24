import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ThreadEvent } from '@/lib/data/matchCentre';
import { ARSENAL } from '@/theme/arsenal';

const CHIP_WIDTH = 42;

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ width: CHIP_WIDTH, height: 27, borderRadius: 3, backgroundColor: ARSENAL.chip }}
      className="items-center justify-center">
      {children}
    </View>
  );
}

function ThreadCard({ event }: { event: ThreadEvent }) {
  return (
    <View
      style={{ backgroundColor: ARSENAL.surface, borderRadius: 8, padding: 16, marginBottom: 17 }}>
      <View className="flex-row items-center">
        <Chip>
          <Text className="font-body text-white" style={{ fontSize: 12 }}>
            {event.minute}
          </Text>
        </Chip>
        <Text className="font-body-semibold text-white" style={{ fontSize: 19, marginLeft: 10 }}>
          {event.title}
        </Text>
      </View>
      <View className="flex-row" style={{ marginTop: event.icon ? 6 : 10 }}>
        {event.icon ? (
          <Chip>
            <MaterialCommunityIcons name="timer-outline" size={20} color="#FFF" />
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

/** Live commentary cards (ref/matchcenter-thread.jpeg). */
export function ThreadList({ events }: { events: ThreadEvent[] }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
      {events.map((event) => (
        <ThreadCard key={event.id} event={event} />
      ))}
    </View>
  );
}
