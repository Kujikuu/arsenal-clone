import React from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { PillButton } from '@/components/ui/PillButton';
import {
  DEFAULT_STORE_FILTERS,
  STORE_PRICE_FILTERS,
  STORE_SIZE_FILTERS,
  STORE_SORTS,
  type StoreFilters,
} from '@/lib/api/store';
import { formatPrice } from '@/lib/format';
import type { Currency } from '@/types/database';
import { PALETTE } from '@/theme/palette';

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
        backgroundColor: selected ? PALETTE.red : PALETTE.chip,
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
  value: StoreFilters;
  currency: Currency;
  onChange: (value: StoreFilters) => void;
  onClose: () => void;
}

/** Sort and filter the shop (same sheet style as search filters). */
export function StoreFilterSheet({ visible, value, currency, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/60">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: PALETTE.surface, maxHeight: '85%' }}
          className="rounded-t-2xl p-6 pb-10">
          <View className="mb-5 h-1 w-12 self-center rounded-full bg-neutral-600" />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-3 font-body-bold text-lg text-white">Sort by</Text>
            <View className="flex-row flex-wrap">
              {STORE_SORTS.map((s) => (
                <Chip
                  key={s.value}
                  label={s.label}
                  selected={value.sort === s.value}
                  onPress={() => onChange({ ...value, sort: s.value })}
                />
              ))}
            </View>
            <Text className="mb-3 mt-4 font-body-bold text-lg text-white">Size in stock</Text>
            <View className="flex-row flex-wrap">
              <Chip
                label="Any"
                selected={value.size === null}
                onPress={() => onChange({ ...value, size: null })}
              />
              {STORE_SIZE_FILTERS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={value.size === s}
                  onPress={() => onChange({ ...value, size: s })}
                />
              ))}
            </View>
            <Text className="mb-3 mt-4 font-body-bold text-lg text-white">Price</Text>
            <View className="flex-row flex-wrap">
              <Chip
                label="Any"
                selected={value.maxPrice === null}
                onPress={() => onChange({ ...value, maxPrice: null })}
              />
              {STORE_PRICE_FILTERS.map((p) => (
                <Chip
                  key={p}
                  label={`Under ${formatPrice(p, currency).replace('.00', '')}`}
                  selected={value.maxPrice === p}
                  onPress={() => onChange({ ...value, maxPrice: p })}
                />
              ))}
            </View>
          </ScrollView>
          <View className="flex-row" style={{ marginTop: 20 }}>
            <PillButton
              label="RESET"
              variant="outline"
              height={44}
              onPress={() => onChange({ ...DEFAULT_STORE_FILTERS, search: value.search })}
              style={{ flex: 1, marginRight: 10 }}
            />
            <PillButton label="DONE" height={44} onPress={onClose} style={{ flex: 1 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
