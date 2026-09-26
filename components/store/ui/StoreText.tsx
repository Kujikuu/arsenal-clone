import React from 'react';
import { Text, type TextProps } from 'react-native';
import { DisplayText } from '@/components/ui/DisplayText';
import { STORE } from '@/theme/store';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
const WEIGHT_CLASS: Record<Weight, string> = {
  regular: 'font-body',
  medium: 'font-body-medium',
  semibold: 'font-body-semibold',
  bold: 'font-body-bold',
};

interface Props extends TextProps {
  size?: number;
  weight?: Weight;
  color?: string;
  upper?: boolean;
}

/** Body copy on the light shop pages. */
export function StoreText({
  size = 15,
  weight = 'regular',
  color = STORE.text,
  upper,
  style,
  children,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      className={WEIGHT_CLASS[weight]}
      style={[
        { fontSize: size, color, lineHeight: Math.round(size * 1.35) },
        upper && { textTransform: 'uppercase', letterSpacing: 0.4 },
        style,
      ]}>
      {children}
    </Text>
  );
}

/** Squared display heading, e.g. "SHOP BY CATEGORY". */
export function StoreHeading({
  children,
  size = 22,
  color = STORE.text,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: TextProps['style'];
}) {
  return (
    <DisplayText size={size} color={color} style={[{ lineHeight: size * 1.25 }, style]}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </DisplayText>
  );
}
