import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SubScreen } from '@/components/ui/SubScreen';
import { FormField } from '@/components/ui/FormField';
import { PillButton } from '@/components/ui/PillButton';
import { sendSupportMessage } from '@/lib/api/account';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PALETTE } from '@/theme/palette';

const TOPICS = ['Tickets', 'Membership', 'App feedback', 'Stadium tours', 'Other'] as const;

/** Contact form; messages land in public.support_messages. */
export default function ContactScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('App feedback');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setName((n) => n || profile.full_name);
    if (user?.email) setEmail((e) => e || (user.email as string));
  }, [profile?.full_name, user?.email]);

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());
  const canSend = name.trim().length > 0 && validEmail && message.trim().length >= 5;

  const send = async () => {
    setSending(true);
    try {
      await sendSupportMessage(
        { name: name.trim(), email: email.trim(), topic, message: message.trim() },
        user?.id
      );
      Alert.alert('Message sent', 'Thanks for getting in touch. We will reply by email.');
      router.back();
    } catch (error: any) {
      Alert.alert('Could not send', error?.message ?? 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SubScreen
      title="Contact Us"
      footer={
        <PillButton label="SEND MESSAGE" onPress={send} disabled={!canSend} loading={sending} />
      }>
      <Text
        className="font-body"
        style={{ fontSize: 15, lineHeight: 21, color: '#C8C6C7', marginTop: 20, marginBottom: 20 }}>
        Questions about tickets, membership or the app? Send us a message and the supporter services
        team will get back to you.
      </Text>
      <FormField label="Name" value={name} onChangeText={setName} autoComplete="name" />
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={email && !validEmail ? 'Enter a valid email address' : null}
      />
      <Text
        className="font-body-semibold"
        style={{ fontSize: 12.5, letterSpacing: 0.6, color: PALETTE.textMuted, marginBottom: 8 }}>
        TOPIC
      </Text>
      <View className="flex-row flex-wrap" style={{ marginBottom: 12 }}>
        {TOPICS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTopic(t)}
            accessibilityRole="radio"
            accessibilityState={{ checked: topic === t }}
            style={{
              height: 34,
              borderRadius: 17,
              paddingHorizontal: 14,
              marginRight: 8,
              marginBottom: 8,
              backgroundColor: topic === t ? PALETTE.red : PALETTE.chip,
            }}
            className="items-center justify-center">
            <Text className="font-body-semibold text-white" style={{ fontSize: 13 }}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
      <FormField
        label="Message"
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={4000}
        placeholder="How can we help?"
      />
    </SubScreen>
  );
}
