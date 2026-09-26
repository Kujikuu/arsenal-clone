import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { OrderStatusBadge } from '@/components/store/OrderStatusBadge';
import { SignInPrompt } from '@/components/ui/SignInPrompt';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useOrders } from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatLongDate, formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { PALETTE } from '@/theme/palette';

/** Order history from the shop. */
export default function OrdersScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const orders = useOrders(user?.id);

  if (!user) {
    return (
      <SubScreen title="My Orders">
        {authLoading ? <LoadingState /> : <SignInPrompt message="Sign in to see your orders." />}
      </SubScreen>
    );
  }

  const list = orders.data ?? [];

  return (
    <SubScreen title="My Orders" onRefresh={orders.refetch}>
      {orders.error ? (
        <ErrorState error={orders.error} onRetry={orders.refetch} />
      ) : orders.loading && !list.length ? (
        <LoadingState />
      ) : !list.length ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="Anything you buy in the shop will appear here."
          actionLabel="SHOP NOW"
          onAction={() => router.push('/store')}
        />
      ) : (
        <View style={{ marginTop: 16 }}>
          {list.map((order) => {
            const items = order.items ?? [];
            const count = items.reduce((n, i) => n + i.quantity, 0);
            return (
              <Pressable
                key={order.id}
                onPress={() => router.push(`/store/order/${order.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Order ${order.order_number}`}
                style={{
                  backgroundColor: PALETTE.surface,
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 12,
                }}
                className="active:opacity-80">
                <View className="flex-row items-center justify-between">
                  <Text className="font-body-semibold text-white" style={{ fontSize: 15.5 }}>
                    {order.order_number}
                  </Text>
                  <OrderStatusBadge status={order.status} />
                </View>
                <Text
                  className="font-body"
                  style={{ fontSize: 13.5, color: PALETTE.textMuted, marginTop: 4 }}>
                  {formatLongDate(order.created_at)} · {count} item{count === 1 ? '' : 's'} ·{' '}
                  {formatPrice(order.total, order.currency)}
                </Text>
                <View className="flex-row items-center" style={{ marginTop: 12 }}>
                  {items.slice(0, 4).map((item) => (
                    <Image
                      key={item.id}
                      source={resolveImage(item.image_url)}
                      style={{
                        width: 48,
                        height: 54,
                        borderRadius: 4,
                        marginRight: 8,
                        backgroundColor: PALETTE.surfaceRaised,
                      }}
                    />
                  ))}
                  {items.length > 4 ? (
                    <Text className="font-body" style={{ fontSize: 13, color: PALETTE.textMuted }}>
                      +{items.length - 4}
                    </Text>
                  ) : null}
                  <View className="flex-1 items-end">
                    <Feather name="chevron-right" size={22} color={PALETTE.textMuted} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </SubScreen>
  );
}
