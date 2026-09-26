export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type TeamType = 'men' | 'women' | 'academy';
/** Media content can also belong to the club as a whole. */
export type ContentTeamType = TeamType | 'club';
export type ReactionKind = 'sad' | 'fire' | 'clap' | 'happy';

export interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  category:
    | 'Match Report'
    | 'Interview'
    | 'News'
    | 'Transfer'
    | 'Academy'
    | 'Women'
    | 'Feature'
    | 'Video'
    | 'Gallery';
  content: string;
  image_url: string;
  author: string;
  read_time: string;
  published_at: string;
  is_featured: boolean;
  /** Sends a breaking-news push when set (see push_notifications migration). */
  is_breaking?: boolean;
  tag?: string | null;
  team_type: ContentTeamType;
  youtube_id?: string | null;
  video_duration?: string | null;
  reaction_kind: ReactionKind;
  reactions_base: number;
  match_id?: string | null;
}

export type Competition =
  | 'Premier League'
  | 'UEFA Champions League'
  | 'FA Cup'
  | 'Carabao Cup'
  | 'UEFA Europa League'
  | 'Emirates Cup'
  | 'Friendly'
  | "Women's Super League"
  | "UEFA Women's Champions League"
  | "Women's League Cup"
  | 'Premier League 2'
  | 'U18 Premier League'
  | 'UEFA Youth League';

export interface Match {
  id: string;
  team_type: TeamType;
  competition: Competition;
  competition_logo?: string | null;
  season: string;
  round: string;
  match_date: string;
  home_team: string;
  away_team: string;
  home_team_logo: string;
  away_team_logo: string;
  home_score?: number | null;
  away_score?: number | null;
  status: 'scheduled' | 'live' | 'finished';
  minute?: number | null;
  stadium: string;
  referee?: string | null;
  audio_url?: string | null;
  /** Set on rows imported from football-data.org, e.g. 'fd:537785'. */
  external_id?: string | null;
}

export type MatchEventType =
  | 'goal'
  | 'own_goal'
  | 'penalty_goal'
  | 'yellow_card'
  | 'red_card'
  | 'sub'
  | 'var'
  | 'whistle'
  | 'chance'
  | 'corner'
  | 'info';

export interface MatchEvent {
  id: string;
  match_id: string;
  sort: number;
  minute_label: string;
  type: MatchEventType;
  team?: 'home' | 'away' | null;
  player?: string | null;
  title: string;
  body: string;
}

export interface MatchLineupPlayer {
  id: string;
  match_id: string;
  side: 'home' | 'away';
  shirt_number: number;
  name: string;
  position: string;
  photo_url?: string | null;
  is_starter: boolean;
  sort: number;
}

export interface MatchStat {
  id: string;
  match_id: string;
  sort: number;
  label: string;
  home_value: string;
  away_value: string;
  /** Share of the bar owned by the home side, 0..1. */
  home_share: number;
}

export interface Standing {
  id: string;
  team_type: TeamType;
  season: string;
  competition: string;
  rank: number;
  team_name: string;
  team_code?: string | null;
  team_logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  trend: 'up' | 'down' | 'same';
  form?: string | null; // e.g. "W,W,D,W,W"
}

export interface Player {
  id: string;
  team_type: TeamType;
  first_name: string;
  last_name: string;
  known_as?: string | null;
  shirt_number: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  nationality: string;
  country_flag: string;
  date_of_birth: string;
  /** Official Premier League cutout; null when the player has none yet. */
  photo_url?: string | null;
  /** Full-height card art; replaces the cutout on the player card when set. */
  card_panel_url?: string | null;
  bio: string;
  appearances: number;
  goals: number;
  assists: number;
  clean_sheets?: number | null;
  place_of_birth?: string | null;
  signed_on?: string | null;
}

export interface Video {
  id: string;
  title: string;
  category:
    | 'Highlights'
    | 'Interviews'
    | 'Features'
    | 'Classic'
    | 'Full Match'
    | 'Reaction'
    | 'Behind The Scenes';
  youtube_id?: string | null;
  duration: string;
  thumbnail_url: string;
  published_at: string;
  views_count?: string | null;
  team_type: ContentTeamType;
  collection_id?: string | null;
  match_id?: string | null;
  sort: number;
  reactions_base: number;
}

export interface VideoCollection {
  id: string;
  title: string;
  team_type: ContentTeamType;
  match_id?: string | null;
  sort: number;
}

export interface Reel {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image_url: string;
  article_id?: string | null;
  team_type: ContentTeamType;
  is_featured: boolean;
  reactions_base: number;
  published_at: string;
}

export interface PhotoGallery {
  id: string;
  title: string;
  team_type: ContentTeamType;
  cover_url: string;
  match_id?: string | null;
  published_at: string;
}

export interface PhotoGalleryImage {
  id: string;
  gallery_id: string;
  image_url: string;
  caption?: string | null;
  sort: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  team_type: ContentTeamType;
  cover_url: string;
  published_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  sort: number;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation?: string | null;
}

