import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { StoreProduct } from '@/types/database';

export async function fetchStoreProducts(
  category?: string
): Promise<{ data: StoreProduct[]; error: any }> {
  try {
    let query = supabase.from('store_products').select('*');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as StoreProduct[]) || [], error: null };
  } catch (error) {
    console.warn('[fetchStoreProducts] Supabase query error:', error);
    return { data: [], error };
  }
}

export async function fetchProductById(
  id: string
): Promise<{ data: StoreProduct | null; error: any }> {
  try {
    const { data, error } = await supabase.from('store_products').select('*').eq('id', id).single();

    if (error) throw error;
    return { data: (data as StoreProduct) || null, error: null };
  } catch (error) {
    console.warn('[fetchProductById] Supabase query error:', error);
    return { data: null, error };
  }
}

export function useStoreProducts(category?: string) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchStoreProducts(category);
    setProducts(data);
    setError(err);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refetch: load };
}

export function useStoreProduct(id: string) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const { data, error: err } = await fetchProductById(id);
      setProduct(data);
      setError(err);
      setLoading(false);
    }
    load();
  }, [id]);

  return { product, loading, error };
}
