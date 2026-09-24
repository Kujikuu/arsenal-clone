import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { DisplayText } from '@/components/ui/DisplayText';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { MediaPills } from '@/components/media/MediaPills';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { ReactionBadge } from '@/components/media/ReactionBadge';
import { VideoCard } from '@/components/media/VideoCard';
import { useArticles } from '@/lib/api/articles';
import { useExperiences } from '@/lib/api/experiences';
import { useGalleries } from '@/lib/api/photos';
import { useQuizzes } from '@/lib/api/quizzes';
import { useReactions } from '@/lib/api/reactions';
import { useVideoRails, useVideos } from '@/lib/api/videos';
import type { QueryResult } from '@/lib/api/useQuery';
import { formatPrice, formatPublished } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import type { ContentTeamType } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const TEAM_CATS = ['ALL', 'MEN', 'WOMEN', 'ACADEMY', 'CLUB'] as const;
const MEDIA_PILLS = ['NEWS', 'VIDEO', 'PHOTOS', 'QUIZ', 'EXPERIENCES'] as const;
type TeamCat = (typeof TEAM_CATS)[number];
type MediaPill = (typeof MEDIA_PILLS)[number];

const TEAM_FILTER: Record<TeamCat, ContentTeamType | null> = {
  ALL: null,
  MEN: 'men',
  WOMEN: 'women',
  ACADEMY: 'academy',
  CLUB: 'club',
};

interface ModuleProps {
  teamType: ContentTeamType | null;
  /** Lets the screen's pull-to-refresh reach the module's query. */
  register: (refetch: () => Promise<void>) => void;
}

/** Loading, error and empty handling shared by every module. */
function QueryView<T>({
  query,
  emptyTitle,
  children,
}: {
  query: QueryResult<T[]>;
  emptyTitle: string;
  children: (items: T[]) => React.ReactNode;
}) {
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  if (query.loading && !query.data?.length) return <LoadingState />;
  if (!query.data?.length) {
    return <EmptyState icon="albums-outline" title={emptyTitle} message="Try another team." />;
  }
  return <>{children(query.data)}</>;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <Text
      className="font-body-semibold text-white"
      style={{ fontSize: 20, marginLeft: 16, marginBottom: 22 }}>
      {children}
    </Text>
  );
}

