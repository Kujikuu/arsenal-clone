import React from 'react';
import Svg, { Circle, Path, Line } from 'react-native-svg';

/** Simple cannon mark for the shop header (drawn here, not the club crest). */
export function CannonLogo({ width = 78, color = '#FFFFFF' }: { width?: number; color?: string }) {
  const h = width * 0.42;
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <Svg width={width} height={h} viewBox="0 0 100 42">
      <Path d="M4 20 L70 6 Q86 3 96 8 L97 15 Q84 14 72 18 L10 30 Q2 30 4 20 Z" fill={color} />
      <Path d="M58 16 L66 14 L69 20 L60 22 Z" fill={color} />
      <Circle cx={46} cy={26} r={14} fill="none" stroke={color} strokeWidth={3.2} />
      <Circle cx={46} cy={26} r={3.2} fill={color} />
      {spokes.map((a, i) => (
        <Line
          key={i}
          x1={46}
          y1={26}
          x2={46 + Math.cos(a) * 13}
          y2={26 + Math.sin(a) * 13}
          stroke={color}
          strokeWidth={1.8}
        />
      ))}
    </Svg>
  );
}
