import type { ImageSourcePropType } from 'react-native';

/**
 * Rows can point at artwork bundled with the app (the crops taken from ref/)
 * with a `local:` URL, e.g. `local:media/news_1.jpg`. Everything else is a
 * remote URL.
 */
const LOCAL_ASSETS: Record<string, ImageSourcePropType> = {
  'media/hbk_1_top.jpg': require('@/assets/media/hbk_1_top.jpg'),
  'media/hbk_2_top.jpg': require('@/assets/media/hbk_2_top.jpg'),
  'media/must_watch_1.jpg': require('@/assets/media/must_watch_1.jpg'),
  'media/must_watch_2.jpg': require('@/assets/media/must_watch_2.jpg'),
  'media/news_1.jpg': require('@/assets/media/news_1.jpg'),
  'media/news_2.jpg': require('@/assets/media/news_2.jpg'),
  'media/news_3.jpg': require('@/assets/media/news_3.jpg'),
  'media/news_4.jpg': require('@/assets/media/news_4.jpg'),
  'media/reel_havertz.jpg': require('@/assets/media/reel_havertz.jpg'),
  'media/search_video_1.jpg': require('@/assets/media/search_video_1.jpg'),
  'media/search_video_2.jpg': require('@/assets/media/search_video_2.jpg'),
  'media/search_video_3.jpg': require('@/assets/media/search_video_3.jpg'),
  'media/search_video_4.jpg': require('@/assets/media/search_video_4.jpg'),
  'extracted/panel_raya.png': require('@/assets/extracted/panel_raya.png'),
  'extracted/panel_kepa.png': require('@/assets/extracted/panel_kepa.png'),
  'extracted/lineup_raya.png': require('@/assets/extracted/lineup_raya.png'),
  'extracted/lineup_calafiori.png': require('@/assets/extracted/lineup_calafiori.png'),
  'extracted/lineup_gabriel.png': require('@/assets/extracted/lineup_gabriel.png'),
  'extracted/lineup_konsa.png': require('@/assets/extracted/lineup_konsa.png'),
};

const LOCAL_PREFIX = 'local:';

export function resolveImage(url?: string | null): ImageSourcePropType | undefined {
  if (!url) return undefined;
  if (url.startsWith(LOCAL_PREFIX)) {
    const asset = LOCAL_ASSETS[url.slice(LOCAL_PREFIX.length)];
    if (!asset) console.warn(`[resolveImage] Unknown bundled asset: ${url}`);
    return asset;
  }
  return { uri: url };
}
