import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { ZigzagPattern } from '@/components/ui/ZigzagPattern';
import { PALETTE } from '@/theme/palette';

/** Shared shell for sign in / sign up: pattern banner, heading and a form. */
export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black">
      <AppHeader left="close" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        <View
          style={{
            height: 120,
            marginHorizontal: 16,
            borderRadius: 8,
            backgroundColor: PALETTE.surface,
          }}
          className="items-center justify-center overflow-hidden">
          <ZigzagPattern
            width={420}
            height={120}
            run={36}
            rise={80}
            spacing={24}
            color="#C8202A"
            strokeWidth={0.9}
            opacity={0.85}
          />
          <DisplayText size={20}>{title}</DisplayText>
        </View>
        <Text
          className="text-center font-body"
          style={{
            fontSize: 15,
            lineHeight: 21,
            color: '#C8C6C7',
            marginTop: 18,
            marginHorizontal: 28,
          }}>
          {subtitle}
        </Text>
        <View style={{ paddingHorizontal: 16, marginTop: 26 }}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
