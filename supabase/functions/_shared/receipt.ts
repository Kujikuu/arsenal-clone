// Order receipt email. Sent once per order (claimed with receipt_sent_at)
// through Resend when RESEND_API_KEY is set; otherwise skipped quietly.
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

export interface ReceiptItem {
  title: string;
  size: string;
  quantity: number;
  line_total: number | string;
  custom_name?: string | null;
  custom_number?: string | null;
  patch_name?: string | null;
}

export interface ReceiptOrder {
  order_number: string;
  currency: 'GBP' | 'USD';
  subtotal: number | string;
  member_discount: number | string;
  discount: number | string;
  shipping: number | string;
  total: number | string;
  gift_card_amount: number | string;
  amount_due: number | string;
  shipping_address: {
    full_name: string;
    line1: string;
    line2?: string | null;
    city: string;
    region?: string | null;
    postcode: string;
    country: string;
  };
}

const money = (n: number | string, currency: 'GBP' | 'USD') =>
  `${currency === 'GBP' ? '£' : '$'}${Number(n).toFixed(2)}`;

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );

export function buildReceipt(order: ReceiptOrder, items: ReceiptItem[]) {
  const m = (n: number | string) => money(n, order.currency);
  const lines = items.map((i) => {
    const print = [i.custom_name, i.custom_number].filter(Boolean).join(' ');
    const extras = [print && `Printed ${print}`, i.patch_name && `${i.patch_name} patch`]
      .filter(Boolean)
      .join(', ');
    return {
      label: `${i.quantity} × ${i.title} (${i.size})${extras ? ` – ${extras}` : ''}`,
      amount: m(i.line_total),
    };
  });
  const totals: [string, string][] = [['Subtotal', m(order.subtotal)]];
  if (Number(order.member_discount))
    totals.push(["Members' discount", `−${m(order.member_discount)}`]);
  if (Number(order.discount)) totals.push(['Discount', `−${m(order.discount)}`]);
  totals.push(['Delivery', Number(order.shipping) ? m(order.shipping) : 'Free']);
  totals.push(['Total', m(order.total)]);
  if (Number(order.gift_card_amount)) {
    totals.push(['Gift card', `−${m(order.gift_card_amount)}`]);
    totals.push(['Paid by card', m(order.amount_due)]);
  }
  const a = order.shipping_address;
  const address = [a.full_name, a.line1, a.line2, a.city, a.region, a.postcode, a.country].filter(
    (x): x is string => Boolean(x)
  );

  const subject = `Your Arsenal Direct order ${order.order_number}`;
  const text = [
    `Thanks for your order ${order.order_number}.`,
    '',
    ...lines.map((l) => `${l.label}  ${l.amount}`),
    '',
    ...totals.map(([k, v]) => `${k}: ${v}`),
    '',
    'Delivering to:',
    ...address,
  ].join('\n');
  const row = (k: string, v: string, bold = false) =>
    `<tr><td style="padding:4px 0;${bold ? 'font-weight:bold' : ''}">${escape(k)}</td><td style="padding:4px 0;text-align:right;${bold ? 'font-weight:bold' : ''}">${escape(v)}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;font-family:Arial,sans-serif;color:#111">
<div style="background:#E30613;padding:18px;text-align:center;color:#fff;font-weight:bold;letter-spacing:1px">ARSENAL DIRECT</div>
<div style="padding:24px;max-width:560px;margin:0 auto">
<h1 style="font-size:20px">Thanks for your order</h1>
<p>Order <strong>${escape(order.order_number)}</strong> is confirmed. We'll let you know when it's on its way.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0">${lines.map((l) => row(l.label, l.amount)).join('')}</table>
<table style="width:100%;border-collapse:collapse;border-top:1px solid #E3E5E8;padding-top:8px">${totals
    .map(([k, v]) => row(k, v, k === 'Total'))
    .join('')}</table>
<h2 style="font-size:15px;margin-top:24px">Delivering to</h2>
<p>${address.map(escape).join('<br>')}</p>
</div></body></html>`;
  return { subject, text, html };
}

/** Sends the receipt for a paid order at most once. Never throws. */
export async function sendReceipt(
  admin: SupabaseClient,
  orderId: string
): Promise<'sent' | 'skipped'> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('RESEND_FROM') ?? 'Arsenal Direct <orders@example.com>';
  if (!apiKey) return 'skipped';
  try {
    const { data: claimed } = await admin
      .from('orders')
      .update({ receipt_sent_at: new Date().toISOString() })
      .eq('id', orderId)
      .is('receipt_sent_at', null)
      .select('*, items:order_items(*)')
      .maybeSingle();
    if (!claimed) return 'skipped';
    const { data: user } = await admin.auth.admin.getUserById(claimed.user_id);
    const to = user?.user?.email;
    if (!to) return 'skipped';
    const receipt = buildReceipt(claimed as ReceiptOrder, (claimed.items ?? []) as ReceiptItem[]);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: receipt.subject,
        html: receipt.html,
        text: receipt.text,
      }),
    });
    if (!res.ok) {
      console.error('Receipt email failed', res.status, await res.text());
      await admin.from('orders').update({ receipt_sent_at: null }).eq('id', orderId);
      return 'skipped';
    }
    return 'sent';
  } catch (err) {
    console.error('Receipt email failed', err);
    return 'skipped';
  }
}
