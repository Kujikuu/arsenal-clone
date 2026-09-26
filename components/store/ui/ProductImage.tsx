import React from 'react';
import { View, Image, type ImageResizeMode } from 'react-native';
import { ShirtArt, parseShirtUrl } from '@/components/store/ui/ShirtArt';
import { resolveImage } from '@/lib/media/resolveImage';
import { STORE } from '@/theme/store';

interface Props {
  uri?: string | null;
  width: number;
  height: number;
  radius?: number;
  resizeMode?: ImageResizeMode;
  dimmed?: boolean;
  background?: string;
}

/** Product imagery: a photo, or a `shirt:` URL drawn as the kit. */
export function ProductImage({
  uri,
  width,
  height,
  radius = 0,
  resizeMode = 'cover',
  dimmed,
  background = STORE.muted,
}: Props) {
  const shirt = parseShirtUrl(uri);
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: background,
        opacity: dimmed ? 0.5 : 1,
      }}
      className="items-center justify-center overflow-hidden">
      {shirt ? (
        <ShirtArt
          style={shirt.style}
          back={shirt.back}
          champions={shirt.champions}
          size={Math.min(width, height) * 0.86}
        />
      ) : (
        <Image source={resolveImage(uri)} style={{ width, height }} resizeMode={resizeMode} />
      )}
    </View>
  );
}
