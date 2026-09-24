import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Video } from '@/types/database';

export async function fetchVideos(category?: string): Promise<{ data: Video[]; error: any }> {
  try {
    let query = supabase.from('videos').select('*').order('published_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as Video[]) || [], error: null };
  } catch (error) {
    console.warn('[fetchVideos] Supabase query error:', error);
    return { data: [], error };
  }
}

export async function fetchVideoById(id: string): Promise<{ data: Video | null; error: any }> {
  try {
    const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();

    if (error) throw error;
    return { data: (data as Video) || null, error: null };
  } catch (error) {
    console.warn('[fetchVideoById] Supabase query error:', error);
    return { data: null, error };
  }
}

export function useVideos(category?: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchVideos(category);
    setVideos(data);
    setError(err);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return { videos, loading, error, refetch: load };
}

export function useVideo(id: string) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const { data, error: err } = await fetchVideoById(id);
      setVideo(data);
      setError(err);
      setLoading(false);
    }
    load();
  }, [id]);

  return { video, loading, error };
}
