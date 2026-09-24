import '@/global.css';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { ThemeProvider as NavThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
} from '@expo-google-fonts/kumbh-sans';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeToggle } from '@/components/nativewindui/ThemeToggle';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    Michroma_400Regular,
  });

  useEffect(() => {
    if (fontError) console.warn('[RootLayout] Font loading failed:', fontError);
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      {/* The whole app is dark (see ref/), so the status bar is always light. */}
      <StatusBar style="light" />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      {/* <ExampleProvider> */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ActionSheetProvider>
          <NavThemeProvider value={NAV_THEME[colorScheme]}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="article/[id]"
                options={{ presentation: 'card', headerShown: false }}
              />
              <Stack.Screen
                name="match/[id]"
                options={{ presentation: 'card', headerShown: false }}
              />
              <Stack.Screen
                name="player/[id]"
                options={{ presentation: 'card', headerShown: false }}
              />
              <Stack.Screen
                name="video/[id]"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="store/[id]"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="auth/login"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="auth/signup"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="search"
                options={{ presentation: 'fullScreenModal', headerShown: false }}
              />
              <Stack.Screen
                name="filter-fixtures"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="settings"
                options={{ presentation: 'card', headerShown: false }}
              />
              <Stack.Screen name="modal" options={MODAL_OPTIONS} />
            </Stack>
          </NavThemeProvider>
        </ActionSheetProvider>
      </GestureHandlerRootView>
      {/* </ExampleProvider> */}
    </>
  );
}

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
