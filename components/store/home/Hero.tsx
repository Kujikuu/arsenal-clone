import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { StoreButton } from '@/components/store/ui/Buttons';
import { DisplayText } from '@/components/ui/DisplayText';

interface Props {
  title: string;
  subtitle?: string;
  cta?: string;
  href?: string;
}

/** Approximate Michroma advance widths in ems, so each word fits one line. */
const glyphUnits = (w: string) =>
  [...w].reduce(
    (n, c) => n + (c === '%' ? 1.9 : /[MW]/i.test(c) ? 1.35 : /[()I1]/.test(c) ? 0.6 : 1.12),
    0
  );

/** Full-bleed campaign banner with the store's blue-to-pink gradient. */
export function Hero({ title, subtitle, cta = 'Shop all', href = '/store/c/sale' }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const height = Math.round(width * 1.4);
  const words = title.split(' ');
  return (
    <View style={{ width, height }} accessibilityRole="header">
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="hero" x1="0" y1="0" x2="0.55" y2="1">
            <Stop offset="0" stopColor="#0D5BA8" />
            <Stop offset="0.45" stopColor="#35A7DB" />
            <Stop offset="0.8" stopColor="#8E7BC4" />
            <Stop offset="1" stopColor="#F28AB0" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#hero)" />
      </Svg>
      <View
        style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 44, justifyContent: 'flex-end' }}>
        {words.map((w, i) => {
          // Michroma glyphs are roughly as wide as they are tall: fit each word to the width.
          const small = w.startsWith('(');
          const size = Math.min(small ? width * 0.07 : width * 0.3, (width - 40) / glyphUnits(w));
          return (
            <DisplayText
              key={`${w}-${i}`}
              size={size}
              style={{ lineHeight: size * 1.08, textAlign: small ? 'right' : 'left' }}>
              {w.toUpperCase()}
            </DisplayText>
          );
        })}
        {subtitle ? (
          <Text
            className="font-body-semibold"
            style={{ color: '#FFF', fontSize: 10.5, marginTop: 10, letterSpacing: 0.4 }}>
            {subtitle.toUpperCase()}
          </Text>
        ) : null}
        <View style={{ marginTop: 28, alignSelf: 'flex-start' }}>
          <StoreButton label={cta} height={40} onPress={() => router.push(href as never)} />
        </View>
      </View>
    </View>
  );
}
