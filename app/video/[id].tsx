import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useVideo, useVideos } from '@/lib/api/videos';

export default function VideoPlayerModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { video, loading } = useVideo(id as string);
  const { videos: relatedVideos } = useVideos();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#DB0007" />
      </View>
    );
  }

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-4 text-lg font-bold text-white">Video Not Found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-lg bg-arsenal-red px-4 py-2">
          <Text className="font-bold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&playsinline=1&modestbranding=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtube_id}`;

  const onShare = async () => {
    try {
      await Share.share({
        title: video.title,
        message: `${video.title} - Watch on Arsenal TV: ${watchUrl}`,
      });
    } catch {}
  };

  const playVideo = async () => {
    if (Platform.OS !== 'web') {
      await WebBrowser.openBrowserAsync(watchUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: '#060814',
      });
    } else {
      Linking.openURL(watchUrl);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Top Modal Bar */}
      <View
        style={{ paddingTop: Math.max(insets.top, 12) + 4 }}
        className="z-20 flex-row items-center justify-between bg-black/90 px-4 pb-2.5">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-800 active:opacity-70">
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </Pressable>

        <View className="flex-row items-center">
          <View className="mr-2 h-2 w-2 rounded-full bg-arsenal-red" />
          <Text className="text-xs font-black uppercase tracking-widest text-white">
            ARSENAL TV
          </Text>
        </View>

        <Pressable
          onPress={onShare}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-800 active:opacity-70">
          <Ionicons name="share-outline" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* VIDEO PLAYER PREVIEW CONTAINER */}
      <View className="relative h-64 w-full bg-slate-950">
        {Platform.OS === 'web' ? (
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        ) : (
          <Pressable onPress={playVideo} className="relative h-full w-full active:opacity-90">
            <Image
              source={{ uri: video.thumbnail_url }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 items-center justify-center bg-black/40">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-arsenal-red shadow-2xl">
                <Ionicons name="play" size={32} color="#FFFFFF" style={{ marginLeft: 4 }} />
              </View>
              <Text className="mt-2 text-xs font-extrabold tracking-wider text-white">
                TAP TO PLAY
              </Text>
            </View>
            <View className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5">
              <Text className="text-xs font-bold text-white">{video.duration}</Text>
            </View>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 50 }}>
        {/* VIDEO DETAILS */}
        <View className="border-b border-arsenal-cardBorder bg-arsenal-card p-4">
          <View className="mb-1.5 flex-row items-center">
            <View className="mr-2 rounded bg-arsenal-red px-2.5 py-0.5">
              <Text className="text-[10px] font-black uppercase text-white">{video.category}</Text>
            </View>
            <Text className="text-xs font-medium text-slate-400">
              {video.duration} • {video.views_count}
            </Text>
          </View>

          <Text className="mt-1 text-lg font-black leading-snug text-white">{video.title}</Text>

          <Text className="mt-2 text-xs text-slate-400">
            Published{' '}
            {new Date(video.published_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          {/* Action Button */}
          <Pressable
            onPress={playVideo}
            className="mt-4 flex-row items-center justify-center rounded-xl bg-arsenal-red px-4 py-3 shadow-lg active:opacity-85">
            <Ionicons name="play" size={18} color="#FFFFFF" />
            <Text className="ml-2 text-xs font-black uppercase tracking-wider text-white">
              Watch Highlight ({video.duration})
            </Text>
          </Pressable>

          {/* External YouTube App link */}
          <Pressable
            onPress={() => Linking.openURL(watchUrl)}
            className="mt-2.5 flex-row items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 active:opacity-80">
            <Ionicons name="logo-youtube" size={16} color="#EF4444" />
            <Text className="ml-2 text-xs font-bold text-slate-200">Open in YouTube App</Text>
          </Pressable>
        </View>

        {/* RELATED VIDEOS */}
        <View className="p-4">
          <Text className="mb-3 text-sm font-black uppercase tracking-wider text-white">
            More From Arsenal TV
          </Text>

          {relatedVideos
            .filter((v) => v.id !== video.id)
            .slice(0, 4)
            .map((v) => (
              <Pressable
                key={v.id}
                onPress={() => router.replace(`/video/${v.id}`)}
                className="mb-2.5 flex-row items-center rounded-xl border border-arsenal-cardBorder bg-arsenal-card p-3 active:opacity-85">
                <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-arsenal-red/80">
                  <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-white" numberOfLines={2}>
                    {v.title}
                  </Text>
                  <Text className="mt-1 text-[10px] text-slate-400">
                    {v.category} • {v.duration}
                  </Text>
                </View>
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