function RailsModule({ teamType, register }: ModuleProps) {
  const router = useRouter();
  const rails = useVideoRails(teamType);
  useEffect(() => {
    register(rails.refetch);
  }, [register, rails.refetch]);
  const ids = (rails.data ?? []).flatMap((r) => r.videos.map((v) => v.id));
  const reactions = useReactions('video', ids);

  return (
    <QueryView query={rails} emptyTitle="No videos yet">
      {(items) => (
        <View style={{ paddingTop: 2 }}>
          {items.map(({ collection, videos }) => (
            <View key={collection.id} style={{ marginBottom: 40 }}>
              <SectionHeading>{collection.title}</SectionHeading>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}>
                {videos.map((video) => {
                  const r = reactions.get(video.id, video.reactions_base);
                  return (
                    <VideoCard
                      key={video.id}
                      video={video}
                      reactions={r.total}
                      reacted={r.reacted}
                      onPress={() => router.push(`/video/${video.id}`)}
                    />
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </View>
      )}
    </QueryView>
  );
}

function NewsModule({ teamType, register }: ModuleProps) {
  const router = useRouter();
  const articles = useArticles(teamType);
  useEffect(() => {
    register(articles.refetch);
  }, [register, articles.refetch]);
  const reactions = useReactions(
    'article',
    (articles.data ?? []).map((a) => a.id)
  );

  return (
    <QueryView query={articles} emptyTitle="No news yet">
      {(items) => (
        <View style={{ paddingHorizontal: 16, paddingTop: 26 }}>
          {items.map((item) => {
            const r = reactions.get(item.id, item.reactions_base);
            return (
              <View key={item.id} style={{ marginBottom: 16 }}>
                <MediaRowCard
                  title={item.title}
                  image={resolveImage(item.image_url) ?? { uri: item.image_url }}
                  height={113}
                  onPress={() => router.push(`/article/${item.id}`)}
                  footer={
                    <Pressable
                      onPress={() => reactions.toggle(item.id)}
                      hitSlop={8}
                      accessibilityLabel="React"
                      style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                      <ReactionBadge
                        kind={item.reaction_kind}
                        count={r.total}
                        color={r.reacted ? ARSENAL.red : '#FFF'}
                      />
                    </Pressable>
                  }
                />
              </View>
            );
          })}
        </View>
      )}
    </QueryView>
  );
}

function VideoModule({ teamType, register }: ModuleProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const videos = useVideos(teamType);
  useEffect(() => {
    register(videos.refetch);
  }, [register, videos.refetch]);
  const reactions = useReactions(
    'video',
    (videos.data ?? []).map((v) => v.id)
  );
  const cardWidth = (width - 16 * 2 - 12) / 2;

  return (
    <QueryView query={videos} emptyTitle="No videos yet">
      {(items) => (
        <View className="flex-row flex-wrap" style={{ paddingLeft: 16, paddingTop: 22 }}>
          {items.map((video) => {
            const r = reactions.get(video.id, video.reactions_base);
            return (
              <View key={video.id} style={{ marginBottom: 12 }}>
                <VideoCard
                  video={video}
                  width={cardWidth}
                  reactions={r.total}
                  reacted={r.reacted}
                  onPress={() => router.push(`/video/${video.id}`)}
                />
              </View>
            );
          })}
        </View>
      )}
    </QueryView>
  );
}

function CoverCard({
  image,
  eyebrow,
  title,
  detail,
  onPress,
}: {
  image: string;
  eyebrow: string;
  title: string;
  detail?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{ borderRadius: 6, backgroundColor: ARSENAL.surfaceRaised, marginBottom: 16 }}
      className="overflow-hidden active:opacity-85">
      <Image
        source={resolveImage(image)}
        style={{ width: '100%', height: 190 }}
        resizeMode="cover"
      />
      <View style={{ padding: 14 }}>
        <DisplayText size={10.5} color="#C8C6C7" heavy={false}>
          {eyebrow}
        </DisplayText>
        <Text className="font-body-semibold text-white" style={{ fontSize: 18, marginTop: 6 }}>
          {title}
        </Text>
        {detail ? (
          <Text
            className="font-body"
            style={{ fontSize: 14, color: ARSENAL.textMuted, marginTop: 4 }}>
            {detail}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function PhotosModule({ teamType, register }: ModuleProps) {
  const router = useRouter();
  const galleries = useGalleries(teamType);
  useEffect(() => {
    register(galleries.refetch);
  }, [register, galleries.refetch]);
  return (
    <QueryView query={galleries} emptyTitle="No galleries yet">
      {(items) => (
        <View style={{ paddingHorizontal: 16, paddingTop: 22 }}>
          {items.map((g) => (
            <CoverCard
              key={g.id}
              image={g.cover_url}
              eyebrow={`GALLERY · ${formatPublished(g.published_at)}`}
              title={g.title}
              onPress={() => router.push(`/gallery/${g.id}`)}
            />
          ))}
        </View>
      )}
    </QueryView>
  );
}

function QuizModule({ teamType, register }: ModuleProps) {
  const router = useRouter();
  const quizzes = useQuizzes(teamType);
  useEffect(() => {
    register(quizzes.refetch);
  }, [register, quizzes.refetch]);
  return (
    <QueryView query={quizzes} emptyTitle="No quizzes yet">
      {(items) => (
        <View style={{ paddingHorizontal: 16, paddingTop: 22 }}>
          {items.map((q) => (
            <CoverCard
              key={q.id}
              image={q.cover_url}
              eyebrow="QUIZ"
              title={q.title}
              detail={q.description}
              onPress={() => router.push(`/quiz/${q.id}`)}
            />
          ))}
        </View>
      )}
    </QueryView>
  );
}

function ExperiencesModule({ register }: ModuleProps) {
  const router = useRouter();
  const experiences = useExperiences();
  useEffect(() => {
    register(experiences.refetch);
  }, [register, experiences.refetch]);
  return (
    <QueryView query={experiences} emptyTitle="No experiences available">
      {(items) => (
        <View style={{ paddingHorizontal: 16, paddingTop: 22 }}>
          {items.map((e) => (
            <CoverCard
              key={e.id}
              image={e.image_url}
              eyebrow={`${e.category.toUpperCase()} · FROM ${formatPrice(e.price_gbp, 'GBP')}`}
              title={e.title}
              detail={e.subtitle}
              onPress={() => router.push(`/experience/${e.id}`)}
            />
          ))}
        </View>
      )}
    </QueryView>
  );
}

const MODULES: Record<MediaPill | 'RAILS', React.ComponentType<ModuleProps>> = {
  RAILS: RailsModule,
  NEWS: NewsModule,
  VIDEO: VideoModule,
  PHOTOS: PhotosModule,
  QUIZ: QuizModule,
  EXPERIENCES: ExperiencesModule,
};

/** Media hub (ref/video-all.jpeg, ref/video-news tab selected.jpeg). */
export default function MediaScreen() {
  const [teamCat, setTeamCat] = useState<TeamCat>('ALL');
  const [activePill, setActivePill] = useState<MediaPill | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const refetchRef = useRef<(() => Promise<void>) | null>(null);
  const register = useCallback((refetch: () => Promise<void>) => {
    refetchRef.current = refetch;
  }, []);

  const Module = MODULES[activePill ?? 'RAILS'];
  const teamType = TEAM_FILTER[teamCat];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchRef.current?.();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader bordered />

      <UnderlineTabs
        tabs={TEAM_CATS}
        value={teamCat}
        onChange={setTeamCat}
        variant="inline"
        scrollable
        gap={27}
        fontSize={16}
        height={58}
      />

      <MediaPills pills={MEDIA_PILLS} active={activePill} onChange={setActivePill} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ARSENAL.red} />
        }>
        <Module key={`${activePill}-${teamCat}`} teamType={teamType} register={register} />
        {activePill === 'EXPERIENCES' && teamType && teamType !== 'club' ? (
          <View className="flex-row items-center justify-center" style={{ marginTop: 4 }}>
            <Ionicons name="information-circle-outline" size={16} color={ARSENAL.textDim} />
            <Text
              className="font-body"
              style={{ fontSize: 13, color: ARSENAL.textDim, marginLeft: 6 }}>
              Experiences are open to every fan.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
