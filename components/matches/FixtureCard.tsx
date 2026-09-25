import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { formatFixtureDate, scoreOrTime } from '@/lib/format';
import type { Match } from '@/types/database';
import { PALETTE } from '@/theme/palette';

interface Props {
  match: Match;
  onMatchCentre: (id: string) => void;
}

function TeamColumn({ name, logo }: { name: string; logo: string }) {
  return (
    <View className="flex-1 items-center">
      <TeamLogo uri={logo} name={name} size={38} />
      <Text
        className="font-body-semibold text-white"
        style={{ fontSize: 16, marginTop: 10 }}
        numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

/** Fixture card from ref/match-fixtures.jpeg. */
export function FixtureCard({ match, onMatchCentre }: Props) {
  const played = match.status !== 'scheduled';
  return (
    <View
      style={{ backgroundColor: PALETTE.surface, borderRadius: 8, paddingHorizontal: 16 }}
      className="mb-4">
      <View style={{ paddingTop: 14, paddingBottom: 14, minHeight: 72 }} className="justify-center">
        {match.competition_logo ? (
          <Image
            source={{ uri: match.competition_logo }}
            style={{
              position: 'absolute',
              left: 26,
              top: 22,
              width: 20,
              height: 20,
              // Only the PL lion is a transparent silhouette that survives a white tint.
              tintColor: match.competition_logo.endsWith('/leagues/39.png') ? '#FFFFFF' : undefined,
            }}
            resizeMode="contain"
            accessibilityLabel={match.competition}
          />
        ) : null}
        <View className="items-center self-center" style={{ maxWidth: 170 }}>
          <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
            {formatFixtureDate(match.match_date)}
          </Text>
          <Text
            className="text-center font-body"
            style={{ fontSize: 13, lineHeight: 14, color: '#BDBBBC', marginTop: 2 }}>
            {match.stadium}
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: '#3A3839' }} />

      <View className="flex-row items-center" style={{ paddingVertical: 20 }}>
        <TeamColumn name={match.home_team} logo={match.home_team_logo} />
        <View
          style={{
            width: 75,
            height: 40,
            borderRadius: 4,
            backgroundColor: played ? PALETTE.scoreBox : 'transparent',
            borderWidth: played ? 0 : 1,
            borderColor: PALETTE.scoreBox,
          }}
          className="items-center justify-center">
          <Text className="font-body-semibold text-white" style={{ fontSize: played ? 20 : 17 }}>
            {scoreOrTime(match)}
          </Text>
        </View>
        <TeamColumn name={match.away_team} logo={match.away_team_logo} />
      </View>

      <View style={{ height: 1, backgroundColor: '#3A3839' }} />

      <Pressable
        onPress={() => onMatchCentre(match.id)}
        accessibilityRole="button"
        style={{
          height: 34,
          borderRadius: 17,
          backgroundColor: PALETTE.button,
          marginVertical: 16,
        }}
        className="items-center justify-center active:opacity-80">
        <Text className="font-body-medium text-white" style={{ fontSize: 13, letterSpacing: 0.4 }}>
          MATCH CENTRE
        </Text>
      </Pressable>
    </View>
  );
}
