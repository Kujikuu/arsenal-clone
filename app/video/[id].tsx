import React from 'react';
import { View, Text, ScrollView, Pressable, Share, Image, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { ReactionIcon } from '@/components/media/ReactionBadge';
import { canPlayInline, YouTubePlayer } from '@/components/media/YouTubePlayer';
import { DisplayText } from '@/components/ui/DisplayText';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useBookmark } from '@/lib/api/bookmarks';
import { useReactions } from '@/lib/api/reactions';
import { useVideo, videoWatchUrl } from '@/lib/api/videos';
import { formatPublished } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { ARSENAL } from '@/theme/arsenal';

export default function VideoPlayerModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const { data, loading, error, refetch } = useVideo(id);
  const reactions = useReactions('video', id ? [id] : []);
  const bookmark = useBookmark({ videoId: id ?? '' });
  const [playing, setPlaying] = React.useState(false);

  const video = data?.video;
  const header = (
    <TheArsenalHeader
      left="close"
      title={<DisplayText size={14}>ARSENAL TV</DisplayText>}
      rightAction={
        video ? (
          <Pressable
            onPress={() =>
              Share.share({ message: `${video.title} - ${videoWatchUrl(video)}` }).catch(() => {})
            }
            hitSlop={10}
            accessibilityLabel="Share">
            <Ionicons name="arrow-redo-outline" size={26} color="#FFF" />
          </Pressable>
        ) : undefined
      }
    />
  );

  if (!video) {
    return (
      <View className="flex-1 bg-black">
        {header}
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState icon="videocam-off-outline" title="Video not found" />
        )}
      </View>
    );
  }

  const height = (width * 9) / 16;
  const reaction = reactions.get(video.id, video.reactions_base);
  const inline = Boolean(video.youtube_id) && canPlayInline();
  const showPlayer = inline && (playing || settings.autoplay_video);

  const play = () => {
    if (inline) setPlaying(true);
    else WebBrowser.openBrowserAsync(videoWatchUrl(video));
  };

  return (
    <View className="flex-1 bg-black">
      {header}

      {showPlayer && video.youtube_id ? (
        <YouTubePlayer youtubeId={video.youtube_id} width={width} height={height} />
      ) : (
        <Pressable onPress={play} accessibilityLabel="Play video" style={{ width, height }}>
          <Image
            source={resolveImage(video.thumbnail_url)}
            style={{ width, height }}
            resizeMode="cover"
          />
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View
              style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: ARSENAL.red }}
              className="items-center justify-center">
              <Ionicons name="play" size={30} color="#FFF" style={{ marginLeft: 4 }} />
            </View>
            {!inline && (
              <Text
                className="font-body-semibold text-white"
                style={{ fontSize: 12, marginTop: 10, letterSpacing: 0.5 }}>
                WATCH ON YOUTUBE
              </Text>
            )}
          </View>
          <View
            style={{
              position: 'absolute',
              right: 12,
              bottom: 12,
              borderRadius: 11,
              paddingHorizontal: 8,
              height: 22,
              backgroundColor: 'rgba(255,255,255,0.88)',
            }}
            className="flex-row items-center">
            <Ionicons name="play" size={11} color="#000" />
            <Text
              className="font-body-semibold"
              style={{ fontSize: 13, color: '#000', marginLeft: 4 }}>
              {video.duration}
            </Text>
          </View>
        </Pressable>
      )}

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: ARSENAL.divider }}>
          <DisplayText size={11} color="#C8C6C7" heavy={false}>
            {`${video.category.toUpperCase()} · ${formatPublished(video.published_at)}`}
          </DisplayText>
          <Text
            className="font-body-semibold text-white"
            style={{ fontSize: 22, lineHeight: 26, marginTop: 10 }}>
            {video.title}
          </Text>
          <Text
            className="font-body"
            style={{ fontSize: 14, color: ARSENAL.textMuted, marginTop: 6 }}>
            {video.duration}
            {video.views_count ? ` · ${video.views_count}` : ''}
          </Text>
          <View className="flex-row items-center" style={{ marginTop: 18 }}>
            <Pressable
              onPress={() => reactions.toggle(video.id)}
              accessibilityLabel={reaction.reacted ? 'Remove reaction' : 'React'}
              className="flex-row items-center">
              <ReactionIcon
                kind="happy"
                size={24}
                color={reaction.reacted ? ARSENAL.red : '#FFF'}
              />
              <Text className="font-body text-white" style={{ fontSize: 15, marginLeft: 8 }}>
                {reaction.total}
              </Text>
            </Pressable>
            <Pressable
              onPress={bookmark.toggle}
              accessibilityLabel={bookmark.saved ? 'Remove bookmark' : 'Bookmark'}
              style={{ marginLeft: 26 }}
              className="flex-row items-center">
              <Ionicons
                name={bookmark.saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color="#FFF"
              />
              <Text className="font-body text-white" style={{ fontSize: 15, marginLeft: 6 }}>
                {bookmark.saved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
            {video.match_id ? (
              <Pressable
                onPress={() => router.push(`/match/${video.match_id}`)}
                accessibilityRole="button"
                style={{
                  marginLeft: 'auto',
                  height: 32,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  backgroundColor: ARSENAL.button,
                }}
                className="items-center justify-center">
                <Text className="font-body-semibold text-white" style={{ fontSize: 12 }}>
                  MATCH CENTRE
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {data.related.length > 0 && (
          <View style={{ padding: 16 }}>
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 20, marginBottom: 16 }}>
              Up next
            </Text>
            {data.related.map((v) => (
              <MediaRowCard
                key={v.id}
                title={v.title}
                image={resolveImage(v.thumbnail_url) ?? { uri: v.thumbnail_url }}
                height={96}
                onPress={() => router.replace(`/video/${v.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
