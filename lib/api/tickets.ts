import { supabase } from '@/lib/supabase';
import { unwrap, useQuery } from '@/lib/api/useQuery';
import type { TicketSale, UserTicket } from '@/types/database';

export function useTicketSales() {
  return useQuery(
    ['ticket-sales'],
    async () => {
      const sales = unwrap(
        await supabase
          .from('ticket_sales')
          .select('*, match:matches(*)')
          .neq('status', 'sold_out')
          .order('opens_at', { ascending: true })
      ) as TicketSale[];
      const now = Date.now();
      return sales
        .filter((s) => s.match && new Date(s.match.match_date).getTime() > now)
        .map((s) => ({ ...s, price_from_gbp: Number(s.price_from_gbp) }));
    },
    { initialData: [] }
  );
}

export function useMyTickets(userId: string | undefined) {
  return useQuery(
    ['my-tickets', userId],
    async () =>
      unwrap(
        await supabase
          .from('user_tickets')
          .select('*, match:matches(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ) as UserTicket[],
    { enabled: Boolean(userId), initialData: [] }
  );
}

export async function claimTicket(saleId: string): Promise<UserTicket> {
  return unwrap(await supabase.rpc('claim_ticket', { p_sale_id: saleId })) as UserTicket;
}
