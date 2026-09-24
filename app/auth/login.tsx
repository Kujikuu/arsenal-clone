import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

export default function LoginModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    } else {
      Alert.alert('Welcome Back!', 'Signed in successfully.');
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-arsenal-dark">
      <View
        style={{ paddingTop: Math.max(insets.top, 12) + 6 }}
        className="flex-row items-center justify-between px-4 pb-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-800 active:opacity-70">
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </Pressable>
        <Text className="text-xs font-black uppercase tracking-widest text-white">
          GUNNER ACCOUNT
        </Text>
        <View className="w-9" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        className="flex-1">
        <View className="my-6 items-center">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-arsenal-red shadow-xl">
            <Ionicons name="shield" size={32} color="#FFFFFF" />
          </View>
          <Text className="text-2xl font-black tracking-wide text-white">WELCOME, GOONER</Text>
          <Text className="mt-1 text-center text-xs text-slate-400">
            Sign in to vote in fan polls, predict match scores, and access your digital membership
            pass.
          </Text>
        </View>

        <View className="space-y-4">
          <View className="mb-3">
            <Text className="mb-1 text-xs font-bold uppercase text-slate-300">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="gunner@arsenal.com"
              placeholderTextColor="#64748B"
              className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-sm text-white"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 text-xs font-bold uppercase text-slate-300">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#64748B"
              className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-sm text-white"
            />
          </View>

          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            className="items-center rounded-xl bg-arsenal-red py-4 shadow-lg active:opacity-85">
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-sm font-black uppercase tracking-wider text-white">
                Sign In
              </Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/auth/signup')} className="items-center py-3">
            <Text className="text-xs text-slate-400">
              {"Don't have an account? "}
              <Text className="font-bold text-arsenal-gold">Join the Arsenal Family</Text>
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="items-center rounded-xl border border-slate-800 bg-slate-900 py-2.5 active:opacity-75">
            <Text className="text-xs font-semibold text-slate-400">Continue as Guest</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
