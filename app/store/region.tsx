import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StoreButton } from '@/components/store/ui/Buttons';
import { ShirtArt } from '@/components/store/ui/ShirtArt';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { SHIPPING_ZONES, useRegionStore, type ShippingZone } from '@/store/regionStore';
import type { Currency } from '@/types/database';
import { STORE } from '@/theme/store';

function Option({
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
        minHeight: 48,
        paddingHorizontal: 14,
        marginBottom: 8,
        borderRadius: 4,
        backgroundColor: STORE.muted,
        borderWidth: 1.5,
        borderColor: selected ? STORE.text : 'transparent',
      }}
      className="flex-row items-center justify-between">
      <Text className="font-body" style={{ fontSize: 15, color: STORE.text }}>
        {label}
      </Text>
      {selected ? (
        <Text className="font-body-bold" style={{ fontSize: 13, color: STORE.text }}>
          ✓
        </Text>
      ) : null}
    </Pressable>
  );
}

/** "NOW SHIPPING WORLDWIDE": delivery location and currency. */
export default function RegionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, update } = useSettings();
  const zone = useRegionStore((s) => s.zone);
  const setZone = useRegionStore((s) => s.setZone);
  const [draftZone, setDraftZone] = useState<ShippingZone>(zone);
  const [draftCurrency, setDraftCurrency] = useState<Currency>(settings.currency);

  const save = async () => {
    setZone(draftZone);
    if (draftCurrency !== settings.currency)
      await update({ currency: draftCurrency }).catch(() => {});
    router.back();
  };

  return (
    <View className="flex-1 justify-center" style={{ backgroundColor: STORE.overlay, padding: 20 }}>
      <View style={{ backgroundColor: STORE.surface, maxHeight: '92%' }}>
        <View className="flex-row" style={{ height: width * 0.42, backgroundColor: '#D4E6F4' }}>
          <View className="flex-1 items-center justify-center">
            <ShirtArt style="home" size={width * 0.38} />
          </View>
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: '#1B2A4A' }}>
            <ShirtArt style="away" back name="SAKA" number={7} size={width * 0.38} />
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <StoreHeading size={18}>Now shipping worldwide</StoreHeading>
          <Text
            className="font-body"
            style={{ fontSize: 13, color: STORE.textMuted, marginTop: 18, marginBottom: 8 }}>
            Location*
          </Text>
          {SHIPPING_ZONES.map((z) => (
            <Option
              key={z.value}
              label={z.label}
              selected={draftZone === z.value}
              onPress={() => {
                setDraftZone(z.value);
                setDraftCurrency(z.currency);
              }}
            />
          ))}
          <Text
            className="font-body"
            style={{ fontSize: 13, color: STORE.textMuted, marginTop: 14, marginBottom: 8 }}>
            Change currency
          </Text>
          <Option
            label="Pound Sterling (£)"
            selected={draftCurrency === 'GBP'}
            onPress={() => setDraftCurrency('GBP')}
          />
          <Option
            label="US Dollar ($)"
            selected={draftCurrency === 'USD'}
            onPress={() => setDraftCurrency('USD')}
          />
          <View className="flex-row" style={{ marginTop: 18 }}>
            <StoreButton
              label="Cancel"
              variant="secondary"
              onPress={() => router.back()}
              style={{ flex: 1, marginRight: 10 }}
            />
            <StoreButton label="Save" onPress={save} style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
