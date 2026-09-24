import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { Experience, TourBooking } from '@/types/database';

const normalise = (e: Experience): Experience => ({ ...e, price_gbp: Number(e.price_gbp) });

export function useExperiences(categories?: Experience['category'][]) {
  return useQuery(
    ['experiences', categories ?? null],
    async () => {
      let query = supabase.from('experiences').select('*').order('sort');
      if (categories?.length) query = query.in('category', categories);
      return (unwrap(await query) as Experience[]).map(normalise);
    },
    { initialData: [] }
  );
}

export function useExperience(id: string | undefined) {
  return useQuery(
    ['experience', id],
    async () => {
      const row = unwrap(
        await supabase.from('experiences').select('*').eq('id', id).maybeSingle()
      ) as Experience | null;
      return row ? normalise(row) : null;
    },
    { enabled: Boolean(id) }
  );
}

export function useTourBookings(userId: string | undefined) {
  return useQuery(
    ['tour-bookings', userId],
    async () =>
      unwrap(
        await supabase
          .from('tour_bookings')
          .select('*, experience:experiences(*)')
          .eq('user_id', userId)
          .order('tour_date', { ascending: true })
      ) as TourBooking[],
    { enabled: Boolean(userId), initialData: [] }
  );
}

export async function bookTour(
  userId: string,
  experienceId: string,
  tourDate: string,
  guests: number
) {
  const { error } = await supabase
    .from('tour_bookings')
    .insert({ user_id: userId, experience_id: experienceId, tour_date: tourDate, guests });
  if (error) throw error;
}

export async function cancelTour(bookingId: string) {
  const { error } = await supabase.from('tour_bookings').delete().eq('id', bookingId);
  if (error) throw error;
}
