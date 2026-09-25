import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/ui/Card';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useExperience } from '@/lib/api/experiences';
import { formatDuration, formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { PALETTE } from '@/theme/palette';

const BOOKABLE_IN_APP = new Set(['tour', 'legends']);

export default function ExperienceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: experience, loading, error, refetch } = useExperience(id);

  if (!experience) {
    return (
      <View className="flex-1 bg-black">
        <AppHeader left="back" />
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState icon="ticket-outline" title="Experience not found" />
        )}
      </View>
    );
  }

  const facts = [
    { label: 'PRICE FROM', value: formatPrice(experience.price_gbp, 'GBP') },
    { label: 'DURATION', value: formatDuration(experience.duration_minutes) },
    { label: 'WHEN', value: experience.schedule },
  ];

  return (
    <View className="flex-1 bg-black">
      <AppHeader left="back" />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Image
          source={resolveImage(experience.image_url)}
          style={{ width: '100%', height: 230 }}
          resizeMode="cover"
        />
        <View style={{ padding: 16 }}>
          <DisplayText size={11} color="#C8C6C7" heavy={false}>
            {experience.category.toUpperCase()}
          </DisplayText>
          <Text className="font-body-semibold text-white" style={{ fontSize: 26, marginTop: 8 }}>
            {experience.title}
          </Text>
          <Text className="font-body" style={{ fontSize: 16, color: '#C8C6C7', marginTop: 4 }}>
            {experience.subtitle}
          </Text>
          <Text
            className="font-body text-white"
            style={{ fontSize: 16, lineHeight: 23, marginTop: 18 }}>
            {experience.description}
          </Text>

          <Card style={{ marginTop: 24, paddingHorizontal: 0 }}>
            {facts.map((f, i) => (
              <View
                key={f.label}
                style={{
                  paddingVertical: 18,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: PALETTE.chip,
                }}
                className="items-center">
                <DisplayText size={9.5} color="#C8C6C7" heavy={false}>
                  {f.label}
                </DisplayText>
                <Text
                  className="text-center font-body-semibold text-white"
                  style={{ fontSize: 16, marginTop: 8 }}>
                  {f.value}
                </Text>
              </View>
            ))}
          </Card>

          {BOOKABLE_IN_APP.has(experience.category) ? (
            <PillButton
              label="BOOK A DATE"
              onPress={() =>
                router.push({
                  pathname: '/account/stadium-tours',
                  params: { experience: experience.id },
                })
              }
              style={{ marginTop: 28 }}
            />
          ) : null}
          <PillButton
            label="MORE INFO ON PALETTE.COM"
            variant={BOOKABLE_IN_APP.has(experience.category) ? 'secondary' : 'primary'}
            onPress={() => WebBrowser.openBrowserAsync(experience.book_url)}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
