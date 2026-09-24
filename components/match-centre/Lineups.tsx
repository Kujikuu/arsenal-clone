import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SegmentedPills } from '@/components/ui/SegmentedPills';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { DisplayText } from '@/components/ui/DisplayText';
import { EmptyState } from '@/components/ui/States';
import { resolveImage } from '@/lib/media/resolveImage';
import type { MatchLineupPlayer } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

interface Props<T extends string> {
  teams: readonly T[];
  selectedTeam: T;
  onSelectTeam: (team: T) => void;
  players: MatchLineupPlayer[];
}

function Bar() {
  return (
    <Text className="font-body" style={{ fontSize: 15, color: '#FFF', marginHorizontal: 12 }}>
      |
    </Text>
  );
}

function LineupRow({ player }: { player: MatchLineupPlayer }) {
  const photo = resolveImage(player.photo_url);
  return (
    <View
      style={{ height: 71, backgroundColor: ARSENAL.surface, borderRadius: 8, marginBottom: 13 }}
      className="flex-row items-center px-4">
      <View style={{ width: 32 }} className="items-center">
        <DisplayText size={15} color={ARSENAL.red} heavy={false}>
          {player.shirt_number}
        </DisplayText>
      </View>
      <Bar />
      <DisplayText size={11}>{player.name}</DisplayText>
      <Bar />
      <Text
        className="flex-1 font-body"
        style={{ fontSize: 14, color: '#C8C6C7' }}
        numberOfLines={1}>
        {player.position}
      </Text>
      {photo ? (
        <Image source={photo} style={{ width: 50, height: 60 }} resizeMode="contain" />
      ) : (
        <View style={{ width: 50 }} className="items-center">
          <Ionicons name="shirt-outline" size={26} color={ARSENAL.textDim} />
        </View>
      )}
    </View>
  );
}

/** Team toggle, starting XI and substitutes (ref/matccenter-lineup.jpeg). */
export function Lineups<T extends string>({
  teams,
  selectedTeam,
  onSelectTeam,
  players,
}: Props<T>) {
  const starters = players.filter((p) => p.is_starter);
  const subs = players.filter((p) => !p.is_starter);

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 26 }}>
      <View className="flex-row">
        <SegmentedPills
          options={teams}
          value={selectedTeam}
          onChange={onSelectTeam}
          height={35}
          fontSize={15}
        />
      </View>
      {players.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Line-ups not available"
          message="Team news is confirmed an hour before kick-off."
        />
      ) : (
        <>
          <View style={{ marginTop: 8, marginBottom: 12, paddingHorizontal: 4 }}>
            <SectionDivider label="Starting" />
          </View>
          {starters.map((player) => (
            <LineupRow key={player.id} player={player} />
          ))}
          {subs.length > 0 && (
            <>
              <View style={{ marginTop: 8, marginBottom: 12, paddingHorizontal: 4 }}>
                <SectionDivider label="Substitutes" />
              </View>
              {subs.map((player) => (
                <LineupRow key={player.id} player={player} />
              ))}
            </>
          )}
        </>
      )}
    </View>
  );
}
