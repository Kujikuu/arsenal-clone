import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Article } from '@/types/database';

export async function fetchArticles(category?: string): Promise<{ data: Article[]; error: any }> {
  try {
    let query = supabase.from('articles').select('*').order('published_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as Article[]) || [], error: null };
  } catch (error) {
    console.warn('[fetchArticles] Supabase query error:', error);
    return { data: [], error };
  }
}

export async function fetchArticleById(id: string): Promise<{ data: Article | null; error: any }> {
  try {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();

    if (error) throw error;
    return { data: (data as Article) || null, error: null };
  } catch (error) {
    console.warn('[fetchArticleById] Supabase query error:', error);
    return { data: null, error };
  }
}

export function useArticles(category?: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchArticles(category);
    setArticles(data);
    setError(err);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return { articles, loading, error, refetch: load };
}

export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const { data, error: err } = await fetchArticleById(id);
      setArticle(data);
      setError(err);
      setLoading(false);
    }
    load();
  }, [id]);

  return { article, loading, error };
}
