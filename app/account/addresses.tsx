import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { AddressForm } from '@/components/store/AddressForm';
import { Card, SectionTitle } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { SignInPrompt } from '@/components/ui/SignInPrompt';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { deleteAddress, formatAddress, saveAddress, useAddresses } from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { ShippingAddress } from '@/types/database';
import { PALETTE } from '@/theme/palette';

/** Delivery addresses used at checkout. */
export default function AddressesScreen() {
  const { user, profile, loading: authLoading } = useAuth();
  const addresses = useAddresses(user?.id);
  // null = list, 'new' = adding, otherwise the address being edited.
  const [editing, setEditing] = useState<ShippingAddress | 'new' | null>(null);

  if (!user) {
    return (
      <SubScreen title="Addresses">
        {authLoading ? (
          <LoadingState />
        ) : (
          <SignInPrompt message="Sign in to manage your delivery addresses." />
        )}
      </SubScreen>
    );
  }

  const list = addresses.data ?? [];

  if (editing) {
    return (
      <SubScreen title={editing === 'new' ? 'New Address' : 'Edit Address'}>
        <View style={{ marginTop: 20 }}>
          <AddressForm
            userId={user.id}
            address={editing === 'new' ? null : editing}
            profile={profile}
            forceDefault={!list.length}
            onCancel={() => setEditing(null)}
            onSaved={async () => {
              await addresses.refetch();
              setEditing(null);
            }}
          />
        </View>
      </SubScreen>
    );
  }

  const remove = (address: ShippingAddress) =>
    Alert.alert('Delete address?', formatAddress(address), [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAddress(address.id);
            await addresses.refetch();
          } catch (error: any) {
            Alert.alert('Could not delete', error?.message ?? 'Please try again.');
          }
        },
      },
    ]);

  const makeDefault = async (address: ShippingAddress) => {
    try {
      const { id, user_id, created_at, ...rest } = address;
      await saveAddress(user_id, { ...rest, is_default: true }, id);
      await addresses.refetch();
    } catch (error: any) {
      Alert.alert('Could not update', error?.message ?? 'Please try again.');
    }
  };

  return (
    <SubScreen
      title="Addresses"
      onRefresh={addresses.refetch}
      footer={<PillButton label="ADD A NEW ADDRESS" onPress={() => setEditing('new')} />}>
      {addresses.error ? (
        <ErrorState error={addresses.error} onRetry={addresses.refetch} />
      ) : addresses.loading && !list.length ? (
        <LoadingState />
      ) : !list.length ? (
        <EmptyState
          icon="location-outline"
          title="No saved addresses"
          message="Add one now or at checkout."
        />
      ) : (
        <>
          <SectionTitle>DELIVERY ADDRESSES</SectionTitle>
          {list.map((a) => (
            <Card key={a.id} style={{ paddingVertical: 16, marginBottom: 12 }}>
              <View className="flex-row items-center justify-between">
                <Text className="font-body-semibold text-white" style={{ fontSize: 15.5 }}>
                  {a.full_name}
                </Text>
                {a.is_default ? (
                  <Text
                    className="font-body-semibold"
                    style={{ fontSize: 12, color: PALETTE.red, letterSpacing: 0.5 }}>
                    DEFAULT
                  </Text>
                ) : null}
              </View>
              <Text
                className="font-body"
                style={{ fontSize: 14, lineHeight: 19, color: PALETTE.textMuted, marginTop: 4 }}>
                {formatAddress(a)}
                {a.phone ? `\n${a.phone}` : ''}
              </Text>
              <View className="flex-row" style={{ marginTop: 12 }}>
                {[
                  { label: 'Edit', onPress: () => setEditing(a) },
                  ...(a.is_default
                    ? []
                    : [{ label: 'Make default', onPress: () => makeDefault(a) }]),
                  { label: 'Delete', onPress: () => remove(a) },
                ].map((action) => (
                  <Pressable
                    key={action.label}
                    onPress={action.onPress}
                    hitSlop={6}
                    accessibilityRole="button"
                    style={{ marginRight: 20 }}
                    className="active:opacity-60">
                    <Text className="font-body-semibold text-white" style={{ fontSize: 14 }}>
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Card>
          ))}
        </>
      )}
    </SubScreen>
  );
}
