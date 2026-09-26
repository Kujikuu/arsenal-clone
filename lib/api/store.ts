import { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import { useAuth } from '@/lib/auth/AuthProvider';
import { toOrderItems, type CartLine } from '@/store/cartStore';
import type {
  CartQuote,
  Currency,
  Order,
  OrderStatus,
  ShippingAddress,
  StoreProduct,
} from '@/types/database';

export const STORE_CATEGORIES = ['ALL', 'KITS', 'TRAINING', 'RETRO', 'ACCESSORIES'] as const;
export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export const STORE_SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
] as const;
export type StoreSort = (typeof STORE_SORTS)[number]['value'];

export interface StoreFilters {
  search: string;
  sort: StoreSort;
  /** Only products with this size in stock. */
  size: string | null;
  /** In the display currency. */
  maxPrice: number | null;
}

export const DEFAULT_STORE_FILTERS: StoreFilters = {
  search: '',
  sort: 'featured',
  size: null,
  maxPrice: null,
};

export const isStoreFiltered = (f: StoreFilters) =>
  f.sort !== 'featured' || f.size !== null || f.maxPrice !== null;

const PRODUCT_SELECT = '*, variants:store_product_variants(*)';

const toDb = (c: StoreCategory) =>
  (c.charAt(0) + c.slice(1).toLowerCase()) as StoreProduct['category'];

const normalise = (p: StoreProduct): StoreProduct => ({
  ...p,
  price_gbp: Number(p.price_gbp),
  price_usd: Number(p.price_usd),
  customisation_price_gbp: Number(p.customisation_price_gbp),
  customisation_price_usd: Number(p.customisation_price_usd),
  variants: [...(p.variants ?? [])].sort((a, b) => a.position - b.position),
});

export const productPrice = (p: StoreProduct, currency: Currency) =>
  currency === 'GBP' ? p.price_gbp : p.price_usd;

export const customisationPrice = (p: StoreProduct, currency: Currency) =>
  currency === 'GBP' ? p.customisation_price_gbp : p.customisation_price_usd;

export const isSoldOut = (p: StoreProduct) =>
  Boolean(p.variants?.length) && p.variants!.every((v) => v.stock <= 0);

/** Sizes offered anywhere in the shop, for the size filter. */
export const STORE_SIZE_FILTERS = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'One Size'] as const;
export const STORE_PRICE_FILTERS = [25, 50, 100] as const;

/** Commas and parentheses would break PostgREST's filter syntax. */
const searchPattern = (search: string) => `%${search.replace(/[%_,()\\]/g, ' ').trim()}%`;

export function useStoreProducts(
  category: StoreCategory = 'ALL',
  filters: StoreFilters = DEFAULT_STORE_FILTERS,
  currency: Currency = 'GBP'
) {
  const priceColumn = currency === 'GBP' ? 'price_gbp' : 'price_usd';
  return useQuery(
    ['store-products', category, filters, currency],
    async () => {
      let query = supabase.from('store_products').select(PRODUCT_SELECT).eq('is_active', true);
      if (category !== 'ALL') query = query.eq('category', toDb(category));
      if (filters.search.trim()) query = query.ilike('title', searchPattern(filters.search));
      if (filters.maxPrice !== null) query = query.lte(priceColumn, filters.maxPrice);
      if (filters.sort === 'price_asc') query = query.order(priceColumn, { ascending: true });
      else if (filters.sort === 'price_desc')
        query = query.order(priceColumn, { ascending: false });
      else if (filters.sort === 'newest') query = query.order('created_at', { ascending: false });
      query = query.order('created_at').order('id');

      const products = (unwrap(await query) as StoreProduct[]).map(normalise);
      if (!filters.size) return products;
      return products.filter((p) =>
        p.variants?.some((v) => v.size === filters.size && v.stock > 0)
      );
    },
    { initialData: [] }
  );
}

export function useStoreProduct(id: string | undefined) {
  return useQuery(
    ['store-product', id],
    async () => {
      const row = unwrap(
        await supabase.from('store_products').select(PRODUCT_SELECT).eq('id', id).maybeSingle()
      ) as StoreProduct | null;
      return row ? normalise(row) : null;
    },
    { enabled: Boolean(id) }
  );
}

// ---------------------------------------------------------------- wishlist

interface WishlistState {
  userId: string | null;
  ids: string[];
  setIds: (userId: string | null, ids: string[]) => void;
}

/** Shared so hearts stay in sync between the grid, product page and wishlist. */
const useWishlistStore = create<WishlistState>((set) => ({
  userId: null,
  ids: [],
  setIds: (userId, ids) => set({ userId, ids }),
}));

async function loadWishlistIds(userId: string) {
  const rows = unwrap(
    await supabase.from('user_wishlist').select('product_id').eq('user_id', userId)
  ) as { product_id: string }[];
  useWishlistStore.getState().setIds(
    userId,
    rows.map((r) => r.product_id)
  );
}

