import React from 'react';
import { View, Pressable, Modal, ScrollView, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { STORE } from '@/theme/store';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Red title bar with a chevron, as on the store's Quick Buy sheet. */
  banner?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: `${number}%`;
}

/** Slide-up sheet on the light shop theme. */
export function BottomSheet({
  visible,
  onClose,
  title,
  banner,
  children,
  footer,
  maxHeight = '85%',
}: SheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close"
        style={{ backgroundColor: STORE.overlay }}
        className="flex-1 justify-end">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: STORE.surface, maxHeight }}>
          {title ? (
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={`${title}, close`}
              style={{
                height: 52,
                paddingHorizontal: 16,
                backgroundColor: banner ? STORE.cta : STORE.surface,
                borderBottomWidth: banner ? 0 : 1,
                borderBottomColor: STORE.divider,
              }}
              className="flex-row items-center justify-between">
              <StoreHeading size={15} color={banner ? '#FFF' : STORE.text}>
                {title}
              </StoreHeading>
              <Feather
                name={banner ? 'chevron-down' : 'x'}
                size={26}
                color={banner ? '#FFF' : STORE.text}
              />
            </Pressable>
          ) : null}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16, paddingBottom: footer ? 8 : 16 + insets.bottom }}>
            {children}
          </ScrollView>
          {footer ? (
            <View style={{ padding: 16, paddingTop: 8, paddingBottom: 16 + insets.bottom }}>
              {footer}
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Drawer from the left, used for listing filters ("FILTERS · 40 PRODUCTS"). */
export function SideDrawer({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 flex-row">
        <View style={{ width: '82%', backgroundColor: STORE.surface }}>
          <View
            style={{
              paddingTop: insets.top + 12,
              paddingHorizontal: 20,
              paddingBottom: 12,
              backgroundColor: STORE.muted,
            }}>
            <StoreHeading size={15}>{title}</StoreHeading>
            {subtitle ? (
              <Text
                className="font-body-bold"
                style={{ fontSize: 11, color: STORE.text, marginTop: 4, letterSpacing: 0.4 }}>
                {subtitle.toUpperCase()}
              </Text>
            ) : null}
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            {children}
          </ScrollView>
          {footer ? (
            <View
              style={{
                padding: 16,
                paddingBottom: 16 + insets.bottom,
                backgroundColor: STORE.muted,
              }}>
              {footer}
            </View>
          ) : null}
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          style={{ backgroundColor: STORE.overlay, paddingTop: insets.top + 8 }}
          className="flex-1 items-center">
          <View
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF' }}
            className="items-center justify-center">
            <Feather name="x" size={24} color={STORE.text} />
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
