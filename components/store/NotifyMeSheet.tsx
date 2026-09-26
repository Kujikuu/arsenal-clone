import React, { useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { StoreButton } from '@/components/store/ui/Buttons';
import { BottomSheet } from '@/components/store/ui/Sheets';
import { subscribeStockAlert } from '@/lib/api/storeCatalog';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { StoreProductVariant } from '@/types/database';
import { STORE } from '@/theme/store';

/** "Email me when it's back" for a sold-out size; alerts arrive as a push notification. */
export function NotifyMeSheet({
  variant,
  productTitle,
  onClose,
}: {
  variant: StoreProductVariant | null;
  productTitle: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  const close = () => {
    setState('idle');
    onClose();
  };

  const subscribe = async () => {
    if (!variant) return;
    if (!user) {
      close();
      router.push('/auth/login');
      return;
    }
    setState('saving');
    try {
      await subscribeStockAlert(user.id, variant.id);
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <BottomSheet
      visible={Boolean(variant)}
      onClose={close}
      title="Back in stock alert"
      footer={
        state === 'done' ? (
          <StoreButton label="Done" onPress={close} />
        ) : (
          <StoreButton
            label={user ? 'Notify me' : 'Sign in to be notified'}
            onPress={subscribe}
            loading={state === 'saving'}
          />
        )
      }>
      <Text className="font-body" style={{ fontSize: 15, lineHeight: 21, color: STORE.text }}>
        {state === 'done'
          ? `We'll send you a notification as soon as ${productTitle} is back in size ${variant?.size}.`
          : `${productTitle} is sold out in size ${variant?.size}. We'll let you know the moment it's back.`}
      </Text>
      {state === 'error' ? (
        <Text className="font-body" style={{ fontSize: 13.5, color: STORE.sale, marginTop: 10 }}>
          Couldn&apos;t save your alert. Please try again.
        </Text>
      ) : null}
    </BottomSheet>
  );
}
