import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { STORE } from '@/theme/store';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
}

/** Light form field with a floating-style label, as on the store's checkout. */
export function StoreField({ label, error, style, ...input }: Props) {
  return (
    <View style={{ marginBottom: 14 }}>
      <View
        style={{
          minHeight: 56,
          borderRadius: 8,
          backgroundColor: STORE.muted,
          paddingHorizontal: 14,
          paddingTop: 7,
          borderWidth: error ? 1 : 0,
          borderColor: STORE.sale,
        }}>
        <Text className="font-body" style={{ fontSize: 11.5, color: STORE.textMuted }}>
          {label}
        </Text>
        <TextInput
          placeholderTextColor={STORE.textFaint}
          accessibilityLabel={label}
          className="font-body"
          style={[{ fontSize: 16, color: STORE.text, height: 30, paddingVertical: 0 }, style]}
          {...input}
        />
      </View>
      {error ? (
        <Text className="font-body" style={{ fontSize: 12.5, color: STORE.sale, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
