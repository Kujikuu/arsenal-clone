import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { STORE, STORE_GUTTER } from '@/theme/store';

interface Props<T> {
  data: T[];
  itemWidth: number;
  gap?: number;
  keyOf: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Red scroll-progress bar under the row, as on the store's carousels. */
  progress?: boolean;
}

/** Horizontal row of cards with the store's red progress bar. */
export function Carousel<T>({
  data,
  itemWidth,
  gap = 14,
  keyOf,
  renderItem,
  progress = true,
}: Props<T>) {
  const [viewport, setViewport] = useState(1);
  const [offset, setOffset] = useState(0);
  const content = data.length * (itemWidth + gap) - gap + STORE_GUTTER * 2;
  const visible = Math.min(1, viewport / Math.max(content, 1));
  const scrollable = Math.max(content - viewport, 1);
  const trackWidth = 250;
  const thumb = Math.max(trackWidth * visible, 30);
  const thumbLeft = (trackWidth - thumb) * Math.min(1, Math.max(0, offset / scrollable));

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={itemWidth + gap}
        onLayout={(e) => setViewport(e.nativeEvent.layout.width)}
        onScroll={(e) => setOffset(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: STORE_GUTTER }}>
        {data.map((item, i) => (
          <View
            key={keyOf(item)}
            style={{ width: itemWidth, marginRight: i < data.length - 1 ? gap : 0 }}>
            {renderItem(item, i)}
          </View>
        ))}
      </ScrollView>
      {progress && visible < 1 ? (
        <View
          style={{
            width: trackWidth,
            height: 3,
            backgroundColor: '#8A8A8A',
            alignSelf: 'center',
            marginTop: 24,
          }}>
          <View
            style={{
              position: 'absolute',
              left: thumbLeft,
              width: thumb,
              height: 3,
              backgroundColor: STORE.cta,
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
