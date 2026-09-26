import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Accordion } from '@/components/store/ui/Accordion';
import { useShippingRates } from '@/lib/api/storeCatalog';
import { formatPrice } from '@/lib/format';
import { useRegionStore, zoneLabel } from '@/store/regionStore';
import type { Currency, ProductDetails } from '@/types/database';
import { STORE } from '@/theme/store';

const P = ({ children }: { children: React.ReactNode }) => (
  <Text
    className="font-body"
    style={{ fontSize: 15, lineHeight: 23, color: STORE.text, marginBottom: 12 }}>
    {children}
  </Text>
);

function Link({ label, href }: { label: string; href: string }) {
  const router = useRouter();
  return (
    <Text
      onPress={() => router.push(href as never)}
      accessibilityRole="link"
      className="font-body"
      style={{ color: STORE.text, textDecorationLine: 'underline' }}>
      {label}
    </Text>
  );
}

/** PRODUCT INFO / SHIPPING TIMES & COSTS / RETURNS POLICY. */
export function ProductInfo({
  description,
  details,
  returnable,
  currency,
}: {
  description: string;
  details: ProductDetails;
  returnable: boolean;
  currency: Currency;
}) {
  const zone = useRegionStore((s) => s.zone);
  const rates = useShippingRates(zone).data ?? [];
  const gbp = currency === 'GBP';
  const standard = rates.find((r) => r.method === 'standard');
  const freeOver = standard ? (gbp ? standard.free_over_gbp : standard.free_over_usd) : null;

  return (
    <View style={{ marginTop: 28 }}>
      <Accordion title="Product info" initiallyOpen>
        <P>{description}</P>
        {details.bullets?.length ? (
          <View style={{ marginBottom: 12 }}>
            {details.bullets.map((b) => (
              <Text
                key={b}
                className="font-body"
                style={{ fontSize: 15, lineHeight: 23, color: STORE.text }}>
                {'•  '}
                {b}
              </Text>
            ))}
          </View>
        ) : null}
        {details.fit ? <P>{details.fit}</P> : null}
        {details.model ? <P>{details.model}</P> : null}
        {details.care ? <P>{details.care}</P> : null}
        {details.colour ? <P>Colour: {details.colour}</P> : null}
        {details.code ? <P>Product code: {details.code}</P> : null}
        {details.material ? <P>Material: {details.material}</P> : null}
      </Accordion>
      <Accordion title="Shipping times & costs">
        {freeOver != null ? (
          <View style={{ backgroundColor: STORE.muted, padding: 14, marginBottom: 14 }}>
            <Text className="font-body-semibold" style={{ fontSize: 14.5, color: STORE.text }}>
              FREE standard delivery to {zoneLabel(zone)} on orders over{' '}
              {formatPrice(freeOver, currency)}
            </Text>
          </View>
        ) : null}
        {rates.map((r) => (
          <View key={r.method} className="flex-row justify-between" style={{ marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text className="font-body-semibold" style={{ fontSize: 15, color: STORE.text }}>
                {r.label}
              </Text>
              <Text className="font-body" style={{ fontSize: 13.5, color: STORE.textMuted }}>
                {r.eta}
              </Text>
            </View>
            <Text className="font-body-semibold" style={{ fontSize: 15, color: STORE.text }}>
              {formatPrice(gbp ? r.price_gbp : r.price_usd, currency)}
            </Text>
          </View>
        ))}
        <P>
          Printed items are dispatched within 2 working days. For more information see our{' '}
          <Link label="delivery information" href="/legal/delivery" />.
        </P>
      </Accordion>
      <Accordion title="Returns policy" last>
        <P>
          We understand that sometimes things just don&apos;t work out. If for any reason you are
          unhappy with your purchase, you can return it to us within 28 days of receipt. See how on
          our <Link label="returns page" href="/legal/returns" />.
        </P>
        <P>
          {returnable
            ? 'Please note that we are unable to accept returns for items that have been printed with a player’s name, a personalised name and/or number, a patch or Champions printing, so please check your personalisation details and size carefully before ordering.'
            : 'This item can’t be returned unless it is faulty.'}
        </P>
      </Accordion>
    </View>
  );
}
