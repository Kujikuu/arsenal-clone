import React from 'react';
import { Text, View, type TextProps, type TextStyle } from 'react-native';
import { FONT } from '@/theme/palette';

interface Props extends TextProps {
  size: number;
  color?: string;
  /**
   * Michroma only ships one weight. Drawing the same glyphs a hair to the right
   * thickens the vertical strokes to match the semi-bold face in the refs.
   */
  heavy?: boolean;
}

/** Wide squared display face: wordmark, player names, "FULL TIME", stat values. */
export function DisplayText({
  size,
  color = '#FFFFFF',
  heavy = true,
  style,
  children,
  ...rest
}: Props) {
  const base: TextStyle = {
    fontFamily: FONT.display,
    fontSize: size,
    color,
    letterSpacing: -0.4,
  };

  if (!heavy) {
    return (
      <Text {...rest} style={[base, style]}>
        {children}
      </Text>
    );
  }

  const shift = Math.max(0.5, size * 0.06);
  return (
    <View>
      <Text {...rest} style={[base, style]}>
        {children}
      </Text>
      <Text
        {...rest}
        accessible={false}
        importantForAccessibility="no"
        style={[base, style, { position: 'absolute', left: shift, right: -shift, top: 0 }]}>
        {children}
      </Text>
    </View>
  );
}
