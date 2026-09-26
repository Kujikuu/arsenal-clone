import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT_LABEL } from '@/components/store/pdp/Personalisation';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { StoreButton } from '@/components/store/ui/Buttons';
import { Skeleton } from '@/components/store/ui/Misc';
import { OrderSummary } from '@/components/store/ui/OrderSummary';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { StoreEmpty, StoreError } from '@/components/store/ui/StoreStates';
import {
  ORDER_STATUS_LABEL,
  RETURN_REASONS,
  RETURN_STATUS_LABEL,
  formatAddress,
  requestReturn,
  useOrder,
  useReturnableItems,
  useReturns,
} from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatLongDate, formatPrice } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import type { Order, OrderStatus, ReturnReason } from '@/types/database';
import { STORE } from '@/theme/store';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'paid', label: 'Confirmed' },
  { status: 'processing', label: 'Preparing' },
  { status: 'shipped', label: 'Dispatched' },
  { status: 'delivered', label: 'Delivered' },
];
const STEP_INDEX: Partial<Record<OrderStatus, number>> = {
  paid: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
};
const METHOD_LABEL = {
  standard: 'Standard delivery',
  express: 'Express delivery',
  nominated: 'Nominated day',
};

/** How long to wait for the Stripe webhook before telling the fan to check back. */
const CONFIRM_POLL_MS = 2000;
const CONFIRM_POLL_TRIES = 15;

const trackingUrl = (n: string) =>
  `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(n)}`;

