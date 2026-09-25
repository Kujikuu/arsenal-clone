import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { SegmentedPills } from '@/components/ui/SegmentedPills';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { FixtureCard } from '@/components/matches/FixtureCard';
import { MonthSelector, type MonthOption } from '@/components/matches/MonthSelector';
import { LeagueTable } from '@/components/matches/LeagueTable';
import { PlayerCard, playerCardData } from '@/components/matches/PlayerCard';
import { FixturesCalendar } from '@/components/matches/FixturesCalendar';
import { CalendarSyncSheet } from '@/components/matches/CalendarSyncSheet';
import { useFixtures } from '@/lib/api/matches';
import { useStandings } from '@/lib/api/standings';
import { useSquad } from '@/lib/api/squad';
import { monthKey } from '@/lib/format';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { isFiltered, useFilterStore } from '@/store/filterStore';
import type { Match, TeamType } from '@/types/database';
import { PALETTE } from '@/theme/palette';
import { useRealtimeRefetch } from '@/lib/api/realtime';

const TEAM_CATEGORIES = ['MEN', 'WOMEN', 'ACADEMY'] as const;
const SUB_TABS = ['FIXTURES', 'TABLES', 'PLAYERS'] as const;
type TeamCategory = (typeof TEAM_CATEGORIES)[number];
type SubTab = (typeof SUB_TABS)[number];

const POSITION_GROUPS = [
  { key: 'Goalkeeper', title: 'Goalkeepers' },
  { key: 'Defender', title: 'Defenders' },
  { key: 'Midfielder', title: 'Midfielders' },
  { key: 'Forward', title: 'Forwards' },
] as const;

const TEAM_TYPE: Record<TeamCategory, TeamType> = {
  MEN: 'men',
  WOMEN: 'women',
  ACADEMY: 'academy',
};
const CATEGORY: Record<TeamType, TeamCategory> = { men: 'MEN', women: 'WOMEN', academy: 'ACADEMY' };

