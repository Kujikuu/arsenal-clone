import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PillButton } from '@/components/ui/PillButton';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { syncFixturesToCalendar } from '@/lib/calendar';
import { useSettings } from '@/lib/settings/SettingsProvider';
import type { TeamType } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const OPTIONS = [
  {
    key: 'calendar_men',
    team: 'men',
    title: "Men's First Team",
    detail: 'Premier League, Champions League and cups',
  },
  {
    key: 'calendar_women',
    team: 'women',
    title: "Women's Team",
    detail: "Women's Super League and Champions League",
  },
  {
    key: 'calendar_academy',
    team: 'academy',
    title: 'Academy (U21, U19 & U18)',
    detail: 'Premier League 2, UEFA Youth League, U18 PL',
  },
] as const;

/** Picks which teams to sync, remembers the choice and writes the device calendar. */
export function CalendarSyncSheet({ visible, onClose }: Props) {
  const { settings, update } = useSettings();
  const [syncing, setSyncing] = useState(false);

  const selectedTeams = OPTIONS.filter((o) => settings[o.key]).map((o) => o.team as TeamType);

  const onToggle = (key: (typeof OPTIONS)[number]['key'], value: boolean) =>
    update({ [key]: value }).catch(() =>
      Alert.alert('Could not save', 'Your calendar choices were not saved. Please try again.')
    );

  const onConfirm = async () => {
    setSyncing(true);
    try {
      const { added, updated, removed } = await syncFixturesToCalendar(selectedTeams);
      onClose();
      const parts = [
        added && `${added} added`,
        updated && `${updated} updated`,
        removed && `${removed} removed`,
      ].filter(Boolean);
      Alert.alert(
        'Calendar synced',
        parts.length
          ? `Arsenal Fixtures calendar: ${parts.join(', ')}.`
          : 'There are no upcoming fixtures for the selected teams.'
      );
    } catch (error: any) {
      Alert.alert('Could not sync', error?.message ?? 'Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/60">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: ARSENAL.surface }}
          className="rounded-t-2xl p-6 pb-10">
          <View className="mb-5 h-1 w-12 self-center rounded-full bg-neutral-600" />
          <View className="mb-2 flex-row items-center">
            <MaterialCommunityIcons name="calendar-sync-outline" size={24} color={ARSENAL.red} />
            <Text className="ml-2.5 font-body-bold text-lg text-white">Sync Fixtures</Text>
          </View>
          <Text className="mb-3 font-body text-sm text-neutral-400">
            Add upcoming matches to an Arsenal Fixtures calendar on this device. Sync again any time
            to pick up changed kick-off times.
          </Text>

          {OPTIONS.map((option, i) => (
            <SwitchRow
              key={option.key}
              title={option.title}
              detail={option.detail}
              value={settings[option.key]}
              onValueChange={(v) => onToggle(option.key, v)}
              last={i === OPTIONS.length - 1}
            />
          ))}

          <PillButton
            label={selectedTeams.length ? 'SYNC TO CALENDAR' : 'REMOVE SYNCED FIXTURES'}
            onPress={onConfirm}
            loading={syncing}
            height={44}
            style={{ marginTop: 24 }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
