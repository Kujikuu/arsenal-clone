import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import type { Fixture } from '@/lib/data/fixtures';
import { ARSENAL } from '@/theme/arsenal';

interface Props {
  fixture: Fixture;
  onMatchCentre: (id: string) => void;
}

function TeamColumn({ name, logo }: { name: string; logo: string }) {
  return (
    <View className="flex-1 items-center">
      <Image source={{ uri: logo }} style={{ width: 38, height: 38 }} resizeMode="contain" />
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
export function FixtureCard({ fixture, onMatchCentre }: Props) {
  return (
    <View
      style={{ backgroundColor: ARSENAL.surface, borderRadius: 8, paddingHorizontal: 16 }}
      className="mb-4">
      <View style={{ paddingTop: 14, paddingBottom: 14, minHeight: 72 }} className="justify-center">
        <Image
          source={{ uri: fixture.compLogo }}
          style={{
            position: 'absolute',
            left: 26,
            top: 22,
            width: 20,
            height: 20,
            // Only the PL lion is a transparent silhouette that survives a white tint.
            tintColor: fixture.compType === 'premier-league' ? '#FFFFFF' : undefined,
          }}
          resizeMode="contain"
        />
        <View className="items-center self-center" style={{ maxWidth: 150 }}>
          <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
            {fixture.date}
          </Text>
          <Text
            className="text-center font-body"
            style={{ fontSize: 13, lineHeight: 14, color: '#BDBBBC', marginTop: 2 }}>
            {fixture.venue}
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: '#3A3839' }} />

      <View className="flex-row items-center" style={{ paddingVertical: 20 }}>
        <TeamColumn name={fixture.homeTeam} logo={fixture.homeLogo} />
        <View
          style={{
            width: 75,
            height: 40,
            borderRadius: 4,
            backgroundColor: ARSENAL.scoreBox,
          }}
          className="items-center justify-center">
          <Text className="font-body-semibold text-white" style={{ fontSize: 20 }}>
            {fixture.score}
          </Text>
        </View>
        <TeamColumn name={fixture.awayTeam} logo={fixture.awayLogo} />
      </View>

      <View style={{ height: 1, backgroundColor: '#3A3839' }} />

      <Pressable
        onPress={() => onMatchCentre(fixture.id)}
        accessibilityRole="button"
        style={{
          height: 34,
          borderRadius: 17,
          backgroundColor: ARSENAL.button,
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
