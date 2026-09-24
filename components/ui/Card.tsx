import React from 'react';
import { View, Text, type ViewStyle, type StyleProp } from 'react-native';
import { DisplayText } from '@/components/ui/DisplayText';
import { ARSENAL } from '@/theme/arsenal';

/** Dark rounded surface used for grouped content (ref/player-profile2.jpeg). */
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[{ backgroundColor: ARSENAL.surface, borderRadius: 8, paddingHorizontal: 16 }, style]}>
      {children}
    </View>
  );
}

/** Display-face section heading, e.g. "MY TICKETS". */
export function SectionTitle({ children, detail }: { children: string; detail?: string }) {
  return (
    <View style={{ marginTop: 28, marginBottom: 14 }}>
      <DisplayText size={13}>{children}</DisplayText>
      {detail ? (
        <Text
          className="font-body"
          style={{ fontSize: 13.5, color: ARSENAL.textMuted, marginTop: 6, lineHeight: 18 }}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}
