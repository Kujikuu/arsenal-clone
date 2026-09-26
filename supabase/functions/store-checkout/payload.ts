// Request validation and error mapping for store-checkout. Prices, stock and
// promo rules are enforced by create_store_order() in the database; this only
// rejects malformed requests early with a readable message.

export type Currency = 'GBP' | 'USD';

export type Zone = 'UK' | 'EU' | 'US' | 'ROW';
export type DeliveryMethod = 'standard' | 'express' | 'nominated';

export interface PrintRequest {
  type: 'player' | 'custom';
  player_id?: string | null;
  special_id?: string | null;
  name?: string | null;
  number?: string | null;
  font?: string | null;
  patch_id?: string | null;
}

export interface CheckoutItem {
  variant_id: string;
  quantity: number;
  print?: PrintRequest | null;
  custom_name?: string | null;
  custom_number?: string | null;
}

export interface CheckoutRequest {
  currency: Currency;
  items: CheckoutItem[];
  addressId: string;
  promoCode: string | null;
  zone: Zone;
  method: DeliveryMethod;
  giftCard: string | null;
}

const ZONES: readonly string[] = ['UK', 'EU', 'US', 'ROW'];
const METHODS: readonly string[] = ['standard', 'express', 'nominated'];

export class BadRequest extends Error {
  constructor(
    message: string,
    readonly reason?: string
  ) {
    super(message);
  }
}

const MAX_LINES = 30;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const optionalText = (v: unknown, max: number): string | null => {
  if (v === undefined || v === null || v === '') return null;
  if (typeof v !== 'string' || v.length > max) throw new BadRequest('Invalid personalisation');
  return v;
};

function parsePrint(print: unknown): PrintRequest | null {
  if (print === undefined || print === null) return null;
  if (!isRecord(print) || (print.type !== 'player' && print.type !== 'custom')) {
    throw new BadRequest('Invalid personalisation');
  }
  return {
    type: print.type,
    player_id: optionalText(print.player_id, 64),
    special_id: optionalText(print.special_id, 64),
    name: optionalText(print.name, 12),
    number: optionalText(print.number, 2),
    font: optionalText(print.font, 32),
    patch_id: optionalText(print.patch_id, 64),
  };
}

export function parseCheckoutRequest(body: unknown): CheckoutRequest {
  if (!isRecord(body)) throw new BadRequest('Invalid request');
  const {
    currency,
    items,
    addressId,
    promoCode,
    zone = 'UK',
    method = 'standard',
    giftCard,
  } = body;

  if (currency !== 'GBP' && currency !== 'USD') throw new BadRequest('Unsupported currency');
  if (typeof addressId !== 'string' || !addressId) {
    throw new BadRequest('Choose a delivery address', 'address');
  }
  if (!Array.isArray(items) || items.length === 0) throw new BadRequest('Your bag is empty');
  if (items.length > MAX_LINES) throw new BadRequest('Too many items in your bag');
  if (promoCode !== undefined && promoCode !== null && typeof promoCode !== 'string') {
    throw new BadRequest('Invalid promo code', 'promo');
  }
  if (typeof zone !== 'string' || !ZONES.includes(zone)) {
    throw new BadRequest('Choose where we are delivering to', 'shipping');
  }
  if (typeof method !== 'string' || !METHODS.includes(method)) {
    throw new BadRequest('Choose a delivery option', 'shipping');
  }
  if (giftCard !== undefined && giftCard !== null && typeof giftCard !== 'string') {
    throw new BadRequest('Invalid gift card', 'gift_card');
  }

  return {
    currency,
    addressId,
    promoCode: typeof promoCode === 'string' && promoCode.trim() ? promoCode.trim() : null,
    zone: zone as Zone,
    method: method as DeliveryMethod,
    giftCard: typeof giftCard === 'string' && giftCard.trim() ? giftCard.trim() : null,
    items: items.map((item) => {
      if (!isRecord(item) || typeof item.variant_id !== 'string' || !item.variant_id) {
        throw new BadRequest('Invalid item in your bag');
      }
      const quantity = item.quantity;
      if (
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        throw new BadRequest('Quantity must be between 1 and 10');
      }
      return {
        variant_id: item.variant_id,
        quantity,
        print: parsePrint(item.print),
        custom_name: optionalText(item.custom_name, 12),
        custom_number: optionalText(item.custom_number, 2),
      };
    }),
  };
}

/** Order totals come back from Postgres as numbers or numeric strings. */
export function toMinorUnits(amount: number | string): number {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid amount: ${amount}`);
  return Math.round(value * 100);
}

interface PostgrestLikeError {
  code?: string;
  message?: string;
  hint?: string | null;
}

/**
 * Errors raised on purpose by create_store_order() are safe to show the
 * customer; anything else is reported as a generic failure.
 */
export function describeOrderError(error: PostgrestLikeError): {
  status: number;
  message: string;
  reason?: string;
} {
  switch (error.code) {
    case '28000':
      return { status: 401, message: error.message ?? 'Sign in to check out' };
    case 'P0001':
    case 'P0002':
    case '22023':
      return {
        status: error.code === 'P0001' ? 409 : 400,
        message: error.message ?? 'Please check your bag',
        reason: error.hint ?? undefined,
      };
    default:
      return { status: 500, message: 'We couldn’t start checkout. Please try again.' };
  }
}
