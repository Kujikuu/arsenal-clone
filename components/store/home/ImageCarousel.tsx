import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Carousel } from '@/components/store/ui/Carousel';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { StoreHeading } from '@/components/store/ui/StoreText';
import { STORE } from '@/theme/store';

export interface ImageCard {
  title: string;
  image: string;
  href: string;
}

/** "ADIDAS COLLECTIONS" / "SHOP BY CATEGORY": image cards with captions. */
export function ImageCarousel({ title, items }: { title: string; items: ImageCard[] }) {
  const router = useRouter();
  return (
    <View
      style={{
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: STORE.divider,
        marginHorizontal: 0,
      }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <StoreHeading size={23}>{title}</StoreHeading>
      </View>
      <Carousel
        data={items}
        itemWidth={198}
        keyOf={(i) => i.title}
        renderItem={(item) => (
          <Pressable
            onPress={() => router.push(item.href as never)}
            accessibilityRole="link"
            accessibilityLabel={item.title}
            className="active:opacity-85">
            <ProductImage uri={item.image} width={198} height={230} radius={6} />
            <Text
              className="font-body"
              style={{ fontSize: 15, color: STORE.text, marginTop: 8 }}
              numberOfLines={2}>
              {item.title}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
