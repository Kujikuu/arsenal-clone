import React from 'react';
import { View, Text, ScrollView, Image, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StoreButton } from '@/components/store/ui/Buttons';
import { Skeleton } from '@/components/store/ui/Misc';
import { StoreFooter } from '@/components/store/ui/StoreFooter';
import { StoreHeader } from '@/components/store/ui/StoreHeader';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { DisplayText } from '@/components/ui/DisplayText';
import { useExperiences } from '@/lib/api/experiences';
import { formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { STORE } from '@/theme/store';

/** EMIRATES STADIUM TOURS landing, booking through the app's experiences. */
export default function StadiumToursScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const experiences = useExperiences();
  const list = experiences.data ?? [];
  const hero = list[0];

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <StoreHeader left="back" promo="CLICK HERE FOR OPENING TIMES" />
      <ScrollView>
        <View style={{ width, height: width * 1.25, backgroundColor: '#1B1B1B' }}>
          {hero?.image_url ? (
            <Image
              source={resolveImage(hero.image_url)}
              style={{ position: 'absolute', width, height: width * 1.25 }}
              resizeMode="cover"
            />
          ) : null}
          <View
            style={{ position: 'absolute', left: 0, right: 0, bottom: 36 }}
            className="items-center">
            <DisplayText size={30} style={{ textAlign: 'center', lineHeight: 34 }}>
              EMIRATES STADIUM
            </DisplayText>
            <DisplayText size={30} style={{ textAlign: 'center', lineHeight: 34 }}>
              TOURS
            </DisplayText>
            <StoreButton
              label="Book now"
              height={40}
              onPress={() => hero && router.push(`/experience/${hero.id}`)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>

        <View style={{ padding: 16, paddingTop: 28 }}>
          <StoreHeading size={20}>Choose your experience</StoreHeading>
          <Text
            className="font-body"
            style={{ fontSize: 15, lineHeight: 22, color: STORE.text, marginTop: 8 }}>
            Walk in the footsteps of legends: the dressing room, the tunnel and pitchside at the
            Emirates.
          </Text>
          {experiences.loading && !list.length ? (
            <Skeleton height={220} style={{ marginTop: 16 }} />
          ) : null}
          {list.map((e) => (
            <Pressable
              key={e.id}
              onPress={() => router.push(`/experience/${e.id}`)}
              accessibilityRole="link"
              accessibilityLabel={e.title}
              style={{ marginTop: 18 }}
              className="active:opacity-85">
              <Image
                source={resolveImage(e.image_url)}
                style={{
                  width: width - 32,
                  height: (width - 32) * 0.6,
                  borderRadius: 6,
                  backgroundColor: STORE.muted,
                }}
                resizeMode="cover"
              />
              <View className="flex-row items-center justify-between" style={{ marginTop: 10 }}>
                <Text
                  className="flex-1 font-body-semibold"
                  style={{ fontSize: 16, color: STORE.text }}>
                  {e.title}
                </Text>
                {e.price_gbp ? (
                  <Text className="font-body-bold" style={{ fontSize: 15, color: STORE.text }}>
                    From {formatPrice(e.price_gbp, 'GBP')}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
        <StoreFooter />
      </ScrollView>
    </View>
  );
}
