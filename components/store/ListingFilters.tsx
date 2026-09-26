import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accordion } from '@/components/store/ui/Accordion';
import { StoreButton } from '@/components/store/ui/Buttons';
import { BottomSheet, SideDrawer } from '@/components/store/ui/Sheets';
import { BROWSE_SORTS, PROFILE_LABEL, type BrowseSort } from '@/lib/api/storeCatalog';
import { formatPrice } from '@/lib/format';
import type { BrowseFacets, Currency, StoreProfile } from '@/types/database';
import { STORE } from '@/theme/store';

export interface ListingFilterState {
  profiles: StoreProfile[];
  sizes: string[];
  brands: string[];
  maxPrice: number | null;
}

export const NO_FILTERS: ListingFilterState = {
  profiles: [],
  sizes: [],
  brands: [],
  maxPrice: null,
};

export const filterCount = (f: ListingFilterState) =>
  f.profiles.length + f.sizes.length + f.brands.length + (f.maxPrice != null ? 1 : 0);

const PRICE_BANDS = [25, 50, 100, 150];

function Check({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={{ minHeight: 40 }}
      className="flex-row items-center">
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: STORE.text,
          backgroundColor: checked ? STORE.text : 'transparent',
        }}
        className="items-center justify-center">
        {checked ? <Ionicons name="checkmark" size={16} color="#FFF" /> : null}
      </View>
      <Text className="font-body" style={{ fontSize: 15, color: STORE.text, marginLeft: 12 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const toggle = <T,>(list: T[], v: T) =>
  list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

/** Left drawer: FILTERS · N PRODUCTS, accordions, APPLY FILTERS. */
export function FiltersDrawer({
  visible,
  onClose,
  value,
  onApply,
  facets,
  total,
  currency,
}: {
  visible: boolean;
  onClose: () => void;
  value: ListingFilterState;
  onApply: (value: ListingFilterState) => void;
  facets: BrowseFacets | null;
  total: number;
  currency: Currency;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const profiles = facets?.profiles ?? [];
  const sizes = facets?.sizes ?? [];
  const brands = facets?.brands ?? [];

  return (
    <SideDrawer
      visible={visible}
      onClose={onClose}
      title="Filters"
      subtitle={`${total} products`}
      footer={
        <View>
          {filterCount(draft) ? (
            <StoreButton
              label="Clear all"
              variant="secondary"
              height={42}
              onPress={() => setDraft(NO_FILTERS)}
              style={{ marginBottom: 10 }}
            />
          ) : null}
          <StoreButton
            label="Apply filters"
            onPress={() => {
              onApply(draft);
              onClose();
            }}
          />
        </View>
      }>
      {profiles.length > 1 ? (
        <Accordion title="Profile" compact initiallyOpen={draft.profiles.length > 0}>
          {profiles.map((p) => (
            <Check
              key={p}
              label={PROFILE_LABEL[p]}
              checked={draft.profiles.includes(p)}
              onPress={() => setDraft((d) => ({ ...d, profiles: toggle(d.profiles, p) }))}
            />
          ))}
        </Accordion>
      ) : null}
      <Accordion title="Price" compact initiallyOpen={draft.maxPrice != null}>
        {PRICE_BANDS.filter((b) => !facets?.max_price || b < Number(facets.max_price) * 1.5).map(
          (b) => (
            <Check
              key={b}
              label={`Under ${formatPrice(b, currency).replace('.00', '')}`}
              checked={draft.maxPrice === b}
              onPress={() => setDraft((d) => ({ ...d, maxPrice: d.maxPrice === b ? null : b }))}
            />
          )
        )}
      </Accordion>
      {sizes.length ? (
        <Accordion
          title="Sizes"
          compact
          initiallyOpen={draft.sizes.length > 0}
          last={brands.length < 2}>
          <View className="flex-row flex-wrap">
            {sizes.map((s) => {
              const on = draft.sizes.includes(s);
              return (
                <Pressable
                  key={s}
                  onPress={() => setDraft((d) => ({ ...d, sizes: toggle(d.sizes, s) }))}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={{
                    minWidth: 56,
                    height: 38,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: on ? STORE.selected : STORE.chip,
                  }}
                  className="items-center justify-center">
                  <Text
                    className="font-body-semibold"
                    style={{ fontSize: 13, color: on ? '#FFF' : STORE.text }}>
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Accordion>
      ) : null}
      {brands.length > 1 ? (
        <Accordion title="Brand" compact initiallyOpen={draft.brands.length > 0} last>
          {brands.map((b) => (
            <Check
              key={b}
              label={b}
              checked={draft.brands.includes(b)}
              onPress={() => setDraft((d) => ({ ...d, brands: toggle(d.brands, b) }))}
            />
          ))}
        </Accordion>
      ) : null}
    </SideDrawer>
  );
}

export function SortSheet({
  visible,
  value,
  onChange,
  onClose,
}: {
  visible: boolean;
  value: BrowseSort;
  onChange: (sort: BrowseSort) => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Sort by">
      {BROWSE_SORTS.map((s) => {
        const selected = s.value === value;
        return (
          <Pressable
            key={s.value}
            onPress={() => {
              onChange(s.value);
              onClose();
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={{ height: 52, borderBottomWidth: 1, borderBottomColor: STORE.divider }}
            className="flex-row items-center justify-between">
            <Text
              className={selected ? 'font-body-bold' : 'font-body'}
              style={{ fontSize: 16, color: STORE.text }}>
              {s.label}
            </Text>
            {selected ? <Ionicons name="checkmark" size={20} color={STORE.text} /> : null}
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}
