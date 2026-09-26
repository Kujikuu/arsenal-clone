/**
 * Shop screens follow the club store's light look (red header, navy promo
 * strip, white pages) while the rest of the app stays dark. Colours were
 * sampled from the store at phone size.
 */
export const STORE = {
  headerRed: '#E30613',
  cta: '#9B0A12',
  ctaDisabled: '#D98C92',
  promoNavy: '#0B1030',
  linkRed: '#9B0A12',
  sale: '#C8102E',
  surface: '#FFFFFF',
  muted: '#F4F5F7',
  chip: '#E9ECEF',
  chipPressed: '#DDE1E5',
  selected: '#000000',
  text: '#111111',
  textMuted: '#5F6368',
  textFaint: '#9AA0A6',
  divider: '#E3E5E8',
  success: '#1E7F4F',
  star: '#111111',
  overlay: 'rgba(0,0,0,0.45)',
  footer: '#000000',
} as const;

export const STORE_RADIUS = { button: 999, card: 6, chip: 8 } as const;

/** Page side gutter used across shop screens. */
export const STORE_GUTTER = 16;
