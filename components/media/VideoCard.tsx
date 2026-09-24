import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReactionBadge } from '@/components/media/ReactionBadge';
import { resolveImage } from '@/lib/media/resolveImage';
import type { Video } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

const CARD_WIDTH = 164;
const IMAGE_HEIGHT = 167;

/** Portrait video card with duration pill (ref/video-all.jpeg). */
interface Props {
  video: Pick<Video, 'title' | 'duration' | 'thumbnail_url'>;
  reactions: number;
  reacted?: boolean;
  onPress: () => void;
  /** Fixed width for rails; omit to fill the parent (grids). */
  width?: number;
}

export function VideoCard({ video, reactions, reacted, onPress, width = CARD_WIDTH }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        width,
        height: 293,
        borderRadius: 5,
        marginRight: 12,
        backgroundColor: ARSENAL.surfaceRaised,
      }}
      className="overflow-hidden active:opacity-85">
      <View style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={resolveImage(video.thumbnail_url)}
          style={{ width, height: IMAGE_HEIGHT }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            left: 8,
            bottom: 7,
            height: 21,
            borderRadius: 11,
            paddingHorizontal: 8,
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
      </View>
      <View
        className="flex-1 justify-between"
        style={{ padding: 9, paddingTop: 16, paddingBottom: 20 }}>
        <Text
          className="font-body-semibold text-white"
          style={{ fontSize: 16, lineHeight: 17.5 }}
          numberOfLines={3}>
          {video.title}
        </Text>
        <ReactionBadge
          kind="happy"
          count={reactions}
          size={19}
          color={reacted ? ARSENAL.red : '#FFF'}
        />
      </View>
    </Pressable>
  );
}
