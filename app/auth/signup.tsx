import React, { useState } from 'react';
import { Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { FormField } from '@/components/ui/FormField';
import { PillButton } from '@/components/ui/PillButton';
import { authRedirectUrl } from '@/lib/auth/linking';
import { supabase } from '@/lib/supabase';
import { PALETTE } from '@/theme/palette';
import { BRAND } from '@/lib/brand';

export default function SignupModal() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert('Required fields', 'Please fill in your name, email and password.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password too short', 'Use at least 8 characters.');
      return;
    }

    setLoading(true);
    // A database trigger creates the profile (with Gunner ID) and default settings.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: authRedirectUrl('auth/callback'),
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }
    if (!data.session) {
      Alert.alert('Confirm your email', 'We have sent you a link to activate your account.');
    }
    router.back();
  };

  return (
    <AuthScreen
      title={`JOIN ${BRAND.appName.toUpperCase()}`}
      subtitle="Create an account to get your digital Gunner ID and personalise the app.">
      <FormField
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        autoComplete="name"
        textContentType="name"
        placeholder="e.g. Thierry Henry"
      />
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
        autoComplete="new-password"
        textContentType="newPassword"
        placeholder="At least 8 characters"
        onSubmitEditing={handleSignUp}
      />
      <PillButton
        label="CREATE ACCOUNT"
        onPress={handleSignUp}
        loading={loading}
        style={{ marginTop: 12 }}
      />
      <Pressable
        onPress={() => router.replace('/auth/login')}
        className="items-center"
        style={{ marginTop: 20 }}>
        <Text className="font-body" style={{ fontSize: 14, color: PALETTE.textMuted }}>
          Already have an account? <Text className="font-body-semibold text-white">Sign in</Text>
        </Text>
      </Pressable>
    </AuthScreen>
  );
}
