import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AppHeader } from '@/components/AppHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { MatchHero, type GoalEvent } from '@/components/match-centre/MatchHero';
import { ThreadList } from '@/components/match-centre/ThreadList';
import { Lineups } from '@/components/match-centre/Lineups';
import { StatsPanel } from '@/components/match-centre/StatsPanel';
import { PredictionCard } from '@/components/match-centre/PredictionCard';
import { PollCard } from '@/components/match-centre/PollCard';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { VideoCard } from '@/components/media/VideoCard';
import { useMatchCentre } from '@/lib/api/matches';
import { applyVote, castVote } from '@/lib/api/polls';
import { useReactions } from '@/lib/api/reactions';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatKickOff, formatKickOffTime, hasScore } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import type { Match, MatchEvent } from '@/types/database';
import { PALETTE } from '@/theme/palette';
import { isClubTeam } from '@/lib/brand';

const MATCH_TABS = ['THREAD', 'LINE UPS', 'STATS', 'MEDIA'] as const;
type MatchTab = (typeof MATCH_TABS)[number];

const GOAL_TYPES = new Set<MatchEvent['type']>(['goal', 'penalty_goal', 'own_goal']);

function statusTitle(match: Match): string {
  if (match.status === 'finished') return 'FULL TIME';
  if (match.status === 'live') return `${match.minute ?? 0}'`;
  return 'PREVIEW';
}

function goalsFor(events: MatchEvent[], side: 'home' | 'away'): GoalEvent[] {
  return events
    .filter((e) => GOAL_TYPES.has(e.type) && e.team === side)
    .map((e) => ({
      minute: e.minute_label,
      player: `${e.player ?? ''}${e.type === 'penalty_goal' ? ' (P)' : e.type === 'own_goal' ? ' (OG)' : ''}`,
    }));
}

/** Match centre (ref/matchcenter*.jpeg, ref/matccenter-lineup.jpeg). */
export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const centre = useMatchCentre(id);
  const [activeTab, setActiveTab] = useState<MatchTab>('THREAD');
  const [lineupSide, setLineupSide] = useState<'home' | 'away' | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const data = centre.data;
  const videoReactions = useReactions('video', data?.videos.map((v) => v.id) ?? []);

  if (centre.error && !data) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="back" />
        <ErrorState error={centre.error} onRetry={centre.refetch} />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="back" />
        <LoadingState />
      </View>
    );
  }

  const { match, events, lineups, stats, videos, articles, polls } = data;

  if (!match) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="back" />
        <EmptyState
          icon="football-outline"
          title="Match not found"
          actionLabel="GO BACK"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const homeName = match.home_team.toUpperCase();
  const awayName = match.away_team.toUpperCase();
  const clubPlaying = isClubTeam(match.home_team) || isClubTeam(match.away_team);
  // Default to the club's side of the line-up.
  const side = lineupSide ?? (isClubTeam(match.away_team) ? 'away' : 'home');
  const score = hasScore(match)
    ? `${match.home_score} - ${match.away_score}`
    : formatKickOffTime(match.match_date);

  const onRefresh = async () => {
    setRefreshing(true);
    await centre.refetch();
    setRefreshing(false);
  };

  const onVote = async (pollId: string, optionId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    centre.setData((prev) =>
      prev ? { ...prev, polls: applyVote(prev.polls, pollId, optionId) } : prev
    );
    try {
      await castVote(pollId, optionId, user.id);
    } catch (error: any) {
      Alert.alert('Vote not counted', error?.message ?? 'Please try again.');
      centre.refetch();
    }
  };

  const renderThread = () => (
    <View style={{ paddingTop: 18 }}>
      <View style={{ paddingHorizontal: 16 }}>
        {match.status === 'scheduled' && clubPlaying && <PredictionCard match={match} />}
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} onVote={(optionId) => onVote(poll.id, optionId)} />
        ))}
      </View>
      {events.length ? (
        <View style={{ marginTop: -18 }}>
          <ThreadList events={events} />
        </View>
      ) : (
        <EmptyState
          icon="chatbubbles-outline"
          title={
            match.status === 'scheduled'
              ? 'Live coverage starts at kick-off'
              : 'No commentary for this match'
          }
          message={
            match.status === 'scheduled'
              ? `Follow every moment here from ${formatKickOff(match.match_date)} (UK time).`
              : undefined
          }
        />
      )}
    </View>
  );

  const renderMedia = () =>
    videos.length || articles.length ? (
      <View style={{ paddingTop: 22 }}>
        {videos.length > 0 && (
          <>
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 20, marginLeft: 16, marginBottom: 16 }}>
              Videos
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 4, marginBottom: 28 }}>
              {videos.map((v) => {
                const r = videoReactions.get(v.id, v.reactions_base);
                return (
                  <VideoCard
                    key={v.id}
                    video={v}
                    reactions={r.total}
                    reacted={r.reacted}
                    onPress={() => router.push(`/video/${v.id}`)}
                  />
                );
              })}
            </ScrollView>
          </>
        )}
        {articles.length > 0 && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 20, marginBottom: 16 }}>
              Articles
            </Text>
            {articles.map((a) => (
              <MediaRowCard
                key={a.id}
                title={a.title}
                image={resolveImage(a.image_url) ?? { uri: a.image_url }}
                onPress={() => router.push(`/article/${a.id}`)}
              />
            ))}
          </View>
        )}
      </View>
    ) : (
      <EmptyState
        icon="videocam-outline"
        title="Match media"
        message="Highlights and reaction appear here after the match."
      />
    );

  return (
    <View className="flex-1 bg-black">
      <AppHeader left="back" title={<DisplayText size={15}>{statusTitle(match)}</DisplayText>} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.red} />
        }>
        <MatchHero
          dateLine={formatKickOff(match.match_date)}
          venue={match.stadium}
          competitionLogo={match.competition_logo ?? ''}
          home={{ name: match.home_team, logo: match.home_team_logo }}
          away={{ name: match.away_team, logo: match.away_team_logo }}
          score={score}
          homeGoals={goalsFor(events, 'home')}
          awayGoals={goalsFor(events, 'away')}
          onListen={
            match.audio_url
              ? () => WebBrowser.openBrowserAsync(match.audio_url as string)
              : undefined
          }
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

        {activeTab === 'THREAD' && renderThread()}
        {activeTab === 'LINE UPS' && (
          <Lineups
            teams={[homeName, awayName] as const}
            selectedTeam={side === 'home' ? homeName : awayName}
            onSelectTeam={(team) => setLineupSide(team === homeName ? 'home' : 'away')}
            players={lineups.filter((p) => p.side === side)}
          />
        )}
        {activeTab === 'STATS' &&
          (stats.length ? (
            <StatsPanel stats={stats} />
          ) : (
            <EmptyState
              icon="stats-chart-outline"
              title="No stats yet"
              message="Opta match stats appear once the game kicks off."
            />
          ))}
        {activeTab === 'MEDIA' && renderMedia()}
      </ScrollView>
    </View>
  );
}
