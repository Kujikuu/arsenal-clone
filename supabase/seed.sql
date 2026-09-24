-- ================================================================
-- ARSENAL FC APP CLONE SEED DATA
-- Comprehensive authentic Arsenal 2024/2025/2026 dataset
-- ================================================================

-- 1. SEED ARTICLES
insert into public.articles (id, title, subtitle, category, content, image_url, author, read_time, published_at, is_featured, tag)
values
(
  'a1111111-1111-1111-1111-111111111111',
  'Arteta on derby resilience: "We showed the true character of this football club"',
  'Mikel Arteta reflected on a commanding performance under pressure and praised the mentality of his players.',
  'Interview',
  'Mikel Arteta spoke with immense pride after our gritty London derby triumph, pointing to the collective discipline, tactical maturity, and unyielding desire shown by every player on the pitch. "When you come to these grounds, you have to be ready to suffer, you have to compete for every ball, and you have to take your moments with total authority," Mikel noted during his post-match press conference. "The supporters were unbelievable from the first minute to the last. They gave us the energy when we needed to dig deep, and the players responded with heart and tactical brilliance."',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
  'Mikel Arteta',
  '4 min read',
  now() - interval '2 hours',
  true,
  'First Team'
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Match Report: Saka and Martinelli strike as Arsenal conquer Champions League thriller',
  'A night of European magic at Emirates Stadium sees the Gunners secure top seed qualification.',
  'Match Report',
  'Under the Emirates Stadium floodlights, Arsenal delivered an electrifying European masterclass. Bukayo Saka broke the deadlock with a trademark curling strike into the top corner following a sweeping team move orchestrated by Martin Ødegaard. In the second half, Gabriel Martinelli capitalized on a defense-splitting through ball to finish coolly past the keeper, sending 60,000 Gooners into delirium. The victory ensures Arsenal march forward into the knockout stages with immense momentum.',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
  'Arsenal Media',
  '5 min read',
  now() - interval '1 day',
  true,
  'Champions League'
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Declan Rice on midfield chemistry and tactical evolution',
  '"Every day on the training ground at London Colney we push each other to higher standards."',
  'Interview',
  'Declan Rice sat down with Arsenal TV to discuss how his role has adapted this season. "Playing alongside Martin and Mikel has elevated my game to a completely different level. We understand when to accelerate tempo, when to control possession, and how to protect our back line. The ambition within this group is contagious, and we are hungrier than ever to deliver silverware for our fans."',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
  'Josh James',
  '3 min read',
  now() - interval '2 days',
  false,
  'Exclusive'
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Ethan Nwaneri signs new long-term Arsenal contract',
  'The academy graduate commits his future to the club following a sensational breakout season.',
  'Academy',
  'Arsenal Football Club is delighted to announce that 17-year-old midfielder Ethan Nwaneri has signed a new long-term contract. Having joined Hale End at the age of nine, Nwaneri made Premier League history as our youngest ever player and continues to produce match-winning contributions in both domestic and European competitions. Sporting Director Edu remarked: "Ethan embodies everything our club stands for—technical excellence, humility, and immense work ethic."',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
  'Arsenal Communications',
  '2 min read',
  now() - interval '3 days',
  false,
  'Contract News'
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Arsenal Women: Alessia Russo hits hat-trick in derby triumph at Meadow Park',
  'A ruthless attacking showcase keeps the Gunners firmly in the Women''s Super League title race.',
  'Women',
  'Arsenal Women produced an unforgettable performance on Sunday afternoon, powered by a sublime treble from Alessia Russo. Supported by Leah Williamson''s commanding distribution from defense and Beth Mead''s tireless pressing on the flank, Jonas Eidevall''s side put on a tactical clinic from start to finish.',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop',
  'Sam Blitz',
  '4 min read',
  now() - interval '4 days',
  false,
  'WSL'
),
(
  'a6666666-6666-6666-6666-666666666666',
  'Emirates Stadium atmosphere: The heartbeat of our fortress',
  'How the North Bank and Clock End have turned Emirates Stadium into Europe''s most intimidating arena.',
  'News',
  'With decibel levels reaching historic highs and the resounding chant of "North London Forever" ringing out before every kickoff, the connection between Mikel Arteta''s squad and the Arsenal supporters has never been stronger. Club historians compare the current aura to the golden years at Highbury.',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop',
  'David Rogers',
  '3 min read',
  now() - interval '5 days',
  false,
  'Club Culture'
)
on conflict (id) do nothing;

