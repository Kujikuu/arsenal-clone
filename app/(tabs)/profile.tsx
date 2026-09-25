import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { DisplayText } from '@/components/ui/DisplayText';
import { ZigzagPattern } from '@/components/ui/ZigzagPattern';
import { PillButton } from '@/components/ui/PillButton';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatLongDate } from '@/lib/format';
import { PALETTE } from '@/theme/palette';

const TILE_SIZE = 107;
const ICON_SIZE = 42;

const MENU = [
  {
    id: 'personal-details',
    title: 'PERSONAL DETAILS',
    icon: <Feather name="monitor" size={ICON_SIZE} color="#FFF" />,
  },
  {
    id: 'tickets',
    title: 'TICKET HUB',
    icon: (
      <MaterialCommunityIcons
        name="ticket-outline"
        size={ICON_SIZE}
        color="#FFF"
        style={{ transform: [{ rotate: '90deg' }] }}
      />
    ),
  },
  {
    id: 'notifications',
    title: 'NOTIFICATIONS',
    icon: <Feather name="bell" size={ICON_SIZE} color="#FFF" />,
  },
  {
    id: 'preferences',
    title: 'PREFERENCES',
    icon: <Ionicons name="chatbox-ellipses-outline" size={ICON_SIZE} color="#FFF" />,
  },
  {
    id: 'stadium-tours',
    title: 'STADIUM TOURS',
    icon: <MaterialCommunityIcons name="flag-variant-outline" size={ICON_SIZE} color="#FFF" />,
  },
] as const;

function PatternTile({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: 6, backgroundColor: '#000' }}
      className="items-center justify-center overflow-hidden">
      <ZigzagPattern
        width={TILE_SIZE}
        height={TILE_SIZE}
        run={36}
        rise={80}
        spacing={24}
        color="#C8202A"
        strokeWidth={0.9}
        opacity={0.85}
      />
      {children}
    </View>
  );
}

/** Account menu (ref/profile.jpeg). */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [pressed, setPressed] = useState<string | null>(null);

  const memberName = profile?.full_name || user?.email?.split('@')[0] || '';

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        rightAction={
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={8}
            accessibilityLabel="Settings"
            className="active:opacity-60">
            <Ionicons name="settings-outline" size={27} color="#FFF" />
          </Pressable>
        }
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {user ? (
          <View className="items-center" style={{ paddingTop: 10, paddingBottom: 14 }}>
            <Text className="font-body-semibold text-white" style={{ fontSize: 16.5 }}>
              {memberName}
            </Text>
            <Text className="font-body text-white" style={{ fontSize: 16, marginTop: 8 }}>
              Member since {formatLongDate(profile?.created_at ?? user.created_at)}
            </Text>
          </View>
        ) : (
          <View className="items-center px-6" style={{ paddingTop: 10, paddingBottom: 18 }}>
            <Text
              className="text-center font-body text-white"
              style={{ fontSize: 16, lineHeight: 22 }}>
              Sign in to manage your details, tickets and notifications.
            </Text>
            <View className="flex-row" style={{ marginTop: 16 }}>
              <PillButton label="SIGN IN" height={38} onPress={() => router.push('/auth/login')} />
              <PillButton
                label="JOIN"
                height={38}
                variant="outline"
                onPress={() => router.push('/auth/signup')}
                style={{ marginLeft: 10 }}
              />
            </View>
          </View>
        )}
        <View
          style={{ height: 1, backgroundColor: '#4D4D4D', marginHorizontal: 14, marginBottom: 6 }}
        />

        {MENU.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/account/${item.id}`)}
            onPressIn={() => setPressed(item.id)}
            onPressOut={() => setPressed(null)}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            style={{
              marginHorizontal: 10,
              marginTop: 10,
              height: 117,
              borderRadius: 8,
              padding: 5,
              backgroundColor: PALETTE.surface,
              opacity: pressed === item.id ? 0.85 : 1,
            }}
            className="flex-row items-center">
            <View className="flex-1" style={{ paddingLeft: 20 }}>
              <DisplayText size={14}>{item.title}</DisplayText>
            </View>
            <PatternTile>{item.icon}</PatternTile>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
