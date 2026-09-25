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
import { vexo } from 'vexo-analytics';

import { AuthProvider, useAuth } from '@/lib/auth/AuthProvider';
import { withMonitoring } from '@/lib/monitoring';
import { usePushNotifications } from '@/lib/notifications';
import { SettingsProvider } from '@/lib/settings/SettingsProvider';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => {});

const VEXO_KEY = process.env.EXPO_PUBLIC_VEXO_KEY;
if (VEXO_KEY && !__DEV__) vexo(VEXO_KEY);

/** Registers the device for push and routes notification taps. Renders nothing. */
function PushNotifications() {
  const { user } = useAuth();
  usePushNotifications(user?.id);
  return null;
}

const CARD = { presentation: 'card', headerShown: false } as const;
const MODAL = { presentation: 'modal', headerShown: false } as const;

function RootLayout() {
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <PushNotifications />
          <SettingsProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                <Stack
                  screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="article/[id]" options={CARD} />
                  <Stack.Screen name="match/[id]" options={CARD} />
                  <Stack.Screen name="player/[id]" options={CARD} />
                  <Stack.Screen
                    name="gallery/[id]"
                    options={{ ...MODAL, presentation: 'fullScreenModal' }}
                  />
                  <Stack.Screen name="quiz/[id]" options={CARD} />
                  <Stack.Screen name="experience/[id]" options={CARD} />
                  <Stack.Screen name="video/[id]" options={MODAL} />
                  <Stack.Screen name="store/[id]" options={MODAL} />
                  <Stack.Screen name="auth/login" options={MODAL} />
                  <Stack.Screen name="auth/signup" options={MODAL} />
                  <Stack.Screen name="auth/reset-password" options={CARD} />
                  <Stack.Screen name="auth/callback" options={CARD} />
                  <Stack.Screen
                    name="search/index"
                    options={{ ...MODAL, presentation: 'fullScreenModal' }}
                  />
                  <Stack.Screen name="search/[kind]" options={CARD} />
                  <Stack.Screen name="filter-fixtures" options={MODAL} />
                  <Stack.Screen name="settings" options={CARD} />
                  <Stack.Screen name="contact" options={CARD} />
                  <Stack.Screen name="legal/[slug]" options={CARD} />
                  <Stack.Screen name="account/personal-details" options={CARD} />
                  <Stack.Screen name="account/tickets" options={CARD} />
                  <Stack.Screen name="account/notifications" options={CARD} />
                  <Stack.Screen name="account/preferences" options={CARD} />
                  <Stack.Screen name="account/stadium-tours" options={CARD} />
                </Stack>
              </NavThemeProvider>
            </ActionSheetProvider>
          </SettingsProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default withMonitoring(RootLayout);
