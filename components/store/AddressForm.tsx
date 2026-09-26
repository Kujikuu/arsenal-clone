import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { FormField } from '@/components/ui/FormField';
import { PillButton } from '@/components/ui/PillButton';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { saveAddress, type AddressInput } from '@/lib/api/store';
import type { ShippingAddress, UserProfile } from '@/types/database';

type Field = 'full_name' | 'line1' | 'city' | 'postcode' | 'country';
const REQUIRED: Record<Field, string> = {
  full_name: 'Enter the recipient’s name',
  line1: 'Enter the first line of the address',
  city: 'Enter a town or city',
  postcode: 'Enter a postcode',
  country: 'Enter a country',
};

interface Props {
  userId: string;
  address?: ShippingAddress | null;
  /** Prefills a new address from the member's profile. */
  profile?: Pick<UserProfile, 'full_name' | 'phone' | 'postcode' | 'country'> | null;
  /** Hide the default toggle, e.g. for a first address that becomes the default anyway. */
  forceDefault?: boolean;
  onSaved: (address: ShippingAddress) => void;
  onCancel?: () => void;
}

export function AddressForm({ userId, address, profile, forceDefault, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<AddressInput>({
    full_name: address?.full_name ?? profile?.full_name ?? '',
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    city: address?.city ?? '',
    region: address?.region ?? '',
    postcode: address?.postcode ?? profile?.postcode ?? '',
    country: address?.country ?? profile?.country ?? 'United Kingdom',
    phone: address?.phone ?? profile?.phone ?? '',
    is_default: address?.is_default ?? Boolean(forceDefault),
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [saving, setSaving] = useState(false);

  const patch = (p: Partial<AddressInput>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    const next: Partial<Record<Field, string>> = {};
    for (const field of Object.keys(REQUIRED) as Field[]) {
      if (!String(form[field] ?? '').trim()) next[field] = REQUIRED[field];
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const saved = await saveAddress(
        userId,
        {
          full_name: form.full_name.trim(),
          line1: form.line1.trim(),
          line2: form.line2?.trim() || null,
          city: form.city.trim(),
          region: form.region?.trim() || null,
          postcode: form.postcode.trim().toUpperCase(),
          country: form.country.trim(),
          phone: form.phone?.trim() || null,
          is_default: forceDefault || form.is_default,
        },
        address?.id
      );
      onSaved(saved);
    } catch (error: any) {
      Alert.alert('Could not save address', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <FormField
        label="Full name"
        value={form.full_name}
        onChangeText={(v) => patch({ full_name: v })}
        error={errors.full_name}
        autoComplete="name"
        maxLength={100}
      />
      <FormField
        label="Address line 1"
        value={form.line1}
        onChangeText={(v) => patch({ line1: v })}
        error={errors.line1}
        autoComplete="address-line1"
        maxLength={120}
      />
      <FormField
        label="Address line 2 (optional)"
        value={form.line2 ?? ''}
        onChangeText={(v) => patch({ line2: v })}
        autoComplete="address-line2"
        maxLength={120}
      />
      <FormField
        label="Town or city"
        value={form.city}
        onChangeText={(v) => patch({ city: v })}
        error={errors.city}
        maxLength={80}
      />
      <FormField
        label="County / state (optional)"
        value={form.region ?? ''}
        onChangeText={(v) => patch({ region: v })}
        maxLength={80}
      />
      <FormField
        label="Postcode"
        value={form.postcode}
        onChangeText={(v) => patch({ postcode: v })}
        error={errors.postcode}
        autoCapitalize="characters"
        autoComplete="postal-code"
        maxLength={20}
      />
      <FormField
        label="Country"
        value={form.country}
        onChangeText={(v) => patch({ country: v })}
        error={errors.country}
        autoComplete="country"
        maxLength={60}
      />
      <FormField
        label="Phone (for delivery updates)"
        value={form.phone ?? ''}
        onChangeText={(v) => patch({ phone: v })}
        keyboardType="phone-pad"
        autoComplete="tel"
        maxLength={30}
      />
      {!forceDefault && (
        <SwitchRow
          title="Default address"
          detail="Used first at checkout"
          value={Boolean(form.is_default)}
          onValueChange={(v) => patch({ is_default: v })}
          last
        />
      )}
      <View className="flex-row" style={{ marginTop: 16 }}>
        {onCancel && (
          <PillButton
            label="CANCEL"
            variant="outline"
            onPress={onCancel}
            style={{ flex: 1, marginRight: 10 }}
          />
        )}
        <PillButton label="SAVE ADDRESS" onPress={save} loading={saving} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
