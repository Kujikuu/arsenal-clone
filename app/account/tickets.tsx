import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { Card, SectionTitle } from '@/components/ui/Card';
import { DisplayText } from '@/components/ui/DisplayText';
import { PillButton } from '@/components/ui/PillButton';
import { SubScreen } from '@/components/ui/SubScreen';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { claimTicket, useMyTickets, useTicketSales } from '@/lib/api/tickets';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatKickOff, formatLongDate, formatPrice } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import type { TicketSale, UserTicket } from '@/types/database';
import { PALETTE } from '@/theme/palette';

/** Deterministic bar pattern drawn from the ticket's barcode string. */
function Barcode({ code }: { code: string }) {
  const bars = code.split('').flatMap((ch) => {
    const n = ch.charCodeAt(0);
    return [1 + (n % 3), 1 + ((n >> 2) % 2), 1 + ((n >> 3) % 3), 1 + ((n >> 1) % 2)];
  });
  return (
    <View style={{ backgroundColor: '#FFF', borderRadius: 4, padding: 10, marginTop: 16 }}>
      <View className="flex-row justify-center" style={{ height: 56 }}>
        {bars.map((w, i) => (
          <View
            key={i}
            style={{ width: w, marginRight: 1, backgroundColor: i % 2 ? '#FFF' : '#000' }}
          />
        ))}
      </View>
      <Text
        className="text-center font-body-semibold"
        style={{ fontSize: 12, letterSpacing: 2, color: '#000', marginTop: 6 }}>
        {code}
      </Text>
    </View>
  );
}

function TicketCard({ ticket }: { ticket: UserTicket }) {
  const match = ticket.match;
  if (!match) return null;
  return (
    <Card style={{ paddingVertical: 16, marginBottom: 14 }}>
      <View className="flex-row items-center">
        <TeamLogo uri={match.home_team_logo} name={match.home_team} size={30} />
        <Text
          className="mx-3 flex-1 text-center font-body-semibold text-white"
          style={{ fontSize: 16 }}>
          {match.home_team} v {match.away_team}
        </Text>
        <TeamLogo uri={match.away_team_logo} name={match.away_team} size={30} />
      </View>
      <Text
        className="text-center font-body"
        style={{ fontSize: 14, color: '#C8C6C7', marginTop: 8 }}>
        {formatKickOff(match.match_date)} · {match.stadium}
      </Text>
      <View className="flex-row justify-around" style={{ marginTop: 16 }}>
        {[
          ['BLOCK', ticket.block],
          ['ROW', ticket.row_label],
          ['SEAT', ticket.seat],
        ].map(([label, value]) => (
          <View key={label} className="items-center">
            <DisplayText size={9.5} color="#C8C6C7" heavy={false}>
              {label}
            </DisplayText>
            <DisplayText size={20} style={{ marginTop: 6 }}>
              {value}
            </DisplayText>
          </View>
        ))}
      </View>
      <Barcode code={ticket.barcode} />
    </Card>
  );
}

function SaleCard({
  sale,
  owned,
  claiming,
  onClaim,
}: {
  sale: TicketSale;
  owned: boolean;
  claiming: boolean;
  onClaim: () => void;
}) {
  const match = sale.match!;
  const open = sale.status === 'open';
  return (
    <Card style={{ paddingVertical: 16, marginBottom: 14 }}>
      <DisplayText size={10} color={open ? PALETTE.formUp : '#C8C6C7'} heavy={false}>
        {open
          ? `${sale.phase.toUpperCase()} · ON SALE NOW`
          : `${sale.phase.toUpperCase()} · OPENS ${formatLongDate(sale.opens_at).toUpperCase()}`}
      </DisplayText>
      <Text className="font-body-semibold text-white" style={{ fontSize: 17, marginTop: 8 }}>
        {match.home_team} v {match.away_team}
      </Text>
      <Text className="font-body" style={{ fontSize: 14, color: '#C8C6C7', marginTop: 4 }}>
        {match.competition} · {formatKickOff(match.match_date)}
      </Text>
      <Text className="font-body" style={{ fontSize: 14, color: PALETTE.textMuted, marginTop: 4 }}>
        From {formatPrice(sale.price_from_gbp, 'GBP')}
      </Text>
      {owned ? (
        <Text
          className="font-body-semibold"
          style={{ fontSize: 14, color: PALETTE.formUp, marginTop: 12 }}>
          You have a ticket for this match.
        </Text>
      ) : open ? (
        <View className="flex-row" style={{ marginTop: 14 }}>
          <PillButton label="GET A SEAT" height={36} loading={claiming} onPress={onClaim} />
          <PillButton
            label="SEE ALL OPTIONS"
            height={36}
            variant="secondary"
            onPress={() => WebBrowser.openBrowserAsync(sale.buy_url)}
            style={{ marginLeft: 10 }}
          />
        </View>
      ) : null}
    </Card>
  );
}

/** Ticket hub: the fan's tickets and upcoming sales. */
export default function TicketsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const sales = useTicketSales();
  const tickets = useMyTickets(user?.id);
  const [claiming, setClaiming] = useState<string | null>(null);
  const now = useNow();

  const ownedMatches = new Set((tickets.data ?? []).map((t) => t.match_id));
  const upcomingTickets = (tickets.data ?? []).filter(
    (t) => t.match && new Date(t.match.match_date).getTime() > now - 3 * 3600 * 1000
  );

  const claim = async (sale: TicketSale) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setClaiming(sale.id);
    try {
      const ticket = await claimTicket(sale.id);
      await tickets.refetch();
      Alert.alert(
        'Seat confirmed',
        `Block ${ticket.block}, row ${ticket.row_label}, seat ${ticket.seat}. Your ticket is in My Tickets.`
      );
    } catch (error: any) {
      Alert.alert('Could not get a seat', error?.message ?? 'Please try again.');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <SubScreen
      title="Ticket Hub"
      onRefresh={async () => {
        await Promise.all([sales.refetch(), tickets.refetch()]);
      }}>
      <SectionTitle>MY TICKETS</SectionTitle>
      {!user ? (
        <EmptyState
          icon="ticket-outline"
          title="Sign in to see your tickets"
          actionLabel="SIGN IN"
          onAction={() => router.push('/auth/login')}
        />
      ) : tickets.error ? (
        <ErrorState error={tickets.error} onRetry={tickets.refetch} />
      ) : tickets.loading && !tickets.data?.length ? (
        <LoadingState />
      ) : upcomingTickets.length ? (
        upcomingTickets.map((t) => <TicketCard key={t.id} ticket={t} />)
      ) : (
        <Text className="font-body" style={{ fontSize: 15, color: PALETTE.textMuted }}>
          Tickets you buy appear here with your seat and barcode.
        </Text>
      )}

      <SectionTitle detail="Sales for upcoming home matches.">TICKET SALES</SectionTitle>
      {sales.error ? (
        <ErrorState error={sales.error} onRetry={sales.refetch} />
      ) : sales.loading && !sales.data?.length ? (
        <LoadingState />
      ) : !sales.data?.length ? (
        <Text className="font-body" style={{ fontSize: 15, color: PALETTE.textMuted }}>
          No sales are scheduled right now.
        </Text>
      ) : (
        sales.data.map((sale) => (
          <SaleCard
            key={sale.id}
            sale={sale}
            owned={ownedMatches.has(sale.match_id)}
            claiming={claiming === sale.id}
            onClaim={() => claim(sale)}
          />
        ))
      )}
    </SubScreen>
  );
}
