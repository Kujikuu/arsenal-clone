import type { ImageSourcePropType } from 'react-native';

export interface LineupPlayer {
  num: number;
  name: string;
  pos: string;
  photo: string;
}

export interface ThreadEvent {
  id: string;
  minute: string;
  title: string;
  body: string;
  icon?: 'whistle';
}

export interface MatchStat {
  label: string;
  home: string;
  away: string;
  /** Share of the bar owned by the home side, 0..1. */
  homeShare: number;
}

export interface GoalEvent {
  minute: string;
  player: string;
}

export const HOME_GOALS: GoalEvent[] = [
  { minute: "31'", player: 'P. Groß' },
  { minute: "45'", player: 'C. Kostoulas' },
  { minute: "57'", player: 'Chema Andrés' },
];

export const AWAY_GOALS: GoalEvent[] = [];

export const THREAD_EVENTS: ThreadEvent[] = [
  {
    id: 'ft',
    minute: '-',
    title: 'Full time',
    body: 'Match ends, Brighton and Hove Albion 3, Arsenal 0.',
    icon: 'whistle',
  },
  {
    id: 'sh',
    minute: "90+7'",
    title: 'Second Half',
    body: 'Second Half ends, Brighton and Hove Albion 3, Arsenal 0.',
  },
  {
    id: 'miss',
    minute: "90+5'",
    title: 'Miss',
    body: 'Attempt missed. Martín Zubimendi (Arsenal) header from the centre of the box.',
  },
  {
    id: 'corner',
    minute: "90+2'",
    title: 'Corner',
    body: 'Corner, Arsenal. Conceded by Malick Yalcouyé.',
  },
];

export const MATCH_STATS: MatchStat[] = [
  { label: 'Possession', home: '40.5%', away: '59.5%', homeShare: 0.405 },
  { label: 'Expected Goals', home: '1.33', away: '1.47', homeShare: 1.33 / (1.33 + 1.47) },
  { label: 'Total Shots', home: '17', away: '10', homeShare: 17 / 27 },
  { label: 'Shots on Target', home: '5', away: '2', homeShare: 5 / 7 },
  { label: 'Big Chances', home: '3', away: '1', homeShare: 3 / 4 },
  { label: 'Corners', home: '5', away: '5', homeShare: 0.5 },
  { label: 'Pass Completion', home: '356 (76%)', away: '418 (84%)', homeShare: 356 / (356 + 418) },
];

const LOCAL_LINEUP_PHOTOS: Record<string, ImageSourcePropType> = {
  'D. RAYA': require('@/assets/extracted/lineup_raya.png'),
  'R. CALAFIORI': require('@/assets/extracted/lineup_calafiori.png'),
  GABRIEL: require('@/assets/extracted/lineup_gabriel.png'),
  'E. KONSA': require('@/assets/extracted/lineup_konsa.png'),
};

export function lineupPhoto(player: LineupPlayer): ImageSourcePropType {
  return LOCAL_LINEUP_PHOTOS[player.name] ?? { uri: player.photo };
}

// Exact starting lineups from ref/matccenter-lineup.jpeg
export const ARSENAL_STARTING: LineupPlayer[] = [
  {
    num: 1,
    name: 'D. RAYA',
    pos: 'Goalkeeper',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p154561.png',
  },
  {
    num: 33,
    name: 'R. CALAFIORI',
    pos: 'Defender',
    photo: 'https://media.api-sports.io/football/players/487597.png',
  },
  {
    num: 6,
    name: 'GABRIEL',
    pos: 'Defender',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p226597.png',
  },
  {
    num: 15,
    name: 'E. KONSA',
    pos: 'Defender',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p199798.png',
  },
  {
    num: 12,
    name: 'J. TIMBER',
    pos: 'Defender',
    photo: 'https://media.api-sports.io/football/players/444884.png',
  },
  {
    num: 41,
    name: 'D. RICE',
    pos: 'Midfielder',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p204480.png',
  },
  {
    num: 8,
    name: 'M. ØDEGAARD',
    pos: 'Midfielder',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p184029.png',
  },
  {
    num: 29,
    name: 'K. HAVERTZ',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p219847.png',
  },
  {
    num: 7,
    name: 'B. SAKA',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png',
  },
  {
    num: 11,
    name: 'G. MARTINELLI',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p444145.png',
  },
  {
    num: 19,
    name: 'L. TROSSARD',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p116216.png',
  },
];

export const BRIGHTON_STARTING: LineupPlayer[] = [
  {
    num: 1,
    name: 'B. VERBRUGGEN',
    pos: 'Goalkeeper',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p486672.png',
  },
  {
    num: 34,
    name: 'J. VELTMAN',
    pos: 'Defender',
    photo: 'https://media.api-sports.io/football/players/2280.png',
  },
  {
    num: 29,
    name: 'J. VAN HECKE',
    pos: 'Defender',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p482609.png',
  },
  {
    num: 5,
    name: 'L. DUNK',
    pos: 'Defender',
    photo: 'https://media.api-sports.io/football/players/18920.png',
  },
  {
    num: 41,
    name: 'J. HINSHELWOOD',
    pos: 'Defender',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p544837.png',
  },
  {
    num: 20,
    name: 'C. BALÉBA',
    pos: 'Midfielder',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p544836.png',
  },
  {
    num: 13,
    name: 'P. GROß',
    pos: 'Midfielder',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p60772.png',
  },
  {
    num: 22,
    name: 'K. MITOMA',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p451340.png',
  },
  {
    num: 14,
    name: 'G. RUTTER',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p466827.png',
  },
  {
    num: 11,
    name: 'S. ADINGRA',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p510383.png',
  },
  {
    num: 18,
    name: 'D. WELBECK',
    pos: 'Forward',
    photo: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p50175.png',
  },
];
