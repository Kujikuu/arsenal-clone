import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type {
  BrowseResult,
  Currency,
  HomeModule,
  StoreCategoryRow,
  StoreProfile,
  StoreProductPage,
  StoreQuestion,
  StoreReview,
  StoreTile,
} from '@/types/database';

export const BROWSE_SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price (low)' },
  { value: 'price_desc', label: 'Price (high)' },
  { value: 'name', label: 'Name (a-z)' },
] as const;
export type BrowseSort = (typeof BROWSE_SORTS)[number]['value'] | 'newest';

export const PROFILE_LABEL: Record<StoreProfile, string> = {
  mens: 'Mens',
  womens: 'Womens',
  kids: 'Kids',
  baby: 'Baby',
  unisex: 'Unisex',
};

export interface BrowseParams {
  category?: string | null;
  query?: string | null;
  profiles?: StoreProfile[] | null;
  sizes?: string[] | null;
  brands?: string[] | null;
  maxPrice?: number | null;
  sort?: BrowseSort;
  limit?: number;
  offset?: number;
  ids?: string[] | null;
  family?: string | null;
  exclude?: string | null;
  onSale?: boolean;
}

/** Virtual listings that aren't a category subtree. */
export const VIRTUAL_LISTINGS: Record<string, Partial<BrowseParams>> = {
  sale: { category: null, onSale: true },
  new: { category: null, sort: 'newest' },
  search: { category: null },
};

const numberTile = (t: StoreTile): StoreTile => ({
  ...t,
  price: Number(t.price),
  compare_at: t.compare_at == null ? null : Number(t.compare_at),
});

const nonEmpty = <T>(a?: T[] | null) => (a && a.length ? a : null);

export async function browseStore(currency: Currency, p: BrowseParams): Promise<BrowseResult> {
  const result = unwrap(
    await supabase.rpc('browse_store', {
      p_currency: currency,
      p_category: p.category ?? null,
      p_query: p.query?.trim() || null,
      p_profiles: nonEmpty(p.profiles),
      p_sizes: nonEmpty(p.sizes),
      p_brands: nonEmpty(p.brands),
      p_max_price: p.maxPrice ?? null,
      p_sort: p.sort ?? 'relevance',
      p_limit: p.limit ?? 24,
      p_offset: p.offset ?? 0,
      p_ids: nonEmpty(p.ids),
      p_family: p.family ?? null,
      p_exclude: p.exclude ?? null,
      p_on_sale: p.onSale ?? false,
    })
  ) as BrowseResult;
  return { ...result, products: result.products.map(numberTile) };
}

export function useBrowse(currency: Currency, params: BrowseParams, enabled = true) {
  return useQuery(['browse', currency, params], () => browseStore(currency, params), {
    enabled,
  });
}

// ---------------------------------------------------------------- categories

export function useStoreCategories() {
  return useQuery(
    ['store-categories'],
    async () =>
      unwrap(
        await supabase
          .from('store_categories')
          .select('*')
          .eq('show_in_menu', true)
          .order('position')
      ) as StoreCategoryRow[],
    { initialData: [] }
  );
}

export function useCategoryPath(slug: string | undefined) {
  return useQuery(
    ['category-path', slug],
    async () =>
      unwrap(await supabase.rpc('store_category_path', { p_slug: slug })) as {
        id: string;
        slug: string;
        title: string;
        depth: number;
      }[],
    { enabled: Boolean(slug) && !(slug! in VIRTUAL_LISTINGS), initialData: [] }
  );
}

/** Routes a category to its screen (a few menu entries aren't product listings). */
export function categoryHref(slug: string): string {
  if (slug === 'stadium-tours') return '/store/tours';
  return `/store/c/${slug}`;
}

// ---------------------------------------------------------------- home

export function useHomeModules() {
  return useQuery(
    ['store-home'],
    async () =>
      unwrap(
        await supabase
          .from('store_home_modules')
          .select('id, kind, title, position, payload')
          .eq('active', true)
          .order('position')
      ) as HomeModule[],
    { initialData: [] }
  );
}

// ---------------------------------------------------------------- product page

