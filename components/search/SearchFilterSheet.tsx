import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { PillButton } from '@/components/ui/PillButton';
import type { SearchKind } from '@/lib/api/search';
import type { ContentTeamType } from '@/types/database';
import { ARSENAL } from '@/theme/arsenal';

export interface SearchFilters {
  kind: SearchKind;
  teamType: ContentTeamType | null;
}

const KINDS: { value: SearchKind; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Videos' },
  { value: 'article', label: 'Articles' },
];

const TEAMS: { value: ContentTeamType | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'academy', label: 'Academy' },
  { value: 'club', label: 'Club' },
];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{
        height: 34,
        borderRadius: 17,
        paddingHorizontal: 16,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: selected ? ARSENAL.red : ARSENAL.chip,
      }}
      className="items-center justify-center">
      <Text className="font-body-semibold text-white" style={{ fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}

interface Props {
  visible: boolean;
  value: SearchFilters;
  onChange: (value: SearchFilters) => void;
  onClose: () => void;
}

export function SearchFilterSheet({ visible, value, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/60">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: ARSENAL.surface }}
          className="rounded-t-2xl p-6 pb-10">
          <View className="mb-5 h-1 w-12 self-center rounded-full bg-neutral-600" />
          <Text className="mb-3 font-body-bold text-lg text-white">Show</Text>
          <View className="flex-row flex-wrap">
            {KINDS.map((k) => (
              <Chip
                key={k.value}
                label={k.label}
                selected={value.kind === k.value}
                onPress={() => onChange({ ...value, kind: k.value })}
              />
            ))}
          </View>
          <Text className="mb-3 mt-4 font-body-bold text-lg text-white">Team</Text>
          <View className="flex-row flex-wrap">
            {TEAMS.map((t) => (
              <Chip
                key={t.label}
                label={t.label}
                selected={value.teamType === t.value}
                onPress={() => onChange({ ...value, teamType: t.value })}
              />
            ))}
          </View>
          <PillButton label="DONE" height={44} onPress={onClose} style={{ marginTop: 20 }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
