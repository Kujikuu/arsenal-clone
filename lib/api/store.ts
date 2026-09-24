import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { StoreProduct } from '@/types/database';

export const STORE_CATEGORIES = ['ALL', 'KITS', 'TRAINING', 'RETRO', 'ACCESSORIES'] as const;
export type StoreCategory = (typeof STORE_CATEGORIES)[number];

const toDb = (c: StoreCategory) =>
  (c.charAt(0) + c.slice(1).toLowerCase()) as StoreProduct['category'];

const normalise = (p: StoreProduct): StoreProduct => ({
  ...p,
  price_gbp: Number(p.price_gbp),
  price_usd: Number(p.price_usd),
});

export function useStoreProducts(category: StoreCategory = 'ALL') {
  return useQuery(
    ['store-products', category],
    async () => {
      let query = supabase.from('store_products').select('*').order('created_at');
      if (category !== 'ALL') query = query.eq('category', toDb(category));
      return (unwrap(await query) as StoreProduct[]).map(normalise);
    },
    { initialData: [] }
  );
}

export function useStoreProduct(id: string | undefined) {
  return useQuery(
    ['store-product', id],
    async () => {
      const row = unwrap(
        await supabase.from('store_products').select('*').eq('id', id).maybeSingle()
      ) as StoreProduct | null;
      return row ? normalise(row) : null;
    },
    { enabled: Boolean(id) }
  );
}