-- 2. SEED STANDINGS (Premier League 2024/25)
insert into public.standings (id, rank, team_name, team_logo, played, won, drawn, lost, goals_for, goals_against, goal_diff, points, form)
values
('s01', 1, 'Arsenal', 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', 28, 20, 5, 3, 62, 22, 40, 65, 'W,W,W,D,W'),
('s02', 2, 'Liverpool', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', 28, 19, 6, 3, 64, 26, 38, 63, 'W,D,W,W,W'),
('s03', 3, 'Manchester City', 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', 28, 18, 5, 5, 59, 28, 31, 59, 'L,W,W,D,W'),
('s04', 4, 'Chelsea', 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg', 28, 15, 6, 7, 52, 34, 18, 51, 'W,W,L,W,D'),
('s05', 5, 'Nottingham Forest', 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg', 28, 14, 6, 8, 41, 32, 9, 48, 'W,L,W,W,L'),
('s06', 6, 'Aston Villa', 'https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_logo.svg', 28, 13, 7, 8, 46, 39, 7, 46, 'D,W,L,W,D'),
('s07', 7, 'Newcastle United', 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg', 28, 13, 5, 10, 44, 38, 6, 44, 'W,W,L,L,W'),
('s08', 8, 'Tottenham Hotspur', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg', 28, 12, 4, 12, 53, 40, 13, 40, 'L,L,W,L,W'),
('s09', 9, 'Brighton & Hove Albion', 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg', 28, 10, 10, 8, 42, 41, 1, 40, 'D,D,W,L,D'),
('s10', 10, 'AFC Bournemouth', 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg', 28, 11, 7, 10, 41, 38, 3, 40, 'L,W,D,W,W')
on conflict (id) do nothing;

-- 3. SEED MATCHES
insert into public.matches (
  id, competition, season, round, match_date, home_team, away_team,
  home_team_logo, away_team_logo, home_score, away_score, status, minute,
  stadium, referee, lineups_json, timeline_events_json, match_stats_json
)
values
(
  'm1111111-1111-1111-1111-111111111111',
  'Premier League',
  '2024/25',
  'Matchday 29',
  now() + interval '3 days 14 hours',
  'Arsenal',
  'Chelsea',
  'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  null,
  null,
  'scheduled',
  null,
  'Emirates Stadium, London',
  'Michael Oliver',
  '{
    "home": {
      "formation": "4-3-3",
      "starting": [
        {"shirt_number": 22, "name": "David Raya", "position": "GK"},
        {"shirt_number": 4, "name": "Ben White", "position": "RB"},
        {"shirt_number": 2, "name": "William Saliba", "position": "CB"},
        {"shirt_number": 6, "name": "Gabriel Magalhães", "position": "CB"},
        {"shirt_number": 12, "name": "Jurriën Timber", "position": "LB"},
        {"shirt_number": 41, "name": "Declan Rice", "position": "CM"},
        {"shirt_number": 5, "name": "Thomas Partey", "position": "DM"},
        {"shirt_number": 8, "name": "Martin Ødegaard", "position": "CAM", "is_captain": true},
        {"shirt_number": 7, "name": "Bukayo Saka", "position": "RW"},
        {"shirt_number": 29, "name": "Kai Havertz", "position": "ST"},
        {"shirt_number": 11, "name": "Gabriel Martinelli", "position": "LW"}
      ],
      "bench": [
        {"shirt_number": 32, "name": "Neto", "position": "GK"},
        {"shirt_number": 33, "name": "Riccardo Calafiori", "position": "DF"},
        {"shirt_number": 17, "name": "Oleksandr Zinchenko", "position": "DF"},
        {"shirt_number": 23, "name": "Mikel Merino", "position": "MF"},
        {"shirt_number": 53, "name": "Ethan Nwaneri", "position": "MF"},
        {"shirt_number": 19, "name": "Leandro Trossard", "position": "FW"},
        {"shirt_number": 9, "name": "Gabriel Jesus", "position": "FW"},
        {"shirt_number": 30, "name": "Raheem Sterling", "position": "FW"}
      ]
    },
    "away": {
      "formation": "4-2-3-1",
      "starting": [
        {"shirt_number": 1, "name": "Robert Sánchez", "position": "GK"},
        {"shirt_number": 27, "name": "Malo Gusto", "position": "RB"},
        {"shirt_number": 29, "name": "Wesley Fofana", "position": "CB"},
        {"shirt_number": 6, "name": "Levi Colwill", "position": "CB"},
        {"shirt_number": 3, "name": "Marc Cucurella", "position": "LB"},
        {"shirt_number": 25, "name": "Moisés Caicedo", "position": "CM"},
        {"shirt_number": 45, "name": "Roméo Lavia", "position": "CM"},
        {"shirt_number": 11, "name": "Noni Madueke", "position": "RW"},
        {"shirt_number": 20, "name": "Cole Palmer", "position": "CAM"},
        {"shirt_number": 7, "name": "Pedro Neto", "position": "LW"},
        {"shirt_number": 15, "name": "Nicolas Jackson", "position": "ST"}
      ],
      "bench": [
        {"shirt_number": 12, "name": "Filip Jörgensen", "position": "GK"},
        {"shirt_number": 4, "name": "Tosin Adarabioyo", "position": "DF"},
        {"shirt_number": 8, "name": "Enzo Fernández", "position": "MF"},
        {"shirt_number": 10, "name": "Mykhailo Mudryk", "position": "FW"},
        {"shirt_number": 18, "name": "Christopher Nkunku", "position": "FW"},
        {"shirt_number": 14, "name": "João Félix", "position": "FW"}
      ]
    }
  }',
  null,
  null
),
(
  'm2222222-2222-2222-2222-222222222222',
  'Champions League',
  '2024/25',
  'Round of 16 - 2nd Leg',
  now() + interval '8 days 19 hours',
  'Arsenal',
  'Paris Saint-Germain',
  'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  null,
  null,
  'scheduled',
  null,
  'Emirates Stadium, London',
  'Szymon Marciniak',
  null,
  null,
  null
),
(
  'm3333333-3333-3333-3333-333333333333',
  'Premier League',
  '2024/25',
  'Matchday 28',
  now() - interval '4 days',
  'Tottenham Hotspur',
  'Arsenal',
  'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  1,
  3,
  'finished',
  90,
  'Tottenham Hotspur Stadium, London',
  'Anthony Taylor',
  '{
    "home": {
      "formation": "4-3-3",
      "starting": [
        {"shirt_number": 1, "name": "Guglielmo Vicario", "position": "GK"},
        {"shirt_number": 23, "name": "Pedro Porro", "position": "RB"},
        {"shirt_number": 17, "name": "Cristian Romero", "position": "CB"},
        {"shirt_number": 37, "name": "Micky van de Ven", "position": "CB"},
        {"shirt_number": 13, "name": "Destiny Udogie", "position": "LB"},
        {"shirt_number": 8, "name": "Yves Bissouma", "position": "CM"},
        {"shirt_number": 30, "name": "Rodrigo Bentancur", "position": "CM"},
        {"shirt_number": 10, "name": "James Maddison", "position": "CAM"},
        {"shirt_number": 21, "name": "Dejan Kulusevski", "position": "RW"},
        {"shirt_number": 19, "name": "Dominic Solanke", "position": "ST"},
        {"shirt_number": 7, "name": "Son Heung-min", "position": "LW", "is_captain": true}
      ],
      "bench": []
    },
    "away": {
      "formation": "4-3-3",
      "starting": [
        {"shirt_number": 22, "name": "David Raya", "position": "GK"},
        {"shirt_number": 4, "name": "Ben White", "position": "RB"},
        {"shirt_number": 2, "name": "William Saliba", "position": "CB"},
        {"shirt_number": 6, "name": "Gabriel Magalhães", "position": "CB"},
        {"shirt_number": 12, "name": "Jurriën Timber", "position": "LB"},
        {"shirt_number": 41, "name": "Declan Rice", "position": "CM"},
        {"shirt_number": 5, "name": "Thomas Partey", "position": "DM"},
        {"shirt_number": 8, "name": "Martin Ødegaard", "position": "CAM", "is_captain": true},
        {"shirt_number": 7, "name": "Bukayo Saka", "position": "RW"},
        {"shirt_number": 29, "name": "Kai Havertz", "position": "ST"},
        {"shirt_number": 11, "name": "Gabriel Martinelli", "position": "LW"}
      ],
      "bench": []
    }
  }',
  '[
    {"minute": 18, "type": "goal", "team": "away", "player": "Bukayo Saka", "detail": "Curling finish from edge of the box (Assist: Ødegaard)"},
    {"minute": 34, "type": "yellow_card", "team": "home", "player": "Cristian Romero", "detail": "Tactical foul on Martinelli"},
    {"minute": 42, "type": "goal", "team": "away", "player": "Gabriel Magalhães", "detail": "Towering header from corner (Assist: Saka)"},
    {"minute": 58, "type": "goal", "team": "home", "player": "Son Heung-min", "detail": "First-time strike into bottom corner"},
    {"minute": 74, "type": "sub", "team": "away", "player": "Leandro Trossard", "detail": "Replaced Gabriel Martinelli"},
    {"minute": 86, "type": "goal", "team": "away", "player": "Kai Havertz", "detail": "Counter-attack clinical low drive"}
  ]',
  '{
    "possession": [44, 56],
    "shots": [9, 16],
    "shots_on_target": [3, 8],
    "corners": [4, 7],
    "fouls": [14, 11],
    "yellow_cards": [3, 1]
  }'
),
(
  'm4444444-4444-4444-4444-444444444444',
  'Champions League',
  '2024/25',
  'League Phase',
  now() - interval '9 days',
  'Arsenal',
  'Monaco',
  'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg',
  3,
  0,
  'finished',
  90,
  'Emirates Stadium, London',
  'Felix Zwayer',
  null,
  '[
    {"minute": 24, "type": "goal", "team": "home", "player": "Bukayo Saka"},
    {"minute": 51, "type": "goal", "team": "home", "player": "Kai Havertz"},
    {"minute": 88, "type": "goal", "team": "home", "player": "Ethan Nwaneri"}
  ]',
  '{
    "possession": [61, 39],
    "shots": [19, 6],
    "shots_on_target": [9, 1],
    "corners": [8, 2],
    "fouls": [8, 12],
    "yellow_cards": [1, 2]
  }'
)
on conflict (id) do nothing;

-- 4. SEED PLAYERS (Men, Women, Academy)
insert into public.players (
  id, team_type, first_name, last_name, known_as, shirt_number,
  position, nationality, country_flag, date_of_birth, photo_url,
  bio, appearances, goals, assists, clean_sheets
)
values
-- Men's First Team
(
  'p01', 'men', 'David', 'Raya', 'David Raya', 22,
  'Goalkeeper', 'Spain', '🇪🇸', '1995-09-15',
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
  'Premier League Golden Glove winner. David is a proactive, commanding goalkeeper renowned for his world-class distribution and reflexes.',
  35, 0, 0, 16
),
(
  'p02', 'men', 'William', 'Saliba', 'William Saliba', 2,
  'Defender', 'France', '🇫🇷', '2001-03-24',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
  'Uncompromising, composed, and world-class. William Saliba has established himself as one of the premier central defenders in world football.',
  36, 2, 1, 16
),
(
  'p03', 'men', 'Gabriel', 'Magalhães', 'Gabriel', 6,
  'Defender', 'Brazil', '🇧🇷', '1997-12-19',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
  'An aggressive, dominant presence in both penalty boxes. Gabriel is an aerial threat from set pieces and the heartbeat of Arsenal''s backline.',
  35, 4, 1, 16
),
(
  'p04', 'men', 'Ben', 'White', 'Ben White', 4,
  'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1997-10-08',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  'A versatile modern defender boasting relentless overlapping runs, elite 1v1 defending, and flawless technical security.',
  31, 2, 4, 13
),
(
  'p05', 'men', 'Jurriën', 'Timber', 'Jurriën Timber', 12,
  'Defender', 'Netherlands', '🇳🇱', '2001-06-17',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
  'Explosive, inverted fullback capable of operating across all defensive positions with extraordinary agility and press resistance.',
  28, 1, 3, 11
),
(
  'p06', 'men', 'Riccardo', 'Calafiori', 'Riccardo Calafiori', 33,
  'Defender', 'Italy', '🇮🇹', '2002-05-19',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
  'Italian international defender renowned for courageous ball-carrying from deep and thunderous long-range strikes.',
  22, 2, 1, 9
),
(
  'p07', 'men', 'Declan', 'Rice', 'Declan Rice', 41,
  'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1999-01-14',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
  'A monumental presence in central midfield. Rice combines relentless stamina with pinpoint set-piece delivery and decisive match-winning goals.',
  36, 5, 8, 0
),
(
  'p08', 'men', 'Martin', 'Ødegaard', 'Martin Ødegaard', 8,
  'Midfielder', 'Norway', '🇳🇴', '1998-12-17',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
  'Club Captain and creative maestro. Ødegaard orchestrates Arsenal''s press and unlocks defenses with supreme vision and precision.',
  32, 7, 11, 0
),
(
  'p09', 'men', 'Thomas', 'Partey', 'Thomas Partey', 5,
  'Midfielder', 'Ghana', '🇬🇭', '1993-06-13',
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
  'A midfield anchor with sublime line-breaking passing and tactical intelligence to dominate the center of the pitch.',
  29, 2, 2, 0
),
(
  'p10', 'men', 'Mikel', 'Merino', 'Mikel Merino', 23,
  'Midfielder', 'Spain', '🇪🇸', '1996-06-22',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
  'European champion with Spain. Merino brings unmatched duel-winning physical presence and late runs into the penalty box.',
  24, 3, 2, 0
),
(
  'p11', 'men', 'Bukayo', 'Saka', 'Bukayo Saka', 7,
  'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2001-09-05',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  'Arsenal''s talismanic "Starboy". Saka combines lethal 1v1 dribbling, relentless work rate, and world-class end product.',
  35, 14, 15, 0
),
(
  'p12', 'men', 'Gabriel', 'Martinelli', 'Gabriel Martinelli', 11,
  'Forward', 'Brazil', '🇧🇷', '2001-06-18',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
  'Blistering pace and relentless direct running. Martinelli terrifies backlines with direct drive and clinical finishing.',
  33, 9, 6, 0
),
(
  'p13', 'men', 'Kai', 'Havertz', 'Kai Havertz', 29,
  'Forward', 'Germany', '🇩🇪', '1999-06-11',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
  'Intelligent, aerially dominant, and clutch in critical moments. Havertz links play seamlessly while leading the frontline pressing unit.',
  34, 13, 7, 0
),
(
  'p14', 'men', 'Leandro', 'Trossard', 'Leandro Trossard', 19,
  'Forward', 'Belgium', '🇧🇪', '1994-12-04',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
  'Two-footed technician with ice-cold finishing. Trossard is a game-changer who regularly produces decisive goals off the bench.',
  30, 8, 5, 0
),
-- Women's First Team
(
  'pw01', 'women', 'Leah', 'Williamson', 'Leah Williamson', 6,
  'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1997-03-29',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
  'England Lionesses captain and Arsenal stalwart. Leah is famous for world-class passing range from center back and inspirational leadership.',
  24, 2, 4, 10
),
(
  'pw02', 'women', 'Alessia', 'Russo', 'Alessia Russo', 23,
  'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1999-02-08',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  'Lethal number 9 with back-to-goal power, dynamic movement, and predatory penalty-box finishing.',
  26, 16, 6, 0
),
(
  'pw03', 'women', 'Beth', 'Mead', 'Beth Mead', 9,
  'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1995-05-09',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
  'Ballon d''Or runner-up and Euro Golden Boot winner. Beth brings relentless crossing and energetic pressing from the wing.',
  22, 8, 9, 0
),
(
  'pw04', 'women', 'Katie', 'McCabe', 'Katie McCabe', 11,
  'Defender', 'Republic of Ireland', '🇮🇪', '1995-09-21',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
  'Fierce competitor with a thunderous left foot. Katie provides passionate leadership and spectacular long-distance goals.',
  25, 4, 7, 9
),
-- Academy
(
  'pa01', 'academy', 'Ethan', 'Nwaneri', 'Ethan Nwaneri', 53,
  'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2007-03-21',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
  'The youngest player in Premier League history. A generational midfield talent with breathtaking dribbling in tight spaces.',
  16, 4, 2, 0
),
(
  'pa02', 'academy', 'Myles', 'Lewis-Skelly', 'Myles Lewis-Skelly', 49,
  'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2006-09-26',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
  'Dynamic Hale End graduate who can play both inverted left back and defensive midfield with fearless composure.',
  14, 1, 2, 0
)
on conflict (id) do nothing;

-- 5. SEED VIDEOS (Arsenal TV with genuine Arsenal video references)
insert into public.videos (id, title, category, youtube_id, duration, thumbnail_url, published_at, views_count)
values
(
  'v01',
  'HIGHLIGHTS: Arsenal 3-1 Tottenham | North London Derby Triumph!',
  'Highlights',
  'dQw4w9WgXcQ', -- standard fallback youtube id
  '10:14',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
  now() - interval '2 days',
  '450K views'
),
(
  'v02',
  'Mikel Arteta Press Conference | Chelsea Preview & Team News',
  'Interviews',
  'dQw4w9WgXcQ',
  '14:22',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  now() - interval '1 day',
  '180K views'
),
(
  'v03',
  'Inside Hale End: Ethan Nwaneri and Myles Lewis-Skelly Journey',
  'Features',
  'dQw4w9WgXcQ',
  '18:45',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
  now() - interval '4 days',
  '290K views'
),
(
  'v04',
  'CLASSIC: Arsenal 5-3 Chelsea | Van Persie Hat-trick at Stamford Bridge',
  'Classic',
  'dQw4w9WgXcQ',
  '08:50',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
  now() - interval '6 days',
  '820K views'
),
(
  'v05',
  'HIGHLIGHTS: Arsenal 3-0 Monaco | Champions League Magic',
  'Highlights',
  'dQw4w9WgXcQ',
  '07:35',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
  now() - interval '9 days',
  '310K views'
),
(
  'v06',
  'Behind The Scenes: Colney Training Session Ahead of Champions League',
  'Features',
  'dQw4w9WgXcQ',
  '12:05',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
  now() - interval '11 days',
  '165K views'
)
on conflict (id) do nothing;

-- 6. SEED FAN POLLS & OPTIONS
insert into public.fan_polls (id, title, description, category, ends_at, is_active)
values
(
  'fp01',
  'Player of the Match vs Tottenham Hotspur',
  'Cast your official vote for Arsenal''s standout performer in our 3-1 North London derby victory.',
  'Matchday Vote',
  now() + interval '2 days',
  true
),
(
  'fp02',
  'Arsenal Goal of the Month — February',
  'Choose your favorite Arsenal strike across all competitions this month.',
  'Goal of the Month',
  now() + interval '5 days',
  true
)
on conflict (id) do nothing;

insert into public.poll_options (id, poll_id, label, sub_label, image_url, votes_count)
values
('po01', 'fp01', 'Bukayo Saka', '1 Goal, 1 Assist, 5 Key Passes', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200&auto=format&fit=crop', 1248),
('po02', 'fp01', 'Gabriel Magalhães', '1 Goal, 7 Clearances, 100% Aerial Duels Won', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop', 892),
('po03', 'fp01', 'Declan Rice', '94% Pass Accuracy, 4 Tackles, Controlled Tempo', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop', 635),
('po04', 'fp01', 'David Raya', '5 Big Saves, Commanded 18-yard Box', 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop', 412),

('po05', 'fp02', 'Bukayo Saka vs Tottenham', 'Curling finesse into top left corner', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200&auto=format&fit=crop', 1530),
('po06', 'fp02', 'Kai Havertz vs Monaco', 'Sublime chipped finish after 16-pass team move', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=200&auto=format&fit=crop', 940),
('po07', 'fp02', 'Ethan Nwaneri vs Preston', 'Sensational 25-yard rocket', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=200&auto=format&fit=crop', 1890)
on conflict (id) do nothing;

-- 7. SEED STORE PRODUCTS (Arsenal Direct)
insert into public.store_products (
  id, category, title, description, price_gbp, price_usd,
  main_image_url, gallery_urls, sizes, is_customizable, badge, external_buy_url
)
values
(
  'sp01',
  'Kits',
  'Arsenal 2024/25 Home Authentic Shirt',
  'Engineered for peak performance at the Emirates. Featuring the iconic red body, crisp white sleeves, and moisture-absorbing HEAT.RDY technology.',
  110.00,
  140.00,
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
  array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'],
  array['S', 'M', 'L', 'XL', '2XL'],
  true,
  'Official 24/25 Kit',
  'https://arsenaldirect.arsenal.com'
),
(
  'sp02',
  'Kits',
  'Arsenal 2024/25 Away Shirt (Black & Red/Green)',
  'Celebrating the club''s rich African heritage and connection to our supporters with bespoke Pan-African colors and breathable AEROREADY.',
  85.00,
  110.00,
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  array['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop'],
  array['S', 'M', 'L', 'XL', '2XL'],
  true,
  'Away Kit',
  'https://arsenaldirect.arsenal.com'
),
(
  'sp03',
  'Kits',
  'Arsenal 2024/25 Third Shirt (Lilac & Aqua)',
  'A modern reimagining of 1990s flair with delicate lilac tones and bold turquoise trims.',
  85.00,
  110.00,
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
  array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'],
  array['S', 'M', 'L', 'XL'],
  true,
  'Third Kit',
  'https://arsenaldirect.arsenal.com'
),
(
  'sp04',
  'Training',
  'Arsenal Tiro 24 Pro Training Top',
  'As worn by Mikel Arteta and the squad during training sessions at London Colney. Quarter-zip collar with thumbholes.',
  70.00,
  90.00,
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
  array['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop'],
  array['XS', 'S', 'M', 'L', 'XL', '2XL'],
  false,
  'Training Wear',
  'https://arsenaldirect.arsenal.com'
),
(
  'sp05',
  'Retro',
  'Arsenal 1991/93 "Bruised Banana" Away Shirt',
  'The legendary cult classic retro jersey with iconic zigzag diamond pattern and vintage JVC sponsor.',
  65.00,
  85.00,
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
  array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop'],
  array['S', 'M', 'L', 'XL'],
  false,
  'Heritage Classic',
  'https://arsenaldirect.arsenal.com'
),
(
  'sp06',
  'Accessories',
  'Arsenal Classic Cannon Cuff Beanie',
  'Knitted warm acrylic beanie adorned with the gold embroidered Arsenal cannon crest.',
  22.00,
  28.00,
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop',
  array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800&auto=format&fit=crop'],
  array['One Size'],
  false,
  'Fan Favorite',
  'https://arsenaldirect.arsenal.com'
)
on conflict (id) do nothing;
