import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { ZigzagPattern } from '@/components/ui/ZigzagPattern';
import { DisplayText } from '@/components/ui/DisplayText';
import type { PlayerPhoto } from '@/lib/data/playerPhotos';
import { ARSENAL } from '@/theme/arsenal';

export interface PlayerCardData {
  shirtNumber: number | string;
  firstName: string;
  lastName: string;
  nationality: string;
  flag: string;
  photo: PlayerPhoto;
}

interface Props {
  player: PlayerCardData;
  height?: number;
  onPress?: () => void;
}

const RIGHT_INSET = 0;

function PanelPhoto({ photo, height }: { photo: PlayerPhoto; height: number }) {
  const width = height * (photo.aspect ?? 1);
  const fade = width * 0.22;
  return (
    <View style={{ position: 'absolute', right: RIGHT_INSET, top: 0, width, height }}>
      <Image source={photo.source} style={{ width, height }} resizeMode="cover" />
      <Svg width={fade} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="panelFade" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={ARSENAL.surface} stopOpacity="1" />
            <Stop offset="1" stopColor={ARSENAL.surface} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={fade} height={height} fill="url(#panelFade)" />
      </Svg>
    </View>
  );
}

/** Number, stacked name, flag and photo on a zigzag background (ref/match-players.jpeg). */
export function PlayerCard({ player, height = 190, onPress }: Props) {
  const [width, setWidth] = useState(0);
  const { photo } = player;

  const body = (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height, backgroundColor: ARSENAL.surface }}
      className="flex-row overflow-hidden">
      {width > 0 && (
        <ZigzagPattern
          width={width}
          height={height}
          run={height * 0.55}
          rise={height * 0.62}
          spacing={height * 0.62}
          color="#7A1419"
          strokeWidth={1.4}
          opacity={0.9}
        />
      )}

      {photo.kind === 'panel' ? (
        <PanelPhoto photo={photo} height={height} />
      ) : (
        <Image
          source={photo.source}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 0,
            width: height * 0.9,
            height: height - 4,
          }}
          resizeMode="contain"
        />
      )}

      <View className="flex-1 justify-center" style={{ paddingLeft: 17, paddingTop: 34 }}>
        <DisplayText size={18} color={ARSENAL.red}>
          {player.shirtNumber}
        </DisplayText>
        <DisplayText size={11.5} style={{ marginTop: 8, lineHeight: 14 }}>
          {player.firstName.toUpperCase()}
        </DisplayText>
        <DisplayText size={11.5} style={{ lineHeight: 14 }}>
          {player.lastName.toUpperCase()}
        </DisplayText>
        <View className="flex-row items-center" style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18 }}>{player.flag}</Text>
          <Text className="font-body" style={{ fontSize: 15, color: '#C8C6C7', marginLeft: 10 }}>
            {player.nationality}
          </Text>
        </View>
      </View>
    </View>
  );

  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="active:opacity-85">
      {body}
    </Pressable>
  );
}
