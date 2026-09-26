import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert@1';
import { buildReceipt, type ReceiptOrder } from './receipt.ts';

const order: ReceiptOrder = {
  order_number: 'AFC100042',
  currency: 'GBP',
  subtotal: '110.00',
  member_discount: '8.50',
  discount: 0,
  shipping: 0,
  total: '101.50',
  gift_card_amount: '25.00',
  amount_due: '76.50',
  shipping_address: {
    full_name: 'Bukayo Fan',
    line1: 'Highbury House',
    city: 'London',
    postcode: 'N5 1BU',
    country: 'United Kingdom',
  },
};

Deno.test('receipt lists items, printing, totals and gift card', () => {
  const r = buildReceipt(order, [
    {
      title: 'Arsenal adidas 26/27 Home Shirt',
      size: 'M',
      quantity: 1,
      line_total: '110.00',
      custom_name: 'NWANERI',
      custom_number: '22',
      patch_name: 'Premier League',
    },
  ]);
  assertEquals(r.subject, 'Your Arsenal Direct order AFC100042');
  assertStringIncludes(
    r.text,
    '1 × Arsenal adidas 26/27 Home Shirt (M) – Printed NWANERI 22, Premier League patch  £110.00'
  );
  assertStringIncludes(r.text, "Members' discount: −£8.50");
  assertStringIncludes(r.text, 'Delivery: Free');
  assertStringIncludes(r.text, 'Gift card: −£25.00');
  assertStringIncludes(r.text, 'Paid by card: £76.50');
  assertStringIncludes(r.html, 'N5 1BU');
});

Deno.test('receipt escapes customer-provided text', () => {
  const r = buildReceipt(
    { ...order, shipping_address: { ...order.shipping_address, full_name: '<script>x</script>' } },
    []
  );
  assert(!r.html.includes('<script>'));
  assertStringIncludes(r.html, '&lt;script&gt;');
});
