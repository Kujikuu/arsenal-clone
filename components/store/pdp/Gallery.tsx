import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ProductImage } from '@/components/store/ui/ProductImage';
import { ShirtArt, parseShirtUrl } from '@/components/store/ui/ShirtArt';
import type { KitFont } from '@/types/database';
import { STORE } from '@/theme/store';

export interface PrintPreview {
  name: string | null;
  number: string | null;
  font: KitFont;
  patch: boolean;
}

interface Props {
  images: string[];
  width: number;
  /** When set, the first slide is the back of the shirt with this printing. */
  preview: PrintPreview | null;
  /** Kit style for the preview (from the product's shirt: image). */
  kitStyle: string | null;
}

/** Swipeable product images with dots; personalising shows a live back-of-shirt preview. */
export function Gallery({ images, width, preview, kitStyle }: Props) {
  const height = width;
  const [index, setIndex] = useState(0);
  const scroller = useRef<ScrollView>(null);
  const slides =
    preview && kitStyle ? ['preview', ...images.filter((u) => !parseShirtUrl(u)?.back)] : images;

  // Jump to the preview as soon as personalisation starts.
  const previewing = Boolean(preview && kitStyle);
  useEffect(() => {
    if (previewing) {
      scroller.current?.scrollTo({ x: 0, animated: true });
      setIndex(0);
    }
  }, [previewing]);

  return (
    <View style={{ backgroundColor: STORE.muted }}>
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        scrollEventThrottle={64}>
        {slides.map((url, i) =>
          url === 'preview' && preview && kitStyle ? (
            <View
              key="preview"
              style={{ width, height, backgroundColor: STORE.surface }}
              className="items-center justify-center"
              accessibilityLabel={`Back of the shirt${preview.name ? ` printed ${preview.name}` : ''}${preview.number ? ` ${preview.number}` : ''}`}>
              <ShirtArt
                style={kitStyle}
                back
                name={preview.name}
                number={preview.number}
                font={preview.font}
                patch={preview.patch}
                size={width * 0.92}
              />
            </View>
          ) : (
            <ProductImage
              key={`${url}-${i}`}
              uri={url}
              width={width}
              height={height}
              background={STORE.muted}
            />
          )
        )}
      </ScrollView>
      {slides.length > 1 ? (
        <View className="flex-row" style={{ position: 'absolute', right: 14, bottom: 14 }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 5,
                backgroundColor: i === index ? '#5F6368' : '#C4C7CC',
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
