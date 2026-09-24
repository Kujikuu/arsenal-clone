import React from 'react';
import { View } from 'react-native';
import type { WebView as WebViewType } from 'react-native-webview';
import { hasWebViewModule } from '@/lib/nativeModules';

/** True when videos can play inside the app (the build includes react-native-webview). */
export const canPlayInline = hasWebViewModule;

interface Props {
  youtubeId: string;
  width: number;
  height: number;
  autoplay?: boolean;
}

/** Inline YouTube embed. Callers check `canPlayInline()` first. */
export function YouTubePlayer({ youtubeId, width, height, autoplay = true }: Props) {
  if (!canPlayInline()) return <View style={{ width, height, backgroundColor: '#000' }} />;
  // Loaded on demand so builds without the native module don't crash at startup.
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- deliberate lazy native import
  const { WebView } = require('react-native-webview') as { WebView: typeof WebViewType };
  const params = `autoplay=${autoplay ? 1 : 0}&playsinline=1&modestbranding=1&rel=0`;
  return (
    <View style={{ width, height, backgroundColor: '#000' }}>
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${youtubeId}?${params}` }}
        style={{ width, height, backgroundColor: '#000' }}
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
      />
    </View>
  );
}
