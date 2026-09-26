import React, { useEffect, useRef } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OrderStatusBadge } from '@/components/store/OrderStatusBadge';
import { PriceSummary } from '@/components/store/PriceSummary';
import { Card, SectionTitle } from '@/components/ui/Card';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { formatAddress, useOrder } from '@/lib/api/store';
import { formatLongDate, formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import type { Order, OrderStatus } from '@/types/database';
import { PALETTE } from '@/theme/palette';

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

/** How long to wait for the Stripe webhook before telling the fan to check back. */
const CONFIRM_POLL_MS = 2000;
const CONFIRM_POLL_TRIES = 15;

function Timeline({ status }: { status: OrderStatus }) {
  const reached = STEP_INDEX[status] ?? -1;
  return (
    <View className="flex-row" style={{ marginTop: 16 }}>
      {STEPS.map((step, i) => {
        const done = i <= reached;
        return (
          <View key={step.status} className="flex-1 items-center">
            <View className="w-full flex-row items-center">
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: i === 0 ? 'transparent' : done ? PALETTE.red : PALETTE.chip,
                }}
              />
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: done ? PALETTE.red : PALETTE.chip,
                }}
              />
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor:
                    i === STEPS.length - 1
                      ? 'transparent'
                      : i < reached
                        ? PALETTE.red
                        : PALETTE.chip,
                }}
              />
            </View>
            <Text
              className="font-body-semibold"
              style={{ fontSize: 12, marginTop: 6, color: done ? '#FFF' : PALETTE.textDim }}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function StatusCard({ order }: { order: Order }) {
  const pending = order.status === 'pending_payment';
  return (
    <Card style={{ marginTop: 20, paddingVertical: 18 }}>
      <View className="flex-row items-center justify-between">
        <View>
          <DisplayText size={9.5} color="#C8C6C7" heavy={false}>
            ORDER
          </DisplayText>
          <DisplayText size={16} style={{ marginTop: 6 }}>
            {order.order_number}
          </DisplayText>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>
      <Text className="font-body" style={{ fontSize: 14, color: PALETTE.textMuted, marginTop: 10 }}>
        Placed {formatLongDate(order.created_at)}
      </Text>
      {pending ? (
        <Text className="font-body text-white" style={{ fontSize: 14, marginTop: 10 }}>
          We’re confirming your payment. This usually takes a few seconds.
        </Text>
      ) : order.status === 'cancelled' ? (
        <Text className="font-body text-white" style={{ fontSize: 14, marginTop: 10 }}>
          This order was cancelled and you have not been charged.
        </Text>
      ) : order.status === 'refunded' ? (
        <Text className="font-body text-white" style={{ fontSize: 14, marginTop: 10 }}>
          This order has been refunded to your original payment method.
        </Text>
      ) : (
        <Timeline status={order.status} />
      )}
      {order.tracking_number ? (
        <Text className="font-body text-white" style={{ fontSize: 14, marginTop: 14 }}>
          Tracking number: <Text className="font-body-semibold">{order.tracking_number}</Text>
        </Text>
      ) : null}
    </Card>
  );
}

export default function OrderScreen() {
  const { id, placed } = useLocalSearchParams<{ id: string; placed?: string }>();
  const router = useRouter();
  const { data: order, loading, error, refetch } = useOrder(id);
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

  if (!order) {
    return (
      <SubScreen title="Order">
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState icon="receipt-outline" title="Order not found" />
        )}
      </SubScreen>
    );
  }

  const address = order.shipping_address;

  return (
    <SubScreen
      title={`Order ${order.order_number}`}
      onRefresh={refetch}
      footer={
        placed ? (
          <PillButton label="CONTINUE SHOPPING" onPress={() => router.replace('/store')} />
        ) : undefined
      }>
      {placed ? (
        <View className="items-center" style={{ marginTop: 28 }}>
          <Ionicons name="checkmark-circle" size={56} color={PALETTE.red} />
          <DisplayText size={17} style={{ marginTop: 12, textAlign: 'center' }}>
            THANK YOU
          </DisplayText>
          <Text
            className="text-center font-body text-white"
            style={{ fontSize: 15, lineHeight: 21, marginTop: 8 }}>
            Your order is in. We’ll let you know when it’s on its way.
          </Text>
        </View>
      ) : null}

      <StatusCard order={order} />

      <SectionTitle>ITEMS</SectionTitle>
      <Card style={{ paddingVertical: 6 }}>
        {(order.items ?? []).map((item, i, all) => (
          <View
            key={item.id}
            className="flex-row items-center"
            style={{
              paddingVertical: 12,
              borderBottomWidth: i === all.length - 1 ? 0 : 1,
              borderBottomColor: PALETTE.divider,
            }}>
            <Image
              source={resolveImage(item.image_url)}
              style={{
                width: 56,
                height: 64,
                borderRadius: 5,
                backgroundColor: PALETTE.surfaceRaised,
              }}
            />
            <View className="flex-1" style={{ marginLeft: 12 }}>
              <Text
                className="font-body-semibold text-white"
                style={{ fontSize: 14.5 }}
                numberOfLines={2}>
                {item.title}
              </Text>
              <Text
                className="font-body"
                style={{ fontSize: 13, color: PALETTE.textMuted, marginTop: 3 }}>
                {item.quantity} × Size {item.size}
                {item.custom_name || item.custom_number
                  ? ` · ${[item.custom_name, item.custom_number].filter(Boolean).join(' ')}`
                  : ''}
              </Text>
            </View>
            <Text
              className="font-body-semibold text-white"
              style={{ fontSize: 14.5, marginLeft: 8 }}>
              {formatPrice(item.line_total, order.currency)}
            </Text>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 14, paddingVertical: 16 }}>
        <PriceSummary
          currency={order.currency}
          subtotal={order.subtotal}
          discount={order.discount}
          shipping={order.shipping}
          total={order.total}
          promoCode={order.promo_code}
        />
      </Card>

      <SectionTitle>DELIVERING TO</SectionTitle>
      <Card style={{ paddingVertical: 16 }}>
        <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
          {address.full_name}
        </Text>
        <Text
          className="font-body"
          style={{ fontSize: 14, lineHeight: 19, color: PALETTE.textMuted, marginTop: 4 }}>
          {formatAddress(address)}
        </Text>
      </Card>

      <PillButton
        label="NEED HELP WITH THIS ORDER?"
        variant="outline"
        height={40}
        onPress={() => router.push('/contact')}
        style={{ marginTop: 24 }}
      />
    </SubScreen>
  );
}
