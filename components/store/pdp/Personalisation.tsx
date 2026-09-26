import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SegmentedButtons } from '@/components/store/ui/Buttons';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { formatPrice } from '@/lib/format';
import type { LinePrint } from '@/store/cartStore';
import type { Currency, KitFont, PrintOptions, StorePatch } from '@/types/database';
import { STORE } from '@/theme/store';

export const FONT_LABEL: Record<KitFont, string> = {
  premier_league: 'Premier League Font',
  arsenal: 'Arsenal Font',
  pride: 'Pride Font',
};

const FONT_INFO: Record<KitFont, string> = {
  premier_league: 'The official Premier League name and number set, as worn in league matches.',
  arsenal: 'The club’s own lettering, worn in cup competitions and on the authentic shirt.',
  pride: 'The special edition lettering worn by Arsenal Women.',
};

type Info = 'font' | 'patch' | null;

function Label({ children, onInfo }: { children: string; onInfo?: () => void }) {
  return (
    <View className="flex-row items-center" style={{ marginTop: 22, marginBottom: 10 }}>
      <StoreHeading size={12.5}>{children}</StoreHeading>
      {onInfo ? (
        <Pressable
          onPress={onInfo}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="More information"
          style={{ marginLeft: 8 }}>
          <Ionicons name="information-circle-outline" size={20} color={STORE.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

function Dropdown({
  label,
  onPress,
  placeholder,
}: {
  label: string | null;
  onPress: () => void;
  placeholder: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? placeholder}
      style={{ height: 54, borderRadius: 8, backgroundColor: STORE.muted, paddingHorizontal: 16 }}
      className="flex-row items-center justify-between">
      <Text
        className="font-body-bold"
        style={{ fontSize: 14, color: STORE.text, letterSpacing: 0.4 }}>
        {(label ?? placeholder).toUpperCase()}
      </Text>
      <Feather name="chevron-down" size={22} color={STORE.text} />
    </Pressable>
  );
}

function CountedInput({
  label,
  value,
  max,
  onChange,
  numeric,
  flex,
}: {
  label: string;
  value: string;
  max: number;
  onChange: (v: string) => void;
  numeric?: boolean;
  flex: number;
}) {
  return (
    <View
      style={{
        flex,
        height: 54,
        borderRadius: 8,
        backgroundColor: STORE.muted,
        paddingHorizontal: 14,
      }}
      className="flex-row items-center">
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor={STORE.textMuted}
        autoCapitalize="characters"
        autoCorrect={false}
        keyboardType={numeric ? 'number-pad' : 'default'}
        maxLength={max}
        accessibilityLabel={label}
        className="font-body-semibold"
        style={{ flex: 1, minWidth: 0, fontSize: 15, color: STORE.text, height: 54 }}
      />
      <Text
        className="font-body-bold"
        style={{ fontSize: 13, color: STORE.text, flexShrink: 0, marginLeft: 6 }}>
        {value.length}/{max}
      </Text>
    </View>
  );
}

interface Props {
  options: PrintOptions;
  patches: StorePatch[];
  currency: Currency;
  value: LinePrint | null;
  onChange: (print: LinePrint | null) => void;
}

/** PERSONALISE YOUR KIT: player or custom printing, kit font and patch. */
export function Personalisation({ options, patches, currency, value, onChange }: Props) {
  const [picker, setPicker] = useState<'player' | 'patch' | null>(null);
  const [info, setInfo] = useState<Info>(null);
  const font = value?.font ?? options.fonts[0];
  const patch = patches.find((p) => p.id === value?.patchId) ?? null;

  const set = (patchValue: Partial<LinePrint>) =>
    onChange({ type: value?.type ?? 'custom', font, ...value, ...patchValue } as LinePrint);

  const chooseType = (type: 'player' | 'custom') => {
    if (value?.type === type) return;
    onChange({ type, font, patchId: value?.patchId ?? null, patchName: value?.patchName ?? null });
  };

  const playerLabel =
    value?.type === 'player' && value.name ? `${value.name} ${value.number ?? ''}`.trim() : null;

  return (
    <View>
      <StoreHeading size={13}>Personalise your kit - optional</StoreHeading>
      <Text
        className="font-body"
        style={{ fontSize: 14, color: STORE.text, marginTop: 4, marginBottom: 12 }}>
        Personalise your item or create the perfect gift.
      </Text>
      <SegmentedButtons
        options={['player', 'custom'] as const}
        value={value?.type ?? null}
        onChange={chooseType}
        height={44}
      />

      {value?.type === 'player' ? (
        <>
          <Label>{`Select player (${formatPrice(options.player_price, currency)})`}</Label>
          <Dropdown
            label={playerLabel}
            placeholder="Choose player*"
            onPress={() => setPicker('player')}
          />
        </>
      ) : null}

      {value?.type === 'custom' ? (
        <>
          <Label>{`Add name (${formatPrice(options.name_price, currency)}) & number (${formatPrice(options.number_price, currency)})`}</Label>
          <View className="flex-row">
            <CountedInput
              label="Name"
              value={value.name ?? ''}
              max={12}
              flex={1.6}
              onChange={(t) =>
                set({
                  name:
                    t
                      .toUpperCase()
                      .replace(/[^A-Z .'-]/g, '')
                      .replace(/^[^A-Z]+/, '') || null,
                })
              }
            />
            <View style={{ width: 10 }} />
            <CountedInput
              label="Number"
              value={value.number ?? ''}
              max={2}
              flex={1}
              numeric
              onChange={(t) => set({ number: t.replace(/[^0-9]/g, '') || null })}
            />
          </View>
        </>
      ) : null}

      {value ? (
        <>
          {options.fonts.length > 1 ? (
            <>
              <Label onInfo={() => setInfo('font')}>Select kit font</Label>
              <View style={{ width: '70%' }}>
                <SegmentedButtons
                  options={options.fonts}
                  value={font}
                  onChange={(f) => set({ font: f })}
                  labels={FONT_LABEL}
                  height={46}
                />
              </View>
            </>
          ) : null}
          {patches.length ? (
            <>
              <Label onInfo={() => setInfo('patch')}>Select patch - optional</Label>
              <Dropdown
                label={patch ? `${patch.name} (${formatPrice(patch.price, currency)})` : null}
                placeholder="Choose patch"
                onPress={() => setPicker('patch')}
              />
            </>
          ) : null}
          <Pressable
            onPress={() => onChange(null)}
            accessibilityRole="button"
            style={{ alignSelf: 'flex-end', marginTop: 10 }}>
            <Text
              className="font-body"
              style={{ fontSize: 13, color: STORE.text, textDecorationLine: 'underline' }}>
              Clear personalisation
            </Text>
          </Pressable>
        </>
      ) : null}

      <BottomSheet
        visible={picker === 'player'}
        onClose={() => setPicker(null)}
        title="Choose player">
        {[
          ...options.specials.map((s) => ({
            key: `s-${s.id}`,
            label: `${s.label} ${s.number}`,
            pick: () =>
              set({
                type: 'player',
                specialId: s.id,
                playerId: null,
                name: s.label,
                number: s.number,
              }),
          })),
          ...options.players.map((p) => ({
            key: p.id,
            label: `${p.name} ${p.number}`,
            pick: () =>
              set({
                type: 'player',
                playerId: p.id,
                specialId: null,
                name: p.name,
                number: String(p.number),
              }),
          })),
        ].map((row) => {
          const selected = playerLabel === row.label;
          return (
            <Pressable
              key={row.key}
              onPress={() => {
                row.pick();
                setPicker(null);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={{ height: 48, borderBottomWidth: 1, borderBottomColor: STORE.divider }}
              className="flex-row items-center justify-between">
              <Text
                className={selected ? 'font-body-bold' : 'font-body'}
                style={{ fontSize: 15.5, color: STORE.text }}>
                {row.label}
              </Text>
              {selected ? <Ionicons name="checkmark" size={20} color={STORE.text} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>

      <BottomSheet
        visible={picker === 'patch'}
        onClose={() => setPicker(null)}
        title="Choose patch">
        {[{ id: null, name: 'Without patch', price: 0 }, ...patches].map((p) => {
          const selected = (value?.patchId ?? null) === p.id;
          return (
            <Pressable
              key={p.id ?? 'none'}
              onPress={() => {
                set({ patchId: p.id, patchName: p.id ? p.name : null });
                setPicker(null);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={{ height: 48, borderBottomWidth: 1, borderBottomColor: STORE.divider }}
              className="flex-row items-center justify-between">
              <Text
                className={selected ? 'font-body-bold' : 'font-body'}
                style={{ fontSize: 15.5, color: STORE.text }}>
                {p.id ? `${p.name} (${formatPrice(p.price, currency)})` : p.name}
              </Text>
              {selected ? <Ionicons name="checkmark" size={20} color={STORE.text} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>

      <BottomSheet
        visible={info !== null}
        onClose={() => setInfo(null)}
        title={info === 'font' ? 'Kit fonts' : 'Patches'}>
        {info === 'font' ? (
          options.fonts.map((f) => (
            <View key={f} style={{ marginBottom: 14 }}>
              <Text className="font-body-bold" style={{ fontSize: 15, color: STORE.text }}>
                {FONT_LABEL[f]}
              </Text>
              <Text
                className="font-body"
                style={{ fontSize: 14, lineHeight: 20, color: STORE.textMuted, marginTop: 2 }}>
                {FONT_INFO[f]}
              </Text>
            </View>
          ))
        ) : (
          <Text className="font-body" style={{ fontSize: 14.5, lineHeight: 21, color: STORE.text }}>
            Official competition sleeve badges, heat-applied to the sleeve by our printing team.
            Printed and patched items can&apos;t be returned unless faulty.
          </Text>
        )}
      </BottomSheet>
    </View>
  );
}
