import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReactionBadge } from '@/components/media/ReactionBadge';
import type { VideoCardItem } from '@/lib/data/media';
import { ARSENAL } from '@/theme/arsenal';

const CARD_WIDTH = 164;
const IMAGE_HEIGHT = 167;

/** Portrait video card with duration pill (ref/video-all.jpeg). */
export function VideoCard({ item, onPress }: { item: VideoCardItem; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        width: CARD_WIDTH,
        height: 293,
        borderRadius: 5,
        marginRight: 12,
        backgroundColor: ARSENAL.surfaceRaised,
      }}
      className="overflow-hidden active:opacity-85">
      <View style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={item.image}
          style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}
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
            {item.duration}
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
          {item.title}
        </Text>
        <ReactionBadge kind="happy" count={item.reactions} size={19} />
      </View>
    </Pressable>
  );
}
