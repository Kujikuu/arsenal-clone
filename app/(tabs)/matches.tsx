import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArsenalHeader } from '@/components/ArsenalHeader';
import { DatabaseStatusBanner } from '@/components/DatabaseStatusBanner';
import { useMatches } from '@/lib/api/matches';
import { useStandings } from '@/lib/api/standings';

type MatchTab = 'fixtures' | 'results' | 'table';

export default function MatchesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MatchTab>('fixtures');
  const [refreshing, setRefreshing] = useState(false);

  const {
    matches: fixtures,
    loading: loadingFixtures,
    error: fixturesError,
    refetch: refetchFixtures,
  } = useMatches('fixtures');
  const {
    matches: results,
    loading: loadingResults,
    error: resultsError,
    refetch: refetchResults,
  } = useMatches('results');
  const {
    standings,
    loading: loadingStandings,
    error: standingsError,
    refetch: refetchStandings,
  } = useStandings();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchFixtures(), refetchResults(), refetchStandings()]);
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-arsenal-dark">
      <ArsenalHeader title="MATCHES" subtitle="Season 2024/25" />

      {/* Segmented Tab Filter */}
      <View className="mx-4 my-3 flex-row rounded-xl border border-arsenal-cardBorder bg-arsenal-card p-1">
        {(['fixtures', 'results', 'table'] as MatchTab[]).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 items-center rounded-lg py-2 ${
                isSelected ? 'bg-arsenal-red' : 'bg-transparent'
              }`}>
              <Text
                className={`text-xs font-black uppercase tracking-wider ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#DB0007"
            colors={['#DB0007']}
          />
        }>
        {(fixturesError || resultsError || standingsError) && (
          <DatabaseStatusBanner tableName="matches" onRetry={onRefresh} />
        )}

        {/* 1. FIXTURES VIEW */}
        {activeTab === 'fixtures' && (
          <View className="px-4">
            {loadingFixtures && fixtures.length === 0 ? (
              <ActivityIndicator color="#DB0007" className="my-8" />
            ) : fixtures.length === 0 ? (
              <View className="items-center justify-center rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-8">
                <Ionicons name="calendar-outline" size={40} color="#64748B" />
                <Text className="mt-3 text-sm font-bold text-white">
                  No upcoming fixtures found
                </Text>
                <Text className="mt-1 text-center text-xs text-slate-400">
                  Seed database or check back later for schedule updates.
                </Text>
              </View>
            ) : (
              fixtures.map((m) => {
                const dateObj = new Date(m.match_date);
                const dateStr = dateObj.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });
                const timeStr = dateObj.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <Pressable
                    key={m.id}
                    onPress={() => router.push(`/match/${m.id}`)}
                    className="mb-3 rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-4 shadow-md active:opacity-85">
                    <View className="mb-3 flex-row items-center justify-between border-b border-slate-800/80 pb-2">
                      <View className="flex-row items-center">
                        <Ionicons name="trophy-outline" size={13} color="#D4AF37" />
                        <Text className="ml-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                          {m.competition} • {m.round}
                        </Text>
                      </View>
                      <Text className="text-[11px] font-medium text-slate-400">{dateStr}</Text>
                    </View>

                    <View className="flex-row items-center justify-between py-1">
                      {/* Home */}
                      <View className="flex-1 items-center">
                        <Image
                          source={{ uri: m.home_team_logo }}
                          className="h-12 w-12"
                          resizeMode="contain"
                        />
                        <Text
                          className="mt-2 text-center text-xs font-bold text-white"
                          numberOfLines={1}>
                          {m.home_team}
                        </Text>
                      </View>

                      {/* Time / Status */}
                      <View className="items-center px-4">
                        <View className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
                          <Text className="text-sm font-black text-arsenal-gold">{timeStr}</Text>
                        </View>
                        <Text className="mt-1 text-[10px] font-medium text-slate-400">Kickoff</Text>
                      </View>

                      {/* Away */}
                      <View className="flex-1 items-center">
                        <Image
                          source={{ uri: m.away_team_logo }}
                          className="h-12 w-12"
                          resizeMode="contain"
                        />
                        <Text
                          className="mt-2 text-center text-xs font-bold text-white"
                          numberOfLines={1}>
                          {m.away_team}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3 flex-row items-center justify-between border-t border-slate-800/80 pt-2.5">
                      <View className="mr-2 flex-1 flex-row items-center">
                        <Ionicons name="location-outline" size={13} color="#94A3B8" />
                        <Text className="ml-1 text-xs text-slate-400" numberOfLines={1}>
                          {m.stadium}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="mr-1 text-xs font-black text-arsenal-red">
                          Match Centre
                        </Text>
                        <Ionicons name="chevron-forward" size={12} color="#DB0007" />
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        )}

        {/* 2. RESULTS VIEW */}
        {activeTab === 'results' && (
          <View className="px-4">
            {loadingResults && results.length === 0 ? (
              <ActivityIndicator color="#DB0007" className="my-8" />
            ) : results.length === 0 ? (
              <View className="items-center justify-center rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-8">
                <Ionicons name="time-outline" size={40} color="#64748B" />
                <Text className="mt-3 text-sm font-bold text-white">No past results found</Text>
              </View>
            ) : (
              results.map((m) => {
                const dateObj = new Date(m.match_date);
                const dateStr = dateObj.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const isArsenalWin =
                  (m.home_team === 'Arsenal' && (m.home_score || 0) > (m.away_score || 0)) ||
                  (m.away_team === 'Arsenal' && (m.away_score || 0) > (m.home_score || 0));

                return (
                  <Pressable
                    key={m.id}
                    onPress={() => router.push(`/match/${m.id}`)}
                    className="mb-3 rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-4 shadow-md active:opacity-85">
                    <View className="mb-3 flex-row items-center justify-between border-b border-slate-800/80 pb-2">
                      <View className="flex-row items-center">
                        <View
                          className={`mr-2 h-2 w-2 rounded-full ${
                            isArsenalWin ? 'bg-emerald-500' : 'bg-slate-500'
                          }`}
                        />
                        <Text className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                          {m.competition} • {m.round}
                        </Text>
                      </View>
                      <Text className="text-[11px] font-medium text-slate-400">{dateStr}</Text>
                    </View>

                    <View className="flex-row items-center justify-between py-1">
                      {/* Home */}
                      <View className="flex-1 items-center">
                        <Image
                          source={{ uri: m.home_team_logo }}
                          className="h-12 w-12"
                          resizeMode="contain"
                        />
                        <Text
                          className="mt-2 text-center text-xs font-bold text-white"
                          numberOfLines={1}>
                          {m.home_team}
                        </Text>
                      </View>

                      {/* Score */}
                      <View className="items-center px-4">
                        <View className="flex-row items-center rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5">
                          <Text className="text-xl font-black text-white">{m.home_score ?? 0}</Text>
                          <Text className="mx-2 text-base font-black text-slate-500">-</Text>
                          <Text className="text-xl font-black text-white">{m.away_score ?? 0}</Text>
                        </View>
                        <Text className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Full Time
                        </Text>
                      </View>

                      {/* Away */}
                      <View className="flex-1 items-center">
                        <Image
                          source={{ uri: m.away_team_logo }}
                          className="h-12 w-12"
                          resizeMode="contain"
                        />
                        <Text
                          className="mt-2 text-center text-xs font-bold text-white"
                          numberOfLines={1}>
                          {m.away_team}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3 flex-row items-center justify-end border-t border-slate-800/80 pt-2.5">
                      <Text className="mr-1 text-xs font-black text-arsenal-red">
                        Match Report & Stats
                      </Text>
                      <Ionicons name="chevron-forward" size={12} color="#DB0007" />
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        )}

        {/* 3. TABLE VIEW */}
        {activeTab === 'table' && (
          <View className="mx-4 overflow-hidden rounded-2xl border border-arsenal-cardBorder bg-arsenal-card">
            {/* Table Header */}
            <View className="flex-row items-center border-b border-slate-800 bg-slate-900/90 px-3 py-2.5">
              <Text className="w-7 text-center text-[10px] font-extrabold text-slate-400">POS</Text>
              <Text className="ml-1 flex-1 text-[10px] font-extrabold text-slate-400">CLUB</Text>
              <Text className="w-8 text-center text-[10px] font-extrabold text-slate-400">PL</Text>
              <Text className="w-8 text-center text-[10px] font-extrabold text-slate-400">GD</Text>
              <Text className="w-9 text-center text-[10px] font-extrabold text-slate-400">PTS</Text>
              <Text className="w-14 text-center text-[10px] font-extrabold text-slate-400">
                FORM
              </Text>
            </View>

            {loadingStandings && standings.length === 0 ? (
              <ActivityIndicator color="#DB0007" className="my-8" />
            ) : (
              standings.map((team, idx) => {
                const isArsenal = team.team_name === 'Arsenal';
                const forms = team.form ? team.form.split(',') : [];

                return (
                  <View
                    key={team.id}
                    className={`flex-row items-center border-b border-slate-800/60 px-3 py-3 ${
                      isArsenal
                        ? 'bg-arsenal-red/15'
                        : idx % 2 === 1
                          ? 'bg-slate-900/30'
                          : 'bg-transparent'
                    }`}>
                    <Text
                      className={`w-7 text-center text-xs font-black ${
                        team.rank <= 4 ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                      {team.rank}
                    </Text>

                    <View className="ml-1 flex-1 flex-row items-center">
                      <Image
                        source={{ uri: team.team_logo }}
                        className="mr-2 h-5 w-5"
                        resizeMode="contain"
                      />
                      <Text
                        className={`text-xs ${
                          isArsenal ? 'font-black text-white' : 'font-semibold text-slate-200'
                        }`}
                        numberOfLines={1}>
                        {team.team_name}
                      </Text>
                    </View>

                    <Text className="w-8 text-center text-xs font-medium text-slate-300">
                      {team.played}
                    </Text>
                    <Text className="w-8 text-center text-xs font-medium text-slate-300">
                      {team.goal_diff > 0 ? `+${team.goal_diff}` : team.goal_diff}
                    </Text>
                    <Text className="w-9 text-center text-xs font-black text-white">
                      {team.points}
                    </Text>

                    {/* Form Dots */}
                    <View className="w-14 flex-row items-center justify-center space-x-1">
                      {forms.slice(-3).map((f, i) => (
                        <View
                          key={i}
                          className={`h-3.5 w-3.5 items-center justify-center rounded-full ${
                            f === 'W' ? 'bg-emerald-500' : f === 'D' ? 'bg-slate-600' : 'bg-red-500'
                          }`}>
                          <Text className="text-[8px] font-black text-white">{f}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
