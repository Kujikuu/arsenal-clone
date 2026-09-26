import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddressForm } from '@/components/store/AddressForm';
import { StoreButton } from '@/components/store/ui/Buttons';
import { Skeleton } from '@/components/store/ui/Misc';
import { OrderSummary } from '@/components/store/ui/OrderSummary';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { PaymentBadges } from '@/components/store/ui/StoreFooter';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { StoreEmpty, StoreError } from '@/components/store/ui/StoreStates';
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
import {
  UNAVAILABLE_MESSAGE,
  paymentsSupported,
  paymentsUnavailableReason,
  useStripe,
} from '@/lib/payments';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { printLabel, useCartStore } from '@/store/cartStore';
import { useRegionStore, zoneLabel } from '@/store/regionStore';
import type { ShippingAddress, ShippingOption } from '@/types/database';
import { STORE } from '@/theme/store';

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: selected ? STORE.text : STORE.textFaint,
      }}
      className="items-center justify-center">
      {selected ? (
        <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: STORE.text }} />
      ) : null}
    </View>
  );
}

function Choice({
  selected,
  onPress,
  children,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      style={{
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: selected ? STORE.text : STORE.divider,
        backgroundColor: STORE.surface,
        padding: 14,
        marginBottom: 10,
      }}
      className="flex-row items-start">
      <Radio selected={selected} />
      <View className="flex-1" style={{ marginLeft: 12 }}>
        {children}
      </View>
    </Pressable>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 26 }}>
      <View className="flex-row items-center" style={{ marginBottom: 14 }}>
        <View
          style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: STORE.text }}
          className="items-center justify-center">
          <Text className="font-body-bold" style={{ color: '#FFF', fontSize: 13 }}>
            {step}
          </Text>
        </View>
        <View style={{ marginLeft: 10 }}>
          <StoreHeading size={14}>{title}</StoreHeading>
        </View>
      </View>
      {children}
    </View>
  );
}

