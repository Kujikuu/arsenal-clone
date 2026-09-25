import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PALETTE } from '@/theme/palette';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Row {
  title: string;
  icon: IconName;
  onPress: () => void;
}

/** Settings list (ref/settings.jpeg). */
export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut, deleteAccount } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(tabs)/profile');
    } catch {
      Alert.alert('Could not log out', 'Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      Alert.alert('Account deleted', 'Your account and all of its data have been removed.');
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      Alert.alert('Could not delete account', error?.message ?? 'Please try again.');
    }
  };

  const confirmDelete = () =>
    Alert.alert(
      'Delete account',
      'This permanently removes your account, tickets, bookings, votes and saved items. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );

  const rows: Row[] = [
    { title: 'Contact Us', icon: 'people-outline', onPress: () => router.push('/contact') },
    {
      title: 'Terms Of Use',
      icon: 'document-text-outline',
      onPress: () => router.push('/legal/terms'),
    },
    {
      title: 'Privacy Policy',
      icon: 'information-circle-outline',
      onPress: () => router.push('/legal/privacy'),
    },
    ...(user
      ? ([
          { title: 'Logout', icon: 'log-out-outline', onPress: handleLogout },
          { title: 'Delete Account', icon: 'trash-outline', onPress: confirmDelete },
        ] as Row[])
      : ([
          { title: 'Sign In', icon: 'log-in-outline', onPress: () => router.push('/auth/login') },
        ] as Row[])),
  ];

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        left="back"
        backgroundColor={PALETTE.surface}
        bordered
        title={
          <Text className="font-body text-white" style={{ fontSize: 18 }}>
            Settings
          </Text>
        }
      />

      {rows.map((row) => (
        <Pressable
          key={row.title}
          onPress={row.onPress}
          accessibilityRole="button"
          style={{ height: 76, borderBottomWidth: 1, borderBottomColor: '#343233' }}
          className="flex-row items-center px-4 active:bg-neutral-900">
          <View style={{ width: 28 }} className="items-center">
            <Ionicons name={row.icon} size={27} color="#FFF" />
          </View>
          <Text className="font-body text-white" style={{ fontSize: 16, marginLeft: 16 }}>
            {row.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
