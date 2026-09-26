import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AddressForm } from '@/components/store/AddressForm';
import { PriceSummary } from '@/components/store/PriceSummary';
import { Card, SectionTitle } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { SignInPrompt } from '@/components/ui/SignInPrompt';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import {
  CheckoutError,
  formatAddress,
  startCheckout,
  useAddresses,
  useCartQuote,
} from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import { BRAND } from '@/lib/brand';
import { formatPrice } from '@/lib/format';
import { paymentsSupported, useStripe } from '@/lib/payments';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { printLabel, useCartStore } from '@/store/cartStore';
import type { ShippingAddress } from '@/types/database';
import { PALETTE } from '@/theme/palette';

function AddressOption({
  address,
  selected,
  onPress,
}: {
  address: ShippingAddress;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={{
        borderRadius: 8,
        borderWidth: 1.2,
        borderColor: selected ? PALETTE.red : PALETTE.divider,
        backgroundColor: PALETTE.surface,
        padding: 14,
        marginBottom: 10,
      }}
      className="flex-row items-start">
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={20}
        color={selected ? PALETTE.red : PALETTE.textMuted}
      />
      <View className="flex-1" style={{ marginLeft: 10 }}>
        <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
          {address.full_name}
        </Text>
        <Text
          className="font-body"
          style={{ fontSize: 14, lineHeight: 19, color: PALETTE.textMuted, marginTop: 3 }}>
          {formatAddress(address)}
        </Text>
      </View>
    </Pressable>
  );
}

