import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  PitchTabIcon,
  MediaTabIcon,
  CenterBoltTabIcon,
  StoreTabIcon,
  ProfileTabIcon,
} from '@/components/CustomTabIcons';
import { TAB_BAR_CONTENT_HEIGHT } from '@/theme/arsenal';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const triggerHaptic = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const baseTabBarStyle = {
    backgroundColor: '#000000',
    borderTopColor: '#1F1D1E',
    borderTopWidth: 1,
    height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
    paddingTop: 10,
    paddingBottom: insets.bottom,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: baseTabBarStyle,
        tabBarItemStyle: { alignItems: 'center', justifyContent: 'center' },
      }}
      screenListeners={{ tabPress: triggerHaptic }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matches',
          tabBarIcon: ({ focused }) => <PitchTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarIcon: ({ focused }) => <MediaTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ focused }) => <CenterBoltTabIcon focused={focused} />,
          // Reels run full-bleed behind the tab bar (ref/reels.jpeg).
          tabBarStyle: {
            ...baseTabBarStyle,
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ focused }) => <StoreTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
        }}
      />

      {/* Legacy routes kept reachable by URL but hidden from the bar */}
      <Tabs.Screen name="matches" options={{ href: null }} />
      <Tabs.Screen name="video" options={{ href: null }} />
      <Tabs.Screen name="teams" options={{ href: null }} />
      <Tabs.Screen name="fanzone" options={{ href: null }} />
    </Tabs>
  );
}
