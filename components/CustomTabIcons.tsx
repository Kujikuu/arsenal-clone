import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { BoltGlyph } from '@/components/ui/ArsenalWordmark';
import { ARSENAL } from '@/theme/arsenal';

const tint = (focused: boolean) => (focused ? ARSENAL.red : ARSENAL.iconInactive);

/** Filled pitch with black markings (ref/match-fixtures.jpeg). */
export function PitchTabIcon({ focused }: { focused: boolean }) {
  return (
    <Svg width={34} height={24} viewBox="0 0 34 24">
      <Rect x={0} y={0} width={34} height={24} rx={1.5} fill={tint(focused)} />
      <Rect x={-1} y={6.5} width={6} height={11} fill="none" stroke="#000" strokeWidth={1.6} />
      <Rect x={29} y={6.5} width={6} height={11} fill="none" stroke="#000" strokeWidth={1.6} />
      <Path d="M17 0 V24" stroke="#000" strokeWidth={1.6} />
      <Circle cx={17} cy={12} r={4.2} fill="none" stroke="#000" strokeWidth={1.6} />
    </Svg>
  );
}

/** Stacked cards with a play button (ref/video-all.jpeg). */
export function MediaTabIcon({ focused }: { focused: boolean }) {
  const c = tint(focused);
  return (
    <Svg width={32} height={28} viewBox="0 0 32 28">
      <Rect x={3} y={0} width={26} height={2} fill={c} />
      <Rect x={1.5} y={4} width={29} height={2} fill={c} />
      <Rect x={0} y={8} width={32} height={20} rx={1.5} fill={c} />
      <Path d="M12.5 12.5 L21.5 18 L12.5 23.5 Z" fill="#000" />
    </Svg>
  );
}

/** Rounded square with the bolt (ref/reels.jpeg active, others inactive). */
export function CenterBoltTabIcon({ focused }: { focused: boolean }) {
  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 9,
        backgroundColor: focused ? ARSENAL.red : ARSENAL.iconInactive,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <BoltGlyph size={26} color={focused ? '#FFFFFF' : '#000000'} />
    </View>
  );
}

/** Shopping bag (ref/match-fixtures.jpeg). */
export function StoreTabIcon({ focused }: { focused: boolean }) {
  const c = tint(focused);
  return (
    <Svg width={28} height={30} viewBox="0 0 28 30">
      <Path
        d="M9 9 V6.5 a5 5 0 0 1 10 0 V9"
        fill="none"
        stroke={c}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path d="M4 9 H24 L27 30 H1 Z" fill={c} />
    </Svg>
  );
}

/** Filled user circle (ref/profile.jpeg). */
export function ProfileTabIcon({ focused }: { focused: boolean }) {
  const c = tint(focused);
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Circle cx={15} cy={15} r={15} fill={c} />
      <Circle cx={15} cy={11} r={5.2} fill="#000" />
      <Path d="M5 27.5 a10 9 0 0 1 20 0 Z" fill="#000" />
    </Svg>
  );
}