const normalisePage = (page: StoreProductPage): StoreProductPage => ({
  ...page,
  price: Number(page.price),
  compare_at: page.compare_at == null ? null : Number(page.compare_at),
  print: page.print
    ? {
        ...page.print,
        player_price: Number(page.print.player_price),
        name_price: Number(page.print.name_price),
        number_price: Number(page.print.number_price),
      }
    : null,
  patches: page.patches.map((p) => ({ ...p, price: Number(p.price) })),
  rating: page.rating ? { ...page.rating, average: Number(page.rating.average) } : null,
});

export function useStoreProductPage(id: string | undefined, currency: Currency) {
  return useQuery(
    ['store-product-page', id, currency],
    async () => {
      const page = unwrap(
        await supabase.rpc('get_store_product', { p_id: id, p_currency: currency })
      ) as StoreProductPage | null;
      return page ? normalisePage(page) : null;
    },
    { enabled: Boolean(id) }
  );
}

// ---------------------------------------------------------------- players

export interface ShopPlayer {
  id: string;
  name: string;
  full_name: string;
  number: number;
  team_type: 'men' | 'women';
  photo_url: string | null;
}

/** Player shirt name, same rule as player_print_name() in the database. */
export function printName(p: { known_as?: string | null; last_name: string }) {
  const n = p.known_as && !p.known_as.includes(' ') ? p.known_as : p.last_name;
  return n.replace(/\s*\(.*\)/, '').toUpperCase();
}

export function useShopPlayers(teams: ('men' | 'women')[]) {
  return useQuery(
    ['shop-players', teams],
    async () => {
      const rows = unwrap(
        await supabase
          .from('players')
          .select('id, first_name, last_name, known_as, shirt_number, team_type, photo_url')
          .in('team_type', teams)
          .order('shirt_number')
      ) as {
        id: string;
        first_name: string;
        last_name: string;
        known_as: string | null;
        shirt_number: number;
        team_type: 'men' | 'women';
        photo_url: string | null;
      }[];
      return rows.map<ShopPlayer>((r) => ({
        id: r.id,
        name: printName(r),
        full_name: r.known_as?.includes(' ') ? r.known_as : `${r.first_name} ${r.last_name}`,
        number: r.shirt_number,
        team_type: r.team_type,
        photo_url: r.photo_url,
      }));
    },
    { initialData: [] }
  );
}

// ---------------------------------------------------------------- back in stock

export async function subscribeStockAlert(userId: string, variantId: string) {
  const { error } = await supabase
    .from('stock_notifications')
    .upsert({ user_id: userId, variant_id: variantId }, { onConflict: 'user_id,variant_id' });
  if (error) throw error;
}

// ---------------------------------------------------------------- paged listings

export const PAGE_SIZE = 24;

/** Listing pages that append with loadMore(); resets when params or currency change. */
export function useInfiniteBrowse(currency: Currency, params: BrowseParams, enabled = true) {
  const key = JSON.stringify([currency, params]);
  const [state, setState] = useState<{
    key: string;
    products: StoreTile[];
    total: number;
    facets: BrowseResult['facets'] | null;
    loading: boolean;
    error: Error | null;
  }>({ key: '', products: [], total: 0, facets: null, loading: enabled, error: null });
  const request = useRef(0);

  const load = useCallback(
    async (offset: number) => {
      const id = ++request.current;
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const result = await browseStore(currency, { ...params, limit: PAGE_SIZE, offset });
        if (id !== request.current) return;
        setState((s) => ({
          key,
          products: offset === 0 ? result.products : [...s.products, ...result.products],
          total: result.total,
          facets: offset === 0 || !s.facets ? result.facets : s.facets,
          loading: false,
          error: null,
        }));
      } catch (err) {
        if (id !== request.current) return;
        setState((s) => ({ ...s, loading: false, error: err as Error }));
      }
    },
    // params are captured through key
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  useEffect(() => {
    if (enabled) load(0);
  }, [load, enabled]);

  const current = state.key === key;
  return {
    products: current ? state.products : [],
    total: current ? state.total : 0,
    facets: current ? state.facets : null,
    loading: state.loading || !current,
    error: state.error,
    hasMore: current && state.products.length < state.total,
    loadMore: () => {
      if (!state.loading && current && state.products.length < state.total)
        load(state.products.length);
    },
    refetch: () => load(0),
  };
}

