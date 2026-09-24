import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { MediaPills } from '@/components/media/MediaPills';
import { MediaRowCard } from '@/components/media/MediaRowCard';
import { ReactionBadge } from '@/components/media/ReactionBadge';
import { VideoCard } from '@/components/media/VideoCard';
import { useArticles } from '@/lib/api/articles';
import { useVideos } from '@/lib/api/videos';
import { MATCH_VIDEOS, MUST_WATCH, NEWS_ITEMS, type VideoCardItem } from '@/lib/data/media';
import { ARSENAL } from '@/theme/arsenal';

const TEAM_CATS = ['ALL', 'MEN', 'WOMEN', 'ACADEMY', 'CLUB'] as const;
const MEDIA_PILLS = ['NEWS', 'VIDEO', 'PHOTOS', 'QUIZ', 'EXPERIENCES'] as const;
type TeamCat = (typeof TEAM_CATS)[number];
type MediaPill = (typeof MEDIA_PILLS)[number];

function VideoRail({
  title,
  items,
  onOpen,
}: {
  title: string;
  items: VideoCardItem[];
  onOpen: (id: string) => void;
}) {
  return (
    <View style={{ marginBottom: 40 }}>
      <Text
        className="font-body-semibold text-white"
        style={{ fontSize: 20, marginLeft: 16, marginBottom: 22 }}>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}>
        {items.map((item) => (
          <VideoCard key={item.id} item={item} onPress={() => onOpen(item.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

/** Media hub (ref/video-all.jpeg, ref/video-news tab selected.jpeg). */
export default function MediaScreen() {
  const router = useRouter();
  const [teamCat, setTeamCat] = useState<TeamCat>('ALL');
  const [activePill, setActivePill] = useState<MediaPill | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { refetch: refetchArticles } = useArticles();
  const { refetch: refetchVideos } = useVideos();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchArticles(), refetchVideos()]);
    setRefreshing(false);
  };

  const openVideo = (id: string) => router.push(`/video/${id}`);

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
        {activePill === 'NEWS' ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 26 }}>
            {NEWS_ITEMS.map((item) => (
              <View key={item.id} style={{ marginBottom: 16 }}>
                <MediaRowCard
                  title={item.title}
                  image={item.image}
                  height={113}
                  onPress={() => router.push(`/article/${item.id}`)}
                  footer={
                    <View style={{ marginTop: 10 }}>
                      <ReactionBadge kind={item.reaction} count={item.reactions} />
                    </View>
                  }
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingTop: 2 }}>
            <VideoRail title="Must Watch" items={MUST_WATCH} onOpen={openVideo} />
            <VideoRail
              title="Arsenal Women 1 - 0 HB Køge"
              items={MATCH_VIDEOS}
              onOpen={openVideo}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
