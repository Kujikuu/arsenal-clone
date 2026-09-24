import React from 'react';
import { View, Text, Image } from 'react-native';
import { SegmentedPills } from '@/components/ui/SegmentedPills';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { DisplayText } from '@/components/ui/DisplayText';
import { lineupPhoto, type LineupPlayer } from '@/lib/data/matchCentre';
import { ARSENAL } from '@/theme/arsenal';

interface Props<T extends string> {
  teams: readonly T[];
  selectedTeam: T;
  onSelectTeam: (team: T) => void;
  players: LineupPlayer[];
}

function Bar() {
  return (
    <Text className="font-body" style={{ fontSize: 15, color: '#FFF', marginHorizontal: 12 }}>
      |
    </Text>
  );
}

function LineupRow({ player }: { player: LineupPlayer }) {
  return (
    <View
      style={{ height: 71, backgroundColor: ARSENAL.surface, borderRadius: 8, marginBottom: 13 }}
      className="flex-row items-center px-4">
      <View style={{ width: 32 }} className="items-center">
        <DisplayText size={15} color={ARSENAL.red} heavy={false}>
          {player.num}
        </DisplayText>
      </View>
      <Bar />
      <DisplayText size={11}>{player.name}</DisplayText>
      <Bar />
      <Text
        className="flex-1 font-body"
        style={{ fontSize: 14, color: '#C8C6C7' }}
        numberOfLines={1}>
        {player.pos}
      </Text>
      <Image source={lineupPhoto(player)} style={{ width: 50, height: 60 }} resizeMode="contain" />
    </View>
  );
}

/** Team toggle and starting XI (ref/matccenter-lineup.jpeg). */
export function Lineups<T extends string>({
  teams,
  selectedTeam,
  onSelectTeam,
  players,
}: Props<T>) {
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
      <View style={{ marginTop: 8, marginBottom: 12, paddingHorizontal: 4 }}>
        <SectionDivider label="Starting" />
      </View>
      {players.map((player) => (
        <LineupRow key={`${player.num}-${player.name}`} player={player} />
      ))}
    </View>
  );
}
