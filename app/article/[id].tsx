import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VideoHero } from '@/components/article/VideoHero';
import { ReactionIcon } from '@/components/media/ReactionBadge';
import { DisplayText } from '@/components/ui/DisplayText';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { AppHeader } from '@/components/AppHeader';
import { useArticle } from '@/lib/api/articles';
import { useBookmark } from '@/lib/api/bookmarks';
import { useReactions } from '@/lib/api/reactions';
import { videoWatchUrl } from '@/lib/api/videos';
import { formatPublished } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { PALETTE } from '@/theme/palette';
import { BRAND } from '@/lib/brand';

/** Article with an inline video header (ref/post detail.jpeg). */
export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: article, loading, error, refetch } = useArticle(id);
  const reactions = useReactions('article', id ? [id] : []);
  const bookmark = useBookmark({ articleId: id ?? '' });
  const { settings } = useSettings();

  if (!article) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="back" />
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState
            icon="newspaper-outline"
            title="Article not found"
            actionLabel="GO BACK"
            onAction={() => router.back()}
          />
        )}
      </View>
    );
  }

  const [first = '', ...rest] = article.content.split('\n\n').filter(Boolean);
  const standfirst = article.subtitle || first;
  const paragraphs = article.subtitle ? [first, ...rest].filter(Boolean) : rest;
  const reaction = reactions.get(article.id, article.reactions_base);

  const onShare = () =>
    Share.share({ message: `${article.title} - ${BRAND.appName}` }).catch((e) =>
      console.warn('[Article] share failed:', e)
    );

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
      <VideoHero
        title={article.title}
        poster={resolveImage(article.image_url)}
        duration={article.video_duration}
        youtubeId={article.youtube_id}
        watchUrl={article.video_duration ? videoWatchUrl(article) : undefined}
        autoplay={settings.autoplay_video}
        rightAction={
          <View className="flex-row items-center">
            <Pressable onPress={onShare} hitSlop={10} accessibilityLabel="Share" className="mr-5">
              <Ionicons name="arrow-redo-outline" size={25} color="#FFF" />
            </Pressable>
            <Pressable
              onPress={bookmark.toggle}
              hitSlop={10}
              accessibilityLabel={bookmark.saved ? 'Remove bookmark' : 'Bookmark'}>
              <Ionicons
                name={bookmark.saved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color="#FFF"
              />
            </Pressable>
          </View>
        }
      />

      <View
        style={{
          backgroundColor: '#000',
          paddingHorizontal: 16,
          paddingTop: 30,
          paddingBottom: 22,
        }}>
        <DisplayText size={11} color="#C8C6C7" heavy={false}>
          {formatPublished(article.published_at)}
        </DisplayText>
        <Text
          className="font-body-semibold text-white"
          style={{ fontSize: 24, lineHeight: 26, marginTop: 8 }}>
          {article.title}
        </Text>
        <Text className="font-body text-white" style={{ fontSize: 16, marginTop: 6 }}>
          {article.author}
        </Text>
        <View style={{ height: 1, backgroundColor: '#BDBBBC', marginTop: 26, marginBottom: 20 }} />
        <Pressable
          onPress={() => reactions.toggle(article.id)}
          accessibilityLabel={reaction.reacted ? 'Remove reaction' : 'React'}
          accessibilityState={{ selected: reaction.reacted }}
          className="flex-row items-center self-start"
          style={{ marginLeft: 14 }}>
          <ReactionIcon
            kind={article.reaction_kind}
            size={26}
            color={reaction.reacted ? PALETTE.red : '#FFF'}
          />
          <Text className="font-body text-white" style={{ fontSize: 15, marginLeft: 12 }}>
            {reaction.total}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: '#FFF',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 40,
        }}>
        <Text
          className="font-body-semibold"
          style={{ fontSize: 16.5, lineHeight: 24, color: '#111' }}>
          {standfirst}
        </Text>
        {paragraphs.map((p, i) => (
          <Text
            key={i}
            className="font-body"
            style={{ fontSize: 16.5, lineHeight: 24, color: '#111', marginTop: 12 }}>
            {p}
          </Text>
        ))}
        {article.match_id ? (
          <Pressable
            onPress={() => router.push(`/match/${article.match_id}`)}
            accessibilityRole="button"
            style={{ height: 40, borderRadius: 20, backgroundColor: '#111', marginTop: 28 }}
            className="items-center justify-center self-start px-6 active:opacity-80">
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 13, letterSpacing: 0.4 }}>
              MATCH CENTRE
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}
