import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { PALETTE } from '@/theme/palette';

interface Props {
  uri?: string | null;
  name: string;
  size: number;
}

/** Club crest with a lettered roundel if the image is missing or fails to load. */
export function TeamLogo({ uri, name, size }: Props) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    const initials = name
      .replace(/ (Women|U21|U19|U18)$/, '')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: PALETTE.chip,
        }}
        className="items-center justify-center">
        <Text className="font-body-bold text-white" style={{ fontSize: size * 0.32 }}>
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      resizeMode="contain"
      onError={() => setFailed(true)}
      accessibilityLabel={name}
    />
  );
}
