import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SignInPrompt } from '@/components/ui/SignInPrompt';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { RETURN_REASONS, RETURN_STATUS_LABEL, useReturns } from '@/lib/api/store';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatLongDate } from '@/lib/format';
import { PALETTE } from '@/theme/palette';

/** Return requests across all orders. */
export default function ReturnsScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const returns = useReturns(user?.id);

  if (!user) {
    return (
      <SubScreen title="Returns">
        {authLoading ? <LoadingState /> : <SignInPrompt message="Sign in to see your returns." />}
      </SubScreen>
    );
  }

  const list = returns.data ?? [];
  return (
    <SubScreen title="Returns" onRefresh={returns.refetch}>
      {returns.error ? (
        <ErrorState error={returns.error} onRetry={returns.refetch} />
      ) : returns.loading && !list.length ? (
        <LoadingState />
      ) : !list.length ? (
        <EmptyState
          icon="return-down-back-outline"
          title="No returns"
          message="To send something back, open the order in My Orders and tap Request a return."
          actionLabel="MY ORDERS"
          onAction={() => router.push('/account/orders')}
        />
      ) : (
        <View style={{ marginTop: 16 }}>
          {list.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/store/order/${r.order_id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Return ${r.return_number}`}
              style={{
                backgroundColor: PALETTE.surface,
                borderRadius: 8,
                padding: 14,
                marginBottom: 12,
              }}
              className="active:opacity-80">
              <View className="flex-row items-center justify-between">
                <Text className="font-body-semibold text-white" style={{ fontSize: 15.5 }}>
                  {r.return_number}
                </Text>
                <Text className="font-body-semibold" style={{ fontSize: 13, color: PALETTE.red }}>
                  {RETURN_STATUS_LABEL[r.status]}
                </Text>
              </View>
              <Text
                className="font-body"
                style={{ fontSize: 13.5, color: PALETTE.textMuted, marginTop: 4 }}>
                Order {r.order?.order_number} · {formatLongDate(r.created_at)} ·{' '}
                {RETURN_REASONS.find((x) => x.value === r.reason)?.label}
              </Text>
              {(r.items ?? []).map((i) => (
                <Text
                  key={i.order_item_id}
                  className="font-body text-white"
                  style={{ fontSize: 14, marginTop: 6 }}>
                  {i.quantity} × {i.item?.title} ({i.item?.size})
                </Text>
              ))}
              <View className="items-end" style={{ marginTop: 4 }}>
                <Feather name="chevron-right" size={20} color={PALETTE.textMuted} />
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </SubScreen>
  );
}
