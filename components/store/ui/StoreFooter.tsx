import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Accordion } from '@/components/store/ui/Accordion';
import { CannonLogo } from '@/components/store/ui/CannonLogo';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { STORE } from '@/theme/store';

const PAYMENT_BADGES: { label: string; bg: string; fg: string }[] = [
  { label: 'VISA', bg: '#1A1F71', fg: '#FFF' },
  { label: 'Mastercard', bg: '#FFFFFF', fg: '#EB001B' },
  { label: 'AMEX', bg: '#2E77BC', fg: '#FFF' },
  { label: ' Pay', bg: '#000000', fg: '#FFF' },
  { label: 'G Pay', bg: '#FFFFFF', fg: '#3C4043' },
  { label: 'PayPal', bg: '#FFFFFF', fg: '#003087' },
  { label: 'Gift card', bg: '#C8102E', fg: '#FFF' },
];

export function PaymentBadges({ dark = true }: { dark?: boolean }) {
  return (
    <View className="flex-row flex-wrap" accessibilityLabel="Accepted payment methods">
      {PAYMENT_BADGES.map((b) => (
        <View
          key={b.label}
          style={{
            width: 58,
            height: 34,
            borderRadius: 4,
            backgroundColor: b.bg,
            marginRight: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: dark ? '#555' : STORE.divider,
          }}
          className="items-center justify-center">
          <Text className="font-body-bold" style={{ fontSize: 11, color: b.fg }} numberOfLines={1}>
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Black store footer: crest, link groups, payment methods and legal links. */
export function StoreFooter() {
  const router = useRouter();
  const link = (label: string, href: string) => (
    <Pressable
      key={label}
      onPress={() => router.push(href as never)}
      accessibilityRole="link"
      style={{ paddingVertical: 7 }}>
      <Text className="font-body" style={{ color: '#D0D0D0', fontSize: 14.5 }}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View
      style={{
        backgroundColor: STORE.footer,
        borderTopWidth: 4,
        borderTopColor: STORE.cta,
        marginTop: 36,
      }}>
      <View style={{ padding: 20 }}>
        <View style={{ marginVertical: 18 }}>
          <CannonLogo width={96} />
        </View>
        <Accordion title="Top Categories" dark>
          {link('Kit', '/store/c/kit')}
          {link('Training', '/store/c/training')}
          {link('Clothing', '/store/c/clothing')}
          {link('Accessories', '/store/c/accessories')}
          {link('Gifts', '/store/c/gifts')}
        </Accordion>
        <Accordion title="Help Centre" dark>
          {link('Contact us', '/contact')}
          {link('Delivery information', '/legal/delivery')}
          {link('Returns & refunds', '/legal/returns')}
          {link('My orders', '/account/orders')}
        </Accordion>
        <Accordion title="Stadium Tours" dark>
          {link('Emirates Stadium tours', '/store/tours')}
        </Accordion>
        <View style={{ marginTop: 20 }}>
          <StoreHeading size={15} color="#FFF">
            Payment Methods
          </StoreHeading>
          <View style={{ marginTop: 16 }}>
            <PaymentBadges />
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#444', marginVertical: 24 }} />
        <View className="items-center">
          {link('Terms & Conditions', '/legal/terms')}
          {link('Privacy Policy', '/legal/privacy')}
          {link('Contact us', '/contact')}
        </View>
      </View>
    </View>
  );
}
