import React from 'react';
import { View, Text } from 'react-native';
import { ORDER_STATUS_LABEL } from '@/lib/api/store';
import type { OrderStatus } from '@/types/database';
import { PALETTE } from '@/theme/palette';

const COLOR: Record<OrderStatus, string> = {
  pending_payment: PALETTE.button,
  paid: PALETTE.red,
  processing: PALETTE.red,
  shipped: PALETTE.opta,
  delivered: '#2E8B57',
  cancelled: PALETTE.chip,
  refunded: PALETTE.chip,
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <View
      style={{
        backgroundColor: COLOR[status],
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
      className="self-start">
      <Text className="font-body-semibold text-white" style={{ fontSize: 12 }}>
        {ORDER_STATUS_LABEL[status]}
      </Text>
    </View>
  );
}
