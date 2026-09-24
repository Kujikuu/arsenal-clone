import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { PlayerCard, playerCardData } from '@/components/matches/PlayerCard';
import { DisplayText } from '@/components/ui/DisplayText';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { usePlayer } from '@/lib/api/squad';
import type { Player } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const PROFILE_TABS = ['PROFILE', 'STATS'] as const;
type ProfileTab = (typeof PROFILE_TABS)[number];

function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][day % 10] ?? 'th';
}

/** "September 15th, 1995" */
function formatDate(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const month = date.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  return `${month} ${day}${ordinal(day)}, ${date.getUTCFullYear()}`;
}

/** "15th August 2023" */
function formatSigned(iso?: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const day = date.getUTCDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  return `${day}${ordinal(day)} ${month} ${date.getUTCFullYear()}`;
}

function detailRows(player: Player): { label: string; value: string }[] {
  const rows = [
    { label: 'POSITION', value: player.position },
    { label: 'DATE OF BIRTH', value: formatDate(player.date_of_birth) },
    { label: 'PLACE OF BIRTH', value: player.place_of_birth },
    { label: 'SIGNED FOR ARSENAL', value: formatSigned(player.signed_on) },
  ];
  return rows.filter((r): r is { label: string; value: string } => Boolean(r.value));
}

function statRows(player: Player): { label: string; value: string }[] {
  const rows = [
    { label: 'APPEARANCES', value: player.appearances },
    { label: 'GOALS', value: player.goals },
    { label: 'ASSISTS', value: player.assists },
  ];
  if (player.position === 'Goalkeeper' || player.position === 'Defender') {
    rows.push({ label: 'CLEAN SHEETS', value: player.clean_sheets ?? 0 });
  }
  return rows.map((r) => ({ ...r, value: String(r.value) }));
}

function DetailList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 26,
        backgroundColor: ARSENAL.surface,
        borderRadius: 8,
      }}>
      {rows.map((row, i) => (
        <View
          key={row.label}
          style={{ height: 95, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: ARSENAL.chip }}
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
  );
}

/** Player profile (ref/player-profile.jpeg, ref/player-profile2.jpeg). */
export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: player, loading, error, refetch } = usePlayer(id);
  const [tab, setTab] = useState<ProfileTab>('PROFILE');

  if (error) {
    return (
      <View className="flex-1 bg-black">
        <TheArsenalHeader left="back" />
        <ErrorState error={error} onRetry={refetch} />
      </View>
    );
  }

  if (!player) {
    return (
      <View className="flex-1 bg-black">
        <TheArsenalHeader left="back" />
        {loading ? (
          <LoadingState />
        ) : (
          <EmptyState
            title="Player not found"
            actionLabel="GO BACK"
            onAction={() => router.back()}
          />
        )}
      </View>
    );
  }

  const paragraphs = player.bio ? player.bio.split('\n\n').filter(Boolean) : [];

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader left="back" />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <PlayerCard height={186} player={playerCardData(player)} />

        <UnderlineTabs
          tabs={PROFILE_TABS}
          value={tab}
          onChange={setTab}
          variant="inline"
          gap={34}
          fontSize={15.5}
          height={58}
        />

        {tab === 'PROFILE' ? (
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
              {paragraphs.map((paragraph, i) => (
                <Text
                  key={i}
                  className="font-body text-white"
                  style={{
                    fontSize: 15.5,
                    lineHeight: 17,
                    letterSpacing: -0.25,
                    marginBottom: 17,
                  }}>
                  {paragraph}
                </Text>
              ))}
            </View>
            <DetailList rows={detailRows(player)} />
          </>
        ) : (
          <>
            <Text
              className="font-body"
              style={{
                fontSize: 14,
                color: ARSENAL.textMuted,
                marginHorizontal: 16,
                marginTop: 20,
              }}>
              All competitions, this season.
            </Text>
            <DetailList rows={statRows(player)} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
