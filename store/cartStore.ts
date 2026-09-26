import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Currency } from '@/types/database';

export const MAX_LINE_QUANTITY = 10;

/**
 * One line in the bag. Prices are a snapshot for instant display only; the
 * bag is always re-priced by quote_store_cart() and at checkout.
 */
export interface CartLine {
  key: string;
  variantId: string;
  productId: string;
  title: string;
  imageUrl: string;
  size: string;
  priceGbp: number;
  priceUsd: number;
  customPriceGbp: number;
  customPriceUsd: number;
  customName: string | null;
  customNumber: string | null;
  quantity: number;
}

export type NewCartLine = Omit<CartLine, 'key' | 'quantity'>;

interface CartState {
  lines: CartLine[];
  promoCode: string | null;
  add: (line: NewCartLine, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  setPromoCode: (code: string | null) => void;
  clear: () => void;
}

export const lineKey = (l: Pick<CartLine, 'variantId' | 'customName' | 'customNumber'>) =>
  `${l.variantId}|${l.customName ?? ''}|${l.customNumber ?? ''}`;

const clamp = (n: number) => Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.round(n)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promoCode: null,
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
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setPromoCode: (promoCode) => set({ promoCode: promoCode?.trim().toUpperCase() || null }),
      clear: () => set({ lines: [], promoCode: null }),
    }),
    {
      name: 'arsenal.store-cart',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCartCount = () =>
  useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

/** Snapshot total for a line, before the server quote arrives. */
export function linePrice(line: CartLine, currency: Currency): number {
  const unit = currency === 'GBP' ? line.priceGbp : line.priceUsd;
  const custom =
    line.customName || line.customNumber
      ? currency === 'GBP'
        ? line.customPriceGbp
        : line.customPriceUsd
      : 0;
  return (unit + custom) * line.quantity;
}

/** The shape quote_store_cart() and store-checkout expect. */
export const toOrderItems = (lines: CartLine[]) =>
  lines.map((l) => ({
    variant_id: l.variantId,
    quantity: l.quantity,
    custom_name: l.customName,
    custom_number: l.customNumber,
  }));