/** Wishlisted product ids for the signed-in user, plus a toggle. */
export function useWishlistIds() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { ids, userId: loadedFor } = useWishlistStore();

  useEffect(() => {
    if (!userId) useWishlistStore.getState().setIds(null, []);
    else if (loadedFor !== userId) loadWishlistIds(userId).catch(() => {});
  }, [userId, loadedFor]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!userId) {
        router.push('/auth/login');
        return;
      }
      const current = useWishlistStore.getState().ids;
      const saved = current.includes(productId);
      useWishlistStore
        .getState()
        .setIds(userId, saved ? current.filter((id) => id !== productId) : [...current, productId]);
      const { error } = saved
        ? await supabase
            .from('user_wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId)
        : await supabase.from('user_wishlist').insert({ user_id: userId, product_id: productId });
      if (error) {
        console.warn('[wishlist] toggle failed:', error.message);
        useWishlistStore.getState().setIds(userId, current);
      }
    },
    [router, userId]
  );

  return { ids: userId === loadedFor ? ids : [], toggle };
}

export function useWishlistProducts(userId: string | undefined, ids: string[]) {
  return useQuery(
    ['wishlist-products', userId, [...ids].sort()],
    async () => {
      if (!ids.length) return [];
      const rows = unwrap(
        await supabase.from('store_products').select(PRODUCT_SELECT).in('id', ids)
      ) as StoreProduct[];
      // Most recently saved first.
      return rows.map(normalise).sort((a, b) => ids.indexOf(b.id) - ids.indexOf(a.id));
    },
    { enabled: Boolean(userId), initialData: [] }
  );
}

// ---------------------------------------------------------------- addresses

export type AddressInput = Omit<ShippingAddress, 'id' | 'user_id' | 'created_at'>;

export function useAddresses(userId: string | undefined) {
  return useQuery(
    ['addresses', userId],
    async () =>
      unwrap(
        await supabase
          .from('shipping_addresses')
          .select('*')
          .eq('user_id', userId)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false })
      ) as ShippingAddress[],
    { enabled: Boolean(userId), initialData: [] }
  );
}

export async function saveAddress(
  userId: string,
  input: AddressInput,
  id?: string
): Promise<ShippingAddress> {
  const query = id
    ? supabase.from('shipping_addresses').update(input).eq('id', id).eq('user_id', userId)
    : supabase.from('shipping_addresses').insert({ ...input, user_id: userId });
  return unwrap(await query.select().single()) as ShippingAddress;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from('shipping_addresses').delete().eq('id', id);
  if (error) throw error;
}

export const formatAddress = (
  a: Pick<ShippingAddress, 'line1' | 'line2' | 'city' | 'region' | 'postcode' | 'country'>
) => [a.line1, a.line2, a.city, a.region, a.postcode, a.country].filter(Boolean).join(', ');

// ---------------------------------------------------------------- bag & checkout

export async function quoteCart(
  currency: Currency,
  lines: CartLine[],
  promoCode: string | null
): Promise<CartQuote> {
  return unwrap(
    await supabase.rpc('quote_store_cart', {
      p_currency: currency,
      p_items: toOrderItems(lines),
      p_promo_code: promoCode,
    })
  ) as CartQuote;
}

/** Server-side prices, stock and promo for the bag. */
export function useCartQuote(currency: Currency, lines: CartLine[], promoCode: string | null) {
  return useQuery(
    ['cart-quote', currency, toOrderItems(lines), promoCode],
    () => quoteCart(currency, lines, promoCode),
    { enabled: lines.length > 0 }
  );
}

export interface CheckoutSession {
  orderId: string;
  orderNumber: string;
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customerId: string;
}

export class CheckoutError extends Error {
  constructor(
    message: string,
    /** 'out_of_stock' | 'promo' | 'address' when the bag needs attention. */
    readonly reason?: string
  ) {
    super(message);
  }
}

export async function startCheckout(params: {
  currency: Currency;
  lines: CartLine[];
  addressId: string;
  promoCode: string | null;
}): Promise<CheckoutSession> {
  const { data, error } = await supabase.functions.invoke<CheckoutSession>('store-checkout', {
    body: {
      currency: params.currency,
      items: toOrderItems(params.lines),
      addressId: params.addressId,
      promoCode: params.promoCode,
    },
  });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json().catch(() => null);
      throw new CheckoutError(body?.error ?? 'Checkout failed. Please try again.', body?.reason);
    }
    throw new CheckoutError('Check your connection and try again.');
  }
  return data!;
}

// ---------------------------------------------------------------- orders

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting payment',
  paid: 'Order confirmed',
  processing: 'Preparing',
  shipped: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const normaliseOrder = (o: Order): Order => ({
  ...o,
  subtotal: Number(o.subtotal),
  discount: Number(o.discount),
  shipping: Number(o.shipping),
  total: Number(o.total),
  items: o.items
    ?.map((i) => ({
      ...i,
      unit_price: Number(i.unit_price),
      customisation_price: Number(i.customisation_price),
      line_total: Number(i.line_total),
    }))
    .sort((a, b) => a.position - b.position),
});

/** Placed orders; unpaid checkouts are left out. */
export function useOrders(userId: string | undefined) {
  return useQuery(
    ['orders', userId],
    async () =>
      (
        unwrap(
          await supabase
            .from('orders')
            .select('*, items:order_items(*)')
            .eq('user_id', userId)
            .neq('status', 'pending_payment')
            .order('created_at', { ascending: false })
        ) as Order[]
      ).map(normaliseOrder),
    { enabled: Boolean(userId), initialData: [] }
  );
}

export function useOrder(id: string | undefined) {
  return useQuery(
    ['order', id],
    async () => {
      const row = unwrap(
        await supabase.from('orders').select('*, items:order_items(*)').eq('id', id).maybeSingle()
      ) as Order | null;
      return row ? normaliseOrder(row) : null;
    },
    { enabled: Boolean(id) }
  );
}
