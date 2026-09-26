import React, { useState } from 'react';
import { View, Pressable, LayoutAnimation } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { STORE } from '@/theme/store';

interface Props {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  /** Smaller body-weight title, e.g. inside the bag or filters. */
  compact?: boolean;
  last?: boolean;
  dark?: boolean;
}

/** Title row with +/− that expands its content (PRODUCT INFO, SHIPPING TIMES & COSTS ...). */
export function Accordion({ title, children, initiallyOpen, compact, last, dark }: Props) {
  const [open, setOpen] = useState(Boolean(initiallyOpen));
  const color = dark ? '#FFF' : STORE.text;
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderBottomWidth: last ? 1 : 0,
        borderColor: dark ? 'transparent' : STORE.divider,
      }}>
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((o) => !o);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        style={{ minHeight: compact ? 52 : 60 }}
        className="flex-row items-center justify-between">
        <StoreHeading size={compact ? 12.5 : 15} color={color}>
          {title}
        </StoreHeading>
        <Feather name={open ? 'minus' : 'plus'} size={24} color={color} />
      </Pressable>
      {open ? <View style={{ paddingBottom: 18 }}>{children}</View> : null}
    </View>
  );
}
