import type { ImageSourcePropType } from 'react-native';
import type { Player } from '@/types/database';

export interface PlayerPhoto {
  source: ImageSourcePropType;
  /**
   * cutout - transparent PNG placed on the card's own pattern
   * panel  - full-height slice cut from the ref card, faded into the card on its left edge
   */
  kind: 'cutout' | 'panel';
  /** width / height, only needed for panels */
  aspect?: number;
}

const PANEL_ASPECT = 228 / 253;

const LOCAL_PANELS: Record<string, ImageSourcePropType> = {
  p01: require('@/assets/extracted/panel_raya.png'),
  p02: require('@/assets/extracted/panel_kepa.png'),
};

export function playerCardPhoto(player: Pick<Player, 'id' | 'photo_url'>): PlayerPhoto {
  const panel = LOCAL_PANELS[player.id];
  if (panel) return { source: panel, kind: 'panel', aspect: PANEL_ASPECT };
  return { source: { uri: player.photo_url }, kind: 'cutout' };
}
