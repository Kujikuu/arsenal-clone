import React from 'react';
import { View, Text, Image, Pressable, type ImageSourcePropType } from 'react-native';
import { PALETTE } from '@/theme/palette';

interface Props {
  title: string;
  image: ImageSourcePropType;
  height?: number;
  footer?: React.ReactNode;
  onPress: () => void;
}

/** Half image / half title card used in search and the NEWS feed (ref/search.jpeg). */
export function MediaRowCard({ title, image, height = 118, footer, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{ height, borderRadius: 5, backgroundColor: PALETTE.surfaceRaised, marginBottom: 9 }}
      className="flex-row overflow-hidden active:opacity-85">
      <Image source={image} style={{ width: '50%', height }} resizeMode="cover" />
      <View className="flex-1 justify-center" style={{ paddingHorizontal: 13 }}>
        <Text
          className="font-body-semibold text-white"
          style={{ fontSize: 16.5, lineHeight: 19 }}
          numberOfLines={3}>
          {title}
        </Text>
        {footer}
      </View>
    </Pressable>
  );
}
