/**
 * Colours sampled directly from the screenshots in ref/.
 * Use these instead of ad-hoc hex values so every screen stays in sync.
 */
export const PALETTE = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#D32D2F',
  statRed: '#B52628',
  statGrey: '#5D6069',
  surface: '#121011',
  surfaceRaised: '#1C1A1B',
  track: '#2C2C2E',
  scoreBox: '#333230',
  chip: '#403E3F',
  pill: '#333333',
  button: '#5A5859',
  divider: '#312F30',
  dividerSoft: '#222021',
  dividerStrong: '#4E4E4E',
  textMuted: '#A7A5A6',
  textDim: '#8E8C8D',
  iconInactive: '#A3A3A3',
  formUp: '#7DE986',
  formDown: '#EE4F4C',
  opta: '#589BD2',
  applyDisabled: '#E38691',
} as const;

export const FONT = {
  body: 'KumbhSans_400Regular',
  bodyMedium: 'KumbhSans_500Medium',
  bodySemibold: 'KumbhSans_600SemiBold',
  bodyBold: 'KumbhSans_700Bold',
  display: 'Michroma_400Regular',
} as const;

/** Height of the bottom tab bar above the home indicator. */
export const TAB_BAR_CONTENT_HEIGHT = 64;
