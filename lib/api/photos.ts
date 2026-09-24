import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { ContentTeamType, PhotoGallery, PhotoGalleryImage } from '@/types/database';

export function useGalleries(teamType: ContentTeamType | null = null) {
  return useQuery(
    ['galleries', teamType],
    async () => {
      let query = supabase
        .from('photo_galleries')
        .select('*')
        .order('published_at', { ascending: false });
      if (teamType) query = query.eq('team_type', teamType);
      return unwrap(await query) as PhotoGallery[];
    },
    { initialData: [] }
  );
}

export function useGallery(id: string | undefined) {
  return useQuery(
    ['gallery', id],
    async () => {
      const [gallery, images] = await Promise.all([
        supabase.from('photo_galleries').select('*').eq('id', id).maybeSingle(),
        supabase.from('photo_gallery_images').select('*').eq('gallery_id', id).order('sort'),
      ]);
      return {
        gallery: unwrap(gallery) as PhotoGallery | null,
        images: unwrap(images) as PhotoGalleryImage[],
      };
    },
    { enabled: Boolean(id) }
  );
}
