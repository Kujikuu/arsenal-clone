import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop, Path, Circle } from 'react-native-svg';
import { tablePoints, type TableForm, type TableRow } from '@/lib/data/fixtures';
import { ARSENAL } from '@/theme/arsenal';

const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 40;
const STAT_WIDTH = 52;
const LEFT_WIDTH = 190;

const STAT_COLUMNS: { key: string; value: (row: TableRow) => number }[] = [
  { key: 'P', value: (r) => r.p },
  { key: 'W', value: (r) => r.w },
  { key: 'D', value: (r) => r.d },
  { key: 'L', value: (r) => r.l },
  { key: 'Pts', value: tablePoints },
];

function FormMarker({ form }: { form: TableForm }) {
  if (form === 'same') {
    return (
      <Svg width={10} height={10}>
        <Circle cx={5} cy={5} r={3.5} fill="#5E5C5D" />
      </Svg>
    );
  }
  const up = form === 'up';
  return (
    <Svg width={10} height={8}>
      <Path
        d={up ? 'M5 0 L10 8 H0 Z' : 'M0 0 H10 L5 8 Z'}
        fill={up ? ARSENAL.formUp : ARSENAL.formDown}
      />
    </Svg>
  );
}

function RightFade() {
  return (
    <Svg
      width={48}
      style={[StyleSheet.absoluteFill, { left: undefined, right: 0 }]}
      pointerEvents="none">
      <Defs>
        <LinearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.9" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="48" height="100%" fill="url(#fade)" />
    </Svg>
  );
}

const rowStyle = {
  height: ROW_HEIGHT,
  backgroundColor: ARSENAL.surface,
  borderBottomWidth: 1,
  borderBottomColor: ARSENAL.dividerSoft,
} as const;

const headerStyle = {
  height: HEADER_HEIGHT,
  borderBottomWidth: 1,
  borderBottomColor: ARSENAL.divider,
} as const;

/** Standings with a fixed club column and horizontally scrolling stats (ref/match-table.jpeg). */
export function LeagueTable({ rows }: { rows: TableRow[] }) {
  return (
    <View style={{ marginLeft: 10 }} className="flex-row">
      <View style={{ width: LEFT_WIDTH }}>
        <View style={headerStyle} className="flex-row items-center">
          <Text
            className="font-body text-white"
            style={{ fontSize: 15, width: 46, paddingLeft: 10 }}>
            #
          </Text>
          <Text className="font-body text-white" style={{ fontSize: 15 }}>
            Club
          </Text>
        </View>
        {rows.map((row) => (
          <View key={row.code} style={rowStyle} className="flex-row items-center">
            <Text
              className="font-body-semibold"
              style={{ fontSize: 15, color: '#C8C6C7', width: 38, paddingLeft: 10 }}>
              {row.rank}
            </Text>
            <View style={{ width: 24 }}>
              <FormMarker form={row.form} />
            </View>
            <Image
              source={{ uri: row.logo }}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 15, marginLeft: 10 }}>
              {row.code}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-1">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View>
            <View style={headerStyle} className="flex-row items-center">
              {STAT_COLUMNS.map((col) => (
                <Text
                  key={col.key}
                  className="text-center font-body text-white"
                  style={{ fontSize: 15, width: STAT_WIDTH }}>
                  {col.key}
                </Text>
              ))}
            </View>
            {rows.map((row) => (
              <View key={row.code} style={rowStyle} className="flex-row items-center">
                {STAT_COLUMNS.map((col) => (
                  <Text
                    key={col.key}
                    className="text-center font-body-semibold text-white"
                    style={{ fontSize: 15, width: STAT_WIDTH }}>
                    {col.value(row)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <RightFade />
      </View>
    </View>
  );
}
