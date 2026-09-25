import React, { useState } from 'react';
import { Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { FormField } from '@/components/ui/FormField';
import { PillButton } from '@/components/ui/PillButton';
import { supabase } from '@/lib/supabase';
import { PALETTE } from '@/theme/palette';

export default function LoginModal() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Required fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign in failed', error.message);
      return;
    }
    router.back();
  };

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Enter your email', 'Type your email address above and tap this again.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    Alert.alert(
      error ? 'Could not send reset email' : 'Check your inbox',
      error ? error.message : 'We have sent you a link to reset your password.'
    );
  };

  return (
    <AuthScreen
      title="WELCOME BACK"
      subtitle="Sign in to react, vote, predict scores, save articles and manage your tickets.">
      <FormField
        label="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="gooner@example.com"
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        placeholder="••••••••"
        onSubmitEditing={handleSignIn}
      />
      <Pressable onPress={handleReset} hitSlop={8} className="self-end" style={{ marginTop: -4 }}>
        <Text className="font-body-medium" style={{ fontSize: 14, color: PALETTE.textMuted }}>
          Forgot password?
        </Text>
      </Pressable>
      <PillButton
        label="SIGN IN"
        onPress={handleSignIn}
        loading={loading}
        style={{ marginTop: 24 }}
      />
      <PillButton
        label="CREATE AN ACCOUNT"
        variant="outline"
        onPress={() => router.replace('/auth/signup')}
        style={{ marginTop: 12 }}
      />
      <Pressable onPress={() => router.back()} className="items-center" style={{ marginTop: 20 }}>
        <Text className="font-body" style={{ fontSize: 14, color: PALETTE.textMuted }}>
          Continue as guest
        </Text>
      </Pressable>
    </AuthScreen>
  );
}
