import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DisplayText } from '@/components/ui/DisplayText';

export function BoltGlyph({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size * 0.72} height={size} viewBox="0 0 18 25">
      <Path d="M12.5 0 L1 14.2 H7.6 L4.6 25 L17 9.6 H10.2 Z" fill={color} />
    </Svg>
  );
}

/** "THE ⚡ ARSENAL" wordmark used in every top header (ref/*.jpeg). */
export function ArsenalWordmark({ size = 15.5 }: { size?: number }) {
  return (
    <View className="flex-row items-center">
      <DisplayText size={size}>THE</DisplayText>
      <View style={{ marginLeft: size * 0.3, marginRight: size * 0.42 }}>
        <BoltGlyph size={size * 1.55} />
      </View>
      <DisplayText size={size}>ARSENAL</DisplayText>
    </View>
  );
}
