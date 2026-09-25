import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { FormField } from '@/components/ui/FormField';
import { PillButton } from '@/components/ui/PillButton';
import { LoadingState } from '@/components/ui/States';
import { useAuth } from '@/lib/auth/AuthProvider';
import { setSessionFromUrl } from '@/lib/auth/linking';
import { supabase } from '@/lib/supabase';
import { PALETTE } from '@/theme/palette';

/** Opened from the reset-password email: signs in with the link, then sets a new password. */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const url = Linking.useLinkingURL();
  const handled = useRef<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!url) {
      setChecking(false);
      return;
    }
    if (handled.current === url) return;
    handled.current = url;
    setSessionFromUrl(url)
      .catch((error: Error) => setLinkError(error.message))
      .finally(() => setChecking(false));
  }, [url]);

  const save = async () => {
    if (password.length < 8) {
      Alert.alert('Password too short', 'Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match', 'Type the same password in both fields.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      Alert.alert('Could not update password', error.message);
      return;
    }
    Alert.alert('Password updated', 'You are now signed in with your new password.');
    router.replace('/');
  };

  if (checking) {
    return (
      <View className="flex-1 bg-black">
        <LoadingState />
      </View>
    );
  }

  if (!session) {
    return (
      <AuthScreen
        title="LINK EXPIRED"
        subtitle="This reset link is no longer valid. Request a new one from the sign-in screen.">
        {linkError ? (
          <Text className="font-body" style={{ fontSize: 14, color: PALETTE.textMuted }}>
            {linkError}
          </Text>
        ) : null}
        <PillButton
          label="BACK TO SIGN IN"
          onPress={() => router.replace('/auth/login')}
          style={{ marginTop: 24 }}
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="NEW PASSWORD" subtitle="Choose a new password for your account.">
      <FormField
        label="New password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="At least 8 characters"
      />
      <FormField
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="Type it again"
        onSubmitEditing={save}
      />
      <PillButton label="SAVE PASSWORD" onPress={save} loading={saving} style={{ marginTop: 24 }} />
    </AuthScreen>
  );
}
