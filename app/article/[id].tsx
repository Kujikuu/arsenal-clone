import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoHero } from '@/components/article/VideoHero';
import { ReactionIcon } from '@/components/media/ReactionBadge';
import { DisplayText } from '@/components/ui/DisplayText';
import { useArticle } from '@/lib/api/articles';
import { ARTICLE_FALLBACKS, type ArticleFallback } from '@/lib/data/media';
import type { Article } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

function formatPublished(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function fromArticle(article: Article): ArticleFallback {
  const [standfirst = '', ...paragraphs] = (article.content ?? '').split('\n\n').filter(Boolean);
  return {
    id: article.id,
    title: article.title,
    author: article.author,
    publishedLabel: formatPublished(article.published_at),
    poster: { uri: article.image_url },
    reaction: 'happy',
    reactions: 0,
    standfirst: article.subtitle || standfirst,
    paragraphs: article.subtitle ? [standfirst, ...paragraphs] : paragraphs,
  };
}

/** Article with an inline video header (ref/post detail.jpeg). */
export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { article, loading } = useArticle(id as string);
  const [reacted, setReacted] = useState(false);

  const fallback = ARTICLE_FALLBACKS[id as string];
  const data = article ? fromArticle(article) : fallback;

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-6">
        {loading ? (
          <ActivityIndicator size="large" color={ARSENAL.red} />
        ) : (
          <>
            <Text className="font-body-semibold text-lg text-white">Article not found</Text>
            <Pressable
              onPress={() => router.back()}
              style={{ backgroundColor: ARSENAL.red }}
              className="mt-6 rounded-full px-5 py-2.5">
              <Text className="font-body-semibold text-white">Go back</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
      <VideoHero title={data.title} poster={data.poster} duration={data.duration} />

      <View
        style={{
          backgroundColor: '#000',
          paddingHorizontal: 16,
          paddingTop: 30,
          paddingBottom: 22,
        }}>
        <DisplayText size={11} color="#C8C6C7" heavy={false}>
          {data.publishedLabel}
        </DisplayText>
        <Text
          className="font-body-semibold text-white"
          style={{ fontSize: 24, lineHeight: 26, marginTop: 8 }}>
          {data.title}
        </Text>
        <Text className="font-body text-white" style={{ fontSize: 16, marginTop: 6 }}>
          {data.author}
        </Text>
        <View style={{ height: 1, backgroundColor: '#BDBBBC', marginTop: 26, marginBottom: 20 }} />
        <Pressable
          onPress={() => setReacted((r) => !r)}
          accessibilityLabel="React"
          className="flex-row items-center self-start"
          style={{ marginLeft: 14 }}>
          <ReactionIcon kind={data.reaction} size={26} />
          <Text className="font-body text-white" style={{ fontSize: 15, marginLeft: 12 }}>
            {data.reactions + (reacted ? 1 : 0)}
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
          {data.standfirst}
        </Text>
        {data.paragraphs.map((p, i) => (
          <Text
            key={i}
            className="font-body"
            style={{ fontSize: 16.5, lineHeight: 24, color: '#111', marginTop: 12 }}>
            {p}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
