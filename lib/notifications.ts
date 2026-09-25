import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter, type Href } from 'expo-router';
import { reportError } from '@/lib/monitoring';
import { supabase } from '@/lib/supabase';
import { PALETTE } from '@/theme/palette';

export type PushPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

// Show alerts while the app is open too (a goal shouldn't wait for backgrounding).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Push only works in a real build on a physical device. */
const pushSupported = Device.isDevice && Platform.OS !== 'web';

let currentToken: string | null = null;

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  // Matches `channelId: 'default'` in the send-notifications Edge Function.
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Match alerts and news',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: PALETTE.red,
  });
}

function toPermission(status: Notifications.PermissionStatus): PushPermission {
  if (status === Notifications.PermissionStatus.GRANTED) return 'granted';
  if (status === Notifications.PermissionStatus.DENIED) return 'denied';
  return 'undetermined';
}

export async function getPushPermission(): Promise<PushPermission> {
  if (!pushSupported) return 'unsupported';
  const { status } = await Notifications.getPermissionsAsync();
  return toPermission(status);
}

/** Show the system prompt (if it can still be shown) and return the result. */
export async function requestPushPermission(): Promise<PushPermission> {
  if (!pushSupported) return 'unsupported';
  await ensureAndroidChannel();
  const { status } = await Notifications.requestPermissionsAsync();
  return toPermission(status);
}

async function getExpoToken(): Promise<string | null> {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  return data;
}

/**
 * Save this device's push token for the signed-in user. Does nothing unless
 * permission was already granted, so it never shows a prompt by itself.
 */
export async function registerPushToken(): Promise<void> {
  try {
    if ((await getPushPermission()) !== 'granted') return;
    await ensureAndroidChannel();
    const token = await getExpoToken();
    if (!token) return;
    const { error } = await supabase.rpc('register_push_token', {
      p_token: token,
      p_platform: Platform.OS,
    });
    if (error) throw error;
    currentToken = token;
  } catch (error) {
    reportError(error, { where: 'registerPushToken' });
  }
}

/** Stop sending to this device. Call before signing out, while the session is still valid. */
export async function unregisterPushToken(): Promise<void> {
  if (!currentToken) return;
  const { error } = await supabase.from('push_tokens').delete().eq('token', currentToken);
  if (error) reportError(error, { where: 'unregisterPushToken' });
  currentToken = null;
}

/** Only follow in-app routes carried by our own notifications. */
function routeFrom(response: Notifications.NotificationResponse | null | undefined): Href | null {
  const url = response?.notification.request.content.data?.url;
  return typeof url === 'string' && url.startsWith('/') ? (url as Href) : null;
}

/**
 * Keeps the push token in sync with the signed-in user and opens the screen a
 * tapped notification points at, including when the tap launched the app.
 */
export function usePushNotifications(userId: string | undefined) {
  const router = useRouter();
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (userId) registerPushToken();
  }, [userId]);

  useEffect(() => {
    const route = routeFrom(lastResponse);
    if (!route) return;
    router.push(route);
    Notifications.clearLastNotificationResponse();
  }, [lastResponse, router]);
}
