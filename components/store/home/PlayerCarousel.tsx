import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Carousel } from '@/components/store/ui/Carousel';
import { ShirtArt } from '@/components/store/ui/ShirtArt';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { useShopPlayers, type ShopPlayer } from '@/lib/api/storeCatalog';
import { STORE } from '@/theme/store';

interface Props {
  title: string;
  teams: ('men' | 'women')[];
  limit?: number;
  menProduct: string;
  womenProduct: string;
}

/** "SHOP BY PLAYER": the back of the home shirt for each player, men and women alternating. */
export function PlayerCarousel({ title, teams, limit = 12, menProduct, womenProduct }: Props) {
  const router = useRouter();
  const players = useShopPlayers(teams);
  const men = (players.data ?? []).filter((p) => p.team_type === 'men');
  const women = (players.data ?? []).filter((p) => p.team_type === 'women');
  const mixed: ShopPlayer[] = [];
  for (let i = 0; mixed.length < limit && (i < men.length || i < women.length); i++) {
    if (men[i]) mixed.push(men[i]);
    if (women[i] && mixed.length < limit) mixed.push(women[i]);
  }
  if (!mixed.length) return null;
  return (
    <View style={{ paddingTop: 32, borderTopWidth: 1, borderTopColor: STORE.divider }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <StoreHeading size={23}>{title}</StoreHeading>
      </View>
      <Carousel
        data={mixed}
        itemWidth={150}
        keyOf={(p) => p.id}
        renderItem={(p) => (
          <Pressable
            onPress={() =>
              router.push(
                `/store/${p.team_type === 'women' ? womenProduct : menProduct}?player=${p.id}`
              )
            }
            accessibilityRole="link"
            accessibilityLabel={`Shop ${p.full_name} shirt`}
            className="active:opacity-85">
            <View
              style={{ width: 150, height: 176, borderRadius: 6, backgroundColor: STORE.muted }}
              className="items-center justify-center">
              <ShirtArt style="home" back name={p.name} number={p.number} size={140} />
            </View>
            <Text
              className="font-body"
              style={{ fontSize: 15, color: STORE.text, marginTop: 8 }}
              numberOfLines={1}>
              {p.full_name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
