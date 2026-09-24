import React from 'react';
import { View, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArsenalWordmark } from '@/components/ui/ArsenalWordmark';

type LeftAction = 'search' | 'back' | 'close' | 'none';

interface Props {
  left?: LeftAction;
  /** @deprecated use left="back" */
  showBack?: boolean;
  onLeftPress?: () => void;
  rightAction?: React.ReactNode;
  /** Replaces the wordmark (e.g. "FULL TIME", "Settings"). */
  title?: React.ReactNode;
  backgroundColor?: string;
  bordered?: boolean;
}

const HEADER_HEIGHT = 50;

export function TheArsenalHeader({
  left,
  showBack = false,
  onLeftPress,
  rightAction,
  title,
  backgroundColor = '#000000',
  bordered = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const leftAction: LeftAction = left ?? (showBack ? 'back' : 'search');

  const handleLeft = () => {
    if (onLeftPress) return onLeftPress();
    if (leftAction === 'search') return router.push('/search');
    router.back();
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor,
        borderBottomWidth: bordered ? 1 : 0,
        borderBottomColor: '#343233',
      }}
      className="z-30">
      <View style={{ height: HEADER_HEIGHT }} className="flex-row items-center px-4">
        <View className="w-16 items-start">
          {leftAction !== 'none' && (
            <Pressable
              onPress={handleLeft}
              hitSlop={10}
              className="active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel={leftAction}>
              {leftAction === 'search' && <Ionicons name="search-outline" size={26} color="#FFF" />}
              {leftAction === 'back' && <Feather name="chevron-left" size={32} color="#FFF" />}
              {leftAction === 'close' && <Feather name="x" size={30} color="#FFF" />}
            </Pressable>
          )}
        </View>

        <View className="flex-1 items-center">{title ?? <ArsenalWordmark />}</View>

        <View className="w-16 flex-row items-center justify-end">{rightAction}</View>
      </View>
    </View>
  );
}
