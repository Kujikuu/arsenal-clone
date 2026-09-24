import React from 'react';
import { View, Text } from 'react-native';
import { DatePicker } from '@/components/nativewindui/DatePicker';
import { ARSENAL } from '@/theme/arsenal';

/** "2026-10-10" for a local date, as stored in `date` columns. */
export function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a `date` column value as a local date. */
export function fromISODate(value?: string | null): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DateField({ label, value, onChange, minimumDate, maximumDate }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        className="font-body-semibold"
        style={{ fontSize: 12.5, letterSpacing: 0.6, color: ARSENAL.textMuted, marginBottom: 7 }}>
        {label.toUpperCase()}
      </Text>
      <View className="flex-row">
        <DatePicker
          mode="date"
          value={value}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          themeVariant="dark"
          accentColor={ARSENAL.red}
          onChange={(_, date) => date && onChange(date)}
        />
      </View>
    </View>
  );
}
