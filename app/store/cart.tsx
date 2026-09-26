import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_LABEL } from '@/components/store/pdp/Personalisation';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { Accordion } from '@/components/store/ui/Accordion';
import { StoreButton } from '@/components/store/ui/Buttons';
import { Skeleton } from '@/components/store/ui/Misc';
import { OrderSummary } from '@/components/store/ui/OrderSummary';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { PaymentBadges } from '@/components/store/ui/StoreFooter';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { StoreError } from '@/components/store/ui/StoreStates';
import { quoteCart, useCartQuote, useWishlistIds } from '@/lib/api/store';
import { formatPrice } from '@/lib/format';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { MAX_LINE_QUANTITY, linePrice, useCartStore, type CartLine } from '@/store/cartStore';
import { useRegionStore } from '@/store/regionStore';
import type { CartQuoteLine, Currency } from '@/types/database';
import { STORE } from '@/theme/store';

function stockProblem(line: CartLine, quoted: CartQuoteLine | undefined, lines: CartLine[]) {
  if (!quoted) return null;
  // Printed and plain lines of one size share the same stock.
  const wanted = lines
    .filter((l) => l.variantId === line.variantId)
    .reduce((n, l) => n + l.quantity, 0);
  if (quoted.stock <= 0) return 'Sold out in this size. Remove it to continue.';
  if (wanted > quoted.stock) return `Only ${quoted.stock} left in this size.`;
  return null;
}

const Detail = ({ children }: { children: React.ReactNode }) => (
  <Text className="font-body" style={{ fontSize: 13.5, lineHeight: 21, color: STORE.textMuted }}>
    {children}
  </Text>
);

