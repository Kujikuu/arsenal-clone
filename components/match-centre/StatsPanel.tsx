import React from 'react';
import { View, Text } from 'react-native';
import { DisplayText } from '@/components/ui/DisplayText';
import type { MatchStat } from '@/types/database';
import { ARSENAL, FONT } from '@/theme/arsenal';

/** Michroma's % glyph reads as "o/o", so the sign is set in the body face. */
function StatValue({ value }: { value: string }) {
  const parts = value.split('%');
  return (
    <DisplayText size={13.5} heavy={false}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <Text style={{ fontFamily: FONT.bodySemibold, fontSize: 15 }}>%</Text>
          )}
        </React.Fragment>
      ))}
    </DisplayText>
  );
}

function StatRow({ stat }: { stat: MatchStat }) {
  const homePct = `${Math.round(stat.home_share * 1000) / 10}%` as const;
  return (
    <View style={{ marginBottom: 20 }}>
      <View className="flex-row items-center justify-between">
        <StatValue value={stat.home_value} />
        <Text className="font-body text-white" style={{ fontSize: 15 }}>
          {stat.label}
        </Text>
        <StatValue value={stat.away_value} />
      </View>
      <View
        style={{ height: 8, borderRadius: 4, marginTop: 9, backgroundColor: ARSENAL.statRed }}
        className="flex-row overflow-hidden">
        <View style={{ width: homePct, backgroundColor: ARSENAL.statGrey }} />
      </View>
    </View>
  );
}

/** Opta head-to-head bars (ref/matchcenter-stats.jpeg). */
export function StatsPanel({ stats }: { stats: MatchStat[] }) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 30,
        backgroundColor: ARSENAL.surface,
        borderRadius: 12,
        paddingHorizontal: 13,
        paddingTop: 22,
        paddingBottom: 4,
      }}>
      <Text
        className="text-center font-body-bold"
        style={{ fontSize: 22, color: ARSENAL.opta, letterSpacing: -0.3 }}>
        opta
      </Text>
      <View style={{ height: 1, backgroundColor: '#424041', marginTop: 14, marginBottom: 14 }} />
      {stats.map((stat) => (
        <StatRow key={stat.id} stat={stat} />
      ))}
    </View>
  );
}
