import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { PriceSummary } from '@/components/store/PriceSummary';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { Card } from '@/components/ui/Card';
import { PillButton } from '@/components/ui/PillButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { quoteCart, useCartQuote } from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { useSettings } from '@/lib/settings/SettingsProvider';
import {
  MAX_LINE_QUANTITY,
  linePrice,
  printLabel,
  useCartStore,
  type CartLine,
} from '@/store/cartStore';
import type { CartQuoteLine, Currency } from '@/types/database';
import { PALETTE } from '@/theme/palette';

function stockProblem(line: CartLine, quoted: CartQuoteLine | undefined, lines: CartLine[]) {
  if (!quoted) return null;
  // Personalised and plain lines of one size share the same stock.
  const wanted = lines
    .filter((l) => l.variantId === line.variantId)
    .reduce((n, l) => n + l.quantity, 0);
  if (quoted.stock <= 0) return 'Sold out in this size. Remove it to continue.';
  if (wanted > quoted.stock) return `Only ${quoted.stock} left in this size.`;
  return null;
}

function BagLine({
  line,
  quoted,
  problem,
  currency,
}: {
  line: CartLine;
  quoted?: CartQuoteLine;
  problem: string | null;
  currency: Currency;
}) {
  const router = useRouter();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const total = quoted ? Number(quoted.line_total) : linePrice(line, currency);
  const personalisation = printLabel(line.print);

  return (
    <View
      style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: PALETTE.divider }}
      className="flex-row">
      <Pressable
        onPress={() => router.push(`/store/${line.productId}`)}
        accessibilityRole="button"
        accessibilityLabel={`View ${line.title}`}>
        <Image
          source={resolveImage(line.imageUrl)}
          style={{ width: 84, height: 96, borderRadius: 6, backgroundColor: PALETTE.surfaceRaised }}
          resizeMode="cover"
        />
      </Pressable>
      <View className="flex-1" style={{ marginLeft: 12 }}>
        <View className="flex-row items-start">
          <Text
            className="flex-1 font-body-semibold text-white"
            style={{ fontSize: 15, lineHeight: 19 }}
            numberOfLines={2}>
            {line.title}
          </Text>
          <Pressable
            onPress={() => remove(line.key)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${line.title}`}
            style={{ marginLeft: 10 }}
            className="active:opacity-60">
            <Feather name="trash-2" size={18} color={PALETTE.textMuted} />
          </Pressable>
        </View>
        <Text
          className="font-body"
          style={{ fontSize: 13.5, color: PALETTE.textMuted, marginTop: 4 }}>
          Size {line.size}
          {personalisation ? ` · ${personalisation}` : ''}
        </Text>
        {problem ? (
          <Text
            className="font-body-semibold"
            style={{ fontSize: 13, color: PALETTE.formDown, marginTop: 4 }}>
            {problem}
          </Text>
        ) : null}
        <View className="flex-row items-center justify-between" style={{ marginTop: 10 }}>
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={MAX_LINE_QUANTITY}
            onChange={(q) => setQuantity(line.key, q)}
          />
          <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
            {total == null ? '…' : formatPrice(total, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function PromoField({ currency, lines }: { currency: Currency; lines: CartLine[] }) {
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const apply = async () => {
    const code = input.trim().toUpperCase();
    if (!code) return;
    setChecking(true);
    setMessage(null);
    try {
      const quote = await quoteCart(currency, lines, code);
      if (quote.promo_error) setMessage(quote.promo_error);
      else {
        setPromoCode(code);
        setInput('');
      }
    } catch (error: any) {
      setMessage(error?.message ?? 'Couldn’t check this code.');
    } finally {
      setChecking(false);
    }
  };

  if (promoCode) {
    return (
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="pricetag" size={16} color={PALETTE.formUp} />
          <Text className="font-body-semibold text-white" style={{ fontSize: 15, marginLeft: 8 }}>
            {promoCode}
          </Text>
        </View>
        <Pressable
          onPress={() => setPromoCode(null)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove code ${promoCode}`}>
          <Text className="font-body-semibold" style={{ fontSize: 14, color: PALETTE.textMuted }}>
            Remove
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-center">
        <TextInput
          value={input}
          onChangeText={(t) => {
            setInput(t.toUpperCase().replace(/[^A-Z0-9]/g, ''));
            setMessage(null);
          }}
          placeholder="Promo code"
          placeholderTextColor={PALETTE.textDim}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={20}
          onSubmitEditing={apply}
          returnKeyType="done"
          accessibilityLabel="Promo code"
          className="flex-1 font-body-semibold text-white"
          style={{
            height: 44,
            borderRadius: 8,
            backgroundColor: PALETTE.pill,
            paddingHorizontal: 14,
            fontSize: 15,
          }}
        />
        <PillButton
          label="APPLY"
          variant="secondary"
          height={44}
          disabled={!input.trim()}
          loading={checking}
          onPress={apply}
          style={{ marginLeft: 10 }}
        />
      </View>
      {message ? (
        <Text className="font-body" style={{ fontSize: 13, color: PALETTE.formDown, marginTop: 6 }}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

/** The bag: lines re-priced by the server, promo code and checkout. */
export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { settings } = useSettings();
  const currency = settings.currency;
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const quote = useCartQuote(currency, lines, promoCode);
  const q = lines.length ? quote.data : undefined;

  // Quote lines come back in bag order.
  const quoted = (line: CartLine) => q?.lines[lines.indexOf(line)];
  const problems = lines.map((l) => stockProblem(l, quoted(l), lines));
  const hasProblem = problems.some(Boolean) || Boolean(q?.promo_error);
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  const checkout = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push('/store/checkout');
  };

  return (
    <View className="flex-1 bg-black">
      <AppHeader
        left="close"
        title={
          <Text className="font-body text-white" style={{ fontSize: 18 }}>
            {count ? `Bag (${count})` : 'Bag'}
          </Text>
        }
      />
      {!lines.length ? (
        <EmptyState
          icon="bag-outline"
          title="Your bag is empty"
          message="Kits, training wear and gifts for every Gooner are waiting in the shop."
          actionLabel="START SHOPPING"
          onAction={() => (router.canGoBack() ? router.back() : router.replace('/store'))}
        />
      ) : (
        <>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
            {lines.map((line, i) => (
              <BagLine
                key={line.key}
                line={line}
                quoted={quoted(line)}
                problem={problems[i]}
                currency={currency}
              />
            ))}

            <Card style={{ marginTop: 20, paddingVertical: 16 }}>
              <PromoField currency={currency} lines={lines} />
              {q?.promo_error && promoCode ? (
                <Text
                  className="font-body"
                  style={{ fontSize: 13, color: PALETTE.formDown, marginTop: 6 }}>
                  {q.promo_error}.{' '}
                  <Text className="font-body-semibold" onPress={() => setPromoCode(null)}>
                    Remove code
                  </Text>
                </Text>
              ) : q?.promo?.description ? (
                <Text
                  className="font-body"
                  style={{ fontSize: 13, color: PALETTE.textMuted, marginTop: 6 }}>
                  {q.promo.description}
                </Text>
              ) : null}
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
                  freeShippingThreshold={Number(q.free_shipping_threshold)}
                />
              )}
            </Card>
          </ScrollView>
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: Math.max(insets.bottom, 12) + 6,
              borderTopWidth: 1,
              borderTopColor: PALETTE.divider,
            }}>
            <PillButton
              label={user ? 'CHECKOUT' : 'SIGN IN TO CHECK OUT'}
              disabled={!q || quote.loading || Boolean(quote.error) || hasProblem}
              onPress={checkout}
            />
          </View>
        </>
      )}
    </View>
  );
}