function BagLine({
  line,
  quoted,
  problem,
  currency,
  onMenu,
}: {
  line: CartLine;
  quoted?: CartQuoteLine;
  problem: string | null;
  currency: Currency;
  onMenu: () => void;
}) {
  const router = useRouter();
  const total = quoted ? quoted.line_total : linePrice(line, currency);
  const p = line.print;
  return (
    <View
      style={{
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: STORE.divider,
      }}>
      <View className="flex-row">
        <Pressable
          onPress={() => router.push(`/store/${line.productId}`)}
          accessibilityRole="link"
          accessibilityLabel={`View ${line.title}`}
          style={{ marginTop: 50 }}>
          <ProductImage uri={line.imageUrl} width={64} height={64} radius={4} />
        </Pressable>
        <View className="flex-1" style={{ marginLeft: 14 }}>
          <Text className="font-body" style={{ fontSize: 15.5, lineHeight: 21, color: STORE.text }}>
            {line.title}
          </Text>
          <Text
            className="font-body-bold"
            style={{ fontSize: 15.5, color: STORE.text, marginTop: 2 }}>
            {total == null ? '…' : formatPrice(total, currency)}
          </Text>
          <View style={{ marginTop: 14 }}>
            {p?.name ? <Detail>Name: {p.name}</Detail> : null}
            {p?.number ? <Detail>Number: {p.number}</Detail> : null}
            {p ? (
              <Detail>
                Style: {FONT_LABEL[p.font ?? 'premier_league']}
                {quoted?.print_price ? ` (${formatPrice(quoted.print_price, currency)})` : ''}
              </Detail>
            ) : null}
            {p?.patchName ? (
              <Detail>
                Patch: {p.patchName}
                {quoted?.patch_price ? ` (${formatPrice(quoted.patch_price, currency)})` : ''}
              </Detail>
            ) : null}
            <View className="flex-row" style={{ marginTop: 10 }}>
              <Detail>Size: {line.size}</Detail>
              <View style={{ width: 24 }} />
              <Detail>Qty: {line.quantity}</Detail>
            </View>
            {quoted && !quoted.returnable ? (
              <Text
                className="font-body"
                style={{ fontSize: 12.5, color: STORE.textMuted, marginTop: 4 }}>
                Personalised items can’t be returned
              </Text>
            ) : null}
            {problem ? (
              <Text
                className="font-body-semibold"
                style={{ fontSize: 13, color: STORE.sale, marginTop: 6 }}>
                {problem}
              </Text>
            ) : null}
          </View>
        </View>
        <Pressable
          onPress={onMenu}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Options for ${line.title}`}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#5F6368',
            marginTop: 60,
            marginLeft: 8,
          }}
          className="items-center justify-center">
          <Feather name="more-vertical" size={15} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

const INVALID_PROMO = /isn['’]t valid/;

/** Voucher field: takes a promo code or a gift card. */
function VoucherField({ currency, lines }: { currency: Currency; lines: CartLine[] }) {
  const promoCode = useCartStore((s) => s.promoCode);
  const giftCard = useCartStore((s) => s.giftCard);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const setGiftCard = useCartStore((s) => s.setGiftCard);
  const zone = useRegionStore((s) => s.zone);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const apply = async () => {
    const code = input.trim().toUpperCase().replace(/[\s-]/g, '');
    if (!code) return;
    setChecking(true);
    setMessage(null);
    try {
      const asPromo = await quoteCart(currency, lines, { promoCode: code, zone });
      if (!asPromo.promo_error) {
        setPromoCode(code);
        setInput('');
        return;
      }
      const asCard = await quoteCart(currency, lines, { giftCard: code, zone });
      if (asCard.gift_card) {
        setGiftCard(code);
        setInput('');
        return;
      }
      // A real promo code with a condition (e.g. minimum spend) explains itself.
      // Unknown as both: the promo code's message; a real gift card or conditional
      // promo explains itself (e.g. wrong currency, minimum spend).
      const unknownCard = !asCard.gift_card_error || INVALID_PROMO.test(asCard.gift_card_error);
      setMessage(
        INVALID_PROMO.test(asPromo.promo_error) && !unknownCard
          ? asCard.gift_card_error
          : asPromo.promo_error
      );
    } catch (e: any) {
      setMessage(e?.message ?? 'Couldn’t check this code.');
    } finally {
      setChecking(false);
    }
  };

  const chip = (label: string, onRemove: () => void) => (
    <View
      key={label}
      style={{
        backgroundColor: STORE.surface,
        borderRadius: 16,
        paddingLeft: 12,
        paddingRight: 6,
        height: 32,
        marginRight: 8,
        marginTop: 10,
      }}
      className="flex-row items-center">
      <Ionicons name="pricetag" size={14} color={STORE.success} />
      <Text
        className="font-body-semibold"
        style={{ fontSize: 13, color: STORE.text, marginHorizontal: 6 }}>
        {label}
      </Text>
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${label}`}>
        <Feather name="x" size={16} color={STORE.textMuted} />
      </Pressable>
    </View>
  );

  return (
    <View style={{ backgroundColor: STORE.muted, padding: 16 }}>
      <View className="flex-row items-center">
        <TextInput
          value={input}
          onChangeText={(t) => {
            setInput(t.toUpperCase());
            setMessage(null);
          }}
          onSubmitEditing={apply}
          placeholder="Enter voucher code"
          placeholderTextColor={STORE.text}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={29}
          accessibilityLabel="Voucher code or gift card"
          className="flex-1 font-body"
          style={{
            height: 38,
            backgroundColor: STORE.surface,
            borderRadius: 4,
            paddingHorizontal: 12,
            fontSize: 14.5,
            color: STORE.text,
          }}
        />
        <StoreButton
          label="Apply"
          height={38}
          loading={checking}
          disabled={!input.trim()}
          onPress={apply}
          style={{
            marginLeft: 10,
            minWidth: 96,
            backgroundColor: input.trim() ? STORE.cta : STORE.ctaDisabled,
          }}
        />
      </View>
      {message ? (
        <Text className="font-body" style={{ fontSize: 13, color: STORE.sale, marginTop: 8 }}>
          {message}
        </Text>
      ) : null}
      <View className="flex-row flex-wrap">
        {promoCode ? chip(promoCode, () => setPromoCode(null)) : null}
        {giftCard ? chip(`Gift card ${giftCard.slice(-4)}`, () => setGiftCard(null)) : null}
      </View>
    </View>
  );
}

