import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  youtubeId: string;
  width: number;
  height: number;
  autoplay?: boolean;
}

/** Inline YouTube embed. */
export function YouTubePlayer({ youtubeId, width, height, autoplay = true }: Props) {
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
