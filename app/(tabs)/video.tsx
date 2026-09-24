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
import { Ionicons } from '@expo/vector-icons';
import { ArsenalHeader } from '@/components/ArsenalHeader';
import { DatabaseStatusBanner } from '@/components/DatabaseStatusBanner';
import { useVideos } from '@/lib/api/videos';

const CATEGORIES = ['All', 'Highlights', 'Interviews', 'Features', 'Classic'];

export default function VideoScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const { videos, loading, error, refetch } = useVideos(
    selectedCategory === 'All' ? undefined : selectedCategory
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <View className="flex-1 bg-arsenal-dark">
      <ArsenalHeader title="ARSENAL TV" subtitle="Official Video Channel" />

      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="my-3 px-4"
        contentContainerStyle={{ paddingRight: 24 }}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`mr-2 rounded-full border px-3.5 py-1.5 ${
                isSelected
                  ? 'border-arsenal-red bg-arsenal-red'
                  : 'border-arsenal-cardBorder bg-arsenal-card'
              }`}>
              <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
        {error && <DatabaseStatusBanner tableName="videos" onRetry={onRefresh} />}

        {loading && videos.length === 0 ? (
          <ActivityIndicator color="#DB0007" className="my-10" />
        ) : (
          <View className="px-4">
            {/* HERO FEATURED VIDEO */}
            {featuredVideo && (
              <Pressable
                onPress={() => router.push(`/video/${featuredVideo.id}`)}
                className="mb-5 overflow-hidden rounded-2xl border border-arsenal-cardBorder bg-arsenal-card shadow-xl active:opacity-90">
                <View className="relative">
                  <Image
                    source={{ uri: featuredVideo.thumbnail_url }}
                    className="h-52 w-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-arsenal-red shadow-2xl">
                      <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 3 }} />
                    </View>
                  </View>
                  <View className="absolute left-3 top-3 rounded-md bg-arsenal-red px-2.5 py-1">
                    <Text className="text-[10px] font-black uppercase tracking-wider text-white">
                      FEATURED VIDEO
                    </Text>
                  </View>
                  <View className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5">
                    <Text className="text-xs font-bold text-white">{featuredVideo.duration}</Text>
                  </View>
                </View>
                <View className="p-4">
                  <Text className="mb-1 text-xs font-black uppercase tracking-wider text-arsenal-gold">
                    {featuredVideo.category}
                  </Text>
                  <Text className="text-base font-black leading-snug text-white">
                    {featuredVideo.title}
                  </Text>
                  <Text className="mt-1.5 text-xs font-medium text-slate-400">
                    {featuredVideo.views_count} • Published{' '}
                    {new Date(featuredVideo.published_at).toLocaleDateString()}
                  </Text>
                </View>
              </Pressable>
            )}

            {/* VIDEO LIST */}
            <View className="mb-3 flex-row items-center">
              <View className="mr-2 h-4 w-1.5 rounded-full bg-arsenal-red" />
              <Text className="text-sm font-black uppercase tracking-wider text-white">
                All Arsenal TV Videos ({videos.length})
              </Text>
            </View>

            {otherVideos.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => router.push(`/video/${v.id}`)}
                className="mb-3 flex-row rounded-xl border border-arsenal-cardBorder bg-arsenal-card p-3 active:opacity-85">
                <View className="relative mr-3 h-20 w-32 overflow-hidden rounded-lg bg-slate-900">
                  <Image
                    source={{ uri: v.thumbnail_url }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 items-center justify-center bg-black/30">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-arsenal-red/90">
                      <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
                    </View>
                  </View>
                  <View className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5">
                    <Text className="text-[9px] font-bold text-white">{v.duration}</Text>
                  </View>
                </View>

                <View className="flex-1 justify-center">
                  <Text className="mb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-arsenal-gold">
                    {v.category}
                  </Text>
                  <Text
                    className="line-clamp-2 text-xs font-bold leading-snug text-white"
                    numberOfLines={2}>
                    {v.title}
                  </Text>
                  <Text className="mt-1.5 text-[10px] text-slate-400">{v.views_count}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