function monthOptions(matches: Match[]): MonthOption[] {
  const seen = new Map<string, MonthOption>();
  matches.forEach((m) => {
    const { key, month, year } = monthKey(m.match_date);
    if (!seen.has(key)) seen.set(key, { key, month, year });
  });
  return [...seen.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/** The month holding the next fixture, or the last month with fixtures. */
function defaultMonth(matches: Match[], months: MonthOption[]): string | null {
  const now = Date.now();
  const next = matches.find((m) => new Date(m.match_date).getTime() >= now);
  if (next) return monthKey(next.match_date).key;
  return months.length ? months[months.length - 1].key : null;
}

export default function MatchesTabScreen() {
  const router = useRouter();
  const { settings, loading: settingsLoading } = useSettings();
  const [teamCategory, setTeamCategory] = useState<TeamCategory>(
    CATEGORY[settings.favourite_team_type]
  );
  // Open on the fan's favourite team once their settings have loaded.
  const appliedFavourite = useRef(false);
  useEffect(() => {
    if (settingsLoading || appliedFavourite.current) return;
    appliedFavourite.current = true;
    setTeamCategory(CATEGORY[settings.favourite_team_type]);
  }, [settingsLoading, settings.favourite_team_type]);
  const [subTab, setSubTab] = useState<SubTab>('FIXTURES');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [syncVisible, setSyncVisible] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const teamType = TEAM_TYPE[teamCategory];
  const filter = useFilterStore((s) => s.filters[teamType]);
  const resetFilter = useFilterStore((s) => s.resetFilter);
  const filtered = isFiltered(filter);

  const fixtures = useFixtures({
    teamType,
    season: filter.season,
    competition: filter.competition,
    clubOnly: filter.teamSelection === 'club',
  });
  useRealtimeRefetch(
    `fixtures:${teamType}`,
    [{ table: 'matches', filter: `team_type=eq.${teamType}` }],
    fixtures.refetch
  );
  const standings = useStandings(teamType, filter.season);
  const squad = useSquad(teamType);

  const matches = useMemo(() => fixtures.data ?? [], [fixtures.data]);
  const months = useMemo(() => monthOptions(matches), [matches]);

  // Keep the selected month valid as the team, season or filters change.
  useEffect(() => {
    if (fixtures.loading) return;
    if (!selectedMonth || !months.some((m) => m.key === selectedMonth)) {
      setSelectedMonth(defaultMonth(matches, months));
    }
  }, [fixtures.loading, matches, months, selectedMonth]);

  const monthMatches = matches.filter((m) => monthKey(m.match_date).key === selectedMonth);

  const openMatchCentre = (id: string) => router.push(`/match/${id}`);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fixtures.refetch(), standings.refetch(), squad.refetch()]);
    setRefreshing(false);
  };

  const headerActions = (
    <>
      <Pressable
        onPress={() => setSyncVisible(true)}
        hitSlop={8}
        accessibilityLabel="Sync fixtures to calendar"
        className="mr-4 active:opacity-60">
        <MaterialCommunityIcons name="calendar-sync-outline" size={27} color="#FFF" />
      </Pressable>
      <Pressable
        onPress={() => router.push({ pathname: '/filter-fixtures', params: { team: teamType } })}
        disabled={subTab === 'PLAYERS'}
        hitSlop={8}
        accessibilityLabel="Filter fixtures"
        className="active:opacity-60">
        <Ionicons
          name="options-outline"
          size={28}
          color={subTab !== 'PLAYERS' ? '#FFF' : '#8E8C8D'}
        />
        {filtered && (
          <View
            style={{ backgroundColor: PALETTE.red }}
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
          />
        )}
      </Pressable>
    </>
  );

  const renderFixtures = () => {
    if (fixtures.error) return <ErrorState error={fixtures.error} onRetry={fixtures.refetch} />;
    if (fixtures.loading && !matches.length) return <LoadingState />;
    if (!matches.length) {
      return (
        <EmptyState
          icon="calendar-outline"
          title="No fixtures found"
          message={`Nothing matches ${filter.competition} in ${filter.season}.`}
          actionLabel={filtered ? 'RESET FILTERS' : undefined}
          onAction={() => resetFilter(teamType)}
        />
      );
    }
    if (isCalendarView && selectedMonth) {
      return (
        <FixturesCalendar
          monthKey={selectedMonth}
          matches={monthMatches}
          onMatchCentre={openMatchCentre}
        />
      );
    }
    return (
      <View className="px-4" style={{ paddingTop: 16 }}>
        {monthMatches.map((m) => (
          <FixtureCard key={m.id} match={m} onMatchCentre={openMatchCentre} />
        ))}
      </View>
    );
  };

  const renderTable = () => {
    if (standings.error) return <ErrorState error={standings.error} onRetry={standings.refetch} />;
    if (standings.loading && !standings.data?.length) return <LoadingState />;
    if (!standings.data?.length) {
      return (
        <EmptyState
          icon="podium-outline"
          title="No table available"
          message={`There is no league table for ${filter.season} yet. Change the season in filters.`}
        />
      );
    }
    return (
      <View>
        <Text
          className="font-body-semibold text-white"
          style={{ fontSize: 15, marginHorizontal: 16, marginTop: 14, marginBottom: 6 }}>
          {standings.data[0].competition} {filter.season}
        </Text>
        <LeagueTable rows={standings.data} />
      </View>
    );
  };

  const renderPlayers = () => {
    if (squad.error) return <ErrorState error={squad.error} onRetry={squad.refetch} />;
    if (squad.loading && !squad.data?.length) return <LoadingState />;
    const players = squad.data ?? [];
    if (!players.length) {
      return <EmptyState icon="people-outline" title="No players listed for this team yet" />;
    }
    return (
      <View className="px-4" style={{ paddingTop: 2 }}>
        {POSITION_GROUPS.map((group) => {
          const inGroup = players.filter((p) => p.position === group.key);
          if (inGroup.length === 0) return null;
          const isCollapsed = Boolean(collapsed[group.key]);
          return (
            <View key={group.key} style={{ marginBottom: 6 }}>
              <SectionDivider
                label={group.title}
                expanded={!isCollapsed}
                onPress={() => setCollapsed((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
              />
              {!isCollapsed &&
                inGroup.map((player) => (
                  <View key={player.id} style={{ marginTop: 8 }}>
                    <PlayerCard
                      player={playerCardData(player)}
                      onPress={() => router.push(`/player/${player.id}`)}
                    />
                  </View>
                ))}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <AppHeader rightAction={headerActions} />

      <UnderlineTabs
        tabs={TEAM_CATEGORIES}
        value={teamCategory}
        onChange={setTeamCategory}
        fontSize={16}
        height={62}
      />

      <View className="flex-row items-center px-4" style={{ paddingTop: 17, paddingBottom: 12 }}>
        <SegmentedPills options={SUB_TABS} value={subTab} onChange={setSubTab} />
        {subTab === 'FIXTURES' && (
          <Pressable
            onPress={() => setIsCalendarView((v) => !v)}
            accessibilityLabel={isCalendarView ? 'Show list' : 'Show calendar'}
            style={{ width: 33, height: 33, borderRadius: 17, backgroundColor: '#323232' }}
            className="ml-3 items-center justify-center active:opacity-75">
            <MaterialCommunityIcons
              name={isCalendarView ? 'format-list-bulleted' : 'calendar-blank-outline'}
              size={20}
              color="#FFF"
            />
          </Pressable>
        )}
      </View>

      {subTab === 'FIXTURES' && months.length > 0 && (
        <MonthSelector months={months} selected={selectedMonth} onSelect={setSelectedMonth} />
      )}

      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.red} />
        }>
        {subTab === 'FIXTURES' && renderFixtures()}
        {subTab === 'TABLES' && renderTable()}
        {subTab === 'PLAYERS' && renderPlayers()}
      </ScrollView>

      <CalendarSyncSheet visible={syncVisible} onClose={() => setSyncVisible(false)} />
    </View>
  );
}
