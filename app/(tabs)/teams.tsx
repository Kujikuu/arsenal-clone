import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArsenalHeader } from '@/components/ArsenalHeader';
import { DatabaseStatusBanner } from '@/components/DatabaseStatusBanner';
import { useSquad } from '@/lib/api/squad';
import { Player } from '@/types/database';

type TeamType = 'men' | 'women' | 'academy';

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const;

export default function TeamsScreen() {
  const router = useRouter();
  const [teamType, setTeamType] = useState<TeamType>('men');
  const [refreshing, setRefreshing] = useState(false);

  const { squad, loading, error, refetch } = useSquad(teamType);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const groupedSquad = POSITIONS.reduce(
    (acc, pos) => {
      acc[pos] = squad.filter((p) => p.position === pos);
      return acc;
    },
    {} as Record<string, Player[]>
  );

  return (
    <View className="flex-1 bg-arsenal-dark">
      <ArsenalHeader title="SQUADS" subtitle="Arsenal FC Teams" />

      {/* Team Type Switcher */}
      <View className="mx-4 my-3 flex-row rounded-xl border border-arsenal-cardBorder bg-arsenal-card p-1">
        {(['men', 'women', 'academy'] as TeamType[]).map((type) => {
          const isSelected = teamType === type;
          return (
            <Pressable
              key={type}
              onPress={() => setTeamType(type)}
              className={`flex-1 items-center rounded-lg py-2 ${
                isSelected ? 'bg-arsenal-red' : 'bg-transparent'
              }`}>
              <Text
                className={`text-xs font-black uppercase tracking-wider ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}>
                {type === 'men'
                  ? "Men's First Team"
                  : type === 'women'
                    ? "Women's Team"
                    : 'Academy U21'}
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
        {error && <DatabaseStatusBanner tableName="players" onRetry={onRefresh} />}

        {loading && squad.length === 0 ? (
          <ActivityIndicator color="#DB0007" className="my-10" />
        ) : (
          POSITIONS.map((pos) => {
            const playersInPos = groupedSquad[pos] || [];
            if (playersInPos.length === 0) return null;

            return (
              <View key={pos} className="mt-4 px-4">
                <View className="mb-3 flex-row items-center">
                  <View className="mr-2 h-4 w-1.5 rounded-full bg-arsenal-red" />
                  <Text className="text-sm font-black uppercase tracking-wider text-white">
                    {pos}s ({playersInPos.length})
                  </Text>
                </View>

                <View className="-mx-1.5 flex-row flex-wrap">
                  {playersInPos.map((player) => (
                    <View key={player.id} className="mb-3 w-1/2 px-1.5">
                      <Pressable
                        onPress={() => router.push(`/player/${player.id}`)}
                        className="overflow-hidden rounded-2xl border border-arsenal-cardBorder bg-arsenal-card shadow-md active:opacity-85">
                        {/* Player Image & Number Badge */}
                        <View className="relative h-44 bg-slate-900">
                          <Image
                            source={{ uri: player.photo_url }}
                            className="h-full w-full"
                            resizeMode="cover"
                          />
                          <View className="absolute inset-0 bg-gradient-to-t from-arsenal-card via-transparent to-transparent" />

                          {/* Shirt number watermark */}
                          <View className="absolute left-2.5 top-2 h-7 w-7 items-center justify-center rounded-full bg-arsenal-red/90 shadow">
                            <Text className="text-xs font-black text-white">
                              {player.shirt_number}
                            </Text>
                          </View>

                          {/* Country Flag */}
                          <View className="absolute right-2.5 top-2 rounded bg-black/60 px-1.5 py-0.5">
                            <Text className="text-xs">{player.country_flag}</Text>
                          </View>
                        </View>

                        <View className="p-3">
                          <Text
                            className="text-sm font-black leading-snug text-white"
                            numberOfLines={1}>
                            {player.known_as || `${player.first_name} ${player.last_name}`}
                          </Text>
                          <Text className="mt-0.5 text-[11px] font-medium text-slate-400">
                            {player.position}
                          </Text>

                          {/* Mini Stats Footer */}
                          <View className="mt-2 flex-row items-center justify-between border-t border-slate-800 pt-2">
                            <View>
                              <Text className="text-[9px] font-bold uppercase text-slate-500">
                                Apps
                              </Text>
                              <Text className="text-xs font-black text-white">
                                {player.appearances}
                              </Text>
                            </View>
                            <View>
                              <Text className="text-[9px] font-bold uppercase text-slate-500">
                                {player.position === 'Goalkeeper' ? 'Cleans' : 'Goals'}
                              </Text>
                              <Text className="text-xs font-black text-arsenal-gold">
                                {player.position === 'Goalkeeper'
                                  ? (player.clean_sheets ?? 0)
                                  : player.goals}
                              </Text>
                            </View>
                            <View>
                              <Text className="text-[9px] font-bold uppercase text-slate-500">
                                Asts
                              </Text>
                              <Text className="text-xs font-black text-white">
                                {player.assists}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
