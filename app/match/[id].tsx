import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { MatchHero } from '@/components/match-centre/MatchHero';
import { ThreadList } from '@/components/match-centre/ThreadList';
import { Lineups } from '@/components/match-centre/Lineups';
import { StatsPanel } from '@/components/match-centre/StatsPanel';
import { useMatch } from '@/lib/api/matches';
import {
  ARSENAL_STARTING,
  AWAY_GOALS,
  BRIGHTON_STARTING,
  HOME_GOALS,
  MATCH_STATS,
  THREAD_EVENTS,
} from '@/lib/data/matchCentre';
import type { Match } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const MATCH_TABS = ['THREAD', 'LINE UPS', 'STATS', 'MEDIA'] as const;
type MatchTab = (typeof MATCH_TABS)[number];

function statusTitle(match: Match): string {
  if (match.status === 'finished') return 'FULL TIME';
  if (match.status === 'live') return `${match.minute ?? 0}'`;
  return 'PREVIEW';
}

function formatKickOff(iso: string): string {
  try {
    const date = new Date(iso);
    const opts = { timeZone: 'Europe/London' } as const;
    const day = date
      .toLocaleDateString('en-GB', { ...opts, weekday: 'short', day: 'numeric', month: 'short' })
      .replace(',', '')
      .toUpperCase();
    const time = date.toLocaleTimeString('en-GB', { ...opts, hour: '2-digit', minute: '2-digit' });
    return `${day} | ${time}`;
  } catch {
    return iso;
  }
}

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { match, loading } = useMatch(id as string);
  const [activeTab, setActiveTab] = useState<MatchTab>('THREAD');
  const [lineupTeam, setLineupTeam] = useState<string>('');

  if (loading && !match) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color={ARSENAL.red} />
      </View>
    );
  }

  if (!match) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-6">
        <Text className="font-body-semibold text-lg text-white">Match not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: ARSENAL.red }}
          className="mt-6 rounded-full px-5 py-2.5">
          <Text className="font-body-semibold text-white">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const homeName = match.home_team.toUpperCase();
  const awayName = match.away_team.toUpperCase();
  const teams = [homeName, awayName] as const;
  const selectedTeam = lineupTeam || awayName;
  const lineup = selectedTeam === 'ARSENAL' ? ARSENAL_STARTING : BRIGHTON_STARTING;
  const score = `${match.home_score ?? 0} - ${match.away_score ?? 0}`;

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader
        left="back"
        title={<DisplayText size={15}>{statusTitle(match)}</DisplayText>}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <MatchHero
          dateLine={formatKickOff(match.match_date)}
          venue={match.stadium}
          competitionLogo={match.competition_logo ?? ''}
          home={{ name: match.home_team, logo: match.home_team_logo }}
          away={{ name: match.away_team, logo: match.away_team_logo }}
          score={score}
          homeGoals={HOME_GOALS}
          awayGoals={AWAY_GOALS}
          onListen={() => Alert.alert('Live audio', 'Matchday commentary will start shortly.')}
        />

        <View style={{ marginTop: 30 }}>
          <UnderlineTabs
            tabs={MATCH_TABS}
            value={activeTab}
            onChange={setActiveTab}
            variant="inline"
            gap={34}
            fontSize={15.5}
            height={52}
          />
        </View>

        {activeTab === 'THREAD' && <ThreadList events={THREAD_EVENTS} />}
        {activeTab === 'LINE UPS' && (
          <Lineups
            teams={teams}
            selectedTeam={selectedTeam}
            onSelectTeam={setLineupTeam}
            players={lineup}
          />
        )}
        {activeTab === 'STATS' && <StatsPanel stats={MATCH_STATS} />}
        {activeTab === 'MEDIA' && (
          <View className="items-center justify-center p-12">
            <Ionicons name="videocam-outline" size={40} color={ARSENAL.textDim} />
            <Text className="mt-3 font-body-semibold text-base text-white">Match media</Text>
            <Text className="mt-1 text-center font-body text-sm text-neutral-400">
              Highlights and reaction appear here after the match.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
