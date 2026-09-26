import { assertEquals, assertThrows } from 'jsr:@std/assert@1';
import { BadRequest, describeOrderError, parseCheckoutRequest, toMinorUnits } from './payload.ts';

const valid = {
  currency: 'GBP',
  addressId: 'addr1',
  promoCode: '  gooner10 ',
  items: [
    { variant_id: 'v1', quantity: 2, custom_name: 'SAKA', custom_number: '7' },
    { variant_id: 'v2', quantity: 1 },
  ],
};

Deno.test('parses a valid request and normalises optional fields', () => {
  assertEquals(parseCheckoutRequest(valid), {
    currency: 'GBP',
    addressId: 'addr1',
    promoCode: 'gooner10',
    zone: 'UK',
    method: 'standard',
    giftCard: null,
    items: [
      { variant_id: 'v1', quantity: 2, print: null, custom_name: 'SAKA', custom_number: '7' },
      { variant_id: 'v2', quantity: 1, print: null, custom_name: null, custom_number: null },
    ],
  });
});

Deno.test('reads delivery, gift card and printing', () => {
  const parsed = parseCheckoutRequest({
    ...valid,
    zone: 'US',
    method: 'express',
    giftCard: ' GOONERGIFT25 ',
    items: [
      {
        variant_id: 'v1',
        quantity: 1,
        print: { type: 'player', player_id: 'p07', font: 'arsenal', patch_id: 'pl' },
      },
    ],
  });
  assertEquals(parsed.zone, 'US');
  assertEquals(parsed.method, 'express');
  assertEquals(parsed.giftCard, 'GOONERGIFT25');
  assertEquals(parsed.items[0].print, {
    type: 'player',
    player_id: 'p07',
    special_id: null,
    name: null,
    number: null,
    font: 'arsenal',
    patch_id: 'pl',
  });
});

Deno.test('blank promo code becomes null', () => {
  assertEquals(parseCheckoutRequest({ ...valid, promoCode: '  ' }).promoCode, null);
  assertEquals(parseCheckoutRequest({ ...valid, promoCode: undefined }).promoCode, null);
});

Deno.test('rejects malformed requests', () => {
  const bad: unknown[] = [
    null,
    [],
    { ...valid, currency: 'EUR' },
    { ...valid, addressId: '' },
    { ...valid, items: [] },
    { ...valid, items: Array.from({ length: 31 }, () => ({ variant_id: 'v', quantity: 1 })) },
    { ...valid, items: [{ variant_id: 'v1', quantity: 0 }] },
    { ...valid, items: [{ variant_id: 'v1', quantity: 11 }] },
    { ...valid, items: [{ variant_id: 'v1', quantity: 1.5 }] },
    { ...valid, items: [{ variant_id: 'v1', quantity: '2' }] },
    { ...valid, items: [{ quantity: 1 }] },
    { ...valid, items: [{ variant_id: 'v1', quantity: 1, custom_name: 'A'.repeat(13) }] },
    { ...valid, items: [{ variant_id: 'v1', quantity: 1, custom_number: 100 }] },
    { ...valid, promoCode: 42 },
    { ...valid, zone: 'MARS' },
    { ...valid, method: 'teleport' },
    { ...valid, giftCard: 12 },
    { ...valid, items: [{ variant_id: 'v1', quantity: 1, print: { type: 'engrave' } }] },
    {
      ...valid,
      items: [{ variant_id: 'v1', quantity: 1, print: { type: 'custom', name: 'A'.repeat(13) } }],
    },
  ];
  for (const body of bad) assertThrows(() => parseCheckoutRequest(body), BadRequest);
});

Deno.test('converts totals to minor units without float drift', () => {
  assertEquals(toMinorUnits(250.2), 25020);
  assertEquals(toMinorUnits('22.95'), 2295);
  assertEquals(toMinorUnits(0.1 + 0.2), 30);
  assertEquals(toMinorUnits(0), 0);
  assertThrows(() => toMinorUnits(-1));
  assertThrows(() => toMinorUnits('abc'));
});

Deno.test('maps database errors to customer-facing responses', () => {
  assertEquals(
    describeOrderError({
      code: 'P0001',
      message: 'Not enough stock: Shirt (size M)',
      hint: 'out_of_stock',
    }),
    { status: 409, message: 'Not enough stock: Shirt (size M)', reason: 'out_of_stock' }
  );
  assertEquals(
    describeOrderError({ code: '22023', message: 'This code isn’t valid', hint: 'promo' }),
    {
      status: 400,
      message: 'This code isn’t valid',
      reason: 'promo',
    }
  );
  assertEquals(describeOrderError({ code: '28000', message: 'Sign in to check out' }).status, 401);
  // Internal errors never leak their message.
  const internal = describeOrderError({ code: '42P01', message: 'relation "x" does not exist' });
  assertEquals(internal.status, 500);
  assertEquals(internal.message.includes('relation'), false);
});