/** Delivery address, order review and payment with the Stripe PaymentSheet. */
export default function CheckoutScreen() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const currency = settings.currency;
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const clearCart = useCartStore((s) => s.clear);
  const quote = useCartQuote(currency, lines, promoCode);
  const addresses = useAddresses(user?.id);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [paying, setPaying] = useState(false);

  const list = addresses.data ?? [];
  useEffect(() => {
    const saved = addresses.data ?? [];
    if (!addressId && saved.length) {
      setAddressId((saved.find((a) => a.is_default) ?? saved[0]).id);
    }
  }, [addressId, addresses.data]);

  if (!user) {
    return (
      <SubScreen title="Checkout">
        {authLoading ? <LoadingState /> : <SignInPrompt message="Sign in to place your order." />}
      </SubScreen>
    );
  }

  if (!lines.length) {
    return (
      <SubScreen title="Checkout">
        <EmptyState icon="bag-outline" title="Your bag is empty" />
      </SubScreen>
    );
  }

  const q = quote.data;
  const address = list.find((a) => a.id === addressId) ?? null;
  const showForm = addingAddress || (!addresses.loading && !list.length);

  const pay = async () => {
    if (!address || !q) return;
    if (!paymentsSupported) {
      Alert.alert('Payments unavailable', 'Checkout is available in the mobile app.');
      return;
    }
    setPaying(true);
    try {
      const session = await startCheckout({
        currency,
        lines,
        addressId: address.id,
        promoCode,
      });

      const init = await initPaymentSheet({
        merchantDisplayName: BRAND.shop,
        customerId: session.customerId,
        customerEphemeralKeySecret: session.ephemeralKey,
        paymentIntentClientSecret: session.paymentIntentClientSecret,
        returnURL: 'arsenal-clone://stripe-redirect',
        style: 'alwaysDark',
        applePay: { merchantCountryCode: 'GB' },
        googlePay: { merchantCountryCode: 'GB', currencyCode: currency, testEnv: __DEV__ },
        defaultBillingDetails: {
          name: address.full_name,
          phone: address.phone ?? undefined,
          email: user.email,
          address: { postalCode: address.postcode },
        },
        defaultShippingDetails: {
          name: address.full_name,
          phone: address.phone ?? undefined,
          address: {
            line1: address.line1,
            line2: address.line2 ?? undefined,
            city: address.city,
            state: address.region ?? undefined,
            postalCode: address.postcode,
          },
        },
        appearance: { colors: { primary: PALETTE.red } },
        primaryButtonLabel: `Pay ${formatPrice(Number(q.total), currency)}`,
      });
      if (init.error) throw new CheckoutError(init.error.message);

      const result = await presentPaymentSheet();
      if (result.error) {
        // Closing the sheet keeps the bag; the unpaid order is cancelled on the next attempt.
        if (result.error.code !== 'Canceled') {
          Alert.alert('Payment not completed', result.error.message);
        }
        return;
      }

      clearCart();
      router.dismissAll();
      router.push(`/store/order/${session.orderId}?placed=1`);
    } catch (error) {
      const err = error as CheckoutError;
      Alert.alert(
        err.reason === 'out_of_stock' ? 'Stock has changed' : 'Checkout failed',
        err.message ?? 'Please try again.',
        err.reason === 'out_of_stock' || err.reason === 'promo'
          ? [{ text: 'Review bag', onPress: () => router.back() }]
          : undefined
      );
      quote.refetch();
    } finally {
      setPaying(false);
    }
  };

  return (
    <SubScreen
      title="Checkout"
      onRefresh={async () => {
        await Promise.all([quote.refetch(), addresses.refetch()]);
      }}
      footer={
        showForm ? undefined : (
          <PillButton
            label={q ? `PAY ${formatPrice(Number(q.total), currency)}` : 'PAY'}
            onPress={pay}
            loading={paying}
            disabled={!address || !q || quote.loading || Boolean(q?.promo_error)}
          />
        )
      }>
      <SectionTitle>DELIVERY ADDRESS</SectionTitle>
      {addresses.error ? (
        <ErrorState error={addresses.error} onRetry={addresses.refetch} />
      ) : addresses.loading && !list.length ? (
        <LoadingState />
      ) : showForm ? (
        <AddressForm
          userId={user.id}
          profile={profile}
          forceDefault={!list.length}
          onCancel={list.length ? () => setAddingAddress(false) : undefined}
          onSaved={async (saved) => {
            await addresses.refetch();
            setAddressId(saved.id);
            setAddingAddress(false);
          }}
        />
      ) : (
        <>
          {list.map((a) => (
            <AddressOption
              key={a.id}
              address={a}
              selected={a.id === addressId}
              onPress={() => setAddressId(a.id)}
            />
          ))}
          <PillButton
            label="ADD A NEW ADDRESS"
            variant="secondary"
            height={38}
            onPress={() => setAddingAddress(true)}
            style={{ alignSelf: 'flex-start' }}
          />
        </>
      )}

      {!showForm && (
        <>
          <SectionTitle>YOUR ORDER</SectionTitle>
          <Card style={{ paddingVertical: 14 }}>
            {lines.map((l) => (
              <View key={l.key} className="flex-row justify-between" style={{ paddingVertical: 6 }}>
                <Text
                  className="flex-1 font-body text-white"
                  style={{ fontSize: 14.5, marginRight: 12 }}
                  numberOfLines={2}>
                  {l.quantity} × {l.title} · {l.size}
                  {l.print ? ` · ${printLabel(l.print)}` : ''}
                </Text>
              </View>
            ))}
          </Card>

          <Card style={{ marginTop: 14, paddingVertical: 16 }}>
            {quote.error ? (
              <ErrorState error={quote.error} onRetry={quote.refetch} />
            ) : !q ? (
              <LoadingState padded={false} />
            ) : (
              <PriceSummary
                currency={currency}
                subtotal={Number(q.subtotal)}
                discount={Number(q.discount)}
                shipping={Number(q.shipping)}
                total={Number(q.total)}
                promoCode={q.promo?.code}
              />
            )}
          </Card>
          {q?.promo_error ? (
            <Text
              className="font-body"
              style={{ fontSize: 13, color: PALETTE.formDown, marginTop: 8 }}>
              {q.promo_error}. Remove the code from your bag to continue.
            </Text>
          ) : null}
          <Text
            className="font-body"
            style={{ fontSize: 12.5, lineHeight: 17, color: PALETTE.textDim, marginTop: 14 }}>
            Payments are processed securely by Stripe. Items are reserved for 30 minutes while you
            pay.
          </Text>
        </>
      )}
    </SubScreen>
  );
}
