import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { SegmentedPills } from '@/components/ui/SegmentedPills';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { FixtureCard } from '@/components/matches/FixtureCard';
import { MonthSelector } from '@/components/matches/MonthSelector';
import { LeagueTable } from '@/components/matches/LeagueTable';
import { PlayerCard } from '@/components/matches/PlayerCard';
import { FixturesCalendar } from '@/components/matches/FixturesCalendar';
import { CalendarSyncSheet } from '@/components/matches/CalendarSyncSheet';
import { FIXTURES_LIST, MEN_TABLE, MONTHS, WOMEN_TABLE } from '@/lib/data/fixtures';
import { playerCardPhoto } from '@/lib/data/playerPhotos';
import { useMatches } from '@/lib/api/matches';
import { useStandings } from '@/lib/api/standings';
import { useSquad } from '@/lib/api/squad';
import { useFilterStore } from '@/store/filterStore';
import { ARSENAL } from '@/theme/arsenal';

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

const TEAM_QUERY: Record<TeamCategory, 'men' | 'women' | 'academy'> = {
  MEN: 'men',
  WOMEN: 'women',
  ACADEMY: 'academy',
};

export default function MatchesTabScreen() {
  const router = useRouter();
  const [teamCategory, setTeamCategory] = useState<TeamCategory>('MEN');
  const [subTab, setSubTab] = useState<SubTab>('FIXTURES');
  const [selectedMonth, setSelectedMonth] = useState('SEP');
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [syncVisible, setSyncVisible] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const teamSelection = useFilterStore((s) => s.teamSelection);
  const selectedComp = useFilterStore((s) => s.selectedComp);
  const isFiltered = useFilterStore((s) => s.isFiltered());
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const { refetch: refetchMatches } = useMatches('all');
  const { refetch: refetchStandings } = useStandings();
  const { squad, refetch: refetchSquad } = useSquad(TEAM_QUERY[teamCategory]);

  const fixtures = FIXTURES_LIST.filter((m) => {
    if (selectedComp !== 'All Competitions' && m.compName !== selectedComp) return false;
    if (teamSelection === 'Arsenal') {
      return m.homeTeam.includes('Arsenal') || m.awayTeam.includes('Arsenal');
    }
    return true;
  });

  const openMatchCentre = (id: string) => router.push(`/match/${id}`);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMatches(), refetchStandings(), refetchSquad()]);
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
        onPress={() => router.push('/filter-fixtures')}
        disabled={subTab !== 'FIXTURES'}
        hitSlop={8}
        accessibilityLabel="Filter fixtures"
        className="active:opacity-60">
        <Ionicons
          name="options-outline"
          size={28}
          color={subTab === 'FIXTURES' ? '#FFF' : '#8E8C8D'}
        />
        {isFiltered && (
          <View
            style={{ backgroundColor: ARSENAL.red }}
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
          />
        )}
      </Pressable>
    </>
  );

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader rightAction={headerActions} />

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

      {subTab === 'FIXTURES' && (
        <MonthSelector
          months={MONTHS}
          selected={selectedMonth}
          year="2026"
          onSelect={setSelectedMonth}
        />
      )}

      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ARSENAL.red} />
        }>
        {subTab === 'FIXTURES' &&
          (isCalendarView ? (
            <FixturesCalendar fixtures={fixtures} onMatchCentre={openMatchCentre} />
          ) : (
            <View className="px-4" style={{ paddingTop: 16 }}>
              {fixtures.length === 0 ? (
                <EmptyFixtures comp={selectedComp} onReset={resetFilters} />
              ) : (
                fixtures.map((m) => (
                  <FixtureCard key={m.id} fixture={m} onMatchCentre={openMatchCentre} />
                ))
              )}
            </View>
          ))}

        {subTab === 'TABLES' && (
          <LeagueTable rows={teamCategory === 'WOMEN' ? WOMEN_TABLE : MEN_TABLE} />
        )}

        {subTab === 'PLAYERS' && (
          <View className="px-4" style={{ paddingTop: 2 }}>
            {POSITION_GROUPS.map((group) => {
              const players = squad.filter((p) => p.position === group.key);
              if (players.length === 0) return null;
              const isCollapsed = Boolean(collapsed[group.key]);
              return (
                <View key={group.key} style={{ marginBottom: 6 }}>
                  <SectionDivider
                    label={group.title}
                    expanded={!isCollapsed}
                    onPress={() =>
                      setCollapsed((prev) => ({ ...prev, [group.key]: !prev[group.key] }))
                    }
                  />
                  {!isCollapsed &&
                    players.map((player) => (
                      <View key={player.id} style={{ marginTop: 8 }}>
                        <PlayerCard
                          player={{
                            shirtNumber: player.shirt_number,
                            firstName: player.first_name,
                            lastName: player.last_name,
                            nationality: player.nationality,
                            flag: player.country_flag,
                            photo: playerCardPhoto(player),
                          }}
                          onPress={() => router.push(`/player/${player.id}`)}
                        />
                      </View>
                    ))}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <CalendarSyncSheet
        visible={syncVisible}
        onClose={() => setSyncVisible(false)}
        onConfirm={() => {
          setSyncVisible(false);
          Alert.alert('Calendar synced', 'Arsenal fixtures were added to your calendar.');
        }}
      />
    </View>
  );
}

function EmptyFixtures({ comp, onReset }: { comp: string; onReset: () => void }) {
  return (
    <View className="items-center px-6 py-16">
      <Text className="font-body-semibold text-base text-white">No fixtures found</Text>
      <Text className="mt-1 text-center font-body text-sm text-neutral-400">
        {`Nothing matches "${comp}".`}
      </Text>
      <Pressable
        onPress={onReset}
        style={{ backgroundColor: ARSENAL.red }}
        className="mt-4 rounded-full px-6 py-2.5 active:opacity-75">
        <Text className="font-body-semibold text-xs text-white">RESET FILTERS</Text>
      </Pressable>
    </View>
  );
}
