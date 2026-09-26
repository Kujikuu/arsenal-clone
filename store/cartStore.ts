import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Currency, KitFont } from '@/types/database';

export const MAX_LINE_QUANTITY = 10;

/** Shirt printing chosen on the product page. */
export interface LinePrint {
  type: 'player' | 'custom';
  playerId?: string | null;
  specialId?: string | null;
  /** Printed name / number, for display (the server re-derives player prints). */
  name?: string | null;
  number?: string | null;
  font?: KitFont | null;
  patchId?: string | null;
  patchName?: string | null;
}

/**
 * One line in the bag. Prices are a snapshot in the currency they were added
 * in, for instant display only; the bag is always re-priced by
 * quote_store_cart() and at checkout.
 */
export interface CartLine {
  key: string;
  variantId: string;
  productId: string;
  title: string;
  imageUrl: string;
  size: string;
  print: LinePrint | null;
  snapshotCurrency: Currency;
  /** Item price plus printing and patch, per unit. */
  snapshotUnit: number;
  quantity: number;
}

export type NewCartLine = Omit<CartLine, 'key' | 'quantity'>;

interface CartState {
  lines: CartLine[];
  promoCode: string | null;
  giftCard: string | null;
  add: (line: NewCartLine, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  replace: (key: string, line: NewCartLine, quantity: number) => void;
  remove: (key: string) => void;
  setPromoCode: (code: string | null) => void;
  setGiftCard: (code: string | null) => void;
  clear: () => void;
}

export const lineKey = (l: Pick<CartLine, 'variantId' | 'print'>) =>
  `${l.variantId}|${l.print ? JSON.stringify([l.print.type, l.print.playerId ?? l.print.specialId ?? l.print.name ?? '', l.print.number ?? '', l.print.font ?? '', l.print.patchId ?? '']) : ''}`;

const clamp = (n: number) => Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.round(n)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promoCode: null,
      giftCard: null,
      add: (line, quantity = 1) =>
        set((s) => {
          const key = lineKey(line);
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === key ? { ...l, ...line, quantity: clamp(l.quantity + quantity) } : l
              ),
            };
          }
          return { lines: [...s.lines, { ...line, key, quantity: clamp(quantity) }] };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          lines:
            quantity < 1
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, quantity: clamp(quantity) } : l)),
        })),
      replace: (key, line, quantity) =>
        set((s) => {
          const nextKey = lineKey(line);
          const others = s.lines.filter((l) => l.key !== key && l.key !== nextKey);
          const index = s.lines.findIndex((l) => l.key === key);
          const merged = { ...line, key: nextKey, quantity: clamp(quantity) };
          const lines = [...others];
          lines.splice(Math.max(0, Math.min(index, lines.length)), 0, merged);
          return { lines };
        }),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setPromoCode: (promoCode) => set({ promoCode: promoCode?.trim().toUpperCase() || null }),
      setGiftCard: (giftCard) =>
        set({ giftCard: giftCard?.replace(/[\s-]/g, '').toUpperCase() || null }),
      clear: () => set({ lines: [], promoCode: null, giftCard: null }),
    }),
    {
      name: 'arsenal.store-cart',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // v1 lines had customName / customNumber and prices in both currencies.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as { lines?: any[]; promoCode?: string | null };
        if (version < 2) {
          const lines: CartLine[] = (state.lines ?? []).map((l) => {
            const print: LinePrint | null =
              l.customName || l.customNumber
                ? { type: 'custom', name: l.customName ?? null, number: l.customNumber ?? null }
                : null;
            const custom = print ? Number(l.customPriceGbp ?? 0) : 0;
            const line = {
              variantId: l.variantId,
              productId: l.productId,
              title: l.title,
              imageUrl: l.imageUrl,
              size: l.size,
              print,
              snapshotCurrency: 'GBP' as Currency,
              snapshotUnit: Number(l.priceGbp ?? 0) + custom,
            };
            return { ...line, key: lineKey(line), quantity: l.quantity ?? 1 };
          });
          return { lines, promoCode: state.promoCode ?? null, giftCard: null } as CartState;
        }
        return state as CartState;
      },
    }
  )
);

export const useCartCount = () =>
  useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

/** Snapshot total for a line before the server quote arrives (null in another currency). */
export function linePrice(line: CartLine, currency: Currency): number | null {
  return line.snapshotCurrency === currency ? line.snapshotUnit * line.quantity : null;
}

/** The shape quote_store_cart() and store-checkout expect. */
export const toOrderItems = (lines: CartLine[]) =>
  lines.map((l) => ({
    variant_id: l.variantId,
    quantity: l.quantity,
    print: l.print
      ? {
          type: l.print.type,
          player_id: l.print.playerId ?? null,
          special_id: l.print.specialId ?? null,
          name: l.print.type === 'custom' ? (l.print.name ?? null) : null,
          number: l.print.type === 'custom' ? (l.print.number ?? null) : null,
          font: l.print.font ?? null,
          patch_id: l.print.patchId ?? null,
        }
      : null,
  }));

/** "SAKA 7" style label for a line's printing. */
export const printLabel = (p: LinePrint | null) =>
  p ? [p.name, p.number].filter(Boolean).join(' ') : '';
