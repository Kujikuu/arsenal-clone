import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SegmentedButtons, StoreButton } from '@/components/store/ui/Buttons';
import { ShirtArt } from '@/components/store/ui/ShirtArt';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { TileGridSkeleton } from '@/components/store/ui/Misc';
import { DisplayText } from '@/components/ui/DisplayText';
import { useShopPlayers } from '@/lib/api/storeCatalog';
import { resolveImage } from '@/lib/media/resolveImage';
import { STORE } from '@/theme/store';
import { AppHeader } from '@/components/AppHeader';
import { StoreHeaderActions } from '@/components/store/StoreHeaderActions';

type Team = 'mens' | 'womens' | 'legends';

interface HeroPlayer {
  id: string;
  first: string;
  last: string;
  number: number | string;
  photo?: string | null;
  href: string;
  kit: string;
}

/** Club legends on the retro shirts they made famous, printed as custom names. */
const LEGENDS: HeroPlayer[] = [
  {
    id: 'henry',
    first: 'Thierry',
    last: 'Henry',
    number: 14,
    kit: 'retro-home',
    href: '/store/rt-0304-home?name=HENRY&number=14',
  },
  {
    id: 'bergkamp',
    first: 'Dennis',
    last: 'Bergkamp',
    number: 10,
    kit: 'retro-home',
    href: '/store/rt-0304-home?name=BERGKAMP&number=10',
  },
  {
    id: 'vieira',
    first: 'Patrick',
    last: 'Vieira',
    number: 4,
    kit: 'retro-home',
    href: '/store/rt-0304-home?name=VIEIRA&number=4',
  },
  {
    id: 'adams',
    first: 'Tony',
    last: 'Adams',
    number: 6,
    kit: 'retro-home',
    href: '/store/rt-8889-home?name=ADAMS&number=6',
  },
  {
    id: 'wright',
    first: 'Ian',
    last: 'Wright',
    number: 8,
    kit: 'retro-9193',
    href: '/store/sp05?name=WRIGHT&number=8',
  },
  {
    id: 'pires',
    first: 'Robert',
    last: 'Pires',
    number: 7,
    kit: 'retro-home',
    href: '/store/rt-0304-home?name=PIRES&number=7',
  },
];

function Hero({ p, width }: { p: HeroPlayer; width: number }) {
  const router = useRouter();
  const height = width * 1.25;
  return (
    <Pressable
      onPress={() => router.push(p.href as never)}
      accessibilityRole="link"
      accessibilityLabel={`Shop ${p.first} ${p.last}`}
      style={{ width, height, backgroundColor: '#E9EAEE', marginBottom: 2 }}
      className="overflow-hidden">
      {p.photo ? (
        <Image
          source={resolveImage(p.photo)}
          style={{ position: 'absolute', width, height }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{ position: 'absolute', width, height }}
          className="items-center justify-center">
          <ShirtArt
            style={p.kit}
            back
            name={p.last.toUpperCase()}
            number={p.number}
            size={width * 0.95}
          />
        </View>
      )}
      <View style={{ position: 'absolute', left: 16, bottom: 20, right: 16 }}>
        <DisplayText size={30} style={{ textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 6 }}>
          {String(p.number)}
        </DisplayText>
        <DisplayText
          size={36}
          style={{ lineHeight: 40, textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 6 }}>
          {p.first.toUpperCase()}
        </DisplayText>
        <DisplayText
          size={36}
          style={{ lineHeight: 40, textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 6 }}>
          {p.last.toUpperCase()}
        </DisplayText>
        <View style={{ alignSelf: 'flex-start', marginTop: 12 }}>
          <StoreButton
            label="Shop now"
            variant="secondary"
            height={38}
            onPress={() => router.push(p.href as never)}
          />
        </View>
      </View>
    </Pressable>
  );
}

/** SELECT YOUR PLAYER: each player's shirt, ready printed. */
export default function ShopByPlayerScreen() {
  const { width } = useWindowDimensions();
  const [team, setTeam] = useState<Team>('mens');
  const players = useShopPlayers(['men', 'women']);

  const list: HeroPlayer[] =
    team === 'legends'
      ? LEGENDS
      : (players.data ?? [])
          .filter((p) => p.team_type === (team === 'mens' ? 'men' : 'women'))
          .map((p) => {
            const parts = p.full_name.split(' ');
            return {
              id: p.id,
              first: parts.slice(0, -1).join(' ') || p.full_name,
              last: parts[parts.length - 1],
              number: p.number,
              photo: p.photo_url,
              kit: 'home',
              href: `/store/${team === 'mens' ? 'kit-home-shirt-m' : 'kit-home-shirt-w'}?player=${p.id}`,
            };
          });

  return (
    <View className="flex-1" style={{ backgroundColor: STORE.surface }}>
      <AppHeader left="back" rightAction={<StoreHeaderActions />} />
      <FlatList
        data={list}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={{ padding: 16, backgroundColor: STORE.surface }}>
            <SegmentedButtons
              options={['mens', 'womens', 'legends'] as const}
              value={team}
              onChange={setTeam}
              height={40}
            />
            <View style={{ marginTop: 20 }}>
              <StoreHeading size={20} color={STORE.headerRed}>
                Select your player
              </StoreHeading>
            </View>
          </View>
        }
        ListEmptyComponent={
          players.loading ? (
            <TileGridSkeleton tileWidth={(width - 46) / 2} count={2} />
          ) : (
            <Text
              className="font-body"
              style={{ fontSize: 15, color: STORE.textMuted, padding: 16 }}>
              No players to show.
            </Text>
          )
        }
        renderItem={({ item }) => <Hero p={item} width={width} />}
        ListFooterComponent={<View style={{ height: 48 }} />}
      />
    </View>
  );
}
