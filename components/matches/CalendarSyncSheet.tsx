import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ARSENAL } from '@/theme/arsenal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OPTIONS = [
  { key: 'men', title: "Men's First Team", detail: 'Premier League, Champions League, FA Cup' },
  { key: 'women', title: "Women's Team", detail: "Women's Super League & Cup matches" },
  { key: 'academy', title: 'Academy (U21 & U18)', detail: 'Premier League 2 fixtures' },
] as const;

type OptionKey = (typeof OPTIONS)[number]['key'];

export function CalendarSyncSheet({ visible, onClose, onConfirm }: Props) {
  const [enabled, setEnabled] = useState<Record<OptionKey, boolean>>({
    men: true,
    women: true,
    academy: false,
  });

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
          <Text className="mb-5 font-body text-sm text-neutral-400">
            Add match schedules to your calendar. Kick-off times stay updated automatically.
          </Text>

          {OPTIONS.map((option) => (
            <View
              key={option.key}
              style={{ borderBottomWidth: 1, borderBottomColor: ARSENAL.divider }}
              className="flex-row items-center justify-between py-3">
              <View className="flex-1 pr-3">
                <Text className="font-body-semibold text-[15px] text-white">{option.title}</Text>
                <Text className="font-body text-xs text-neutral-400">{option.detail}</Text>
              </View>
              <Switch
                value={enabled[option.key]}
                onValueChange={(value) => setEnabled((prev) => ({ ...prev, [option.key]: value }))}
                trackColor={{ false: '#3A3A3C', true: ARSENAL.red }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}

          <Pressable
            onPress={onConfirm}
            style={{ backgroundColor: ARSENAL.red, height: 44, borderRadius: 22 }}
            className="mt-6 items-center justify-center active:opacity-85">
            <Text className="font-body-semibold text-sm text-white">ADD TO CALENDAR</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
