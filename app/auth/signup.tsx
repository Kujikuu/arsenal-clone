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

export default function SignUpModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Missing Details', 'Please fill in all fields to create your account.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setLoading(false);
      Alert.alert('Sign Up Failed', error.message);
      return;
    }

    // Create user profile entry
    if (data.user) {
      const generatedGunnerId = `AFC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      try {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          full_name: fullName.trim(),
          gunner_id_number: generatedGunnerId,
          membership_tier: 'Digital Fan',
        });
      } catch {}
    }

    setLoading(false);
    Alert.alert('Welcome to Arsenal!', 'Your digital Gunner account has been created.');
    router.replace('/fanzone');
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
          JOIN THE ARSENAL
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
          <Text className="text-2xl font-black tracking-wide text-white">CREATE ACCOUNT</Text>
          <Text className="mt-1 text-center text-xs text-slate-400">
            Get your official Digital Gunner ID and participate in matchday votes.
          </Text>
        </View>

        <View className="space-y-4">
          <View className="mb-3">
            <Text className="mb-1 text-xs font-bold uppercase text-slate-300">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Thierry Henry"
              placeholderTextColor="#64748B"
              className="rounded-xl border border-slate-800 bg-slate-900 p-3.5 text-sm text-white"
            />
          </View>

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
            <Text className="mb-1 text-xs font-bold uppercase text-slate-300">
              Password (min 6 characters)
            </Text>
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
            onPress={handleSignUp}
            disabled={loading}
            className="items-center rounded-xl bg-arsenal-red py-4 shadow-lg active:opacity-85">
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-sm font-black uppercase tracking-wider text-white">
                Create Gunner Pass
              </Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/auth/login')} className="items-center py-3">
            <Text className="text-xs text-slate-400">
              Already have an account? <Text className="font-bold text-arsenal-gold">Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
