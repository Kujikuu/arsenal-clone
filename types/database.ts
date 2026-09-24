export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  category: 'Match Report' | 'Interview' | 'News' | 'Transfer' | 'Academy' | 'Women';
  content: string;
  image_url: string;
  author: string;
  read_time: string;
  published_at: string;
  is_featured: boolean;
  tag?: string | null;
}

export interface MatchTimelineEvent {
  minute: number;
  type: 'goal' | 'sub' | 'yellow_card' | 'red_card' | 'var' | 'penalty';
  team: 'home' | 'away';
  player: string;
  detail?: string;
}

export interface MatchPlayerLineup {
  shirt_number: number;
  name: string;
  position: string;
  is_captain?: boolean;
}

export interface MatchLineup {
  formation: string;
  starting: MatchPlayerLineup[];
  bench: MatchPlayerLineup[];
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shots_on_target: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellow_cards: [number, number];
}

export interface Match {
  id: string;
  competition: 'Premier League' | 'Champions League' | 'FA Cup' | 'Carabao Cup' | 'Friendly';
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
  lineups_json?: {
    home: MatchLineup;
    away: MatchLineup;
  } | null;
  timeline_events_json?: MatchTimelineEvent[] | null;
  match_stats_json?: MatchStats | null;
}

export interface Standing {
  id: string;
  rank: number;
  team_name: string;
  team_logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  form?: string | null; // e.g. "W,W,D,W,W"
}

export interface Player {
  id: string;
  team_type: 'men' | 'women' | 'academy';
  first_name: string;
  last_name: string;
  known_as?: string | null;
  shirt_number: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  nationality: string;
  country_flag: string;
  date_of_birth: string;
  photo_url: string;
  bio: string;
  appearances: number;
  goals: number;
  assists: number;
  clean_sheets?: number;
}

export interface Video {
  id: string;
  title: string;
  category: 'Highlights' | 'Interviews' | 'Features' | 'Classic';
  youtube_id: string;
  duration: string;
  thumbnail_url: string;
  published_at: string;
  views_count?: string | null;
}

export interface FanPoll {
  id: string;
  title: string;
  description: string;
  category: string;
  ends_at: string;
  is_active: boolean;
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
  external_buy_url: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string | null;
  favorite_player_id?: string | null;
  gunner_id_number: string;
  membership_tier: 'Red Member' | 'Silver Member' | 'Junior Gunner' | 'Digital Fan';
  created_at: string;
}
