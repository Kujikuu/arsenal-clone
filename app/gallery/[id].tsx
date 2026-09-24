import React, { useState } from 'react';
import { View, Text, Image, FlatList, Pressable, Share, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States';
import { useGallery } from '@/lib/api/photos';
import { resolveImage } from '@/lib/media/resolveImage';

/** Full-screen, swipeable photo gallery. */
export default function GalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { data, loading, error, refetch } = useGallery(id);
  const [index, setIndex] = useState(0);

  const images = data?.images ?? [];
  const current = images[index];

  const header = (
    <View
      style={{ paddingTop: insets.top + 6, paddingHorizontal: 16, paddingBottom: 10 }}
      className="flex-row items-center justify-between">
      <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Close">
        <Feather name="x" size={30} color="#FFF" />
      </Pressable>
      <Text className="font-body-semibold text-white" style={{ fontSize: 15 }}>
        {images.length ? `${index + 1} / ${images.length}` : ''}
      </Text>
      <Pressable
        onPress={() =>
          data?.gallery &&
          Share.share({ message: `${data.gallery.title} - The Arsenal` }).catch(() => {})
        }
        hitSlop={10}
        accessibilityLabel="Share">
        <Ionicons name="arrow-redo-outline" size={26} color="#FFF" />
      </Pressable>
    </View>
  );

  if (!data?.gallery || !images.length) {
    return (
      <View className="flex-1 bg-black">
        {header}
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <EmptyState icon="images-outline" title="Gallery not found" />
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {header}
      <FlatList
        data={images}
        keyExtractor={(img) => img.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 justify-center">
            <Image
              source={resolveImage(item.image_url)}
              style={{ width, height: height * 0.6 }}
              resizeMode="contain"
              accessibilityLabel={item.caption ?? undefined}
            />
          </View>
        )}
      />
      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24, minHeight: 110 }}>
        <Text className="font-body-semibold text-white" style={{ fontSize: 18 }}>
          {data.gallery.title}
        </Text>
        {current?.caption ? (
          <Text className="font-body" style={{ fontSize: 15, color: '#C8C6C7', marginTop: 6 }}>
            {current.caption}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
