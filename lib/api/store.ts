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
  ReturnReason,
  ReturnStatus,
  ReturnableItem,
  ShippingAddress,
  ShippingOption,
  StoreReturn,
} from '@/types/database';

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

export interface QuoteOptions {
  promoCode?: string | null;
  zone?: string;
  method?: ShippingOption['method'];
  giftCard?: string | null;
}

const numberQuote = (q: CartQuote): CartQuote => ({
  ...q,
  subtotal: Number(q.subtotal),
  member_discount: Number(q.member_discount),
  discount: Number(q.discount),
  shipping: Number(q.shipping),
  total: Number(q.total),
  amount_due: Number(q.amount_due),
  free_shipping_threshold:
    q.free_shipping_threshold == null ? null : Number(q.free_shipping_threshold),
  gift_card: q.gift_card
    ? {
        ...q.gift_card,
        amount: Number(q.gift_card.amount),
        balance_after: Number(q.gift_card.balance_after),
      }
    : null,
  shipping_options: q.shipping_options.map((o) => ({ ...o, price: Number(o.price) })),
  lines: q.lines.map((l) => ({
    ...l,
    unit_price: Number(l.unit_price),
    compare_at: l.compare_at == null ? null : Number(l.compare_at),
    print_price: Number(l.print_price),
    patch_price: Number(l.patch_price),
    customisation_price: Number(l.customisation_price),
    line_total: Number(l.line_total),
  })),
});

export async function quoteCart(
  currency: Currency,
  lines: CartLine[],
  opts: QuoteOptions = {}
): Promise<CartQuote> {
  const q = unwrap(
    await supabase.rpc('quote_store_cart', {
      p_currency: currency,
      p_items: toOrderItems(lines),
      p_promo_code: opts.promoCode ?? null,
      p_zone: opts.zone ?? 'UK',
      p_method: opts.method ?? 'standard',
      p_gift_card: opts.giftCard ?? null,
    })
  ) as CartQuote;
  return numberQuote(q);
}

/** Server-side prices, stock, promo, delivery and gift card for the bag. */
export function useCartQuote(currency: Currency, lines: CartLine[], opts: QuoteOptions = {}) {
  return useQuery(
    ['cart-quote', currency, toOrderItems(lines), opts],
    () => quoteCart(currency, lines, opts),
    { enabled: lines.length > 0 }
  );
}

export type CheckoutSession =
  | { orderId: string; orderNumber: string; paid: true }
  | {
      orderId: string;
      orderNumber: string;
      paid: false;
      paymentIntentClientSecret: string;
      ephemeralKey: string;
      customerId: string;
    };

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
  zone: string;
  method: ShippingOption['method'];
  giftCard: string | null;
}): Promise<CheckoutSession> {
  const { data, error } = await supabase.functions.invoke<CheckoutSession>('store-checkout', {
    body: {
      currency: params.currency,
      items: toOrderItems(params.lines),
      addressId: params.addressId,
      promoCode: params.promoCode,
      zone: params.zone,
      method: params.method,
      giftCard: params.giftCard,
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
  member_discount: Number(o.member_discount ?? 0),
  discount: Number(o.discount),
  shipping: Number(o.shipping),
  total: Number(o.total),
  gift_card_amount: Number(o.gift_card_amount ?? 0),
  amount_due: Number(o.amount_due ?? o.total),
  items: o.items
    ?.map((i) => ({
      ...i,
      unit_price: Number(i.unit_price),
      print_price: Number(i.print_price ?? 0),
      patch_price: Number(i.patch_price ?? 0),
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

// ---------------------------------------------------------------- returns

export const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: 'too_small', label: 'Too small' },
  { value: 'too_big', label: 'Too big' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'faulty', label: 'Faulty or damaged' },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'other', label: 'Other' },
];

export const RETURN_STATUS_LABEL: Record<ReturnStatus, string> = {
  requested: 'Requested',
  approved: 'Approved – send it back',
  received: 'Received',
  refunded: 'Refunded',
  rejected: 'Not accepted',
};

export function useReturnableItems(orderId: string | undefined, enabled = true) {
  return useQuery(
    ['returnable', orderId],
    async () =>
      unwrap(
        await supabase.rpc('returnable_order_items', { p_order_id: orderId })
      ) as ReturnableItem[],
    { enabled: Boolean(orderId) && enabled, initialData: [] }
  );
}

export async function requestReturn(params: {
  orderId: string;
  items: { order_item_id: string; quantity: number }[];
  reason: ReturnReason;
  notes: string;
}): Promise<StoreReturn> {
  return unwrap(
    await supabase.rpc('request_store_return', {
      p_order_id: params.orderId,
      p_items: params.items,
      p_reason: params.reason,
      p_notes: params.notes,
    })
  ) as StoreReturn;
}

const RETURN_SELECT =
  '*, order:orders(order_number, currency), items:store_return_items(order_item_id, quantity, item:order_items(title, size, image_url))';

export function useReturns(userId: string | undefined, orderId?: string) {
  return useQuery(
    ['returns', userId, orderId ?? null],
    async () => {
      let q = supabase.from('store_returns').select(RETURN_SELECT).eq('user_id', userId);
      if (orderId) q = q.eq('order_id', orderId);
      return unwrap(await q.order('created_at', { ascending: false })) as StoreReturn[];
    },
    { enabled: Boolean(userId), initialData: [] }
  );
}
