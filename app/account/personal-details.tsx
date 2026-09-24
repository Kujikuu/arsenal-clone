import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Card, SectionTitle } from '@/components/ui/Card';
import { DateField, fromISODate, toISODate } from '@/components/ui/DateField';
import { DisplayText } from '@/components/ui/DisplayText';
import { FormField } from '@/components/ui/FormField';
import { PillButton } from '@/components/ui/PillButton';
import { SignInPrompt } from '@/components/ui/SignInPrompt';
import { SubScreen } from '@/components/ui/SubScreen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { LoadingState } from '@/components/ui/States';
import { updateProfile, type ProfilePatch } from '@/lib/api/account';
import { useAuth } from '@/lib/auth/AuthProvider';
import { ARSENAL } from '@/theme/arsenal';

const DEFAULT_DOB = new Date(1995, 0, 1);

/** Editable profile saved to public.user_profiles. */
export default function PersonalDetailsScreen() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [form, setForm] = useState<ProfilePatch>({});
  const [hasDob, setHasDob] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name,
      phone: profile.phone ?? '',
      date_of_birth: profile.date_of_birth ?? null,
      country: profile.country ?? '',
      postcode: profile.postcode ?? '',
      marketing_opt_in: profile.marketing_opt_in,
    });
    setHasDob(Boolean(profile.date_of_birth));
  }, [profile]);

  if (!user) {
    return (
      <SubScreen title="Personal Details">
        {loading ? (
          <LoadingState />
        ) : (
          <SignInPrompt message="Sign in to view and edit your details." />
        )}
      </SubScreen>
    );
  }

  if (!profile) {
    return (
      <SubScreen title="Personal Details" onRefresh={refreshProfile}>
        <LoadingState />
      </SubScreen>
    );
  }

  const patch = (p: ProfilePatch) => setForm((f) => ({ ...f, ...p }));
  const dirty =
    form.full_name !== profile.full_name ||
    (form.phone ?? '') !== (profile.phone ?? '') ||
    (form.date_of_birth ?? null) !== (profile.date_of_birth ?? null) ||
    (form.country ?? '') !== (profile.country ?? '') ||
    (form.postcode ?? '') !== (profile.postcode ?? '') ||
    form.marketing_opt_in !== profile.marketing_opt_in;

  const save = async () => {
    if (!form.full_name?.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: form.full_name.trim(),
        phone: form.phone?.trim() || null,
        date_of_birth: form.date_of_birth || null,
        country: form.country?.trim() || null,
        postcode: form.postcode?.trim().toUpperCase() || null,
        marketing_opt_in: Boolean(form.marketing_opt_in),
      });
      await refreshProfile();
      Alert.alert('Saved', 'Your details have been updated.');
    } catch (error: any) {
      Alert.alert('Could not save', error?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SubScreen
      title="Personal Details"
      onRefresh={refreshProfile}
      footer={
        <PillButton label="SAVE CHANGES" onPress={save} disabled={!dirty} loading={saving} />
      }>
      <Card style={{ marginTop: 20, paddingVertical: 18 }}>
        <DisplayText size={9.5} color="#C8C6C7" heavy={false}>
          GUNNER ID
        </DisplayText>
        <DisplayText size={18} style={{ marginTop: 8 }}>
          {profile.gunner_id_number}
        </DisplayText>
        <Text
          className="font-body"
          style={{ fontSize: 14, color: ARSENAL.textMuted, marginTop: 10 }}>
          {profile.membership_tier} · {user.email}
        </Text>
      </Card>

      <SectionTitle>YOUR DETAILS</SectionTitle>
      <FormField
        label="Full name"
        value={form.full_name ?? ''}
        onChangeText={(v) => patch({ full_name: v })}
        autoComplete="name"
      />
      <FormField
        label="Mobile number"
        value={form.phone ?? ''}
        onChangeText={(v) => patch({ phone: v })}
        keyboardType="phone-pad"
        autoComplete="tel"
        placeholder="+44"
      />
      {hasDob ? (
        <DateField
          label="Date of birth"
          value={fromISODate(form.date_of_birth) ?? DEFAULT_DOB}
          maximumDate={new Date()}
          onChange={(d) => patch({ date_of_birth: toISODate(d) })}
        />
      ) : (
        <PillButton
          label="ADD DATE OF BIRTH"
          variant="secondary"
          height={38}
          onPress={() => {
            setHasDob(true);
            patch({ date_of_birth: toISODate(DEFAULT_DOB) });
          }}
          style={{ alignSelf: 'flex-start', marginBottom: 16 }}
        />
      )}
      <FormField
        label="Country"
        value={form.country ?? ''}
        onChangeText={(v) => patch({ country: v })}
        autoComplete="country"
        placeholder="United Kingdom"
      />
      <FormField
        label="Postcode"
        value={form.postcode ?? ''}
        onChangeText={(v) => patch({ postcode: v })}
        autoCapitalize="characters"
        autoComplete="postal-code"
      />

      <SectionTitle>MARKETING</SectionTitle>
      <Card>
        <SwitchRow
          title="Club news and offers"
          detail="Hear about tickets, new kits and events by email."
          value={Boolean(form.marketing_opt_in)}
          onValueChange={(v) => patch({ marketing_opt_in: v })}
          last
        />
      </Card>
      <View style={{ height: 12 }} />
    </SubScreen>
  );
}
