import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { YouTubePlayer } from '@/components/media/YouTubePlayer';
import { PALETTE } from '@/theme/palette';

interface Props {
  title: string;
  poster?: ImageSourcePropType;
  /** Without a duration the hero is a plain image with a back button. */
  duration?: string | null;
  /** Plays inline when set; otherwise play opens `watchUrl`. */
  youtubeId?: string | null;
  watchUrl?: string;
  /** Start playing as soon as the screen opens. */
  autoplay?: boolean;
  rightAction?: React.ReactNode;
}

/** Inline player chrome over the poster frame (ref/post detail.jpeg). */
export function VideoHero({
  title,
  poster,
  duration,
  youtubeId,
  watchUrl,
  autoplay,
  rightAction,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [playing, setPlaying] = useState(Boolean(autoplay && youtubeId));
  const height = (width * 9) / 16;

  return (
    <View style={{ paddingTop: insets.top + 43, backgroundColor: '#000' }}>
      <View style={{ width, height }}>
        {playing && youtubeId ? (
          <YouTubePlayer youtubeId={youtubeId} width={width} height={height} />
        ) : (
          <>
            <Image source={poster} style={{ width, height }} resizeMode="cover" />
            <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.28)' }} />
          </>
        )}

        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityLabel="Back"
          style={{ position: 'absolute', left: 22, top: 2 }}>
          <Feather name="chevron-left" size={30} color="#FFF" />
        </Pressable>

        {rightAction ? (
          <View style={{ position: 'absolute', right: 22, top: 2 }}>{rightAction}</View>
        ) : null}

        {duration && !playing ? (
          <VideoChrome
            title={title}
            duration={duration}
            playing={playing}
            onToggle={() => {
              if (youtubeId) setPlaying(true);
              else if (watchUrl) WebBrowser.openBrowserAsync(watchUrl);
            }}
          />
        ) : null}
      </View>
    </View>
  );
}

interface ChromeProps {
  title: string;
  duration: string;
  playing: boolean;
  onToggle: () => void;
}

function VideoChrome({ title, duration, playing, onToggle }: ChromeProps) {
  return (
    <>
      <Text
        className="font-body-semibold text-white"
        numberOfLines={1}
        ellipsizeMode="clip"
        style={{ position: 'absolute', left: 24, right: 0, top: 40, fontSize: 20 }}>
        {title}
      </Text>

      <Pressable
        onPress={onToggle}
        accessibilityLabel={playing ? 'Pause' : 'Play'}
        className="absolute inset-0 items-center justify-center">
        <Ionicons name={playing ? 'pause' : 'play'} size={52} color="#FFF" />
      </Pressable>

      <View
        style={{ position: 'absolute', left: 24, right: 24, bottom: 16 }}
        pointerEvents="box-none">
        <Text className="font-body text-white" style={{ fontSize: 13 }}>
          00:00:00/ {duration}
        </Text>
        <View
          style={{
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.35)',
            marginTop: 10,
            marginBottom: 14,
          }}>
          <View
            style={{
              position: 'absolute',
              left: -6,
              top: -6,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: PALETTE.red,
            }}
          />
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name={playing ? 'pause' : 'play'} size={20} color="#FFF" />
            <Ionicons name="volume-medium" size={22} color="#FFF" style={{ marginLeft: 22 }} />
          </View>
          <View className="flex-row items-center">
            <Ionicons name="settings-sharp" size={19} color="#FFF" />
            <Feather name="maximize" size={19} color="#FFF" style={{ marginLeft: 26 }} />
          </View>
        </View>
      </View>
    </>
  );
}
