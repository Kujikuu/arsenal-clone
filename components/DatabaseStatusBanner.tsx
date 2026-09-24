import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  tableName: string;
  onRetry?: () => void;
}

export function DatabaseStatusBanner({ tableName, onRetry }: Props) {
  return (
    <View className="m-4 rounded-xl border border-amber-500/30 bg-slate-900 p-4">
      <View className="mb-2 flex-row items-center">
        <Ionicons name="information-circle" size={20} color="#F59E0B" />
        <Text className="ml-2 text-sm font-bold text-amber-400">Supabase Table Setup Required</Text>
      </View>
      <Text className="mb-3 text-xs leading-relaxed text-slate-300">
        Table <Text className="font-mono text-amber-200">public.{tableName}</Text> was not found in
        your Supabase schema cache. Run{' '}
        <Text className="font-mono text-white">supabase/schema.sql</Text> and{' '}
        <Text className="font-mono text-white">supabase/seed.sql</Text> in your Supabase SQL Editor.
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="self-start rounded-lg bg-arsenal-red px-3 py-1.5 active:opacity-80">
          <Text className="text-xs font-semibold text-white">Retry Connection</Text>
        </Pressable>
      )}
    </View>
  );
}
