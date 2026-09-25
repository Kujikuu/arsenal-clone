import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Card, SectionTitle } from '@/components/ui/Card';
import { DateField, fromISODate, toISODate } from '@/components/ui/DateField';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { SubScreen } from '@/components/ui/SubScreen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { bookTour, cancelTour, useExperiences, useTourBookings } from '@/lib/api/experiences';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatDuration, formatLongDate, formatPrice } from '@/lib/format';
import { resolveImage } from '@/lib/media/resolveImage';
import { PALETTE } from '@/theme/palette';

function tomorrow(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
}

/** Stadium & legends tours with in-app booking. */
export default function StadiumToursScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ experience?: string }>();
  const { user } = useAuth();
  const tours = useExperiences(['tour', 'legends']);
  const bookings = useTourBookings(user?.id);

  const [selected, setSelected] = useState<string | null>(params.experience ?? null);
  const [date, setDate] = useState<Date>(tomorrow());
  const [guests, setGuests] = useState(2);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!selected && tours.data?.length) setSelected(tours.data[0].id);
  }, [selected, tours.data]);

  const tour = tours.data?.find((t) => t.id === selected);
  const upcoming = (bookings.data ?? []).filter((b) => {
    const d = fromISODate(b.tour_date);
    return d && d.getTime() >= new Date().setHours(0, 0, 0, 0);
  });

  const book = async () => {
    if (!tour) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setBooking(true);
    try {
      await bookTour(user.id, tour.id, toISODate(date), guests);
      await bookings.refetch();
      Alert.alert(
        'Tour booked',
        `${tour.title} on ${formatLongDate(toISODate(date))} for ${guests} ${guests === 1 ? 'guest' : 'guests'}.`
      );
    } catch (error: any) {
      Alert.alert('Could not book', error?.message ?? 'Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const cancel = (id: string) =>
    Alert.alert('Cancel booking', 'Are you sure you want to cancel this tour?', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel tour',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelTour(id);
            bookings.refetch();
          } catch (error: any) {
            Alert.alert('Could not cancel', error?.message ?? 'Please try again.');
          }
        },
      },
    ]);

  return (
    <SubScreen
      title="Stadium Tours"
      onRefresh={async () => {
        await Promise.all([tours.refetch(), bookings.refetch()]);
      }}>
      {user && upcoming.length > 0 && (
        <>
          <SectionTitle>MY BOOKINGS</SectionTitle>
          {upcoming.map((b) => (
            <Card key={b.id} style={{ paddingVertical: 14, marginBottom: 10 }}>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="font-body-semibold text-white" style={{ fontSize: 16 }}>
                    {b.experience?.title ?? 'Stadium tour'}
                  </Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 14, color: '#C8C6C7', marginTop: 4 }}>
                    {formatLongDate(b.tour_date)} · {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => cancel(b.id)}
                  hitSlop={8}
                  accessibilityLabel="Cancel booking">
                  <Feather name="x-circle" size={22} color={PALETTE.textMuted} />
                </Pressable>
              </View>
            </Card>
          ))}
        </>
      )}

      <SectionTitle detail="Choose a tour, pick a date and book.">BOOK A TOUR</SectionTitle>
      {tours.error ? (
        <ErrorState error={tours.error} onRetry={tours.refetch} />
      ) : tours.loading && !tours.data?.length ? (
        <LoadingState />
      ) : !tours.data?.length ? (
        <EmptyState icon="flag-outline" title="No tours available right now" />
      ) : (
        <>
          {tours.data.map((t) => {
            const isSelected = t.id === selected;
            return (
              <Pressable
                key={t.id}
                onPress={() => setSelected(t.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                style={{
                  borderRadius: 8,
                  marginBottom: 12,
                  backgroundColor: PALETTE.surface,
                  borderWidth: 1.5,
                  borderColor: isSelected ? PALETTE.red : 'transparent',
                }}
                className="flex-row overflow-hidden">
                <Image
                  source={resolveImage(t.image_url)}
                  style={{ width: 110, height: 110 }}
                  resizeMode="cover"
                />
                <View className="flex-1 justify-center" style={{ padding: 12 }}>
                  <Text className="font-body-semibold text-white" style={{ fontSize: 16 }}>
                    {t.title}
                  </Text>
                  <Text
                    className="font-body"
                    style={{ fontSize: 13, color: '#C8C6C7', marginTop: 3 }}
                    numberOfLines={2}>
                    {t.subtitle} · {formatDuration(t.duration_minutes)}
                  </Text>
                  <DisplayText size={13} style={{ marginTop: 8 }}>
                    {formatPrice(t.price_gbp, 'GBP')}
                  </DisplayText>
                </View>
              </Pressable>
            );
          })}

          {tour && (
            <Card style={{ paddingVertical: 16, marginTop: 8 }}>
              <Text
                className="font-body"
                style={{ fontSize: 14, color: '#C8C6C7', marginBottom: 14 }}>
                {tour.schedule}
              </Text>
              <DateField label="Date" value={date} minimumDate={tomorrow()} onChange={setDate} />
              <Text
                className="font-body-semibold"
                style={{
                  fontSize: 12.5,
                  letterSpacing: 0.6,
                  color: PALETTE.textMuted,
                  marginBottom: 8,
                }}>
                GUESTS
              </Text>
              <View className="flex-row items-center">
                <Pressable
                  onPress={() => setGuests((g) => Math.max(1, g - 1))}
                  accessibilityLabel="Fewer guests"
                  style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: PALETTE.chip }}
                  className="items-center justify-center">
                  <Feather name="minus" size={18} color="#FFF" />
                </Pressable>
                <DisplayText size={20} style={{ marginHorizontal: 22 }}>
                  {guests}
                </DisplayText>
                <Pressable
                  onPress={() => setGuests((g) => Math.min(10, g + 1))}
                  accessibilityLabel="More guests"
                  style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: PALETTE.chip }}
                  className="items-center justify-center">
                  <Feather name="plus" size={18} color="#FFF" />
                </Pressable>
                <View className="flex-1 items-end">
                  <Text className="font-body" style={{ fontSize: 13, color: PALETTE.textMuted }}>
                    Total
                  </Text>
                  <DisplayText size={17} style={{ marginTop: 4 }}>
                    {formatPrice(tour.price_gbp * guests, 'GBP')}
                  </DisplayText>
                </View>
              </View>
              <PillButton
                label={user ? 'BOOK TOUR' : 'SIGN IN TO BOOK'}
                onPress={book}
                loading={booking}
                style={{ marginTop: 20 }}
              />
            </Card>
          )}
        </>
      )}
    </SubScreen>
  );
}
