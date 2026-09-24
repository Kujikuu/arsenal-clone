import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ArsenalHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function ArsenalHeader({
  title = 'ARSENAL FC',
  subtitle,
  showBack = false,
  rightAction,
}: ArsenalHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      className="border-b border-arsenal-cardBorder/60 bg-arsenal-dark/95">
      <View className="flex-row items-center justify-between px-4 pb-3">
        <View className="flex-row items-center space-x-2">
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              className="mr-2 rounded-full bg-slate-800/80 p-1.5 active:opacity-70">
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>
          )}

          {/* Arsenal Cannon Icon Badge */}
          <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-arsenal-red shadow-sm">
            <Ionicons name="shield" size={18} color="#FFFFFF" />
          </View>

          <View>
            <Text className="text-base font-black tracking-widest text-white">{title}</Text>
            {subtitle ? (
              <Text className="text-xs font-medium tracking-wide text-slate-400">{subtitle}</Text>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-center space-x-3">
          {rightAction ? (
            rightAction
          ) : (
            <Pressable
              onPress={() => router.push('/fanzone')}
              className="h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800/90 active:opacity-70">
              <Ionicons name="person" size={16} color="#D4AF37" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 50,
  },
});