function Timeline({ status }: { status: OrderStatus }) {
  const reached = STEP_INDEX[status] ?? -1;
  return (
    <View className="flex-row" style={{ marginTop: 18 }}>
      {STEPS.map((step, i) => {
        const done = i <= reached;
        return (
          <View key={step.status} className="flex-1 items-center">
            <View className="w-full flex-row items-center">
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: i === 0 ? 'transparent' : done ? STORE.cta : STORE.divider,
                }}
              />
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: done ? STORE.cta : STORE.divider,
                }}
                className="items-center justify-center">
                {done ? <Ionicons name="checkmark" size={11} color="#FFF" /> : null}
              </View>
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor:
                    i === STEPS.length - 1
                      ? 'transparent'
                      : i < reached
                        ? STORE.cta
                        : STORE.divider,
                }}
              />
            </View>
            <Text
              className="font-body-semibold"
              style={{ fontSize: 12, marginTop: 6, color: done ? STORE.text : STORE.textFaint }}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function ReturnSheet({
  order,
  visible,
  onClose,
  onDone,
}: {
  order: Order;
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const items = useReturnableItems(order.id, visible);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<ReturnReason | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const chosen = Object.entries(qty).filter(([, n]) => n > 0);

  const submit = async () => {
    if (!reason || !chosen.length) return;
    setSaving(true);
    try {
      const created = await requestReturn({
        orderId: order.id,
        items: chosen.map(([order_item_id, quantity]) => ({ order_item_id, quantity })),
        reason,
        notes,
      });
      setQty({});
      setReason(null);
      setNotes('');
      onDone();
      Alert.alert(
        'Return requested',
        `Your return ${created.return_number} is with our team. We’ll email your returns label.`
      );
    } catch (e: any) {
      Alert.alert('Couldn’t request the return', e?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Request a return"
      maxHeight="90%"
      footer={
        <StoreButton
          label="Request return"
          onPress={submit}
          loading={saving}
          disabled={!reason || !chosen.length}
        />
      }>
      <Text
        className="font-body"
        style={{ fontSize: 14, lineHeight: 20, color: STORE.textMuted, marginBottom: 12 }}>
        Choose the items to send back within 28 days of receipt. Printed items can’t be returned
        unless faulty.
      </Text>
      {items.loading && !items.data?.length ? <Skeleton height={80} /> : null}
      {(items.data ?? []).map((i) => {
        const blocked = Boolean(i.reason) || i.returnable_quantity <= 0;
        const n = qty[i.order_item_id] ?? 0;
        return (
          <View
            key={i.order_item_id}
            className="flex-row items-center"
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: STORE.divider,
              opacity: blocked ? 0.55 : 1,
            }}>
            <ProductImage uri={i.image_url} width={48} height={48} radius={4} />
            <View className="flex-1" style={{ marginLeft: 10 }}>
              <Text
                className="font-body"
                style={{ fontSize: 14, color: STORE.text }}
                numberOfLines={2}>
                {i.title} ({i.size})
              </Text>
              <Text className="font-body" style={{ fontSize: 12.5, color: STORE.textMuted }}>
                {i.reason ??
                  (i.returnable_quantity > 0
                    ? `Up to ${i.returnable_quantity}`
                    : 'Already being returned')}
              </Text>
            </View>
            {!blocked ? (
              <QuantityStepper
                size="sm"
                light
                min={0}
                value={n}
                max={i.returnable_quantity}
                onChange={(v) => setQty((q) => ({ ...q, [i.order_item_id]: v }))}
              />
            ) : null}
          </View>
        );
      })}
      <Text
        className="font-body-semibold"
        style={{ fontSize: 14, color: STORE.text, marginTop: 18, marginBottom: 8 }}>
        Reason
      </Text>
      <View className="flex-row flex-wrap">
        {RETURN_REASONS.map((r) => (
          <Pressable
            key={r.value}
            onPress={() => setReason(r.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: reason === r.value }}
            style={{
              height: 36,
              paddingHorizontal: 14,
              borderRadius: 18,
              marginRight: 8,
              marginBottom: 8,
              backgroundColor: reason === r.value ? STORE.selected : STORE.chip,
            }}
            className="justify-center">
            <Text
              className="font-body-semibold"
              style={{ fontSize: 13, color: reason === r.value ? '#FFF' : STORE.text }}>
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Anything else we should know? (optional)"
        placeholderTextColor={STORE.textMuted}
        multiline
        maxLength={1000}
        accessibilityLabel="Return notes"
        className="font-body"
        style={{
          minHeight: 80,
          borderRadius: 8,
          backgroundColor: STORE.muted,
          padding: 12,
          fontSize: 14.5,
          color: STORE.text,
          textAlignVertical: 'top',
          marginTop: 8,
        }}
      />
    </BottomSheet>
  );
}

/** Order confirmation and detail: status timeline, items, totals, delivery and returns. */
export default function OrderScreen() {
  const { id, placed } = useLocalSearchParams<{ id: string; placed?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: order, loading, error, refetch } = useOrder(id);
  const returns = useReturns(user?.id, id);
  const [returning, setReturning] = useState(false);
  const now = useNow();
  const tries = useRef(0);

  // The webhook marks the order paid moments after the PaymentSheet closes.
  const pending = order?.status === 'pending_payment';
  useEffect(() => {
    if (!pending || tries.current >= CONFIRM_POLL_TRIES) return;
    const t = setTimeout(() => {
      tries.current += 1;
      refetch();
    }, CONFIRM_POLL_MS);
    return () => clearTimeout(t);
  }, [pending, order, refetch]);

  const shell = (children: React.ReactNode) => (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <StoreHeader left={placed ? 'close' : 'back'} />
      {children}
    </View>
  );

  if (!order) {
    return shell(
      error ? (
        <StoreError error={error} onRetry={refetch} />
      ) : loading ? (
        <Skeleton height={220} style={{ margin: 16 }} />
      ) : (
        <StoreEmpty icon="receipt-outline" title="Order not found" />
      )
    );
  }

  const address = order.shipping_address;
  const paidAt = order.paid_at ? new Date(order.paid_at).getTime() : 0;
  const canReturn =
    ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) &&
    paidAt > 0 &&
    now < paidAt + 35 * 86400000;

  return shell(
    <ScrollView contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}>
      {placed ? (
        <View
          className="items-center"
          style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 8 }}>
          <Ionicons name="checkmark-circle" size={60} color={STORE.success} />
          <StoreHeading size={20} style={{ marginTop: 12, textAlign: 'center' }}>
            Thank you for your order
          </StoreHeading>
          <Text
            className="text-center font-body"
            style={{ fontSize: 15, lineHeight: 21, color: STORE.text, marginTop: 8 }}>
            {`We’ve emailed your receipt${user?.email ? ` to ${user.email}` : ''}. We’ll let you know when it’s on its way.`}
          </Text>
        </View>
      ) : null}

      <View style={{ margin: 16, padding: 16, backgroundColor: STORE.muted }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-body" style={{ fontSize: 13, color: STORE.textMuted }}>
              Order number
            </Text>
            <Text className="font-body-bold" style={{ fontSize: 20, color: STORE.text }}>
              {order.order_number}
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                order.status === 'cancelled' || order.status === 'refunded'
                  ? STORE.textFaint
                  : STORE.cta,
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
            <Text className="font-body-semibold" style={{ fontSize: 12, color: '#FFF' }}>
              {ORDER_STATUS_LABEL[order.status]}
            </Text>
          </View>
        </View>
        <Text className="font-body" style={{ fontSize: 14, color: STORE.textMuted, marginTop: 6 }}>
          Placed {formatLongDate(order.created_at)}
        </Text>
        {order.status === 'pending_payment' ? (
          <Text className="font-body" style={{ fontSize: 14, color: STORE.text, marginTop: 12 }}>
            We’re confirming your payment. This usually takes a few seconds.
          </Text>
        ) : order.status === 'cancelled' ? (
          <Text className="font-body" style={{ fontSize: 14, color: STORE.text, marginTop: 12 }}>
            This order was cancelled and you have not been charged.
          </Text>
        ) : order.status === 'refunded' ? (
          <Text className="font-body" style={{ fontSize: 14, color: STORE.text, marginTop: 12 }}>
            This order has been refunded to your original payment method.
          </Text>
        ) : (
          <Timeline status={order.status} />
        )}
        {order.tracking_number ? (
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync(trackingUrl(order.tracking_number!))}
            accessibilityRole="link"
            className="flex-row items-center"
            style={{ marginTop: 16 }}>
            <Feather name="truck" size={17} color={STORE.text} />
            <Text
              className="font-body-semibold"
              style={{
                fontSize: 14.5,
                color: STORE.text,
                marginLeft: 8,
                textDecorationLine: 'underline',
              }}>
              Track parcel {order.tracking_number}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <StoreHeading size={14}>Items</StoreHeading>
        {(order.items ?? []).map((item) => (
          <View
            key={item.id}
            className="flex-row"
            style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: STORE.divider }}>
            <ProductImage uri={item.image_url} width={60} height={60} radius={4} />
            <View className="flex-1" style={{ marginLeft: 12 }}>
              <Text
                className="font-body"
                style={{ fontSize: 14.5, color: STORE.text }}
                numberOfLines={2}>
                {item.title}
              </Text>
              <Text
                className="font-body"
                style={{ fontSize: 13, lineHeight: 19, color: STORE.textMuted, marginTop: 2 }}>
                Size {item.size} · Qty {item.quantity}
                {item.custom_name || item.custom_number
                  ? `\nPrinted ${[item.custom_name, item.custom_number].filter(Boolean).join(' ')}${item.print_font ? `, ${FONT_LABEL[item.print_font]}` : ''}`
                  : ''}
                {item.patch_name ? `\n${item.patch_name} patch` : ''}
              </Text>
            </View>
            <Text
              className="font-body-semibold"
              style={{ fontSize: 14.5, color: STORE.text, marginLeft: 8 }}>
              {formatPrice(item.line_total, order.currency)}
            </Text>
          </View>
        ))}

        <View style={{ marginTop: 18 }}>
          <OrderSummary
            currency={order.currency}
            values={{
              subtotal: order.subtotal,
              member_discount: order.member_discount,
              discount: order.discount,
              promoCode: order.promo_code,
              shipping: order.shipping,
              shippingLabel: order.shipping_method
                ? METHOD_LABEL[order.shipping_method]
                : 'Delivery',
              gift_card: order.gift_card_amount,
              total: order.total,
              amount_due: order.amount_due,
            }}
          />
        </View>

        <View style={{ marginTop: 26 }}>
          <StoreHeading size={14}>Delivering to</StoreHeading>
          <Text
            className="font-body-semibold"
            style={{ fontSize: 15, color: STORE.text, marginTop: 10 }}>
            {address.full_name}
          </Text>
          <Text
            className="font-body"
            style={{ fontSize: 14, lineHeight: 20, color: STORE.textMuted, marginTop: 2 }}>
            {formatAddress(address)}
          </Text>
        </View>

        {(returns.data ?? []).length ? (
          <View style={{ marginTop: 26 }}>
            <StoreHeading size={14}>Returns</StoreHeading>
            {(returns.data ?? []).map((r) => (
              <View key={r.id} style={{ marginTop: 10, padding: 12, backgroundColor: STORE.muted }}>
                <View className="flex-row justify-between">
                  <Text
                    className="font-body-semibold"
                    style={{ fontSize: 14.5, color: STORE.text }}>
                    {r.return_number}
                  </Text>
                  <Text className="font-body-semibold" style={{ fontSize: 13.5, color: STORE.cta }}>
                    {RETURN_STATUS_LABEL[r.status]}
                  </Text>
                </View>
                {(r.items ?? []).map((ri) => (
                  <Text
                    key={ri.order_item_id}
                    className="font-body"
                    style={{ fontSize: 13.5, color: STORE.textMuted, marginTop: 4 }}>
                    {ri.quantity} × {ri.item?.title} ({ri.item?.size})
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ marginTop: 28 }}>
          {canReturn ? (
            <StoreButton
              label="Request a return"
              variant="secondary"
              onPress={() => setReturning(true)}
              style={{ marginBottom: 12 }}
            />
          ) : null}
          <StoreButton
            label="Need help with this order?"
            variant="outline"
            height={44}
            onPress={() => router.push('/contact')}
          />
          {placed ? (
            <StoreButton
              label="Continue shopping"
              onPress={() => router.navigate('/store')}
              style={{ marginTop: 12 }}
            />
          ) : null}
        </View>
      </View>

      <ReturnSheet
        order={order}
        visible={returning}
        onClose={() => setReturning(false)}
        onDone={() => {
          setReturning(false);
          returns.refetch();
        }}
      />
    </ScrollView>
  );
}