export interface Experience {
  id: string;
  category: 'tour' | 'museum' | 'matchday' | 'legends';
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  price_gbp: number;
  duration_minutes: number;
  schedule: string;
  book_url: string;
  team_type: ContentTeamType;
  sort: number;
}

export interface FanPoll {
  id: string;
  title: string;
  description: string;
  category: string;
  ends_at: string;
  is_active: boolean;
  match_id?: string | null;
  total_votes: number;
  options: PollOption[];
  user_voted_option_id?: string | null;
}

export interface PollOption {
  id: string;
  poll_id: string;
  label: string;
  sub_label?: string | null;
  image_url?: string | null;
  votes_count: number;
}

export interface MatchPrediction {
  id: string;
  match_id: string;
  user_id: string;
  home_score_pred: number;
  away_score_pred: number;
  first_scorer_pred: string;
  points_awarded?: number | null;
  created_at: string;
}

export interface StoreProduct {
  id: string;
  category: 'Kits' | 'Training' | 'Retro' | 'Accessories';
  title: string;
  description: string;
  price_gbp: number;
  price_usd: number;
  main_image_url: string;
  gallery_urls: string[];
  sizes: string[];
  is_customizable: boolean;
  badge?: string | null;
  external_buy_url?: string | null;
  customisation_price_gbp: number;
  customisation_price_usd: number;
  is_active: boolean;
  created_at: string;
  variants?: StoreProductVariant[];
}

export interface StoreProductVariant {
  id: string;
  product_id: string;
  size: string;
  sku?: string | null;
  stock: number;
  position: number;
}

export type Currency = 'GBP' | 'USD';

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  postcode: string;
  country: string;
  phone?: string | null;
  is_default: boolean;
  created_at: string;
}

export type OrderStatus =
  'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  title: string;
  image_url?: string | null;
  size: string;
  custom_name?: string | null;
  custom_number?: string | null;
  unit_price: number;
  compare_at?: number | null;
  customisation_price: number;
  print_type?: 'player' | 'custom' | null;
  player_id?: string | null;
  print_font?: KitFont | null;
  patch_id?: string | null;
  patch_name?: string | null;
  print_price: number;
  patch_price: number;
  quantity: number;
  line_total: number;
  position: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  currency: Currency;
  subtotal: number;
  member_discount: number;
  discount: number;
  shipping: number;
  total: number;
  gift_card_code?: string | null;
  gift_card_amount: number;
  amount_due: number;
  shipping_zone?: string | null;
  shipping_method?: 'standard' | 'express' | 'nominated' | null;
  promo_code?: string | null;
  shipping_address: Omit<ShippingAddress, 'id' | 'user_id' | 'is_default' | 'created_at'>;
  tracking_number?: string | null;
  expires_at?: string | null;
  paid_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  items?: OrderItem[];
}

/** Returned by the quote_store_cart() RPC. */
export interface CartQuoteLine {
  variant_id: string;
  product_id: string;
  title: string;
  image_url: string;
  size: string;
  stock: number;
  quantity: number;
  custom_name: string | null;
  custom_number: string | null;
  returnable: boolean;
  unit_price: number;
  compare_at: number | null;
  print: {
    type: 'player' | 'custom';
    player_id: string | null;
    special_id: string | null;
    name: string | null;
    number: string | null;
    font: KitFont;
    patch_id: string | null;
    patch_name: string | null;
  } | null;
  print_price: number;
  patch_price: number;
  customisation_price: number;
  line_total: number;
}

export interface ShippingOption {
  method: 'standard' | 'express' | 'nominated';
  label: string;
  eta: string;
  price: number;
}

export interface CartQuote {
  currency: Currency;
  zone: string;
  method: ShippingOption['method'];
  lines: CartQuoteLine[];
  subtotal: number;
  member: boolean;
  member_discount: number;
  discount: number;
  shipping: number;
  total: number;
  gift_card: { code: string; amount: number; balance_after: number } | null;
  gift_card_error: string | null;
  amount_due: number;
  free_shipping_threshold: number | null;
  shipping_options: ShippingOption[];
  promo: { code: string; description: string | null } | null;
  promo_error: string | null;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  favorite_player_id?: string | null;
  gunner_id_number: string;
  membership_tier: 'Red Member' | 'Silver Member' | 'Junior Gunner' | 'Digital Fan';
  phone?: string | null;
  date_of_birth?: string | null;
  country?: string | null;
  postcode?: string | null;
  marketing_opt_in: boolean;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  notify_kickoff: boolean;
  notify_lineups: boolean;
  notify_goals: boolean;
  notify_full_time: boolean;
  notify_news: boolean;
  notify_tickets: boolean;
  notify_women: boolean;
  notify_academy: boolean;
  favourite_team_type: TeamType;
  currency: 'GBP' | 'USD';
  autoplay_video: boolean;
  language: 'en' | 'es' | 'fr' | 'ar';
  calendar_men: boolean;
  calendar_women: boolean;
  calendar_academy: boolean;
}

