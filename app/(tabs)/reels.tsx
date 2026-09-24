import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Share,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { useArticles } from '@/lib/api/articles';
import { REEL_STORIES, type ReelStory } from '@/lib/data/media';
import { TAB_BAR_CONTENT_HEIGHT } from '@/theme/arsenal';

const FEED_TABS = ['FOR YOU', 'LATEST'] as const;
type FeedTab = (typeof FEED_TABS)[number];

interface ScrimProps {
  id: string;
  width: number;
  height: number;
  from: number;
  to: number;
}

function Scrim({ id, width, height, from, to }: ScrimProps) {
  return (
    <Svg width={width} height={height} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#000" stopOpacity={String(from)} />
          <Stop offset="1" stopColor="#000" stopOpacity={String(to)} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill={`url(#${id})`} />
    </Svg>
  );
}

// The reel photo is cropped from ref/reels.jpeg starting just under the tabs.
const REEL_IMAGE_ASPECT = 470 / 550;
const REEL_IMAGE_TOP = 64;
const REEL_IMAGE_SCALE = 1.04;
const FADE_HEIGHT = 260;

interface StoryProps {
  story: ReelStory;
  width: number;
  height: number;
  topInset: number;
  bottomInset: number;
  onRead: () => void;
}

function Story({ story, width, height, topInset, bottomInset, onRead }: StoryProps) {
  const [reacted, setReacted] = useState(false);
  const imageWidth = width * REEL_IMAGE_SCALE;
  const imageHeight = imageWidth / REEL_IMAGE_ASPECT;
  const imageTop = topInset + REEL_IMAGE_TOP;
  const imageBottom = imageTop + imageHeight;
  const count = story.reactions + (reacted ? 1 : 0);

  const onShare = async () => {
    try {
      await Share.share({ message: `${story.title} - The Arsenal` });
    } catch (error) {
      console.warn('[Reels] Share failed:', error);
    }
  };

  return (
    <View style={{ height }}>
      <Image
        source={story.image}
        style={{
          position: 'absolute',
          top: imageTop,
          left: (width - imageWidth) / 2,
          width: imageWidth,
          height: imageHeight,
        }}
        resizeMode="cover"
      />
      <View style={{ position: 'absolute', left: 0, right: 0, top: imageTop }} pointerEvents="none">
        <Scrim id={`top-${story.id}`} width={width} height={110} from={1} to={0} />
      </View>
      <View
        style={{ position: 'absolute', left: 0, right: 0, top: imageBottom - FADE_HEIGHT }}
        pointerEvents="none">
        <Scrim id={`bottom-${story.id}`} width={width} height={FADE_HEIGHT} from={0} to={1} />
        <View style={{ height: Math.max(0, height - imageBottom), backgroundColor: '#000' }} />
      </View>

      <View
        style={{ position: 'absolute', right: 14, bottom: bottomInset + 250 }}
        className="items-center">
        <Pressable onPress={() => setReacted((r) => !r)} accessibilityLabel="React" hitSlop={8}>
          <MaterialCommunityIcons name="emoticon-happy-outline" size={32} color="#FFF" />
        </Pressable>
        <Text className="font-body" style={{ fontSize: 14, color: '#D0CECF', marginTop: 12 }}>
          {count}
        </Text>
        <Pressable
          onPress={onShare}
          accessibilityLabel="Share"
          hitSlop={8}
          style={{ marginTop: 38 }}>
          <Ionicons name="arrow-redo-outline" size={30} color="#D0CECF" />
        </Pressable>
      </View>

      <View style={{ position: 'absolute', left: 21, right: 60, bottom: bottomInset + 20 }}>
        <DisplayText size={11.5}>{story.tag}</DisplayText>
        <Text
          className="font-body-semibold text-white"
          style={{ fontSize: 23.5, lineHeight: 25, marginTop: 8 }}>
          {story.title}
        </Text>
        <Text
          className="font-body text-white"
          style={{ fontSize: 16, lineHeight: 24, marginTop: 4 }}>
          {story.subtitle}
        </Text>
        <Pressable
          onPress={onRead}
          accessibilityRole="button"
          style={{
            alignSelf: 'flex-start',
            height: 34,
            borderRadius: 17,
            paddingHorizontal: 20,
            marginTop: 20,
            backgroundColor: 'rgba(90,88,89,0.92)',
          }}
          className="items-center justify-center active:opacity-80">
          <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
            READ FULL ARTICLE
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Full-screen story feed (ref/reels.jpeg). */
export default function ReelsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [tab, setTab] = useState<FeedTab>('LATEST');
  const { articles } = useArticles();

  const stories = useMemo<ReelStory[]>(
    () => [
      ...REEL_STORIES,
      ...articles.map((a) => ({
        id: `article-${a.id}`,
        articleId: a.id,
        tag: (a.tag || a.category || 'NEWS').toUpperCase(),
        title: a.title,
        subtitle: a.subtitle ?? '',
        image: { uri: a.image_url },
        reactions: 0,
      })),
    ],
    [articles]
  );

  const bottomInset = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={stories}
        keyExtractor={(s) => s.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        renderItem={({ item }) => (
          <Story
            story={item}
            width={width}
            height={height}
            topInset={insets.top}
            bottomInset={bottomInset}
            onRead={() => router.push(`/article/${item.articleId}`)}
          />
        )}
      />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <TheArsenalHeader backgroundColor="transparent" />
        <View style={{ marginTop: -6 }}>
          <UnderlineTabs
            tabs={FEED_TABS}
            value={tab}
            onChange={setTab}
            variant="inline"
            gap={100}
            fontSize={15}
            height={46}
            bordered={false}
          />
        </View>
      </View>
    </View>
  );
}
