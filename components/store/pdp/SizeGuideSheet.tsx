import React from 'react';
import { View, Text } from 'react-native';
import { BottomSheet } from '@/components/store/ui/Sheets';
import type { SizeChart } from '@/types/database';
import { STORE } from '@/theme/store';

export function SizeGuideSheet({
  chart,
  visible,
  onClose,
}: {
  chart: SizeChart | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!chart) return null;
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Size guide">
      <Text
        className="font-body-bold"
        style={{ fontSize: 15, color: STORE.text, marginBottom: 12 }}>
        {chart.title}
      </Text>
      <View style={{ borderWidth: 1, borderColor: STORE.divider }}>
        {[chart.columns, ...chart.rows].map((row, r) => (
          <View
            key={r}
            className="flex-row"
            style={{
              backgroundColor: r === 0 ? STORE.muted : r % 2 ? STORE.surface : '#FAFAFB',
              borderTopWidth: r ? 1 : 0,
              borderTopColor: STORE.divider,
            }}>
            {row.map((cell, c) => (
              <Text
                key={c}
                className={r === 0 || c === 0 ? 'font-body-bold' : 'font-body'}
                style={{
                  flex: 1,
                  fontSize: 13.5,
                  color: STORE.text,
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                }}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <Text
        className="font-body"
        style={{ fontSize: 13, lineHeight: 18, color: STORE.textMuted, marginTop: 12 }}>
        Measurements are body sizes. If you are between sizes, choose the larger one for a looser
        fit.
      </Text>
    </BottomSheet>
  );
}
