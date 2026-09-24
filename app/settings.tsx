import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { supabase } from '@/lib/supabase';
import { ARSENAL } from '@/theme/arsenal';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Row {
  title: string;
  icon: IconName;
  onPress: () => void;
}

/** Settings list (ref/settings.jpeg). */
export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Could not log out', 'Please try again.');
      return;
    }
    router.replace('/(tabs)');
  };

  const confirmDelete = () =>
    Alert.alert('Delete account', 'This permanently removes your account. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleLogout },
    ]);

  const rows: Row[] = [
    {
      title: 'Contact Us',
      icon: 'people-outline',
      onPress: () => Alert.alert('Contact Us', 'Reach out at support@arsenal.co.uk'),
    },
    { title: 'Terms Of Use', icon: 'document-text-outline', onPress: () => {} },
    { title: 'Privacy Policy', icon: 'information-circle-outline', onPress: () => {} },
    { title: 'Logout', icon: 'log-out-outline', onPress: handleLogout },
    { title: 'Delete Account', icon: 'trash-outline', onPress: confirmDelete },
  ];

  return (
    <View className="flex-1 bg-black">
      <TheArsenalHeader
        left="back"
        backgroundColor={ARSENAL.surface}
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
