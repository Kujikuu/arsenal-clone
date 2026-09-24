import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  /** Horizontal length of each flat segment. */
  run?: number;
  /** Vertical distance between two flat segments. */
  rise?: number;
  /** Horizontal distance between repeated zigzags. */
  spacing?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}

/**
 * Stacked "Z" lightning lines used behind player cards, the profile menu tiles
 * and the player hero (ref/profile.jpeg, ref/match-players.jpeg).
 */
export function ZigzagPattern({
  width,
  height,
  run = 60,
  rise = 70,
  spacing = 34,
  color = '#C8202A',
  strokeWidth = 1,
  opacity = 0.75,
}: Props) {
  const paths: string[] = [];
  const steps = Math.ceil(height / rise) + 3;
  let index = 0;

  for (let x = -width; x < width + run; x += spacing) {
    // Stagger each zigzag vertically so the flat segments don't line up into stripes.
    const phase = ((index * 0.37) % 1) * rise;
    let d = '';
    for (let i = 0; i < steps; i++) {
      const y = i * rise - rise + phase;
      // Each step drifts right so the zigzag leans like a bolt.
      const left = x + i * (run * 0.35);
      d += `${i === 0 ? 'M' : 'L'}${left},${y} L${left + run},${y} `;
    }
    paths.push(d);
    index += 1;
  }

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {paths.map((d, i) => (
        <Path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
          fill="none"
        />
      ))}
    </Svg>
  );
}
