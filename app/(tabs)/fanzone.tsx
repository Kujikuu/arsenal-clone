import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArsenalHeader } from '@/components/ArsenalHeader';
import { DatabaseStatusBanner } from '@/components/DatabaseStatusBanner';
import { usePolls } from '@/lib/api/polls';
import { useNextMatch } from '@/lib/api/matches';
import { useMatchPrediction } from '@/lib/api/predictions';
import { useAuth } from '@/lib/api/auth';

type FanZoneTab = 'polls' | 'predictor' | 'membership';

export default function FanZoneScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FanZoneTab>('polls');
  const [refreshing, setRefreshing] = useState(false);

  const { polls, error: pollError, vote, refetch: refetchPolls } = usePolls();
  const { nextMatch, refetch: refetchMatch } = useNextMatch();
  const { user, profile } = useAuth();

  // Predictor state
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(1);
  const [firstScorer, setFirstScorer] = useState('Bukayo Saka');
  const [submitted, setSubmitted] = useState(false);

  const { prediction, submit: submitPred } = useMatchPrediction(nextMatch?.id || '');

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPolls(), refetchMatch()]);
    setRefreshing(false);
  };

  const handlePredictionSubmit = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    const res = await submitPred(homeScore, awayScore, firstScorer);
    if (res.success) {
      setSubmitted(true);
      Alert.alert(
        'Prediction Locked In!',
        'Best of luck, Gooner! Check back after the match for leaderboard points.'
      );
    } else {
      Alert.alert('Error', res.error?.message || 'Could not submit prediction');
    }
  };

  return (
    <View className="flex-1 bg-arsenal-dark">
      <ArsenalHeader title="FAN ZONE" subtitle="Interactive Gunners Hub" />

      {/* Segmented Filter */}
      <View className="mx-4 my-3 flex-row rounded-xl border border-arsenal-cardBorder bg-arsenal-card p-1">
        {(['polls', 'predictor', 'membership'] as FanZoneTab[]).map((tab) => {
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
                {tab === 'polls' ? 'Fan Polls' : tab === 'predictor' ? 'Predictor' : 'Gunner ID'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#DB0007"
            colors={['#DB0007']}
          />
        }>
        {pollError && <DatabaseStatusBanner tableName="fan_polls" onRetry={onRefresh} />}

        {/* 1. FAN POLLS TAB */}
        {activeTab === 'polls' && (
          <View className="space-y-4 px-4">
            {polls.length === 0 ? (
              <View className="items-center justify-center rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-8">
                <Ionicons name="podium-outline" size={40} color="#64748B" />
                <Text className="mt-3 text-sm font-bold text-white">No Active Polls</Text>
              </View>
            ) : (
              polls.map((poll) => (
                <View
                  key={poll.id}
                  className="mb-4 rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-5 shadow-lg">
                  <View className="mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="trophy" size={14} color="#D4AF37" />
                      <Text className="ml-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                        {poll.category}
                      </Text>
                    </View>
                    <Text className="text-[10px] font-medium text-slate-400">
                      {poll.total_votes.toLocaleString()} votes
                    </Text>
                  </View>

                  <Text className="mb-1 text-base font-black text-white">{poll.title}</Text>
                  <Text className="mb-4 text-xs text-slate-400">{poll.description}</Text>

                  {/* Options */}
                  <View className="space-y-2.5">
                    {poll.options.map((opt) => {
                      const isVoted = poll.user_voted_option_id === opt.id;
                      const percentage =
                        poll.total_votes > 0
                          ? Math.round((opt.votes_count / poll.total_votes) * 100)
                          : 0;

                      return (
                        <Pressable
                          key={opt.id}
                          onPress={async () => {
                            if (!user) {
                              router.push('/auth/login');
                              return;
                            }
                            await vote(poll.id, opt.id);
                          }}
                          className={`relative overflow-hidden rounded-xl border p-3.5 active:opacity-85 ${
                            isVoted
                              ? 'border-arsenal-red bg-arsenal-red/10'
                              : 'border-slate-800 bg-slate-900/70'
                          }`}>
                          {poll.user_voted_option_id && (
                            <View
                              style={{ width: `${percentage}%` }}
                              className="absolute inset-y-0 left-0 bg-arsenal-red/20"
                            />
                          )}

                          <View className="z-10 flex-row items-center justify-between">
                            <View className="mr-2 flex-1">
                              <Text className="text-xs font-bold text-white">{opt.label}</Text>
                              {opt.sub_label ? (
                                <Text className="mt-0.5 text-[10px] text-slate-400">
                                  {opt.sub_label}
                                </Text>
                              ) : null}
                            </View>

                            {poll.user_voted_option_id ? (
                              <Text className="text-xs font-black text-white">{percentage}%</Text>
                            ) : (
                              <View className="h-5 w-5 items-center justify-center rounded-full border border-slate-600">
                                <Ionicons name="checkmark" size={12} color="transparent" />
                              </View>
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* 2. MATCH PREDICTOR TAB */}
        {activeTab === 'predictor' && (
          <View className="px-4">
            {nextMatch ? (
              <View className="rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-5 shadow-xl">
                <View className="mb-3 items-center">
                  <View className="mb-1 rounded-full bg-arsenal-red px-3 py-0.5">
                    <Text className="text-[10px] font-black uppercase tracking-wider text-white">
                      SCORE PREDICTOR
                    </Text>
                  </View>
                  <Text className="text-center text-base font-black text-white">
                    {nextMatch.home_team} vs {nextMatch.away_team}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    Predict score & first scorer to earn points!
                  </Text>
                </View>

                {/* Score Stepper */}
                <View className="my-3 flex-row items-center justify-around rounded-2xl border border-slate-800 bg-slate-900/80 py-4">
                  {/* Home Score Stepper */}
                  <View className="items-center">
                    <Text className="mb-2 text-xs font-bold text-slate-300">
                      {nextMatch.home_team}
                    </Text>
                    <View className="flex-row items-center space-x-3">
                      <Pressable
                        onPress={() => setHomeScore(Math.max(0, homeScore - 1))}
                        className="h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 active:opacity-70">
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      </Pressable>
                      <Text className="mx-2 text-3xl font-black text-white">{homeScore}</Text>
                      <Pressable
                        onPress={() => setHomeScore(homeScore + 1)}
                        className="h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 active:opacity-70">
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>

                  <Text className="text-2xl font-black text-slate-600">:</Text>

                  {/* Away Score Stepper */}
                  <View className="items-center">
                    <Text className="mb-2 text-xs font-bold text-slate-300">
                      {nextMatch.away_team}
                    </Text>
                    <View className="flex-row items-center space-x-3">
                      <Pressable
                        onPress={() => setAwayScore(Math.max(0, awayScore - 1))}
                        className="h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 active:opacity-70">
                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                      </Pressable>
                      <Text className="mx-2 text-3xl font-black text-white">{awayScore}</Text>
                      <Pressable
                        onPress={() => setAwayScore(awayScore + 1)}
                        className="h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 active:opacity-70">
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* First Goalscorer Picker */}
                <View className="my-3">
                  <Text className="mb-2 text-xs font-bold text-slate-300">First Goalscorer</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row space-x-2">
                    {[
                      'Bukayo Saka',
                      'Kai Havertz',
                      'Gabriel Martinelli',
                      'Martin Ødegaard',
                      'Declan Rice',
                      'No Goalscorer',
                    ].map((name) => {
                      const isSelected = firstScorer === name;
                      return (
                        <Pressable
                          key={name}
                          onPress={() => setFirstScorer(name)}
                          className={`mr-2 rounded-xl border px-3 py-2 ${
                            isSelected
                              ? 'border-arsenal-red bg-arsenal-red'
                              : 'border-slate-800 bg-slate-900'
                          }`}>
                          <Text
                            className={`text-xs font-bold ${
                              isSelected ? 'text-white' : 'text-slate-400'
                            }`}>
                            {name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Submit button */}
                <Pressable
                  onPress={handlePredictionSubmit}
                  className="mt-4 items-center rounded-xl bg-arsenal-red py-3.5 shadow-lg active:opacity-85">
                  <Text className="text-sm font-black uppercase tracking-wider text-white">
                    {prediction || submitted ? 'Update Prediction' : 'Lock In Prediction'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="items-center justify-center rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-8">
                <Ionicons name="football-outline" size={40} color="#64748B" />
                <Text className="mt-3 text-sm font-bold text-white">
                  No upcoming fixture to predict
                </Text>
              </View>
            )}

            {/* Fan Predictor Leaderboard */}
            <View className="mt-5 rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xs font-black uppercase tracking-wider text-white">
                  Fan Predictor Leaderboard
                </Text>
                <Text className="text-xs font-bold text-amber-400">Top 5</Text>
              </View>

              {[
                { rank: 1, name: 'RedGunner99', points: 142 },
                { rank: 2, name: 'EmiratesKing', points: 138 },
                { rank: 3, name: 'SakaFan07', points: 131 },
                { rank: 4, name: 'NorthLondonGuy', points: 124 },
                { rank: 5, name: 'ArtetaBall', points: 119 },
              ].map((row) => (
                <View
                  key={row.rank}
                  className="flex-row items-center justify-between border-b border-slate-800/60 py-2 last:border-0">
                  <View className="flex-row items-center">
                    <Text className="w-6 text-xs font-bold text-slate-400">#{row.rank}</Text>
                    <Text className="text-xs font-semibold text-white">{row.name}</Text>
                  </View>
                  <Text className="text-xs font-black text-arsenal-gold">{row.points} pts</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 3. DIGITAL MEMBERSHIP CARD TAB */}
        {activeTab === 'membership' && (
          <View className="px-4">
            {/* Membership Card Graphic */}
            <View className="relative overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-700 via-arsenal-red to-red-950 p-6 shadow-2xl">
              {/* Background Cannon Pattern */}
              <View className="absolute bottom-0 right-0 opacity-10">
                <Ionicons name="shield" size={160} color="#FFFFFF" />
              </View>

              <View className="mb-6 flex-row items-start justify-between">
                <View>
                  <Text className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    ARSENAL FOOTBALL CLUB
                  </Text>
                  <Text className="mt-0.5 text-xl font-black tracking-wider text-white">
                    DIGITAL PASS
                  </Text>
                </View>

                <View className="rounded-full border border-white/20 bg-black/30 px-3 py-1">
                  <Text className="text-xs font-black text-amber-300">
                    {profile?.membership_tier || 'RED MEMBER'}
                  </Text>
                </View>
              </View>

              <View className="my-4">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Member Name
                </Text>
                <Text className="text-lg font-black text-white">
                  {profile?.full_name || (user ? user.email?.split('@')[0] : 'Guest Gunner')}
                </Text>
              </View>

              <View className="flex-row items-end justify-between border-t border-white/20 pt-3">
                <View>
                  <Text className="text-[9px] font-bold uppercase tracking-wider text-white/70">
                    Membership ID
                  </Text>
                  <Text className="font-mono text-sm font-bold tracking-widest text-white">
                    {profile?.gunner_id_number || 'AFC-2024-88392'}
                  </Text>
                </View>

                {/* Simulated Barcode / QR */}
                <View className="items-center justify-center rounded-lg bg-white p-2">
                  <Ionicons name="qr-code" size={36} color="#000000" />
                </View>
              </View>
            </View>

            {/* Quick Profile / Auth Action */}
            <View className="mt-5 rounded-2xl border border-arsenal-cardBorder bg-arsenal-card p-4">
              <View className="flex-row items-center justify-between">
                <View className="mr-3 flex-1">
                  <Text className="text-sm font-bold text-white">
                    {user ? 'Signed In' : 'Sign In with Supabase'}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-400">
                    {user
                      ? `Connected as ${user.email}`
                      : 'Unlock personalized member perks, favorite players, and predictions.'}
                  </Text>
                </View>

                {user ? (
                  <Pressable
                    onPress={() => router.push('/auth/login')}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 active:opacity-70">
                    <Text className="text-xs font-semibold text-white">Account</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => router.push('/auth/login')}
                    className="rounded-lg bg-arsenal-red px-3.5 py-1.5 active:opacity-80">
                    <Text className="text-xs font-bold text-white">Sign In</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
