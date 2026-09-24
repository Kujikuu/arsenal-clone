import type { ImageSourcePropType } from 'react-native';

export type ReactionKind = 'sad' | 'fire' | 'clap' | 'happy';

export interface NewsItem {
  id: string;
  title: string;
  image: ImageSourcePropType;
  reaction: ReactionKind;
  reactions: number;
}

export interface VideoCardItem {
  id: string;
  title: string;
  duration: string;
  image: ImageSourcePropType;
  reactions: number;
}

export interface SearchResult {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

export interface ReelStory {
  id: string;
  articleId: string;
  tag: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  reactions: number;
}

export interface ArticleFallback {
  id: string;
  title: string;
  author: string;
  publishedLabel: string;
  poster: ImageSourcePropType;
  duration?: string;
  reaction: ReactionKind;
  reactions: number;
  standfirst: string;
  paragraphs: string[];
}

// Thumbnails below are cropped from the screenshots in ref/.

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'a01',
    title: 'Full match: Arsenal Women 1-1 Manchester United',
    image: require('@/assets/media/news_1.jpg'),
    reaction: 'sad',
    reactions: 7,
  },
  {
    id: 'a02',
    title: 'Five things to know about the international break',
    image: require('@/assets/media/news_2.jpg'),
    reaction: 'fire',
    reactions: 12,
  },
  {
    id: 'a03',
    title: "Watch all of Ian Wright's Premier League goals!",
    image: require('@/assets/media/news_3.jpg'),
    reaction: 'clap',
    reactions: 11,
  },
  {
    id: 'a04',
    title: "Wrighty's Arsenal career in pictures",
    image: require('@/assets/media/news_4.jpg'),
    reaction: 'fire',
    reactions: 14,
  },
];

export const MUST_WATCH: VideoCardItem[] = [
  {
    id: 'v01',
    title: 'The special bond with our Emirates Stadium support',
    duration: '0:43',
    image: require('@/assets/media/must_watch_1.jpg'),
    reactions: 0,
  },
  {
    id: 'v02',
    title: 'The Art of a Matchday: Vol.1',
    duration: '0:34',
    image: require('@/assets/media/must_watch_2.jpg'),
    reactions: 0,
  },
  {
    id: 'v03',
    title: 'Chris Mepham: Ask Me Anything',
    duration: '9:12',
    image: require('@/assets/media/search_video_1.jpg'),
    reactions: 0,
  },
];

export const MATCH_VIDEOS: VideoCardItem[] = [
  {
    id: 'v04',
    title: 'Highlights: Arsenal Women 1-0 HB Køge',
    duration: '2:15',
    image: require('@/assets/media/hbk_1_top.jpg'),
    reactions: 0,
  },
  {
    id: 'v05',
    title: 'Reaction: the win over HB Køge',
    duration: '3:40',
    image: require('@/assets/media/hbk_2_top.jpg'),
    reactions: 0,
  },
];

export const SEARCH_VIDEOS: SearchResult[] = [
  {
    id: 'sv01',
    title: '😋 Hunger to win again',
    image: require('@/assets/media/search_video_1.jpg'),
  },
  {
    id: 'sv02',
    title: '🫂 Wrighty welcomes Ebs',
    image: require('@/assets/media/search_video_2.jpg'),
  },
  {
    id: 'sv03',
    title: '🧱 How the points were bagged',
    image: require('@/assets/media/search_video_3.jpg'),
  },
  {
    id: 'sv04',
    title: "Denilson's dazzler | Arsenal 3-0 Hull City | 2009/10",
    image: require('@/assets/media/search_video_4.jpg'),
  },
];

export const SEARCH_ARTICLES: SearchResult[] = NEWS_ITEMS.slice(0, 2).map(
  ({ id, title, image }) => ({
    id,
    title,
    image,
  })
);

export const REEL_STORIES: ReelStory[] = [
  {
    id: 'r01',
    articleId: 'a05',
    tag: 'FEATURE',
    title: '13 things you may not know about Kai Havertz',
    subtitle: 'Discover some interesting facts about our German international',
    image: require('@/assets/media/reel_havertz.jpg'),
    reactions: 10,
  },
];

export const ARTICLE_FALLBACKS: Record<string, ArticleFallback> = {
  a05: {
    id: 'a05',
    title: '13 things you may not know about Kai Havertz',
    author: 'Arsenal Media',
    publishedLabel: '',
    poster: require('@/assets/media/reel_havertz.jpg'),
    reaction: 'happy',
    reactions: 10,
    standfirst: 'Discover some interesting facts about our German international.',
    paragraphs: [],
  },
  a01: {
    id: 'a01',
    title: 'Full match: Arsenal Women 1-1 Manchester United',
    author: 'Stephen Wright',
    publishedLabel: '27 SEPT 2026',
    poster: require('@/assets/media/news_1.jpg'),
    duration: '01:44:09',
    reaction: 'sad',
    reactions: 7,
    standfirst:
      "A full match replay of Saturday's 1-1 draw at home to Manchester United in the Women's Super League is available to watch now.",
    paragraphs: [
      'Julia Zigiotti opened the scoring for the away side in the second half, but Smilla Holmberg ensured the points were shared with a 95th-minute equaliser.',
      'Press play on the video above to see every kick of the game in N5.',
    ],
  },
};