/** Checkout: member sign-in, delivery address, delivery method, summary and payment. */
export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, profile, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const currency = settings.currency;
  const zone = useRegionStore((s) => s.zone);
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const giftCard = useCartStore((s) => s.giftCard);
  const clearCart = useCartStore((s) => s.clear);
  const [method, setMethod] = useState<ShippingOption['method']>('standard');
  const quote = useCartQuote(currency, lines, { promoCode, giftCard, zone, method });
  const addresses = useAddresses(user?.id);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const saved = addresses.data ?? [];
    if (!addressId && saved.length) {
      setAddressId((saved.find((a) => a.is_default) ?? saved[0]).id);
    }
  }, [addressId, addresses.data]);

  // A method not offered in the chosen zone falls back to standard.
  useEffect(() => {
    const options = quote.data?.shipping_options ?? [];
    if (options.length && !options.some((o) => o.method === method)) setMethod('standard');
  }, [quote.data, method]);

  const shell = (children: React.ReactNode) => (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <StoreHeader minimal promo={null} />
      {children}
    </View>
  );

  if (!user) {
    return shell(
      authLoading ? (
        <Skeleton height={200} style={{ margin: 16 }} />
      ) : (
        <View style={{ padding: 20 }}>
          <View className="items-center" style={{ marginTop: 30 }}>
            <StoreHeading size={24} style={{ textAlign: 'center' }}>
              How would you like to checkout?
            </StoreHeading>
          </View>
          <View
            style={{ marginTop: 34, height: 48, borderRadius: 24, backgroundColor: STORE.selected }}
            className="items-center justify-center">
            <Text
              className="font-body-medium"
              style={{ color: '#FFF', fontSize: 15, letterSpacing: 0.4 }}>
              MEMBER LOGIN
            </Text>
          </View>
          <Text
            className="font-body"
            style={{ fontSize: 14.5, lineHeight: 21, color: STORE.text, marginTop: 20 }}>
            Sign in with your Arsenal account to check out, track your orders and get your members’
            discount on eligible products.
          </Text>
          <StoreButton
            label="Login"
            variant="bright"
            onPress={() => router.push('/auth/login')}
            style={{ marginTop: 20 }}
          />
          <Text
            onPress={() => router.push('/auth/signup')}
            accessibilityRole="link"
            className="text-center font-body"
            style={{
              fontSize: 15,
              color: STORE.text,
              marginTop: 18,
              textDecorationLine: 'underline',
            }}>
            Create an account
          </Text>
        </View>
      )
    );
  }

  if (!lines.length) {
    return shell(
      <StoreEmpty
        icon="bag-outline"
        title="Your bag is empty"
        actionLabel="Continue shopping"
        onAction={() => router.navigate('/store')}
      />
    );
  }

  const q = quote.data;
  const list = addresses.data ?? [];
  const address = list.find((a) => a.id === addressId) ?? null;
  const showForm = addingAddress || (!addresses.loading && !list.length);
  const blocked =
    !address || !q || quote.loading || Boolean(q?.promo_error) || Boolean(q?.gift_card_error);

  const finish = (orderId: string) => {
    clearCart();
    router.dismissAll();
    router.push(`/store/order/${orderId}?placed=1`);
  };

  const pay = async () => {
    if (!address || !q) return;
    if (q.amount_due > 0 && !paymentsSupported) {
      Alert.alert(
        'Card payment unavailable',
        UNAVAILABLE_MESSAGE[paymentsUnavailableReason ?? 'no-key']
      );
      return;
    }
    setPaying(true);
    try {
      const session = await startCheckout({
        currency,
        lines,
        addressId: address.id,
        promoCode,
        zone,
        method,
        giftCard,
      });
      if (session.paid) {
        finish(session.orderId);
        return;
      }

      const init = await initPaymentSheet({
        merchantDisplayName: BRAND.shop,
        customerId: session.customerId,
        customerEphemeralKeySecret: session.ephemeralKey,
        paymentIntentClientSecret: session.paymentIntentClientSecret,
        returnURL: 'arsenal-clone://stripe-redirect',
        style: 'alwaysLight',
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
        appearance: { colors: { primary: STORE.cta } },
        primaryButtonLabel: `Pay ${formatPrice(q.amount_due, currency)}`,
      });
      if (init.error) throw new CheckoutError(init.error.message);

      const result = await presentPaymentSheet();
      if (result.error) {
        // Closing the sheet keeps the bag; the unpaid order is cancelled on the next attempt.
        if (result.error.code !== 'Canceled')
          Alert.alert('Payment not completed', result.error.message);
        return;
      }
      finish(session.orderId);
    } catch (error) {
      const err = error as CheckoutError;
      const backToBag = ['out_of_stock', 'promo', 'gift_card'].includes(err.reason ?? '');
      Alert.alert(
        err.reason === 'out_of_stock' ? 'Stock has changed' : 'Checkout failed',
        err.message ?? 'Please try again.',
        backToBag ? [{ text: 'Review bag', onPress: () => router.back() }] : undefined
      );
      quote.refetch();
    } finally {
      setPaying(false);
    }
  };

  return shell(
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}>
        <View
          style={{ backgroundColor: STORE.muted, paddingVertical: 14 }}
          className="items-center">
          <StoreHeading size={16}>Checkout</StoreHeading>
        </View>

        <Section step={1} title="Delivery address">
          {addresses.error ? (
            <StoreError error={addresses.error} onRetry={addresses.refetch} />
          ) : addresses.loading && !list.length ? (
            <Skeleton height={90} />
          ) : showForm ? (
            <AddressForm
              light
              userId={user.id}
              profile={profile}
              forceDefault={!list.length}
              onCancel={list.length ? () => setAddingAddress(false) : undefined}
              onSaved={async (saved: ShippingAddress) => {
                await addresses.refetch();
                setAddressId(saved.id);
                setAddingAddress(false);
              }}
            />
          ) : (
            <>
              {list.map((a) => (
                <Choice
                  key={a.id}
                  selected={a.id === addressId}
                  onPress={() => setAddressId(a.id)}
                  label={`${a.full_name}, ${formatAddress(a)}`}>
                  <Text className="font-body-semibold" style={{ fontSize: 15, color: STORE.text }}>
                    {a.full_name}
                  </Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 14, lineHeight: 20, color: STORE.textMuted, marginTop: 2 }}>
                    {formatAddress(a)}
                  </Text>
                </Choice>
              ))}
              <StoreButton
                label="Add a new address"
                variant="secondary"
                height={42}
                onPress={() => setAddingAddress(true)}
              />
            </>
          )}
        </Section>

        {!showForm ? (
          <>
            <Section step={2} title="Delivery method">
              <View className="flex-row items-center justify-between" style={{ marginBottom: 12 }}>
                <Text className="font-body" style={{ fontSize: 14, color: STORE.textMuted }}>
                  Delivering to {zoneLabel(zone)}
                </Text>
                <Text
                  onPress={() => router.push('/store/region')}
                  accessibilityRole="link"
                  className="font-body-semibold"
                  style={{ fontSize: 14, color: STORE.text, textDecorationLine: 'underline' }}>
                  Change
                </Text>
              </View>
              {(q?.shipping_options ?? []).map((o) => (
                <Choice
                  key={o.method}
                  selected={o.method === method}
                  onPress={() => setMethod(o.method)}
                  label={`${o.label}, ${o.eta}`}>
                  <View className="flex-row justify-between">
                    <Text
                      className="font-body-semibold"
                      style={{ fontSize: 15, color: STORE.text }}>
                      {o.label}
                    </Text>
                    <Text className="font-body-bold" style={{ fontSize: 15, color: STORE.text }}>
                      {o.price > 0 ? formatPrice(o.price, currency) : 'FREE'}
                    </Text>
                  </View>
                  <Text
                    className="font-body"
                    style={{ fontSize: 13.5, color: STORE.textMuted, marginTop: 2 }}>
                    {o.eta}
                  </Text>
                </Choice>
              ))}
              {!q ? <Skeleton height={70} /> : null}
            </Section>

            <Section step={3} title="Review and pay">
              {lines.map((l, i) => (
                <View key={l.key} className="flex-row items-center" style={{ marginBottom: 12 }}>
                  <ProductImage uri={l.imageUrl} width={52} height={52} radius={4} />
                  <View className="flex-1" style={{ marginLeft: 12 }}>
                    <Text
                      className="font-body"
                      style={{ fontSize: 14.5, color: STORE.text }}
                      numberOfLines={2}>
                      {l.title}
                    </Text>
                    <Text className="font-body" style={{ fontSize: 13, color: STORE.textMuted }}>
                      Size {l.size} · Qty {l.quantity}
                      {l.print ? ` · ${printLabel(l.print)}` : ''}
                    </Text>
                  </View>
                  <Text
                    className="font-body-semibold"
                    style={{ fontSize: 14.5, color: STORE.text, marginLeft: 8 }}>
                    {q?.lines[i] ? formatPrice(q.lines[i].line_total, currency) : '…'}
                  </Text>
                </View>
              ))}
              <View style={{ height: 1, backgroundColor: STORE.divider, marginVertical: 10 }} />
              {quote.error ? (
                <StoreError error={quote.error} onRetry={quote.refetch} />
              ) : !q ? (
                <Skeleton height={100} />
              ) : (
                <OrderSummary
                  currency={currency}
                  values={{
                    subtotal: q.subtotal,
                    member_discount: q.member_discount,
                    discount: q.discount,
                    promoCode: q.promo?.code,
                    shipping: q.shipping,
                    shippingLabel: q.shipping_options.find((o) => o.method === method)?.label,
                    gift_card: q.gift_card?.amount,
                    total: q.total,
                    amount_due: q.amount_due,
                  }}
                />
              )}
              {q?.promo_error || q?.gift_card_error ? (
                <Text
                  className="font-body"
                  style={{ fontSize: 13, color: STORE.sale, marginTop: 8 }}>
                  {q.promo_error ?? q.gift_card_error}. Update your bag to continue.
                </Text>
              ) : null}
              <StoreButton
                label={
                  q && q.amount_due === 0
                    ? 'Place order'
                    : q
                      ? `Pay ${formatPrice(q.amount_due, currency)}`
                      : 'Pay'
                }
                variant="bright"
                onPress={pay}
                loading={paying}
                disabled={blocked}
                style={{ marginTop: 18 }}
              />
              <View className="flex-row items-center justify-center" style={{ marginTop: 14 }}>
                <Ionicons name="lock-closed" size={14} color={STORE.textMuted} />
                <Text
                  className="font-body"
                  style={{ fontSize: 12.5, color: STORE.textMuted, marginLeft: 6 }}>
                  Secure payment by Stripe. Items are reserved for 30 minutes.
                </Text>
              </View>
              <View style={{ marginTop: 16 }}>
                <PaymentBadges dark={false} />
              </View>
            </Section>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
