import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { PlayerCard } from '@/components/matches/PlayerCard';
import { DisplayText } from '@/components/ui/DisplayText';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { usePlayer } from '@/lib/api/squad';
import { playerCardPhoto } from '@/lib/data/playerPhotos';
import type { Player } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const PROFILE_TABS = ['PROFILE'] as const;

/** Known details that aren't in the players table yet. */
const EXTRA_DETAILS: Record<string, { placeOfBirth: string; signed: string }> = {
  p01: { placeOfBirth: 'Barcelona, Spain', signed: '15th August 2023' },
};

function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][day % 10] ?? 'th';
}

function formatDob(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const month = date.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  return `${month} ${day}${ordinal(day)}, ${date.getUTCFullYear()}`;
}

function detailRows(player: Player): { label: string; value: string }[] {
  const extra = EXTRA_DETAILS[player.id];
  const dob = formatDob(player.date_of_birth);
  return [
    { label: 'POSITION', value: player.position },
    ...(dob ? [{ label: 'DATE OF BIRTH', value: dob }] : []),
    ...(extra ? [{ label: 'PLACE OF BIRTH', value: extra.placeOfBirth }] : []),
    ...(extra ? [{ label: 'SIGNED FOR ARSENAL', value: extra.signed }] : []),
  ];
}

/** Player profile (ref/player-profile.jpeg, ref/player-profile2.jpeg). */
export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { player } = usePlayer(id as string);

  if (!player) {
    return (
      <View className="flex-1 bg-black">
        <TheArsenalHeader left="back" />
        <Text className="mt-10 text-center font-body text-base text-white">Player not found</Text>
      </View>
    );
  }

  const paragraphs = player.bio ? player.bio.split('\n\n').filter(Boolean) : [];

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader left="back" />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <PlayerCard
          height={186}
          player={{
            shirtNumber: player.shirt_number,
            firstName: player.first_name,
            lastName: player.last_name,
            nationality: player.nationality,
            flag: player.country_flag,
            photo: playerCardPhoto(player),
          }}
        />

        <UnderlineTabs
          tabs={PROFILE_TABS}
          value="PROFILE"
          onChange={() => {}}
          variant="inline"
          gap={0}
          fontSize={15.5}
          height={58}
        />

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          {paragraphs.map((paragraph, i) => (
            <Text
              key={i}
              className="font-body text-white"
              style={{ fontSize: 15.5, lineHeight: 17, letterSpacing: -0.25, marginBottom: 17 }}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View
          style={{
            marginHorizontal: 16,
            marginTop: 26,
            backgroundColor: ARSENAL.surface,
            borderRadius: 8,
          }}>
          {detailRows(player).map((row, i) => (
            <View
              key={row.label}
              style={{
                height: 95,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: ARSENAL.chip,
              }}
              className="items-center justify-center">
              <DisplayText size={9.5} color="#C8C6C7" heavy={false}>
                {row.label}
              </DisplayText>
              <DisplayText size={16.5} style={{ marginTop: 12 }}>
                {row.value.toUpperCase()}
              </DisplayText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
