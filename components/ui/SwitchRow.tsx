import React from 'react';
import { View, Text, Switch } from 'react-native';
import { PALETTE } from '@/theme/palette';

interface Props {
  title: string;
  detail?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
}

export function SwitchRow({ title, detail, value, onValueChange, disabled, last }: Props) {
  return (
    <View
      style={{
        minHeight: 64,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: PALETTE.divider,
        paddingVertical: 10,
      }}
      className="flex-row items-center">
      <View className="flex-1 pr-3">
        <Text className="font-body-semibold text-white" style={{ fontSize: 15.5 }}>
          {title}
        </Text>
        {detail ? (
          <Text
            className="font-body"
            style={{ fontSize: 13, lineHeight: 17, color: PALETTE.textMuted, marginTop: 2 }}>
            {detail}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={title}
        trackColor={{ false: '#3A3A3C', true: PALETTE.red }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#3A3A3C"
      />
    </View>
  );
}
