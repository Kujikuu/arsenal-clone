import React, { useEffect, useRef } from 'react';
import { Alert, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { LoadingState } from '@/components/ui/States';
import { setSessionFromUrl } from '@/lib/auth/linking';

/** Landing screen for the email-confirmation link: signs the user in and goes home. */
export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!url || handled.current === url) return;
    handled.current = url;
    setSessionFromUrl(url)
      .then((signedIn) => {
        if (signedIn) Alert.alert('Email confirmed', 'Your account is ready.');
      })
      .catch((error: Error) => Alert.alert('Link not valid', error.message))
      .finally(() => router.replace('/'));
  }, [url, router]);

  return (
    <View className="flex-1 bg-black">
      <LoadingState />
    </View>
  );
}
