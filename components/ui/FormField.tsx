import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { PALETTE } from '@/theme/palette';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
}

export function FormField({ label, error, style, multiline, ...input }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        className="font-body-semibold"
        style={{ fontSize: 12.5, letterSpacing: 0.6, color: PALETTE.textMuted, marginBottom: 7 }}>
        {label.toUpperCase()}
      </Text>
      <TextInput
        placeholderTextColor="#8E8C8D"
        multiline={multiline}
        className="font-body text-white"
        style={[
          {
            minHeight: multiline ? 120 : 50,
            borderRadius: 8,
            backgroundColor: PALETTE.pill,
            paddingHorizontal: 14,
            paddingTop: multiline ? 14 : 0,
            fontSize: 16,
            borderWidth: error ? 1 : 0,
            borderColor: PALETTE.red,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
        {...input}
      />
      {error ? (
        <Text
          className="font-body"
          style={{ fontSize: 12.5, color: PALETTE.formDown, marginTop: 5 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
