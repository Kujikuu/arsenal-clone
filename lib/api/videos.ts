import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { ContentTeamType, Video, VideoCollection } from '@/types/database';

export function useVideos(teamType: ContentTeamType | null = null) {
  return useQuery(
    ['videos', teamType],
    async () => {
      let query = supabase.from('videos').select('*').order('published_at', { ascending: false });
      if (teamType) query = query.eq('team_type', teamType);
      return unwrap(await query) as Video[];
    },
    { initialData: [] }
  );
}

export interface VideoRail {
  collection: VideoCollection;
  videos: Video[];
}

/**
 * Collections with their videos, for the media hub. With a team selected,
 * only rails and videos for that team are shown.
 */
export function useVideoRails(teamType: ContentTeamType | null = null) {
  return useQuery(
    ['video-rails', teamType],
    async (): Promise<VideoRail[]> => {
      let cols = supabase.from('video_collections').select('*').order('sort');
      let vids = supabase.from('videos').select('*').not('collection_id', 'is', null).order('sort');
      if (teamType) {
        cols = cols.eq('team_type', teamType);
        vids = vids.eq('team_type', teamType);
      }
      const [collections, videos] = await Promise.all([cols, vids]);
      const allVideos = unwrap(videos) as Video[];
      return (unwrap(collections) as VideoCollection[])
        .map((collection) => ({
          collection,
          videos: allVideos.filter((v) => v.collection_id === collection.id),
        }))
        .filter((rail) => rail.videos.length > 0);
    },
    { initialData: [] }
  );
}

export function useVideo(id: string | undefined) {
  return useQuery(
    ['video', id],
    async () => {
      const video = unwrap(
        await supabase.from('videos').select('*').eq('id', id).maybeSingle()
      ) as Video | null;
      if (!video) return { video: null, related: [] as Video[] };
      // Same rail first, then anything else from the same team.
      let related = supabase
        .from('videos')
        .select('*')
        .neq('id', video.id)
        .order('published_at', { ascending: false })
        .limit(6);
      related = video.collection_id
        ? related.eq('collection_id', video.collection_id)
        : related.eq('team_type', video.team_type);
      return { video, related: unwrap(await related) as Video[] };
    },
    { enabled: Boolean(id) }
  );
}

/** Where to watch a clip: the YouTube upload when we have one, otherwise a search. */
export function videoWatchUrl(video: Pick<Video, 'youtube_id' | 'title'>): string {
  if (video.youtube_id) return `https://www.youtube.com/watch?v=${video.youtube_id}`;
  return `https://www.youtube.com/@arsenal/search?query=${encodeURIComponent(video.title)}`;
}