export interface TicketSale {
  id: string;
  match_id: string;
  phase: string;
  opens_at: string;
  closes_at?: string | null;
  price_from_gbp: number;
  status: 'upcoming' | 'open' | 'sold_out';
  buy_url: string;
  match?: Match | null;
}

export interface UserTicket {
  id: string;
  user_id: string;
  match_id: string;
  sale_id?: string | null;
  block: string;
  row_label: string;
  seat: string;
  barcode: string;
  created_at: string;
  match?: Match | null;
}

export interface TourBooking {
  id: string;
  user_id: string;
  experience_id: string;
  tour_date: string;
  guests: number;
  created_at: string;
  experience?: Experience | null;
}

export interface LegalDocument {
  slug: string;
  title: string;
  body: string;
  updated_at: string;
}

export interface SearchResult {
  kind: 'article' | 'video';
  id: string;
  title: string;
  image_url: string;
  published_at: string;
  total: number;
}

// ---------------------------------------------------------------- store catalogue

export type StoreProfile = 'mens' | 'womens' | 'kids' | 'baby' | 'unisex';
export type KitRole = 'home' | 'away' | 'third' | 'goalkeeper';
export type KitFont = 'premier_league' | 'arsenal' | 'pride';

export interface StoreCategoryRow {
  id: string;
  parent_id: string | null;
  slug: string;
  title: string;
  image_url?: string | null;
  position: number;
  show_in_menu: boolean;
}

/** A product as listings show it (browse_store()). */
export interface StoreTile {
  id: string;
  title: string;
  main_image_url: string;
  badge?: string | null;
  brand?: string | null;
  profile: StoreProfile;
  popularity: number;
  price: number;
  compare_at: number | null;
  sold_out: boolean;
}

export interface BrowseFacets {
  profiles: StoreProfile[];
  brands: string[];
  sizes: string[];
  max_price: number | null;
}

export interface BrowseResult {
  total: number;
  products: StoreTile[];
  facets: BrowseFacets;
}

export interface ProductDetails {
  bullets?: string[];
  fit?: string | null;
  model?: string | null;
  care?: string | null;
  colour?: string | null;
  code?: string | null;
  material?: string | null;
}

export interface PrintPlayer {
  id: string;
  name: string;
  number: number;
}

export interface PrintSpecial {
  id: string;
  label: string;
  number: string;
}

export interface PrintOptions {
  team_type: 'men' | 'women';
  fonts: KitFont[];
  player_price: number;
  name_price: number;
  number_price: number;
  players: PrintPlayer[];
  specials: PrintSpecial[];
}

export interface StorePatch {
  id: string;
  name: string;
  price: number;
}

export interface SizeChart {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export interface RatingSummary {
  average: number;
  total: number;
  breakdown: Record<'1' | '2' | '3' | '4' | '5', number>;
}

/** get_store_product(): everything the product page needs. */
export interface StoreProductPage {
  product: StoreProduct & {
    brand?: string | null;
    family_id?: string | null;
    kit_role?: KitRole | null;
    profile: StoreProfile;
    profile_group_id?: string | null;
    details: ProductDetails;
    returnable: boolean;
    member_discount_eligible: boolean;
    back_image_url?: string | null;
  };
  price: number;
  compare_at: number | null;
  variants: StoreProductVariant[];
  family: { id: string; kit_role: KitRole; image_url: string; title: string }[];
  profiles: { id: string; profile: StoreProfile }[];
  size_chart: SizeChart | null;
  print: PrintOptions | null;
  patches: StorePatch[];
  category: { slug: string; title: string } | null;
  rating: RatingSummary | null;
}

export type HomeModuleKind =
  | 'hero'
  | 'ticker'
  | 'product_tabs'
  | 'collection_carousel'
  | 'category_carousel'
  | 'player_carousel'
  | 'product_carousel'
  | 'trust';

export interface HomeModule {
  id: string;
  kind: HomeModuleKind;
  title: string | null;
  position: number;
  payload: Record<string, any>;
}

export interface StoreReview {
  id: string;
  product_id: string;
  user_id: string | null;
  author_name: string;
  country: string | null;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpful_count: number;
  unhelpful_count: number;
  created_at: string;
}

export interface StoreQuestion {
  id: string;
  product_id: string;
  author_name: string;
  question: string;
  answer: string | null;
  answered_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------- returns

export type ReturnStatus = 'requested' | 'approved' | 'received' | 'refunded' | 'rejected';
export type ReturnReason =
  'too_small' | 'too_big' | 'not_as_described' | 'faulty' | 'changed_mind' | 'other';

export interface StoreReturn {
  id: string;
  return_number: string;
  order_id: string;
  status: ReturnStatus;
  reason: ReturnReason;
  notes: string | null;
  refund_amount: number | null;
  created_at: string;
  order?: Pick<Order, 'order_number' | 'currency'> | null;
  items?: {
    order_item_id: string;
    quantity: number;
    item?: Pick<OrderItem, 'title' | 'size' | 'image_url'> | null;
  }[];
}

export interface ReturnableItem {
  order_item_id: string;
  title: string;
  size: string;
  image_url: string | null;
  returnable_quantity: number;
  reason: string | null;
}
