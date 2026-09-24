import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { TheArsenalHeader } from '@/components/TheArsenalHeader';
import { ARSENAL } from '@/theme/arsenal';

interface Props {
  title: string;
  children: React.ReactNode;
  /** Pinned below the scroll view, e.g. a save button. */
  footer?: React.ReactNode;
  onRefresh?: () => Promise<void>;
}

/** Back header + scrolling body used by the account, legal and contact screens. */
export function SubScreen({ title, children, footer, onRefresh }: Props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const refresh = onRefresh
    ? async () => {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }
    : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black">
      <TheArsenalHeader
        left="back"
        backgroundColor={ARSENAL.surface}
        bordered
        title={
          <Text className="font-body text-white" style={{ fontSize: 18 }} numberOfLines={1}>
            {title}
          </Text>
        }
      />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        refreshControl={
          refresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={ARSENAL.red} />
          ) : undefined
        }>
        {children}
      </ScrollView>
      {footer ? <View style={{ padding: 16, paddingBottom: 28 }}>{footer}</View> : null}
    </KeyboardAvoidingView>
  );
}