/** MY BAG: server-priced lines, voucher codes and gift cards, then checkout. */
export default function BagScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const currency = settings.currency;
  const zone = useRegionStore((s) => s.zone);
  const lines = useCartStore((s) => s.lines);
  const promoCode = useCartStore((s) => s.promoCode);
  const giftCard = useCartStore((s) => s.giftCard);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const setGiftCard = useCartStore((s) => s.setGiftCard);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const wishlist = useWishlistIds();
  const quote = useCartQuote(currency, lines, { promoCode, giftCard, zone });
  const q = lines.length ? quote.data : undefined;
  const [menuKey, setMenuKey] = useState<string | null>(null);

  const quoted = (line: CartLine) => q?.lines[lines.indexOf(line)];
  const problems = lines.map((l) => stockProblem(l, quoted(l), lines));
  const hasProblem =
    problems.some(Boolean) || Boolean(q?.promo_error) || Boolean(q?.gift_card_error);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const menuLine = menuKey ? lines.find((l) => l.key === menuKey) : null;

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <StoreHeader left="back" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
        keyboardShouldPersistTaps="handled">
        <View
          style={{ backgroundColor: STORE.muted, paddingVertical: 14 }}
          className="items-center">
          <StoreHeading size={16}>{`My bag (${count} item${count === 1 ? '' : 's'})`}</StoreHeading>
        </View>

        {!lines.length ? (
          <View style={{ padding: 20 }}>
            <Text
              className="font-body-bold"
              style={{ fontSize: 18, color: STORE.text, textAlign: 'center', marginTop: 20 }}>
              Your shopping bag is empty
            </Text>
            <Text
              className="font-body-semibold"
              style={{ fontSize: 15, color: STORE.text, marginTop: 28 }}>
              Suggestions
            </Text>
            {[
              ['Browse our products by selecting a category', '/store/menu'],
              ['Check out our Shop by Player page', '/store/players'],
              ['Take a look at your wishlist', '/account/wishlist'],
            ].map(([label, href]) => (
              <Text
                key={href}
                onPress={() => router.push(href as never)}
                accessibilityRole="link"
                className="font-body"
                style={{
                  fontSize: 15,
                  color: STORE.text,
                  marginTop: 10,
                  textDecorationLine: 'underline',
                }}>
                {label}
              </Text>
            ))}
            <StoreButton
              label="Continue shopping"
              onPress={() => router.navigate('/store')}
              style={{ marginTop: 28 }}
            />
          </View>
        ) : (
          <>
            {lines.map((line, i) => (
              <BagLine
                key={line.key}
                line={line}
                quoted={quoted(line)}
                problem={problems[i]}
                currency={currency}
                onMenu={() => setMenuKey(line.key)}
              />
            ))}

            <VoucherField currency={currency} lines={lines} />
            {q?.promo_error && promoCode ? (
              <Text
                className="font-body"
                style={{ fontSize: 13, color: STORE.sale, paddingHorizontal: 16, marginTop: 8 }}>
                {q.promo_error}.{' '}
                <Text
                  className="font-body-semibold"
                  onPress={() => setPromoCode(null)}
                  style={{ textDecorationLine: 'underline' }}>
                  Remove code
                </Text>
              </Text>
            ) : null}
            {q?.gift_card_error && giftCard ? (
              <Text
                className="font-body"
                style={{ fontSize: 13, color: STORE.sale, paddingHorizontal: 16, marginTop: 8 }}>
                {q.gift_card_error}.{' '}
                <Text
                  className="font-body-semibold"
                  onPress={() => setGiftCard(null)}
                  style={{ textDecorationLine: 'underline' }}>
                  Remove gift card
                </Text>
              </Text>
            ) : null}

            <View style={{ padding: 16, paddingTop: 22 }}>
              {quote.error ? (
                <StoreError error={quote.error} onRetry={quote.refetch} />
              ) : !q ? (
                <Skeleton height={90} />
              ) : (
                <OrderSummary
                  currency={currency}
                  values={{
                    subtotal: q.subtotal,
                    member_discount: q.member_discount,
                    discount: q.discount,
                    promoCode: q.promo?.code,
                    shipping: q.shipping,
                    shippingLabel: 'Standard delivery',
                    gift_card: q.gift_card?.amount,
                    total: q.total,
                    amount_due: q.amount_due,
                  }}
                />
              )}
              {q?.free_shipping_threshold != null && q.shipping > 0 ? (
                <Text
                  className="font-body"
                  style={{ fontSize: 13, color: STORE.textMuted, marginTop: 4 }}>
                  Spend{' '}
                  {formatPrice(
                    q.free_shipping_threshold - (q.subtotal - q.member_discount - q.discount),
                    currency
                  )}{' '}
                  more for free standard delivery
                </Text>
              ) : null}
              <StoreButton
                label="Proceed to checkout"
                disabled={!q || quote.loading || Boolean(quote.error) || hasProblem}
                onPress={() => router.push('/store/checkout')}
                style={{ marginTop: 18 }}
              />
            </View>

            <View
              style={{ backgroundColor: STORE.muted, marginHorizontal: 16, paddingHorizontal: 16 }}>
              <Accordion title="Returns and refunds" compact>
                <Text
                  className="font-body"
                  style={{ fontSize: 14, lineHeight: 20, color: STORE.text }}>
                  Return unworn items within 28 days of receipt for a refund to your original
                  payment method. Personalised items can’t be returned unless faulty.{' '}
                  <Text
                    onPress={() => router.push('/legal/returns')}
                    style={{ textDecorationLine: 'underline' }}>
                    Read our returns policy
                  </Text>
                </Text>
              </Accordion>
            </View>
            <View style={{ padding: 16, paddingTop: 22 }}>
              <PaymentBadges dark={false} />
            </View>
          </>
        )}
      </ScrollView>

      <BottomSheet
        visible={Boolean(menuLine)}
        onClose={() => setMenuKey(null)}
        title={menuLine?.title ?? ''}>
        {menuLine ? (
          <View>
            <View className="flex-row items-center justify-between" style={{ marginBottom: 12 }}>
              <Text className="font-body-semibold" style={{ fontSize: 15, color: STORE.text }}>
                Quantity
              </Text>
              <QuantityStepper
                value={menuLine.quantity}
                max={MAX_LINE_QUANTITY}
                onChange={(n) => setQuantity(menuLine.key, n)}
                light
              />
            </View>
            {[
              {
                label: 'Edit size or personalisation',
                icon: 'edit-2' as const,
                run: () =>
                  router.push(
                    `/store/${menuLine.productId}?edit=${encodeURIComponent(menuLine.key)}`
                  ),
              },
              {
                label: 'Move to wishlist',
                icon: 'heart' as const,
                run: () => {
                  if (!wishlist.ids.includes(menuLine.productId)) {
                    wishlist.toggle(menuLine.productId);
                  }
                  remove(menuLine.key);
                },
              },
              {
                label: 'Remove from bag',
                icon: 'trash-2' as const,
                run: () => remove(menuLine.key),
              },
            ].map((a) => (
              <Pressable
                key={a.label}
                onPress={() => {
                  setMenuKey(null);
                  a.run();
                }}
                accessibilityRole="button"
                style={{ height: 52, borderTopWidth: 1, borderTopColor: STORE.divider }}
                className="flex-row items-center">
                <Feather name={a.icon} size={18} color={STORE.text} />
                <Text
                  className="font-body"
                  style={{ fontSize: 15.5, color: STORE.text, marginLeft: 12 }}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}