// ---------------------------------------------------------------- reviews & questions

export const REVIEW_SORTS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'helpful', label: 'Most helpful' },
  { value: 'highest', label: 'Highest rating' },
  { value: 'lowest', label: 'Lowest rating' },
] as const;
export type ReviewSort = (typeof REVIEW_SORTS)[number]['value'];

export const REVIEWS_PAGE = 5;

export function useReviews(
  productId: string | undefined,
  opts: { sort: ReviewSort; rating: number | null; search: string; limit: number }
) {
  return useQuery(
    ['reviews', productId, opts],
    async () => {
      let q = supabase
        .from('store_reviews')
        .select('*', { count: 'exact' })
        .eq('product_id', productId);
      if (opts.rating) q = q.eq('rating', opts.rating);
      const term = opts.search.replace(/[%_,()\\]/g, ' ').trim();
      if (term) q = q.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
      q =
        opts.sort === 'helpful'
          ? q.order('helpful_count', { ascending: false })
          : opts.sort === 'highest'
            ? q.order('rating', { ascending: false })
            : opts.sort === 'lowest'
              ? q.order('rating', { ascending: true })
              : q;
      const { data, error, count } = await q
        .order('created_at', { ascending: false })
        .range(0, opts.limit - 1);
      if (error) throw error;
      return { reviews: (data ?? []) as StoreReview[], total: count ?? 0 };
    },
    { enabled: Boolean(productId) }
  );
}

export function useMyReviewVotes(userId: string | undefined, reviewIds: string[]) {
  return useQuery(
    ['review-votes', userId, reviewIds],
    async () => {
      const rows = unwrap(
        await supabase
          .from('store_review_votes')
          .select('review_id, helpful')
          .eq('user_id', userId)
          .in('review_id', reviewIds)
      ) as { review_id: string; helpful: boolean }[];
      return Object.fromEntries(rows.map((r) => [r.review_id, r.helpful])) as Record<
        string,
        boolean
      >;
    },
    { enabled: Boolean(userId) && reviewIds.length > 0, initialData: {} }
  );
}

export async function voteReview(userId: string, reviewId: string, helpful: boolean | null) {
  const { error } =
    helpful === null
      ? await supabase
          .from('store_review_votes')
          .delete()
          .eq('user_id', userId)
          .eq('review_id', reviewId)
      : await supabase
          .from('store_review_votes')
          .upsert(
            { user_id: userId, review_id: reviewId, helpful },
            { onConflict: 'review_id,user_id' }
          );
  if (error) throw error;
}

export async function writeReview(input: {
  productId: string;
  rating: number;
  title: string;
  body: string;
}): Promise<StoreReview> {
  return unwrap(
    await supabase
      .from('store_reviews')
      .insert({
        product_id: input.productId,
        rating: input.rating,
        title: input.title,
        body: input.body,
      })
      .select()
      .single()
  ) as StoreReview;
}

export function useQuestions(productId: string | undefined) {
  return useQuery(
    ['questions', productId],
    async () =>
      unwrap(
        await supabase
          .from('store_questions')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
      ) as StoreQuestion[],
    { enabled: Boolean(productId), initialData: [] }
  );
}

export async function askQuestion(productId: string, question: string) {
  const { error } = await supabase
    .from('store_questions')
    .insert({ product_id: productId, question });
  if (error) throw error;
}

// ---------------------------------------------------------------- delivery

export interface ShippingRate {
  zone: string;
  method: 'standard' | 'express' | 'nominated';
  label: string;
  eta: string;
  price_gbp: number;
  price_usd: number;
  free_over_gbp: number | null;
  free_over_usd: number | null;
}

export function useShippingRates(zone: string) {
  return useQuery(
    ['shipping-rates', zone],
    async () =>
      (
        unwrap(
          await supabase.from('store_shipping_rates').select('*').eq('zone', zone).order('position')
        ) as ShippingRate[]
      ).map((r) => ({
        ...r,
        price_gbp: Number(r.price_gbp),
        price_usd: Number(r.price_usd),
        free_over_gbp: r.free_over_gbp == null ? null : Number(r.free_over_gbp),
        free_over_usd: r.free_over_usd == null ? null : Number(r.free_over_usd),
      })),
    { initialData: [] }
  );
}
