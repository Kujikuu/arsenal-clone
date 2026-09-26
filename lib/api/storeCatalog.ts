import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type {
  BrowseResult,
  Currency,
  HomeModule,
  StoreCategoryRow,
  StoreProfile,
  StoreProductPage,
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
