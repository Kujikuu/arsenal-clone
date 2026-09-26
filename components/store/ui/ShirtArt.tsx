import React from 'react';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { KitFont } from '@/types/database';
import { FONT } from '@/theme/palette';

interface KitStyle {
  body: string;
  sleeves: string;
  trim: string;
  print: string;
  /** Optional pattern drawn over the body. */
  pattern?: 'zigzag' | 'stripes' | 'hoops';
  patternColor?: string;
}

export const KIT_STYLES: Record<string, KitStyle> = {
  home: { body: '#DB0007', sleeves: '#FFFFFF', trim: '#8C0A12', print: '#FFFFFF' },
  away: { body: '#1B2A4A', sleeves: '#1B2A4A', trim: '#C9A646', print: '#C9A646' },
  third: { body: '#F3E6A2', sleeves: '#F3E6A2', trim: '#7A1F2B', print: '#7A1F2B' },
  gk: { body: '#B7E34A', sleeves: '#B7E34A', trim: '#1B1B1B', print: '#1B1B1B' },
  prematch: {
    body: '#8C0A12',
    sleeves: '#8C0A12',
    trim: '#FFFFFF',
    print: '#FFFFFF',
    pattern: 'stripes',
    patternColor: 'rgba(255,255,255,0.18)',
  },
  training: { body: '#22263A', sleeves: '#22263A', trim: '#DB0007', print: '#FFFFFF' },
  'training-euro': { body: '#111111', sleeves: '#DB0007', trim: '#DB0007', print: '#FFFFFF' },
  'retro-9193': {
    body: '#F4C430',
    sleeves: '#F4C430',
    trim: '#1B2A6B',
    print: '#1B2A6B',
    pattern: 'zigzag',
    patternColor: '#1B2A6B',
  },
  'retro-home': { body: '#D50A0A', sleeves: '#FFFFFF', trim: '#FFFFFF', print: '#FFFFFF' },
  'retro-7172': { body: '#F7D117', sleeves: '#F7D117', trim: '#1E4FA0', print: '#1E4FA0' },
};

export interface ShirtSpec {
  style: string;
  back: boolean;
  champions: boolean;
}

/** Parses `shirt:<style>[:back][:champions]` image URLs. */
export function parseShirtUrl(url?: string | null): ShirtSpec | null {
  if (!url?.startsWith('shirt:')) return null;
  const [, style, ...flags] = url.split(':');
  return { style, back: flags.includes('back'), champions: flags.includes('champions') };
}

const FONT_FAMILY: Record<KitFont, string> = {
  premier_league: FONT.bodyBold,
  arsenal: FONT.display,
  pride: FONT.bodyMedium,
};

const SLEEVE_L = 'M62 34 L24 58 L40 92 L62 80 Z';
const SLEEVE_R = 'M138 34 L176 58 L160 92 L138 80 Z';
const BODY_FRONT = 'M62 34 L84 24 Q100 38 116 24 L138 34 L138 186 L62 186 Z';
const BODY_BACK = 'M62 34 L84 24 Q100 30 116 24 L138 34 L138 186 L62 186 Z';

interface Props {
  style?: string;
  back?: boolean;
  champions?: boolean;
  name?: string | null;
  number?: string | number | null;
  font?: KitFont;
  patch?: boolean;
  size: number;
}

/** A kit drawn in its colours, front or back, with optional printing. */
export function ShirtArt({
  style = 'home',
  back = false,
  champions = false,
  name,
  number,
  font = 'premier_league',
  patch = false,
  size,
}: Props) {
  const k = KIT_STYLES[style] ?? KIT_STYLES.home;
  const printColor = champions ? '#C9A646' : k.print;
  const printName = champions && !name ? 'CHAMPIONS' : name;
  const printNumber = champions && number == null ? '26' : number;
  const nameSize = printName && printName.length > 9 ? 11 : 14;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <G>
        <Path d={SLEEVE_L} fill={k.sleeves} stroke={k.trim} strokeWidth={1.2} />
        <Path d={SLEEVE_R} fill={k.sleeves} stroke={k.trim} strokeWidth={1.2} />
        <Path d="M24 58 L40 92" stroke={k.trim} strokeWidth={5} />
        <Path d="M176 58 L160 92" stroke={k.trim} strokeWidth={5} />
        <Path d={back ? BODY_BACK : BODY_FRONT} fill={k.body} stroke={k.trim} strokeWidth={1.2} />
        {k.pattern === 'zigzag'
          ? [60, 95, 130, 165].map((y) => (
              <Path
                key={y}
                d={`M64 ${y} l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l10 -8`}
                stroke={k.patternColor}
                strokeWidth={4}
                fill="none"
              />
            ))
          : null}
        {k.pattern === 'stripes'
          ? [72, 88, 104, 120].map((x) => (
              <Rect key={x} x={x} y={40} width={6} height={144} fill={k.patternColor} />
            ))
          : null}
        {/* Collar */}
        <Path
          d={back ? 'M84 24 Q100 30 116 24' : 'M84 24 Q100 38 116 24'}
          stroke={k.trim}
          strokeWidth={5}
          fill="none"
        />
        {!back ? (
          <>
            <Circle cx={119} cy={62} r={8} fill={k.trim} />
            <Path d="M77 57 l6 5 l6 -5" stroke={k.trim} strokeWidth={2.2} fill="none" />
            <Rect x={74} y={96} width={52} height={11} rx={2} fill={k.trim} opacity={0.9} />
          </>
        ) : (
          <>
            {printName ? (
              <SvgText
                x={100}
                y={66}
                fontSize={nameSize}
                fontFamily={FONT_FAMILY[font]}
                fill={printColor}
                textAnchor="middle"
                letterSpacing={0.5}>
                {printName}
              </SvgText>
            ) : null}
            {printNumber != null && printNumber !== '' ? (
              <SvgText
                x={100}
                y={136}
                fontSize={62}
                fontFamily={FONT_FAMILY[font]}
                fill={printColor}
                stroke={style === 'home' && !champions ? k.trim : undefined}
                strokeWidth={style === 'home' && !champions ? 1 : undefined}
                textAnchor="middle">
                {String(printNumber)}
              </SvgText>
            ) : null}
          </>
        )}
        {patch ? (
          <G>
            <Rect
              x={141}
              y={48}
              width={20}
              height={24}
              rx={4}
              fill="#FFFFFF"
              stroke="#3D195B"
              strokeWidth={1.5}
              transform="rotate(-18 151 60)"
            />
            <Circle cx={151} cy={60} r={5} fill="#3D195B" />
          </G>
        ) : null}
      </G>
    </Svg>
  );
}
