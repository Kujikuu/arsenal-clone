import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Card, SectionTitle } from '@/components/ui/Card';
import { SubScreen } from '@/components/ui/SubScreen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useSettings, type SettingsPatch } from '@/lib/settings/SettingsProvider';
import { ARSENAL } from '@/theme/arsenal';

interface Choice<T extends string> {
  value: T;
  label: string;
}

function ChoiceRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="flex-row flex-wrap">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={{
              height: 36,
              borderRadius: 18,
              paddingHorizontal: 16,
              marginRight: 8,
              marginBottom: 8,
              backgroundColor: selected ? ARSENAL.red : ARSENAL.chip,
            }}
            className="items-center justify-center">
            <Text className="font-body-semibold text-white" style={{ fontSize: 14 }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** App preferences bound to public.user_settings. */
export default function PreferencesScreen() {
  const { settings, update } = useSettings();

  const save = (patch: SettingsPatch) =>
    update(patch).catch(() => Alert.alert('Could not save', 'Your preferences were not updated.'));

  return (
    <SubScreen title="Preferences">
      <SectionTitle detail="Opens the Matches tab on this team and shapes your For You feed.">
        FAVOURITE TEAM
      </SectionTitle>
      <ChoiceRow
        options={[
          { value: 'men', label: 'Men' },
          { value: 'women', label: 'Women' },
          { value: 'academy', label: 'Academy' },
        ]}
        value={settings.favourite_team_type}
        onChange={(v) => save({ favourite_team_type: v })}
      />

      <SectionTitle detail="Used for prices in the Store.">CURRENCY</SectionTitle>
      <ChoiceRow
        options={[
          { value: 'GBP', label: '£ GBP' },
          { value: 'USD', label: '$ USD' },
        ]}
        value={settings.currency}
        onChange={(v) => save({ currency: v })}
      />

      <SectionTitle detail="Language for club communications.">LANGUAGE</SectionTitle>
      <ChoiceRow
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Español' },
          { value: 'fr', label: 'Français' },
          { value: 'ar', label: 'العربية' },
        ]}
        value={settings.language}
        onChange={(v) => save({ language: v })}
      />

      <SectionTitle>PLAYBACK</SectionTitle>
      <Card>
        <SwitchRow
          title="Autoplay videos"
          detail="Start videos as soon as you open them."
          value={settings.autoplay_video}
          onValueChange={(v) => save({ autoplay_video: v })}
          last
        />
      </Card>
    </SubScreen>
  );
}
