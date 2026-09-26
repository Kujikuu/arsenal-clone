-- ================================================================
-- ARSENAL FC APP CLONE — SEED DATA
-- Club content for every screen of the app. Safe to re-run: rows are
-- upserted by id and match/gallery/quiz children are rebuilt.
-- ================================================================

begin;

-- ----------------------------------------------------------------
-- Retire rows from the first version of this seed
-- ----------------------------------------------------------------
delete from public.matches where id in ('m1111111-1111-1111-1111-111111111111', 'm2222222-2222-2222-2222-222222222222', 'm3333333-3333-3333-3333-333333333333', 'm4444444-4444-4444-4444-444444444444');
delete from public.poll_options where id in ('po01','po02','po03','po04','po05','po06','po07') and poll_id not in (select id from public.fan_polls where id in ('fp01','fp02'));

-- ----------------------------------------------------------------
-- Matches
-- ----------------------------------------------------------------
insert into public.matches (id, team_type, competition, competition_logo, season, round, match_date, home_team, away_team, home_team_logo, away_team_logo, home_score, away_score, status, minute, stadium, referee, audio_url)
values
  ('m2627-01', 'men', 'Friendly', 'https://media.api-sports.io/football/leagues/667.png', '2026/27', 'Pre-season', '2026-07-25T11:00:00Z', 'Arsenal', 'AC Milan', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/489.png', 1, 0, 'finished', 90, 'National Stadium, Singapore', 'Clarence Chew', null),
  ('m2627-02', 'men', 'Emirates Cup', 'https://media.api-sports.io/football/teams/42.png', '2026/27', 'Final', '2026-08-01T14:00:00Z', 'Arsenal', 'Athletic Club', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/531.png', 3, 0, 'finished', 90, 'Emirates Stadium', 'Tony Harrington', null),
  ('m2627-03', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 1', '2026-08-22T14:00:00Z', 'Arsenal', 'Wolves', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/39.png', 2, 0, 'finished', 90, 'Emirates Stadium', 'Anthony Taylor', null),
  ('m2627-04', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 2', '2026-08-29T11:30:00Z', 'Aston Villa', 'Arsenal', 'https://media.api-sports.io/football/teams/66.png', 'https://media.api-sports.io/football/teams/42.png', 1, 2, 'finished', 90, 'Villa Park', 'Simon Hooper', null),
  ('m2627-05', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 3', '2026-09-12T16:30:00Z', 'Arsenal', 'Newcastle', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/34.png', 3, 1, 'finished', 90, 'Emirates Stadium', 'Chris Kavanagh', null),
  ('m02', 'men', 'Carabao Cup', 'https://media.api-sports.io/football/leagues/48.png', '2026/27', 'Round 3', '2026-09-15T18:45:00Z', 'Ipswich Town', 'Arsenal', 'https://media.api-sports.io/football/teams/57.png', 'https://media.api-sports.io/football/teams/42.png', 2, 4, 'finished', 90, 'Portman Road', 'Robert Jones', null),
  ('m01', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 4', '2026-09-19T16:00:00Z', 'Brighton', 'Arsenal', 'https://media.api-sports.io/football/teams/51.png', 'https://media.api-sports.io/football/teams/42.png', 3, 0, 'finished', 90, 'American Express Stadium', 'Stuart Attwell', 'https://www.arsenal.com/arsenal-radio'),
  ('m03', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 5', '2026-09-22T19:00:00Z', 'Man City', 'Arsenal', 'https://media.api-sports.io/football/teams/50.png', 'https://media.api-sports.io/football/teams/42.png', 2, 2, 'finished', 90, 'Etihad Stadium', 'Michael Oliver', 'https://www.arsenal.com/arsenal-radio'),
  ('m04', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 6', '2026-09-26T14:00:00Z', 'Arsenal', 'Leicester City', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/46.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Paul Tierney', null),
  ('m2627-06', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD1', '2026-09-30T19:00:00Z', 'Arsenal', 'Olympiacos', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/553.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Danny Makkelie', null),
  ('m2627-07', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 7', '2026-10-03T16:30:00Z', 'Arsenal', 'Chelsea', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/49.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Michael Oliver', null),
  ('m2627-08', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 8', '2026-10-17T11:30:00Z', 'Liverpool', 'Arsenal', 'https://media.api-sports.io/football/teams/40.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Anfield', 'Anthony Taylor', null),
  ('m2627-09', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD2', '2026-10-21T19:00:00Z', 'Inter', 'Arsenal', 'https://media.api-sports.io/football/teams/505.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'San Siro', 'Clément Turpin', null),
  ('m2627-10', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 9', '2026-10-24T14:00:00Z', 'Arsenal', 'Fulham', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/36.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Jarred Gillett', null),
  ('m2627-11', 'men', 'Carabao Cup', 'https://media.api-sports.io/football/leagues/48.png', '2026/27', 'Round 4', '2026-10-28T19:45:00Z', 'Arsenal', 'Brentford', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/55.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Tim Robinson', null),
  ('m2627-12', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 10', '2026-10-31T17:30:00Z', 'Tottenham', 'Arsenal', 'https://media.api-sports.io/football/teams/47.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Tottenham Hotspur Stadium', 'Simon Hooper', null),
  ('m2627-13', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD3', '2026-11-04T20:00:00Z', 'Arsenal', 'PSV', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/197.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Slavko Vinčić', null),
  ('m2627-14', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 11', '2026-11-07T17:30:00Z', 'Arsenal', 'Man United', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/33.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Chris Kavanagh', null),
  ('m2627-15', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 12', '2026-11-21T15:00:00Z', 'Everton', 'Arsenal', 'https://media.api-sports.io/football/teams/45.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Hill Dickinson Stadium', 'Craig Pawson', null),
  ('m2627-16', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD4', '2026-11-25T20:00:00Z', 'Bayern Munich', 'Arsenal', 'https://media.api-sports.io/football/teams/157.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Allianz Arena', 'Szymon Marciniak', null),
  ('m2627-17', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 13', '2026-11-28T15:00:00Z', 'Arsenal', 'Crystal Palace', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/52.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Robert Jones', null),
  ('m2627-18', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 14', '2026-12-05T15:00:00Z', 'Nott''m Forest', 'Arsenal', 'https://media.api-sports.io/football/teams/65.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'The City Ground', 'John Brooks', null),
  ('m2627-19', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD5', '2026-12-09T20:00:00Z', 'Arsenal', 'Atlético Madrid', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/530.png', null, null, 'scheduled', null, 'Emirates Stadium', 'François Letexier', null),
  ('m2627-20', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 15', '2026-12-13T14:00:00Z', 'Arsenal', 'West Ham', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/48.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Samuel Barrott', null),
  ('m2627-21', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 16', '2026-12-19T15:00:00Z', 'Bournemouth', 'Arsenal', 'https://media.api-sports.io/football/teams/35.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Vitality Stadium', 'Peter Bankes', null),
  ('m2627-22', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 17', '2026-12-26T15:00:00Z', 'Arsenal', 'Sunderland', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/746.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Andy Madley', null),
  ('m2627-23', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 19', '2027-01-02T12:30:00Z', 'Leeds', 'Arsenal', 'https://media.api-sports.io/football/teams/63.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Elland Road', 'Stuart Attwell', null),
  ('m2627-24', 'men', 'FA Cup', 'https://media.api-sports.io/football/leagues/45.png', '2026/27', 'Third Round', '2027-01-09T17:45:00Z', 'Arsenal', 'Southampton', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/41.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Darren England', null),
  ('m2627-25', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD7', '2027-01-20T20:00:00Z', 'Arsenal', 'Real Madrid', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/541.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Daniele Orsato', null),
  ('m2627-26', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 22', '2027-01-23T17:30:00Z', 'Man City', 'Arsenal', 'https://media.api-sports.io/football/teams/50.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Etihad Stadium', 'Michael Oliver', null),
  ('m2627-27', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 25', '2027-02-06T17:30:00Z', 'Arsenal', 'Liverpool', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/40.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Anthony Taylor', null),
  ('m2627-28', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 28', '2027-02-27T12:30:00Z', 'Chelsea', 'Arsenal', 'https://media.api-sports.io/football/teams/49.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Stamford Bridge', 'Paul Tierney', null),
  ('m2627-29', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 30', '2027-03-13T15:00:00Z', 'Arsenal', 'Tottenham', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/47.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Chris Kavanagh', null),
  ('m2627-30', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 32', '2027-04-10T14:00:00Z', 'Newcastle', 'Arsenal', 'https://media.api-sports.io/football/teams/34.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'St. James'' Park', 'Simon Hooper', null),
  ('m2627-31', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 38', '2027-05-23T15:00:00Z', 'Arsenal', 'Aston Villa', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/66.png', null, null, 'scheduled', null, 'Emirates Stadium', 'Anthony Taylor', null),
  ('m2627-o1', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 4', '2026-09-19T14:00:00Z', 'Liverpool', 'Chelsea', 'https://media.api-sports.io/football/teams/40.png', 'https://media.api-sports.io/football/teams/49.png', 2, 1, 'finished', 90, 'Anfield', 'Craig Pawson', null),
  ('m2627-o2', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 4', '2026-09-20T13:00:00Z', 'Man United', 'Tottenham', 'https://media.api-sports.io/football/teams/33.png', 'https://media.api-sports.io/football/teams/47.png', 1, 2, 'finished', 90, 'Old Trafford', 'John Brooks', null),
  ('m2627-o3', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 5', '2026-09-23T19:00:00Z', 'Newcastle', 'Aston Villa', 'https://media.api-sports.io/football/teams/34.png', 'https://media.api-sports.io/football/teams/66.png', 1, 1, 'finished', 90, 'St. James'' Park', 'Robert Jones', null),
  ('m2627-o4', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 6', '2026-09-26T16:30:00Z', 'Chelsea', 'Man City', 'https://media.api-sports.io/football/teams/49.png', 'https://media.api-sports.io/football/teams/50.png', null, null, 'scheduled', null, 'Stamford Bridge', 'Anthony Taylor', null),
  ('m2526-01', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2025/26', 'Matchday 1', '2025-08-17T15:30:00Z', 'Man United', 'Arsenal', 'https://media.api-sports.io/football/teams/33.png', 'https://media.api-sports.io/football/teams/42.png', 0, 1, 'finished', 90, 'Old Trafford', null, null),
  ('m2526-02', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2025/26', 'Matchday 2', '2025-08-23T16:30:00Z', 'Arsenal', 'Leeds', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/63.png', 5, 0, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2526-03', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2025/26', 'Matchday 3', '2025-08-31T15:30:00Z', 'Liverpool', 'Arsenal', 'https://media.api-sports.io/football/teams/40.png', 'https://media.api-sports.io/football/teams/42.png', 1, 0, 'finished', 90, 'Anfield', null, null),
  ('m2526-04', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2025/26', 'Matchday 4', '2025-09-13T11:30:00Z', 'Arsenal', 'Nott''m Forest', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/65.png', 3, 0, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2526-05', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2025/26', 'League Phase MD1', '2025-09-16T16:45:00Z', 'Athletic Club', 'Arsenal', 'https://media.api-sports.io/football/teams/531.png', 'https://media.api-sports.io/football/teams/42.png', 0, 2, 'finished', 90, 'San Mamés', null, null),
  ('m2526-06', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2025/26', 'Matchday 5', '2025-09-21T15:30:00Z', 'Arsenal', 'Man City', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/50.png', 1, 1, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2425-01', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2024/25', 'Matchday 1', '2024-08-17T14:00:00Z', 'Arsenal', 'Wolves', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/39.png', 2, 0, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2425-02', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2024/25', 'Matchday 2', '2024-08-24T16:30:00Z', 'Aston Villa', 'Arsenal', 'https://media.api-sports.io/football/teams/66.png', 'https://media.api-sports.io/football/teams/42.png', 0, 2, 'finished', 90, 'Villa Park', null, null),
  ('m2425-03', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2024/25', 'Matchday 4', '2024-09-15T13:00:00Z', 'Tottenham', 'Arsenal', 'https://media.api-sports.io/football/teams/47.png', 'https://media.api-sports.io/football/teams/42.png', 0, 1, 'finished', 90, 'Tottenham Hotspur Stadium', null, null),
  ('m2425-04', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2024/25', 'Matchday 6', '2024-09-28T14:00:00Z', 'Arsenal', 'Leicester City', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/46.png', 4, 2, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2425-05', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2024/25', 'League Phase MD2', '2024-10-01T19:00:00Z', 'Arsenal', 'Paris Saint-Germain', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/85.png', 2, 0, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2425-06', 'men', 'Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2024/25', 'Matchday 24', '2025-02-02T16:30:00Z', 'Arsenal', 'Man City', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/50.png', 5, 1, 'finished', 90, 'Emirates Stadium', null, null),
  ('m2425-07', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2024/25', 'Quarter-final 2nd leg', '2025-04-16T19:00:00Z', 'Real Madrid', 'Arsenal', 'https://media.api-sports.io/football/teams/541.png', 'https://media.api-sports.io/football/teams/42.png', 1, 2, 'finished', 90, 'Santiago Bernabéu', null, null),
  ('m2425-08', 'men', 'UEFA Champions League', 'https://media.api-sports.io/football/leagues/2.png', '2024/25', 'Semi-final 1st leg', '2025-04-29T19:00:00Z', 'Arsenal', 'Paris Saint-Germain', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/85.png', 0, 1, 'finished', 90, 'Emirates Stadium', null, null),
  ('w2627-01', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 1', '2026-09-06T13:00:00Z', 'Chelsea Women', 'Arsenal Women', 'https://media.api-sports.io/football/teams/49.png', 'https://media.api-sports.io/football/teams/42.png', 1, 1, 'finished', 90, 'Kingsmeadow', null, null),
  ('w2627-02', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 2', '2026-09-13T13:00:00Z', 'Arsenal Women', 'West Ham Women', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/48.png', 3, 0, 'finished', 90, 'Meadow Park', null, null),
  ('w2627-hbk', 'women', 'UEFA Women''s Champions League', 'https://media.api-sports.io/football/leagues/525.png', '2026/27', 'Qualifying Round 2', '2026-09-17T18:00:00Z', 'Arsenal Women', 'HB Køge', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/2070.png', 1, 0, 'finished', 90, 'Meadow Park', null, null),
  ('w2627-03', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 3', '2026-09-20T11:30:00Z', 'Arsenal Women', 'Man United Women', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/33.png', 1, 1, 'finished', 90, 'Emirates Stadium', null, null),
  ('w2627-04', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 4', '2026-10-04T13:00:00Z', 'Liverpool Women', 'Arsenal Women', 'https://media.api-sports.io/football/teams/40.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'St Helens Stadium', null, null),
  ('w2627-05', 'women', 'UEFA Women''s Champions League', 'https://media.api-sports.io/football/leagues/525.png', '2026/27', 'League Phase MD1', '2026-10-08T17:45:00Z', 'Arsenal Women', 'Bayern Munich Women', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/157.png', null, null, 'scheduled', null, 'Emirates Stadium', null, null),
  ('w2627-06', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 5', '2026-10-11T13:00:00Z', 'Arsenal Women', 'Tottenham Women', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/47.png', null, null, 'scheduled', null, 'Emirates Stadium', null, null),
  ('w2627-07', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 7', '2026-11-01T14:00:00Z', 'Man City Women', 'Arsenal Women', 'https://media.api-sports.io/football/teams/50.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Joie Stadium', null, null),
  ('w2627-08', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 8', '2026-11-15T12:30:00Z', 'Arsenal Women', 'Chelsea Women', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/49.png', null, null, 'scheduled', null, 'Emirates Stadium', null, null),
  ('w2627-09', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 10', '2026-12-13T12:00:00Z', 'Arsenal Women', 'Brighton Women', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/51.png', null, null, 'scheduled', null, 'Meadow Park', null, null),
  ('w2627-10', 'women', 'Women''s Super League', 'https://media.api-sports.io/football/leagues/44.png', '2026/27', 'Matchday 12', '2027-01-17T14:00:00Z', 'Everton Women', 'Arsenal Women', 'https://media.api-sports.io/football/teams/45.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Goodison Park', null, null),
  ('w2425-final', 'women', 'UEFA Women''s Champions League', 'https://media.api-sports.io/football/leagues/525.png', '2024/25', 'Final', '2025-05-24T16:00:00Z', 'Barcelona Women', 'Arsenal Women', 'https://media.api-sports.io/football/teams/529.png', 'https://media.api-sports.io/football/teams/42.png', 0, 1, 'finished', 90, 'Estádio José Alvalade, Lisbon', 'Ivana Martinčić', null),
  ('a2627-01', 'academy', 'Premier League 2', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 1', '2026-08-15T12:00:00Z', 'Arsenal U21', 'Chelsea U21', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/49.png', 2, 1, 'finished', 90, 'Meadow Park', null, null),
  ('a2627-02', 'academy', 'Premier League 2', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 3', '2026-08-29T12:00:00Z', 'Man City U21', 'Arsenal U21', 'https://media.api-sports.io/football/teams/50.png', 'https://media.api-sports.io/football/teams/42.png', 0, 3, 'finished', 90, 'Joie Stadium', null, null),
  ('a2627-03', 'academy', 'UEFA Youth League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD1', '2026-09-16T12:00:00Z', 'Arsenal U19', 'Olympiacos U19', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/553.png', 2, 2, 'finished', 90, 'Meadow Park', null, null),
  ('a2627-04', 'academy', 'U18 Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 4', '2026-09-20T10:00:00Z', 'Arsenal U18', 'Tottenham U18', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/47.png', 4, 1, 'finished', 90, 'Hale End', null, null),
  ('a2627-05', 'academy', 'Premier League 2', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 5', '2026-10-03T12:00:00Z', 'Arsenal U21', 'Liverpool U21', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/40.png', null, null, 'scheduled', null, 'Meadow Park', null, null),
  ('a2627-06', 'academy', 'UEFA Youth League', 'https://media.api-sports.io/football/leagues/2.png', '2026/27', 'League Phase MD2', '2026-10-21T13:00:00Z', 'Inter U19', 'Arsenal U19', 'https://media.api-sports.io/football/teams/505.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Konami Youth Development Centre', null, null),
  ('a2627-07', 'academy', 'U18 Premier League', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 9', '2026-11-07T11:00:00Z', 'West Ham U18', 'Arsenal U18', 'https://media.api-sports.io/football/teams/48.png', 'https://media.api-sports.io/football/teams/42.png', null, null, 'scheduled', null, 'Rush Green', null, null),
  ('a2627-08', 'academy', 'Premier League 2', 'https://media.api-sports.io/football/leagues/39.png', '2026/27', 'Matchday 10', '2026-12-12T13:00:00Z', 'Arsenal U21', 'Man United U21', 'https://media.api-sports.io/football/teams/42.png', 'https://media.api-sports.io/football/teams/33.png', null, null, 'scheduled', null, 'Emirates Stadium', null, null)
on conflict (id) do update set
  team_type = excluded.team_type,
  competition = excluded.competition,
  competition_logo = excluded.competition_logo,
  season = excluded.season,
  round = excluded.round,
  match_date = excluded.match_date,
  home_team = excluded.home_team,
  away_team = excluded.away_team,
  home_team_logo = excluded.home_team_logo,
  away_team_logo = excluded.away_team_logo,
  home_score = excluded.home_score,
  away_score = excluded.away_score,
  status = excluded.status,
  minute = excluded.minute,
  stadium = excluded.stadium,
  referee = excluded.referee,
  audio_url = excluded.audio_url;

-- ----------------------------------------------------------------
-- Standings (rebuilt)
-- ----------------------------------------------------------------
delete from public.standings;
insert into public.standings (id, team_type, season, competition, rank, team_name, team_code, team_logo, played, won, drawn, lost, goals_for, goals_against, goal_diff, points, trend, form)
values
  ('st-men-202627-premierleague-liv', 'men', '2026/27', 'Premier League', 1, 'Liverpool', 'LIV', 'https://media.api-sports.io/football/teams/40.png', 5, 4, 1, 0, 11, 4, 7, 13, 'same', 'W,W,D,W,W'),
  ('st-men-202627-premierleague-mci', 'men', '2026/27', 'Premier League', 2, 'Man City', 'MCI', 'https://media.api-sports.io/football/teams/50.png', 5, 4, 0, 1, 12, 5, 7, 12, 'up', 'W,W,L,W,D'),
  ('st-men-202627-premierleague-che', 'men', '2026/27', 'Premier League', 3, 'Chelsea', 'CHE', 'https://media.api-sports.io/football/teams/49.png', 5, 3, 1, 1, 10, 6, 4, 10, 'up', 'W,D,W,L,W'),
  ('st-men-202627-premierleague-ars', 'men', '2026/27', 'Premier League', 4, 'Arsenal', 'ARS', 'https://media.api-sports.io/football/teams/42.png', 5, 3, 1, 1, 9, 7, 2, 10, 'down', 'W,W,W,L,D'),
  ('st-men-202627-premierleague-tot', 'men', '2026/27', 'Premier League', 5, 'Tottenham', 'TOT', 'https://media.api-sports.io/football/teams/47.png', 5, 3, 0, 2, 8, 6, 2, 9, 'up', 'L,W,W,L,W'),
  ('st-men-202627-premierleague-bha', 'men', '2026/27', 'Premier League', 6, 'Brighton', 'BHA', 'https://media.api-sports.io/football/teams/51.png', 5, 2, 2, 1, 9, 6, 3, 8, 'up', 'D,L,W,D,W'),
  ('st-men-202627-premierleague-new', 'men', '2026/27', 'Premier League', 7, 'Newcastle', 'NEW', 'https://media.api-sports.io/football/teams/34.png', 5, 2, 2, 1, 7, 6, 1, 8, 'same', 'W,D,L,W,D'),
  ('st-men-202627-premierleague-avl', 'men', '2026/27', 'Premier League', 8, 'Aston Villa', 'AVL', 'https://media.api-sports.io/football/teams/66.png', 5, 2, 1, 2, 6, 6, 0, 7, 'down', 'W,L,W,L,D'),
  ('st-men-202627-premierleague-nfo', 'men', '2026/27', 'Premier League', 9, 'Nott''m Forest', 'NFO', 'https://media.api-sports.io/football/teams/65.png', 5, 2, 1, 2, 5, 6, -1, 7, 'same', 'L,W,D,W,L'),
  ('st-men-202627-premierleague-ful', 'men', '2026/27', 'Premier League', 10, 'Fulham', 'FUL', 'https://media.api-sports.io/football/teams/36.png', 5, 1, 3, 1, 5, 5, 0, 6, 'up', 'D,D,W,L,D'),
  ('st-men-202627-premierleague-bou', 'men', '2026/27', 'Premier League', 11, 'Bournemouth', 'BOU', 'https://media.api-sports.io/football/teams/35.png', 5, 2, 0, 3, 6, 8, -2, 6, 'down', 'W,L,L,W,L'),
  ('st-men-202627-premierleague-mun', 'men', '2026/27', 'Premier League', 12, 'Man United', 'MUN', 'https://media.api-sports.io/football/teams/33.png', 5, 1, 2, 2, 6, 7, -1, 5, 'down', 'D,W,L,D,L'),
  ('st-men-202627-premierleague-bre', 'men', '2026/27', 'Premier League', 13, 'Brentford', 'BRE', 'https://media.api-sports.io/football/teams/55.png', 5, 1, 2, 2, 5, 7, -2, 5, 'same', 'L,D,W,D,L'),
  ('st-men-202627-premierleague-eve', 'men', '2026/27', 'Premier League', 14, 'Everton', 'EVE', 'https://media.api-sports.io/football/teams/45.png', 5, 1, 2, 2, 4, 6, -2, 5, 'up', 'D,L,D,W,L'),
  ('st-men-202627-premierleague-cry', 'men', '2026/27', 'Premier League', 15, 'Crystal Palace', 'CRY', 'https://media.api-sports.io/football/teams/52.png', 5, 1, 1, 3, 4, 7, -3, 4, 'down', 'L,W,L,D,L'),
  ('st-men-202627-premierleague-whu', 'men', '2026/27', 'Premier League', 16, 'West Ham', 'WHU', 'https://media.api-sports.io/football/teams/48.png', 5, 1, 1, 3, 5, 9, -4, 4, 'same', 'L,L,W,D,L'),
  ('st-men-202627-premierleague-lee', 'men', '2026/27', 'Premier League', 17, 'Leeds', 'LEE', 'https://media.api-sports.io/football/teams/63.png', 5, 1, 1, 3, 4, 8, -4, 4, 'up', 'L,D,L,W,L'),
  ('st-men-202627-premierleague-sun', 'men', '2026/27', 'Premier League', 18, 'Sunderland', 'SUN', 'https://media.api-sports.io/football/teams/746.png', 5, 1, 0, 4, 3, 9, -6, 3, 'down', 'W,L,L,L,L'),
  ('st-men-202627-premierleague-lei', 'men', '2026/27', 'Premier League', 19, 'Leicester City', 'LEI', 'https://media.api-sports.io/football/teams/46.png', 5, 0, 2, 3, 3, 8, -5, 2, 'same', 'D,L,L,D,L'),
  ('st-men-202627-premierleague-wol', 'men', '2026/27', 'Premier League', 20, 'Wolves', 'WOL', 'https://media.api-sports.io/football/teams/39.png', 5, 0, 1, 4, 2, 10, -8, 1, 'down', 'L,L,D,L,L'),
  ('st-men-202425-premierleague-liv', 'men', '2024/25', 'Premier League', 1, 'Liverpool', 'LIV', 'https://media.api-sports.io/football/teams/40.png', 38, 25, 9, 4, 86, 41, 45, 84, 'same', null),
  ('st-men-202425-premierleague-ars', 'men', '2024/25', 'Premier League', 2, 'Arsenal', 'ARS', 'https://media.api-sports.io/football/teams/42.png', 38, 20, 14, 4, 69, 34, 35, 74, 'same', null),
  ('st-men-202425-premierleague-mci', 'men', '2024/25', 'Premier League', 3, 'Man City', 'MCI', 'https://media.api-sports.io/football/teams/50.png', 38, 21, 8, 9, 72, 44, 28, 71, 'up', null),
  ('st-men-202425-premierleague-che', 'men', '2024/25', 'Premier League', 4, 'Chelsea', 'CHE', 'https://media.api-sports.io/football/teams/49.png', 38, 20, 9, 9, 64, 43, 21, 69, 'up', null),
  ('st-men-202425-premierleague-new', 'men', '2024/25', 'Premier League', 5, 'Newcastle', 'NEW', 'https://media.api-sports.io/football/teams/34.png', 38, 20, 6, 12, 68, 47, 21, 66, 'down', null),
  ('st-men-202425-premierleague-avl', 'men', '2024/25', 'Premier League', 6, 'Aston Villa', 'AVL', 'https://media.api-sports.io/football/teams/66.png', 38, 19, 9, 10, 58, 51, 7, 66, 'same', null),
  ('st-men-202425-premierleague-nfo', 'men', '2024/25', 'Premier League', 7, 'Nott''m Forest', 'NFO', 'https://media.api-sports.io/football/teams/65.png', 38, 19, 8, 11, 58, 46, 12, 65, 'down', null),
  ('st-men-202425-premierleague-bha', 'men', '2024/25', 'Premier League', 8, 'Brighton', 'BHA', 'https://media.api-sports.io/football/teams/51.png', 38, 16, 13, 9, 66, 59, 7, 61, 'up', null),
  ('st-men-202425-premierleague-bou', 'men', '2024/25', 'Premier League', 9, 'Bournemouth', 'BOU', 'https://media.api-sports.io/football/teams/35.png', 38, 15, 11, 12, 58, 46, 12, 56, 'same', null),
  ('st-men-202425-premierleague-bre', 'men', '2024/25', 'Premier League', 10, 'Brentford', 'BRE', 'https://media.api-sports.io/football/teams/55.png', 38, 16, 8, 14, 66, 57, 9, 56, 'up', null),
  ('st-men-202425-premierleague-ful', 'men', '2024/25', 'Premier League', 11, 'Fulham', 'FUL', 'https://media.api-sports.io/football/teams/36.png', 38, 15, 9, 14, 54, 54, 0, 54, 'down', null),
  ('st-men-202425-premierleague-cry', 'men', '2024/25', 'Premier League', 12, 'Crystal Palace', 'CRY', 'https://media.api-sports.io/football/teams/52.png', 38, 13, 14, 11, 51, 51, 0, 53, 'same', null),
  ('st-men-202425-premierleague-eve', 'men', '2024/25', 'Premier League', 13, 'Everton', 'EVE', 'https://media.api-sports.io/football/teams/45.png', 38, 11, 15, 12, 42, 44, -2, 48, 'up', null),
  ('st-men-202425-premierleague-whu', 'men', '2024/25', 'Premier League', 14, 'West Ham', 'WHU', 'https://media.api-sports.io/football/teams/48.png', 38, 11, 10, 17, 46, 62, -16, 43, 'same', null),
  ('st-men-202425-premierleague-mun', 'men', '2024/25', 'Premier League', 15, 'Man United', 'MUN', 'https://media.api-sports.io/football/teams/33.png', 38, 11, 9, 18, 44, 54, -10, 42, 'down', null),
  ('st-men-202425-premierleague-wol', 'men', '2024/25', 'Premier League', 16, 'Wolves', 'WOL', 'https://media.api-sports.io/football/teams/39.png', 38, 12, 6, 20, 54, 69, -15, 42, 'up', null),
  ('st-men-202425-premierleague-tot', 'men', '2024/25', 'Premier League', 17, 'Tottenham', 'TOT', 'https://media.api-sports.io/football/teams/47.png', 38, 11, 5, 22, 64, 65, -1, 38, 'down', null),
  ('st-men-202425-premierleague-lei', 'men', '2024/25', 'Premier League', 18, 'Leicester City', 'LEI', 'https://media.api-sports.io/football/teams/46.png', 38, 6, 7, 25, 33, 80, -47, 25, 'same', null),
  ('st-men-202425-premierleague-ips', 'men', '2024/25', 'Premier League', 19, 'Ipswich Town', 'IPS', 'https://media.api-sports.io/football/teams/57.png', 38, 4, 10, 24, 36, 82, -46, 22, 'same', null),
  ('st-men-202425-premierleague-sou', 'men', '2024/25', 'Premier League', 20, 'Southampton', 'SOU', 'https://media.api-sports.io/football/teams/41.png', 38, 2, 6, 30, 26, 86, -60, 12, 'same', null),
  ('st-women-202627-womenssuperleague-mci', 'women', '2026/27', 'Women''s Super League', 1, 'Man City Women', 'MCI', 'https://media.api-sports.io/football/teams/50.png', 3, 3, 0, 0, 8, 1, 7, 9, 'up', null),
  ('st-women-202627-womenssuperleague-tot', 'women', '2026/27', 'Women''s Super League', 2, 'Tottenham Women', 'TOT', 'https://media.api-sports.io/football/teams/47.png', 3, 2, 1, 0, 6, 2, 4, 7, 'up', null),
  ('st-women-202627-womenssuperleague-che', 'women', '2026/27', 'Women''s Super League', 3, 'Chelsea Women', 'CHE', 'https://media.api-sports.io/football/teams/49.png', 3, 2, 1, 0, 5, 2, 3, 7, 'up', null),
  ('st-women-202627-womenssuperleague-lei', 'women', '2026/27', 'Women''s Super League', 4, 'Leicester City Women', 'LEI', 'https://media.api-sports.io/football/teams/46.png', 3, 2, 0, 1, 4, 3, 1, 6, 'same', null),
  ('st-women-202627-womenssuperleague-eve', 'women', '2026/27', 'Women''s Super League', 5, 'Everton Women', 'EVE', 'https://media.api-sports.io/football/teams/45.png', 3, 2, 0, 1, 3, 3, 0, 6, 'up', null),
  ('st-women-202627-womenssuperleague-ars', 'women', '2026/27', 'Women''s Super League', 6, 'Arsenal Women', 'ARS', 'https://media.api-sports.io/football/teams/42.png', 3, 1, 2, 0, 5, 2, 3, 5, 'down', null),
  ('st-women-202627-womenssuperleague-liv', 'women', '2026/27', 'Women''s Super League', 7, 'Liverpool Women', 'LIV', 'https://media.api-sports.io/football/teams/40.png', 3, 1, 1, 1, 3, 3, 0, 4, 'down', null),
  ('st-women-202627-womenssuperleague-cry', 'women', '2026/27', 'Women''s Super League', 8, 'Crystal Palace Women', 'CRY', 'https://media.api-sports.io/football/teams/52.png', 3, 1, 1, 1, 2, 3, -1, 4, 'down', null),
  ('st-women-202627-womenssuperleague-whu', 'women', '2026/27', 'Women''s Super League', 9, 'West Ham Women', 'WHU', 'https://media.api-sports.io/football/teams/48.png', 3, 1, 0, 2, 2, 6, -4, 3, 'up', null),
  ('st-women-202627-womenssuperleague-mun', 'women', '2026/27', 'Women''s Super League', 10, 'Man United Women', 'MUN', 'https://media.api-sports.io/football/teams/33.png', 3, 0, 2, 1, 2, 3, -1, 2, 'down', null),
  ('st-women-202627-womenssuperleague-bha', 'women', '2026/27', 'Women''s Super League', 11, 'Brighton Women', 'BHA', 'https://media.api-sports.io/football/teams/51.png', 3, 0, 2, 1, 2, 4, -2, 2, 'same', null),
  ('st-women-202627-womenssuperleague-avl', 'women', '2026/27', 'Women''s Super League', 12, 'Aston Villa Women', 'AVL', 'https://media.api-sports.io/football/teams/66.png', 3, 0, 0, 3, 1, 9, -8, 0, 'down', null),
  ('st-academy-202627-premierleague2-ars', 'academy', '2026/27', 'Premier League 2', 1, 'Arsenal U21', 'ARS', 'https://media.api-sports.io/football/teams/42.png', 2, 2, 0, 0, 5, 1, 4, 6, 'up', null),
  ('st-academy-202627-premierleague2-liv', 'academy', '2026/27', 'Premier League 2', 2, 'Liverpool U21', 'LIV', 'https://media.api-sports.io/football/teams/40.png', 2, 1, 1, 0, 3, 1, 2, 4, 'up', null),
  ('st-academy-202627-premierleague2-che', 'academy', '2026/27', 'Premier League 2', 3, 'Chelsea U21', 'CHE', 'https://media.api-sports.io/football/teams/49.png', 3, 1, 1, 1, 5, 4, 1, 4, 'same', null),
  ('st-academy-202627-premierleague2-tot', 'academy', '2026/27', 'Premier League 2', 4, 'Tottenham U21', 'TOT', 'https://media.api-sports.io/football/teams/47.png', 2, 1, 0, 1, 3, 3, 0, 3, 'down', null),
  ('st-academy-202627-premierleague2-mun', 'academy', '2026/27', 'Premier League 2', 5, 'Man United U21', 'MUN', 'https://media.api-sports.io/football/teams/33.png', 2, 1, 0, 1, 2, 3, -1, 3, 'same', null),
  ('st-academy-202627-premierleague2-bha', 'academy', '2026/27', 'Premier League 2', 6, 'Brighton U21', 'BHA', 'https://media.api-sports.io/football/teams/51.png', 2, 0, 2, 0, 2, 2, 0, 2, 'up', null),
  ('st-academy-202627-premierleague2-whu', 'academy', '2026/27', 'Premier League 2', 7, 'West Ham U21', 'WHU', 'https://media.api-sports.io/football/teams/48.png', 2, 0, 1, 1, 2, 3, -1, 1, 'down', null),
  ('st-academy-202627-premierleague2-mci', 'academy', '2026/27', 'Premier League 2', 8, 'Man City U21', 'MCI', 'https://media.api-sports.io/football/teams/50.png', 3, 0, 1, 2, 1, 6, -5, 1, 'down', null)
on conflict (id) do update set
  team_type = excluded.team_type,
  season = excluded.season,
  competition = excluded.competition,
  rank = excluded.rank,
  team_name = excluded.team_name,
  team_code = excluded.team_code,
  team_logo = excluded.team_logo,
  played = excluded.played,
  won = excluded.won,
  drawn = excluded.drawn,
  lost = excluded.lost,
  goals_for = excluded.goals_for,
  goals_against = excluded.goals_against,
  goal_diff = excluded.goal_diff,
  points = excluded.points,
  trend = excluded.trend,
  form = excluded.form;

-- ----------------------------------------------------------------
-- Players
-- ----------------------------------------------------------------
-- Men's squad synced with the Premier League (2026/27, fetched 2026-09-24T13:42:08.478Z).
delete from public.players where team_type = 'men' and id not in ('p01', 'p02', 'p05', 'p07', 'p08', 'p09', 'p13', 'pa01', 'p-marli-salmon', 'p15', 'p-eberechi-eze', 'p17', 'p-martin-zubimendi', 'p18', 'p-max-dowman', 'p20', 'p-viktor-gyokeres', 'p-noni-madueke', 'p24', 'p-piero-hincapie', 'p-illan-meslier', 'p-cristhian-mosquera', 'p-christos-tzolis', 'p-bruno-guimaraes', 'p-ezri-konsa', 'p-ife-ibrahim', 'p-theo-julienne');

insert into public.players (id, team_type, first_name, last_name, known_as, shirt_number, position, nationality, country_flag, date_of_birth, photo_url, card_panel_url, bio, appearances, goals, assists, clean_sheets, place_of_birth, signed_on)
values
  ('p01', 'men', 'David', 'Raya', 'David Raya', 1, 'Goalkeeper', 'Spain', '🇪🇸', '1995-09-15', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/154561.png', 'local:extracted/panel_raya.png', 'David Raya has cemented himself as one of the best goalkeepers around after picking up back-to-back Premier League Golden Glove awards.

Having initially joined us from Brentford on loan in 2023, David made his switch from west London permanent in summer 2024.

The Barcelona-born stopper was an ever-present in 2024/25 in the Premier League, winning the Save of the Month on two occasions in August 2024 and March 2025.

In 2023/24, David was named in PFA Team of the Season as well as saving two penalties in the shootout against Porto in the Champions League round of 16.

The experienced keeper, who is renowned for his catching ability when coming for crosses, calmness under pressure and precise passing, arrived in England in 2012, at the age of 16, when he joined Blackburn Rovers'' academy.

He played on loan at Southport in the National League before helping Rovers to promotion from League One in 2018. A year later he joined Brentford, winning the Championship Golden Glove award in 2019/20, and was a key player as the Bees won promotion to the Premier League in 2021.

He won his first cap for Spain in March 2022 and was a member of the 2022 World Cup squad, before playing one group game – keeping a clean sheet – as Spain triumphed at Euro 2024.', 5, 0, 0, 3, 'Barcelona, Spain', '2023-08-15'),
  ('p02', 'men', 'Kepa', 'Arrizabalaga', 'Kepa Arrizabalaga', 13, 'Goalkeeper', 'Spain', '🇪🇸', '1994-10-03', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/109745.png', 'local:extracted/panel_kepa.png', 'Kepa Arrizabalaga brings UEFA Champions League and Europa League winning pedigree and immense agility to the Arsenal goalkeeping squad.

An experienced Spanish international shot-stopper known for sharp reflex saves, aerial command, and elite composure in high-stakes matches.', 0, 0, 0, 0, 'Ondarroa, Spain', '2025-07-26'),
  ('p05', 'men', 'William', 'Saliba', 'William Saliba', 2, 'Defender', 'France', '🇫🇷', '2001-03-24', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/462424.png', null, 'Uncompromising, composed, and world-class. William Saliba has established himself as one of the premier central defenders on the planet.

Named in successive Premier League and European Championship Teams of the Tournament, Saliba''s recovery pace, reading of the game, and laser-precise line-breaking passes make him the bedrock of Mikel Arteta''s defense.', 0, 0, 0, 0, 'Bondy, France', '2019-07-25'),
  ('p07', 'men', 'Ben', 'White', 'Ben White', 4, 'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1997-10-08', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/198869.png', null, 'A modern tactical masterclass on the right flank. Ben White combines suffocating defensive 1v1 ability with telepathic overlapping partnerships with Bukayo Saka.', 4, 0, 1, 2, 'Poole, England', '2021-07-30'),
  ('p08', 'men', 'Gabriel', 'dos Santos Magalhães', 'Gabriel Magalhães', 6, 'Defender', 'Brazil', '🇧🇷', '1997-12-19', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/226597.png', null, 'A colossal warrior at the heart of our backline. Gabriel is the Premier League''s most prolific goalscoring center-back from corners and an impenetrable aerial force.', 5, 0, 0, 3, 'São Paulo, Brazil', '2020-09-01'),
  ('p09', 'men', 'Jurriën', 'Timber', 'Jurriën Timber', 12, 'Defender', 'Netherlands', '🇳🇱', '2001-06-17', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/445122.png', null, 'An exceptionally gifted, press-resistant fullback with elite technical security. Timber can invert into central midfield or lockdown either flank with world-class agility.', 2, 0, 0, 0, 'Utrecht, Netherlands', '2023-07-14'),
  ('p13', 'men', 'Riccardo', 'Calafiori', 'Riccardo Calafiori', 33, 'Defender', 'Italy', '🇮🇹', '2002-05-19', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/466075.png', null, 'Signed in summer 2024 after starring at Euro 2024, the Italian defender is famous for audacious forward surges, physical dominance, and stunning strikes like his debut screamer against Manchester City.', 5, 0, 2, 2, 'Rome, Italy', '2024-07-29'),
  ('pa01', 'men', 'Myles', 'Lewis-Skelly', 'Myles Lewis-Skelly', 49, 'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2006-09-26', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/499169.png', null, 'Dynamic Hale End graduate who excels at both inverted fullback and defensive midfield with immense composure.', 4, 0, 0, 1, 'London, England', '2023-07-01'),
  ('p-marli-salmon', 'men', 'Marli', 'Salmon', 'Marli Salmon', 89, 'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2009-08-29', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/616065.png', null, 'Marli Salmon is a defender for Arsenal and a England international. He joined the club on 22 July 2025.', 0, 0, 0, 0, 'London, England', '2025-07-22'),
  ('p15', 'men', 'Martin', 'Ødegaard', 'Martin Ødegaard', 8, 'Midfielder', 'Norway', '🇳🇴', '1998-12-17', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/184029.png', null, 'Club Captain and visionary playmaker. Martin Ødegaard leads the high press by example while unlocking low blocks with surgical left-footed through balls.', 5, 2, 0, 0, 'Drammen, Norway', '2021-08-20'),
  ('p-eberechi-eze', 'men', 'Eberechi', 'Eze', 'Eberechi Eze', 10, 'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1998-06-29', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/232413.png', null, 'Eberechi Eze is a midfielder for Arsenal and a England international. He joined the club on 23 August 2025.', 4, 0, 0, 0, 'London, England', '2025-08-23'),
  ('p17', 'men', 'Mikel', 'Merino', 'Mikel Merino', 23, 'Midfielder', 'Spain', '🇪🇸', '1996-06-22', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/195384.png', null, 'European champion with Spain who joined Arsenal in summer 2024. Renowned as a duel monster who wins second balls and crashes into the penalty area with devastating timing.', 5, 0, 0, 0, 'Pamplona, Spain', '2024-08-27'),
  ('p-martin-zubimendi', 'men', 'Martín', 'Zubimendi', 'Martín Zubimendi', 36, 'Midfielder', 'Spain', '🇪🇸', '1999-02-02', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/481655.png', null, 'Martín Zubimendi is a midfielder for Arsenal and a Spain international. He joined the club on 6 July 2025.', 5, 0, 0, 0, 'San Sebastián, Spain', '2025-07-06'),
  ('p18', 'men', 'Declan', 'Rice', 'Declan Rice', 41, 'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1999-01-14', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/204480.png', null, 'A transformative force in world football. Declan Rice covers every blade of grass, delivers pinpoint dead-balls, and scores sensational clutch winners.', 5, 0, 2, 0, 'London, England', '2023-07-15'),
  ('p-max-dowman', 'men', 'Max', 'Dowman', 'Max Dowman', 56, 'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2009-12-31', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/616077.png', null, 'Max Dowman is a midfielder for Arsenal and a England international. He joined the club on 22 July 2025.', 1, 0, 0, 0, 'Chelmsford, England', '2025-07-22'),
  ('p20', 'men', 'Bukayo', 'Saka', 'Bukayo Saka', 7, 'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2001-09-05', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223340.png', null, 'Arsenal''s talismanic Starboy. Bukayo Saka combines unplayable 1v1 dribbling with world-class vision, ruthless finishing, and heroic leadership on the pitch.', 5, 3, 0, 2, 'London, England', '2018-07-01'),
  ('p-viktor-gyokeres', 'men', 'Viktor', 'Gyökeres', 'Viktor Gyökeres', 14, 'Forward', 'Sweden', '🇸🇪', '1998-06-04', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/224117.png', null, 'Viktor Gyökeres is a forward for Arsenal and a Sweden international. He joined the club on 26 July 2025.', 2, 0, 0, 0, 'Stockholm, Sweden', '2025-07-26'),
  ('p-noni-madueke', 'men', 'Noni', 'Madueke', 'Noni Madueke', 20, 'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2002-03-10', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/248857.png', null, 'Noni Madueke is a forward for Arsenal and a England international. He joined the club on 18 July 2025.', 2, 0, 0, 0, 'London, England', '2025-07-18'),
  ('p24', 'men', 'Kai', 'Havertz', 'Kai Havertz', 29, 'Forward', 'Germany', '🇩🇪', '1999-06-11', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/219847.png', null, 'Intelligent, aerially dominant, and clutch in the biggest moments. Havertz links play seamlessly while leading the frontline pressing unit with relentless stamina.', 5, 2, 0, 3, 'Aachen, Germany', '2023-06-28'),
  ('p-piero-hincapie', 'men', 'Piero', 'Hincapié', 'Piero Hincapié', 5, 'Defender', 'Ecuador', '🇪🇨', '2002-01-09', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/448104.png', null, 'Piero Hincapié is a defender for Arsenal and a Ecuador international. He joined the club on 1 July 2026.', 2, 0, 0, 0, 'Esmeraldas, Ecuador', '2026-07-01'),
  ('p-illan-meslier', 'men', 'Illan', 'Meslier', 'Illan Meslier', 30, 'Goalkeeper', 'France', '🇫🇷', '2000-03-02', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/437495.png', null, 'Illan Meslier is a goalkeeper for Arsenal and a France international. He joined the club on 9 July 2026.', 0, 0, 0, 0, 'Lorient, France', '2026-07-09'),
  ('p-cristhian-mosquera', 'men', 'Cristhian', 'Mosquera', 'Cristhian Mosquera', 3, 'Defender', 'Spain', '🇪🇸', '2004-06-27', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/500040.png', null, 'Cristhian Mosquera is a defender for Arsenal and a Spain international. He joined the club on 24 July 2025.', 2, 0, 0, 1, 'Alicante, Spain', '2025-07-24'),
  ('p-christos-tzolis', 'men', 'Christos', 'Tzolis', 'Christos Tzolis', 17, 'Forward', 'Greece', '🇬🇷', '2002-01-30', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/439509.png', null, 'Christos Tzolis is a forward for Arsenal and a Greece international. He joined the club on 23 July 2026.', 5, 0, 1, 0, 'Thessaloniki, Greece', '2026-07-23'),
  ('p-bruno-guimaraes', 'men', 'Bruno', 'Guimarães Rodriguez Moura', 'Bruno Guimarães', 39, 'Midfielder', 'Brazil', '🇧🇷', '1997-11-16', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/208706.png', null, 'Bruno Guimarães is a midfielder for Arsenal and a Brazil international. He joined the club on 8 August 2026.', 3, 1, 0, 0, 'Rio de Janeiro, Brazil', '2026-08-08'),
  ('p-ezri-konsa', 'men', 'Ezri', 'Konsa', 'Ezri Konsa', 15, 'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1997-10-23', 'https://resources.premierleague.com/premierleague25/photos/players/500x500/199798.png', null, 'Ezri Konsa is a defender for Arsenal and a England international. He joined the club on 21 August 2026.', 4, 0, 0, 1, 'London, England', '2026-08-21'),
  ('p-ife-ibrahim', 'men', 'Ife', 'Ibrahim', 'Ife Ibrahim', 44, 'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2008-01-20', null, null, 'Ife Ibrahim is a midfielder for Arsenal and a England international. He joined the club on 27 January 2026.', 0, 0, 0, 0, 'England', '2026-01-27'),
  ('p-theo-julienne', 'men', 'Theo', 'Julienne', 'Theo Julienne', 45, 'Midfielder', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2008-01-11', null, null, 'Theo Julienne is a midfielder for Arsenal and a England international. He joined the club on 30 July 2026.', 0, 0, 0, 0, 'England', '2026-07-30'),
  ('pa02', 'academy', 'Ayden', 'Heaven', 'Ayden Heaven', 76, 'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '2006-09-22', null, null, 'Towering, elegant central defender with superb ball-playing capability from Hale End academy.', 8, 0, 0, 3, 'London, England', '2024-07-01'),
  ('pw01', 'women', 'Manuela', 'Zinsberger', 'Manuela Zinsberger', 1, 'Goalkeeper', 'Austria', '🇦🇹', '1995-10-19', null, null, 'Golden Glove winner and commanding presence in goal for Arsenal Women with elite distribution.', 28, 0, 0, 12, 'Stockerau, Austria', '2019-07-01'),
  ('pw02', 'women', 'Leah', 'Williamson', 'Leah Williamson', 6, 'Defender', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1997-03-29', null, null, 'England Lionesses captain and Arsenal stalwart famous for world-class passing range from center back.', 26, 2, 5, 14, 'Milton Keynes, England', '2014-07-01'),
  ('pw03', 'women', 'Katie', 'McCabe', 'Katie McCabe', 11, 'Defender', 'Ireland', '🇮🇪', '1995-09-21', null, null, 'Fierce competitor with a thunderous left foot who produces spectacular long-distance goals.', 27, 5, 8, 11, 'Dublin, Ireland', '2015-01-06'),
  ('pw04', 'women', 'Kim', 'Little', 'Kim Little', 10, 'Midfielder', 'Scotland', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '1990-06-29', null, null, 'Arsenal Women legend and captain. A midfield master whose dribbling in tight spaces is unmatched.', 25, 6, 9, 0, 'Aberdeen, Scotland', '2016-11-17'),
  ('pw05', 'women', 'Alessia', 'Russo', 'Alessia Russo', 23, 'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1999-02-08', null, null, 'Lethal number 9 with explosive movement, back-to-goal hold-up play, and predatory finishing.', 29, 18, 6, 0, 'Maidstone, England', '2023-07-01'),
  ('pw06', 'women', 'Beth', 'Mead', 'Beth Mead', 9, 'Forward', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '1995-05-09', null, null, 'Euro 2022 Golden Boot winner with lethal crossing, endless energy, and clinical finishing.', 24, 9, 10, 0, 'Whitby, England', '2017-01-01')
on conflict (id) do update set
  team_type = excluded.team_type,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  known_as = excluded.known_as,
  shirt_number = excluded.shirt_number,
  position = excluded.position,
  nationality = excluded.nationality,
  country_flag = excluded.country_flag,
  date_of_birth = excluded.date_of_birth,
  photo_url = excluded.photo_url,
  card_panel_url = excluded.card_panel_url,
  bio = excluded.bio,
  appearances = excluded.appearances,
  goals = excluded.goals,
  assists = excluded.assists,
  clean_sheets = excluded.clean_sheets,
  place_of_birth = excluded.place_of_birth,
  signed_on = excluded.signed_on;

-- ----------------------------------------------------------------
-- Match centre (rebuilt)
-- ----------------------------------------------------------------
delete from public.match_events;
delete from public.match_lineups;
delete from public.match_stats;
insert into public.match_events (id, match_id, sort, minute_label, type, team, player, title, body)
values
  ('m01-ev01', 'm01', 1, '-', 'whistle', null, null, 'Kick off', 'First Half begins at the American Express Stadium.'),
  ('m01-ev02', 'm01', 2, '12''', 'chance', 'away', 'Bukayo Saka', 'Chance', 'Attempt saved. Bukayo Saka (Arsenal) left footed shot from the right side of the box is saved in the centre of the goal.'),
  ('m01-ev03', 'm01', 3, '31''', 'goal', 'home', 'P. Groß', 'Goal!', 'Goal! Brighton and Hove Albion 1, Arsenal 0. Pascal Groß (Brighton and Hove Albion) right footed shot from outside the box to the bottom left corner.'),
  ('m01-ev04', 'm01', 4, '38''', 'yellow_card', 'away', 'Declan Rice', 'Booking', 'Declan Rice (Arsenal) is shown the yellow card for a bad foul.'),
  ('m01-ev05', 'm01', 5, '45''', 'goal', 'home', 'C. Kostoulas', 'Goal!', 'Goal! Brighton and Hove Albion 2, Arsenal 0. Charalampos Kostoulas (Brighton and Hove Albion) header from very close range.'),
  ('m01-ev06', 'm01', 6, '45+2''', 'whistle', null, null, 'Half time', 'First Half ends, Brighton and Hove Albion 2, Arsenal 0.'),
  ('m01-ev07', 'm01', 7, '46''', 'sub', 'away', 'Leandro Trossard', 'Substitution', 'Substitution, Arsenal. Leandro Trossard replaces Gabriel Martinelli.'),
  ('m01-ev08', 'm01', 8, '57''', 'goal', 'home', 'Chema Andrés', 'Goal!', 'Goal! Brighton and Hove Albion 3, Arsenal 0. Chema Andrés (Brighton and Hove Albion) left footed shot from the centre of the box.'),
  ('m01-ev09', 'm01', 9, '71''', 'var', 'away', 'Kai Havertz', 'VAR', 'VAR Decision: No Goal Brighton and Hove Albion 3-0 Arsenal. Kai Havertz was offside in the build-up.'),
  ('m01-ev10', 'm01', 10, '90+2''', 'corner', 'away', null, 'Corner', 'Corner, Arsenal. Conceded by Malick Yalcouyé.'),
  ('m01-ev11', 'm01', 11, '90+5''', 'chance', 'away', 'Martín Zubimendi', 'Miss', 'Attempt missed. Martín Zubimendi (Arsenal) header from the centre of the box.'),
  ('m01-ev12', 'm01', 12, '90+7''', 'whistle', null, null, 'Second Half', 'Second Half ends, Brighton and Hove Albion 3, Arsenal 0.'),
  ('m01-ev13', 'm01', 13, '-', 'whistle', null, null, 'Full time', 'Match ends, Brighton and Hove Albion 3, Arsenal 0.'),
  ('m03-ev01', 'm03', 1, '-', 'whistle', null, null, 'Kick off', 'First Half begins at the Etihad Stadium.'),
  ('m03-ev02', 'm03', 2, '9''', 'goal', 'home', 'E. Haaland', 'Goal!', 'Goal! Manchester City 1, Arsenal 0. Erling Haaland (Manchester City) right footed shot from the centre of the box.'),
  ('m03-ev03', 'm03', 3, '27''', 'goal', 'away', 'B. Saka', 'Goal!', 'Goal! Manchester City 1, Arsenal 1. Bukayo Saka (Arsenal) left footed curler into the top corner. Assisted by Martin Ødegaard.'),
  ('m03-ev04', 'm03', 4, '45+1''', 'whistle', null, null, 'Half time', 'First Half ends, Manchester City 1, Arsenal 1.'),
  ('m03-ev05', 'm03', 5, '58''', 'goal', 'away', 'Gabriel', 'Goal!', 'Goal! Manchester City 1, Arsenal 2. Gabriel (Arsenal) header from a Declan Rice corner.'),
  ('m03-ev06', 'm03', 6, '74''', 'sub', 'away', 'Leandro Trossard', 'Substitution', 'Substitution, Arsenal. Leandro Trossard replaces Gabriel Martinelli.'),
  ('m03-ev07', 'm03', 7, '90+8''', 'goal', 'home', 'J. Stones', 'Goal!', 'Goal! Manchester City 2, Arsenal 2. John Stones (Manchester City) volley from close range after a goalmouth scramble.'),
  ('m03-ev08', 'm03', 8, '-', 'whistle', null, null, 'Full time', 'Match ends, Manchester City 2, Arsenal 2.'),
  ('m02-ev01', 'm02', 1, '-', 'whistle', null, null, 'Kick off', 'First Half begins at Portman Road.'),
  ('m02-ev02', 'm02', 2, '14''', 'goal', 'away', 'E. Nwaneri', 'Goal!', 'Goal! Ipswich Town 0, Arsenal 1. Ethan Nwaneri (Arsenal) left footed shot from outside the box.'),
  ('m02-ev03', 'm02', 3, '33''', 'goal', 'home', 'L. Delap', 'Goal!', 'Goal! Ipswich Town 1, Arsenal 1. Header from the centre of the box.'),
  ('m02-ev04', 'm02', 4, '51''', 'goal', 'away', 'G. Jesus', 'Goal!', 'Goal! Ipswich Town 1, Arsenal 2. Gabriel Jesus (Arsenal) right footed shot from close range.'),
  ('m02-ev05', 'm02', 5, '66''', 'goal', 'away', 'L. Trossard', 'Goal!', 'Goal! Ipswich Town 1, Arsenal 3. Leandro Trossard (Arsenal) curls one into the far corner.'),
  ('m02-ev06', 'm02', 6, '78''', 'goal', 'home', 'O. Hutchinson', 'Goal!', 'Goal! Ipswich Town 2, Arsenal 3. Low shot into the bottom right corner.'),
  ('m02-ev07', 'm02', 7, '88''', 'goal', 'away', 'M. Lewis-Skelly', 'Goal!', 'Goal! Ipswich Town 2, Arsenal 4. Myles Lewis-Skelly (Arsenal) finishes a counter-attack.'),
  ('m02-ev08', 'm02', 8, '-', 'whistle', null, null, 'Full time', 'Match ends, Ipswich Town 2, Arsenal 4.')
;

insert into public.match_lineups (id, match_id, side, shirt_number, name, position, photo_url, is_starter, sort)
values
  ('m01-away-01', 'm01', 'away', 1, 'D. RAYA', 'Goalkeeper', 'local:extracted/lineup_raya.png', true, 1),
  ('m01-away-02', 'm01', 'away', 33, 'R. CALAFIORI', 'Defender', 'local:extracted/lineup_calafiori.png', true, 2),
  ('m01-away-03', 'm01', 'away', 6, 'GABRIEL', 'Defender', 'local:extracted/lineup_gabriel.png', true, 3),
  ('m01-away-04', 'm01', 'away', 15, 'E. KONSA', 'Defender', 'local:extracted/lineup_konsa.png', true, 4),
  ('m01-away-05', 'm01', 'away', 12, 'J. TIMBER', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/445122.png', true, 5),
  ('m01-away-06', 'm01', 'away', 41, 'D. RICE', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/204480.png', true, 6),
  ('m01-away-07', 'm01', 'away', 8, 'M. ØDEGAARD', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/184029.png', true, 7),
  ('m01-away-08', 'm01', 'away', 29, 'K. HAVERTZ', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/219847.png', true, 8),
  ('m01-away-09', 'm01', 'away', 7, 'B. SAKA', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223340.png', true, 9),
  ('m01-away-10', 'm01', 'away', 11, 'G. MARTINELLI', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/444145.png', true, 10),
  ('m01-away-11', 'm01', 'away', 19, 'L. TROSSARD', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/116216.png', true, 11),
  ('m01-away-12', 'm01', 'away', 13, 'KEPA', 'Goalkeeper', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/109745.png', false, 12),
  ('m01-away-13', 'm01', 'away', 2, 'W. SALIBA', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/462424.png', false, 13),
  ('m01-away-14', 'm01', 'away', 36, 'M. ZUBIMENDI', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/481655.png', false, 14),
  ('m01-away-15', 'm01', 'away', 53, 'E. NWANERI', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/499175.png', false, 15),
  ('m01-away-16', 'm01', 'away', 49, 'M. LEWIS-SKELLY', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/499169.png', false, 16),
  ('m01-away-17', 'm01', 'away', 9, 'G. JESUS', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/205651.png', false, 17),
  ('m01-home-01', 'm01', 'home', 1, 'B. VERBRUGGEN', 'Goalkeeper', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/489639.png', true, 1),
  ('m01-home-02', 'm01', 'home', 34, 'J. VELTMAN', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/111478.png', true, 2),
  ('m01-home-03', 'm01', 'home', 29, 'J. VAN HECKE', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/469142.png', true, 3),
  ('m01-home-04', 'm01', 'home', 5, 'L. DUNK', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/83299.png', true, 4),
  ('m01-home-05', 'm01', 'home', 41, 'J. HINSHELWOOD', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/532529.png', true, 5),
  ('m01-home-06', 'm01', 'home', 20, 'C. BALÉBA', 'Midfielder', null, true, 6),
  ('m01-home-07', 'm01', 'home', 13, 'P. GROß', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/60307.png', true, 7),
  ('m01-home-08', 'm01', 'home', 22, 'K. MITOMA', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/451340.png', true, 8),
  ('m01-home-09', 'm01', 'home', 14, 'G. RUTTER', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/463067.png', true, 9),
  ('m01-home-10', 'm01', 'home', 11, 'S. ADINGRA', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/535818.png', true, 10),
  ('m01-home-11', 'm01', 'home', 18, 'D. WELBECK', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/50175.png', true, 11),
  ('m01-home-12', 'm01', 'home', 23, 'J. STEELE', 'Goalkeeper', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/49262.png', false, 12),
  ('m01-home-13', 'm01', 'home', 9, 'C. KOSTOULAS', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/647850.png', false, 13),
  ('m01-home-14', 'm01', 'home', 8, 'CHEMA ANDRÉS', 'Midfielder', null, false, 14),
  ('m01-home-15', 'm01', 'home', 26, 'M. YALCOUYÉ', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/611695.png', false, 15),
  ('m03-away-01', 'm03', 'away', 1, 'D. RAYA', 'Goalkeeper', 'local:extracted/lineup_raya.png', true, 1),
  ('m03-away-02', 'm03', 'away', 33, 'R. CALAFIORI', 'Defender', 'local:extracted/lineup_calafiori.png', true, 2),
  ('m03-away-03', 'm03', 'away', 6, 'GABRIEL', 'Defender', 'local:extracted/lineup_gabriel.png', true, 3),
  ('m03-away-04', 'm03', 'away', 15, 'E. KONSA', 'Defender', 'local:extracted/lineup_konsa.png', true, 4),
  ('m03-away-05', 'm03', 'away', 12, 'J. TIMBER', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/445122.png', true, 5),
  ('m03-away-06', 'm03', 'away', 41, 'D. RICE', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/204480.png', true, 6),
  ('m03-away-07', 'm03', 'away', 8, 'M. ØDEGAARD', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/184029.png', true, 7),
  ('m03-away-08', 'm03', 'away', 29, 'K. HAVERTZ', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/219847.png', true, 8),
  ('m03-away-09', 'm03', 'away', 7, 'B. SAKA', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223340.png', true, 9),
  ('m03-away-10', 'm03', 'away', 11, 'G. MARTINELLI', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/444145.png', true, 10),
  ('m03-away-11', 'm03', 'away', 19, 'L. TROSSARD', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/116216.png', true, 11),
  ('m03-away-12', 'm03', 'away', 13, 'KEPA', 'Goalkeeper', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/109745.png', false, 12),
  ('m03-away-13', 'm03', 'away', 2, 'W. SALIBA', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/462424.png', false, 13),
  ('m03-away-14', 'm03', 'away', 36, 'M. ZUBIMENDI', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/481655.png', false, 14),
  ('m03-away-15', 'm03', 'away', 53, 'E. NWANERI', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/499175.png', false, 15),
  ('m03-away-16', 'm03', 'away', 49, 'M. LEWIS-SKELLY', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/499169.png', false, 16),
  ('m03-away-17', 'm03', 'away', 9, 'G. JESUS', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/205651.png', false, 17),
  ('m03-home-01', 'm03', 'home', 25, 'G. DONNARUMMA', 'Goalkeeper', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/204936.png', true, 1),
  ('m03-home-02', 'm03', 'home', 27, 'M. NUNES', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/465351.png', true, 2),
  ('m03-home-03', 'm03', 'home', 3, 'R. DIAS', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/171314.png', true, 3),
  ('m03-home-04', 'm03', 'home', 5, 'J. STONES', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/97299.png', true, 4),
  ('m03-home-05', 'm03', 'home', 24, 'J. GVARDIOL', 'Defender', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/477424.png', true, 5),
  ('m03-home-06', 'm03', 'home', 16, 'RODRI', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/220566.png', true, 6),
  ('m03-home-07', 'm03', 'home', 4, 'T. REIJNDERS', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/433036.png', true, 7),
  ('m03-home-08', 'm03', 'home', 47, 'P. FODEN', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/209244.png', true, 8),
  ('m03-home-09', 'm03', 'home', 10, 'R. CHERKI', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/466052.png', true, 9),
  ('m03-home-10', 'm03', 'home', 11, 'J. DOKU', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/248875.png', true, 10),
  ('m03-home-11', 'm03', 'home', 9, 'E. HAALAND', 'Forward', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223094.png', true, 11),
  ('m03-home-12', 'm03', 'home', 18, 'S. ORTEGA', 'Goalkeeper', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/88248.png', false, 12),
  ('m03-home-13', 'm03', 'home', 20, 'B. SILVA', 'Midfielder', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/165809.png', false, 13),
  ('m03-home-14', 'm03', 'home', 26, 'S. SAVINHO', 'Forward', null, false, 14)
;

insert into public.match_stats (id, match_id, sort, label, home_value, away_value, home_share)
values
  ('m01-st1', 'm01', 1, 'Possession', '40.5%', '59.5%', 0.405),
  ('m01-st2', 'm01', 2, 'Expected Goals', '1.33', '1.47', 0.475),
  ('m01-st3', 'm01', 3, 'Total Shots', '17', '10', 0.6296),
  ('m01-st4', 'm01', 4, 'Shots on Target', '5', '2', 0.7143),
  ('m01-st5', 'm01', 5, 'Big Chances', '3', '1', 0.75),
  ('m01-st6', 'm01', 6, 'Corners', '5', '5', 0.5),
  ('m01-st7', 'm01', 7, 'Pass Completion', '356 (76%)', '418 (84%)', 0.4599),
  ('m03-st1', 'm03', 1, 'Possession', '52.1%', '47.9%', 0.521),
  ('m03-st2', 'm03', 2, 'Expected Goals', '1.88', '1.61', 0.5387),
  ('m03-st3', 'm03', 3, 'Total Shots', '14', '11', 0.56),
  ('m03-st4', 'm03', 4, 'Shots on Target', '6', '5', 0.5455),
  ('m03-st5', 'm03', 5, 'Big Chances', '3', '2', 0.6),
  ('m03-st6', 'm03', 6, 'Corners', '7', '4', 0.6364),
  ('m03-st7', 'm03', 7, 'Pass Completion', '512 (89%)', '441 (86%)', 0.5373),
  ('m02-st1', 'm02', 1, 'Possession', '38.4%', '61.6%', 0.384),
  ('m02-st2', 'm02', 2, 'Expected Goals', '1.12', '2.74', 0.2902),
  ('m02-st3', 'm02', 3, 'Total Shots', '9', '19', 0.3214),
  ('m02-st4', 'm02', 4, 'Shots on Target', '4', '9', 0.3077),
  ('m02-st5', 'm02', 5, 'Corners', '3', '8', 0.2727)
;

-- ----------------------------------------------------------------
-- Articles
-- ----------------------------------------------------------------
insert into public.articles (youtube_id, video_duration, match_id, id, title, category, team_type, subtitle, content, image_url, author, read_time, published_at, reaction_kind, reactions_base, tag, is_featured)
values
  (null, '01:44:09', 'w2627-03', 'a01', 'Full match: Arsenal Women 1-1 Manchester United', 'Video', 'women', 'A full match replay of Saturday''s 1-1 draw at home to Manchester United in the Women''s Super League is available to watch now.', 'Julia Zigiotti opened the scoring for the away side in the second half, but Smilla Holmberg ensured the points were shared with a 95th-minute equaliser.

Press play on the video above to see every kick of the game in N5.', 'local:media/news_1.jpg', 'Stephen Wright', '2 min read', '2026-09-21T09:00:00Z', 'sad', 7, 'Full Match', false),
  (null, null, null, 'a02', 'Five things to know about the international break', 'News', 'men', 'Where our players are heading, who they face and when they are back at Sobha Realty Training Centre.', 'Twenty of our first-team players have been called up for international duty this month, with fixtures spread across four continents.

Bukayo Saka, Declan Rice and Myles Lewis-Skelly link up with England for two qualifiers at Wembley, while William Saliba joins France and Martin Ødegaard captains Norway.

The squad reconvenes at Sobha Realty Training Centre on Thursday before the trip to face Liverpool at Anfield.', 'local:media/news_2.jpg', 'Arsenal Media', '3 min read', '2026-09-23T08:00:00Z', 'fire', 12, 'First Team', true),
  (null, '28:41', null, 'a03', 'Watch all of Ian Wright''s Premier League goals!', 'Video', 'club', 'Every one of Wrighty’s 104 Premier League goals for Arsenal in one place.', 'Ian Wright scored 185 goals in 288 appearances for the club between 1991 and 1998, breaking Cliff Bastin’s long-standing record on his way to becoming a legend at Highbury.

Relive all 104 of his Premier League strikes, from poacher’s finishes to long-range screamers.', 'local:media/news_3.jpg', 'Arsenal Media', '1 min read', '2026-09-22T12:00:00Z', 'clap', 11, 'Legends', false),
  (null, null, null, 'a04', 'Wrighty''s Arsenal career in pictures', 'Gallery', 'club', 'From his arrival from Crystal Palace to lifting the Double in 1998.', 'Ian Wright joined from Crystal Palace in September 1991 and scored on his debut in the League Cup against Leicester City.

He went on to win the FA Cup, League Cup, European Cup Winners’ Cup and the 1997/98 Double. Browse our gallery of his greatest moments.', 'local:media/news_4.jpg', 'Arsenal Media', '2 min read', '2026-09-22T10:00:00Z', 'fire', 14, 'Legends', false),
  (null, null, null, 'a05', '13 things you may not know about Kai Havertz', 'Feature', 'men', 'Discover some interesting facts about our German international.', 'Kai Havertz became the youngest player to make 100 Bundesliga appearances when he did so for Bayer Leverkusen aged 20 years and 111 days.

He scored the winning goal in the 2021 Champions League final for Chelsea against Manchester City in Porto.

Kai is a keen horse rider and has a donkey called Toffee. He also plays the piano and grew up in Mariadorf, near Aachen.

Since joining us in 2023 he has played in midfield, as a false nine and as a traditional centre forward.', 'local:media/reel_havertz.jpg', 'Arsenal Media', '5 min read', '2026-09-24T07:00:00Z', 'happy', 10, 'Feature', true),
  (null, null, 'm03', 'a1111111-1111-1111-1111-111111111111', 'Arteta after Etihad draw: "We showed the true character of this club"', 'Interview', 'men', 'Mikel Arteta reflected on a battling performance at Manchester City and praised the mentality of his players.', 'Mikel Arteta spoke with pride after a 2-2 draw at the Etihad Stadium, pointing to the discipline, maturity and desire shown by every player on the pitch.

"When you come to these grounds you have to be ready to suffer, you have to compete for every ball, and you have to take your moments," Mikel said after the game.

"The supporters were unbelievable from the first minute to the last. To concede so late hurts, but the reaction after Brighton was exactly what we asked for."', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', 'Arsenal Media', '4 min read', '2026-09-22T22:00:00Z', 'fire', 21, 'First Team', true),
  (null, null, 'm01', 'a2222222-2222-2222-2222-222222222222', 'Report: Brighton 3-0 Arsenal', 'Match Report', 'men', 'A difficult afternoon on the south coast as goals from Groß, Kostoulas and Chema Andrés decide it.', 'We suffered our first Premier League defeat of the season at the American Express Stadium.

Pascal Groß opened the scoring from distance on 31 minutes and Charalampos Kostoulas headed a second just before the break.

Chema Andrés added a third early in the second half, and although Kai Havertz had a goal ruled out by VAR, we could not find a way back.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'Arsenal Media', '5 min read', '2026-09-19T19:10:00Z', 'sad', 9, 'Match Report', false),
  (null, null, null, 'a3333333-3333-3333-3333-333333333333', 'Declan Rice on midfield chemistry and tactical evolution', 'Interview', 'men', '"Every day on the training ground we push each other to higher standards."', 'Declan Rice sat down with Arsenal Media to discuss how his role has changed this season.

"Playing alongside Martin and Martín has taken my game to a different level. We understand when to speed the tempo up, when to control possession, and how to protect our back line.

"The ambition in this group is contagious, and we are hungrier than ever to deliver silverware for our fans."', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 'Josh James', '3 min read', '2026-09-17T11:00:00Z', 'clap', 6, 'Exclusive', false),
  (null, null, 'm02', 'a4444444-4444-4444-4444-444444444444', 'Report: Ipswich Town 2-4 Arsenal', 'Match Report', 'men', 'Nwaneri, Jesus, Trossard and Lewis-Skelly on target as we reach the Carabao Cup fourth round.', 'A much-changed side booked our place in the fourth round with an entertaining win at Portman Road.

Ethan Nwaneri curled in the opener, and after Ipswich levelled, Gabriel Jesus and Leandro Trossard put us in control.

Myles Lewis-Skelly sealed it late on with his first senior goal of the season.', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', 'Arsenal Media', '4 min read', '2026-09-15T21:45:00Z', 'happy', 15, 'Carabao Cup', false),
  (null, null, 'w2627-hbk', 'a5555555-5555-5555-5555-555555555555', 'Arsenal Women edge past HB Køge to reach the league phase', 'Women', 'women', 'A single goal at Meadow Park books our place in the UEFA Women’s Champions League league phase.', 'Arsenal Women are through to the league phase of the UEFA Women’s Champions League after a narrow 1-0 win over Danish champions HB Køge.

Alessia Russo’s first-half header proved decisive on a tense night in Borehamwood, with Manuela Zinsberger making two key saves late on.', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', 'Sam Blitz', '4 min read', '2026-09-17T20:30:00Z', 'fire', 8, 'UWCL', true),
  (null, null, 'a2627-04', 'a6666666-6666-6666-6666-666666666666', 'Hale End report: U18s hit four against Tottenham', 'Academy', 'academy', 'Our under-18s produced a brilliant display at Hale End to win the north London derby.', 'Jack Wilshere’s under-18s were in sparkling form on Sunday morning, beating Tottenham 4-1 at Hale End.

Two goals in each half, including a stunning free kick, kept the side top of the U18 Premier League South.', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', 'David Rogers', '3 min read', '2026-09-20T14:00:00Z', 'clap', 4, 'Hale End', false),
  (null, null, 'm2627-07', 'a07', 'Ticket news: Arsenal v Chelsea', 'News', 'men', 'Red and Silver Members can apply for tickets for the London derby from Monday.', 'Tickets for our Premier League match against Chelsea at Emirates Stadium on Saturday, October 3 go on sale to members next week.

Red Members can apply in the ballot from 10am on Monday, September 28. Any remaining tickets will go on general sale.', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', 'Arsenal Ticketing', '2 min read', '2026-09-24T09:00:00Z', 'happy', 2, 'Tickets', false)
on conflict (id) do update set
  youtube_id = excluded.youtube_id,
  video_duration = excluded.video_duration,
  match_id = excluded.match_id,
  title = excluded.title,
  category = excluded.category,
  team_type = excluded.team_type,
  subtitle = excluded.subtitle,
  content = excluded.content,
  image_url = excluded.image_url,
  author = excluded.author,
  read_time = excluded.read_time,
  published_at = excluded.published_at,
  reaction_kind = excluded.reaction_kind,
  reactions_base = excluded.reactions_base,
  tag = excluded.tag,
  is_featured = excluded.is_featured;

-- ----------------------------------------------------------------
-- Video collections & videos
-- ----------------------------------------------------------------
insert into public.video_collections (id, title, team_type, match_id, sort)
values
  ('col-must-watch', 'Must Watch', 'club', null, 0),
  ('col-hbk', 'Arsenal Women 1 - 0 HB Køge', 'women', 'w2627-hbk', 1),
  ('col-men-highlights', 'Men''s highlights', 'men', null, 2),
  ('col-academy', 'Hale End', 'academy', null, 3),
  ('col-classics', 'Classics', 'club', null, 4)
on conflict (id) do update set
  title = excluded.title,
  team_type = excluded.team_type,
  match_id = excluded.match_id,
  sort = excluded.sort;

insert into public.videos (youtube_id, reactions_base, match_id, id, title, category, team_type, collection_id, duration, thumbnail_url, published_at, views_count, sort)
values
  (null, 0, null, 'v01', 'The special bond with our Emirates Stadium support', 'Features', 'club', 'col-must-watch', '0:43', 'local:media/must_watch_1.jpg', '2026-09-23T17:00:00Z', '48K views', 1),
  (null, 0, null, 'v02', 'The Art of a Matchday: Vol.1', 'Behind The Scenes', 'club', 'col-must-watch', '0:34', 'local:media/must_watch_2.jpg', '2026-09-22T17:00:00Z', '31K views', 2),
  (null, 0, null, 'v03', 'Chris Mepham: Ask Me Anything', 'Interviews', 'men', 'col-must-watch', '9:12', 'local:media/search_video_1.jpg', '2026-09-21T17:00:00Z', '22K views', 3),
  (null, 0, 'w2627-hbk', 'v04', 'Highlights: Arsenal Women 1-0 HB Køge', 'Highlights', 'women', 'col-hbk', '2:15', 'local:media/hbk_1_top.jpg', '2026-09-17T21:00:00Z', '64K views', 1),
  (null, 0, 'w2627-hbk', 'v05', 'Reaction: the win over HB Køge', 'Reaction', 'women', 'col-hbk', '3:40', 'local:media/hbk_2_top.jpg', '2026-09-17T22:00:00Z', '18K views', 2),
  (null, 0, null, 'sv01', '😋 Hunger to win again', 'Features', 'men', 'col-men-highlights', '1:12', 'local:media/search_video_1.jpg', '2026-09-24T08:30:00Z', '12K views', 1),
  (null, 0, null, 'sv02', '🫂 Wrighty welcomes Ebs', 'Behind The Scenes', 'club', 'col-must-watch', '0:58', 'local:media/search_video_2.jpg', '2026-09-23T12:00:00Z', '40K views', 4),
  (null, 0, null, 'sv03', '🧱 How the points were bagged', 'Features', 'men', 'col-men-highlights', '2:02', 'local:media/search_video_3.jpg', '2026-09-13T10:00:00Z', '26K views', 3),
  (null, 0, null, 'sv04', 'Denilson''s dazzler | Arsenal 3-0 Hull City | 2009/10', 'Classic', 'club', 'col-classics', '1:30', 'local:media/search_video_4.jpg', '2026-09-10T10:00:00Z', '9K views', 2),
  (null, 0, 'm03', 'v06', 'Highlights: Man City 2-2 Arsenal', 'Highlights', 'men', 'col-men-highlights', '10:14', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', '2026-09-22T22:30:00Z', '450K views', 0),
  (null, 0, 'm04', 'v07', 'Mikel Arteta press conference | Leicester City preview', 'Interviews', 'men', null, '14:22', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', '2026-09-24T12:30:00Z', '38K views', 0),
  (null, 0, null, 'v08', 'Inside Hale End: the road to the first team', 'Features', 'academy', 'col-academy', '18:45', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', '2026-09-18T12:00:00Z', '90K views', 1),
  (null, 0, null, 'v09', 'Classic: Chelsea 3-5 Arsenal | Van Persie hat-trick | 2011/12', 'Classic', 'club', 'col-classics', '8:50', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', '2026-09-16T12:00:00Z', '820K views', 1),
  (null, 0, 'm01', 'v10', 'Highlights: Brighton 3-0 Arsenal', 'Highlights', 'men', 'col-men-highlights', '7:35', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', '2026-09-19T19:30:00Z', '310K views', 2),
  (null, 0, 'm02', 'v11', 'Highlights: Ipswich Town 2-4 Arsenal', 'Highlights', 'men', 'col-men-highlights', '6:05', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', '2026-09-15T22:00:00Z', '165K views', 4),
  (null, 0, 'a2627-04', 'v12', 'U18 highlights: Arsenal 4-1 Tottenham', 'Highlights', 'academy', 'col-academy', '4:10', 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop', '2026-09-20T15:00:00Z', '21K views', 2)
on conflict (id) do update set
  youtube_id = excluded.youtube_id,
  reactions_base = excluded.reactions_base,
  match_id = excluded.match_id,
  title = excluded.title,
  category = excluded.category,
  team_type = excluded.team_type,
  collection_id = excluded.collection_id,
  duration = excluded.duration,
  thumbnail_url = excluded.thumbnail_url,
  published_at = excluded.published_at,
  views_count = excluded.views_count,
  sort = excluded.sort;

-- ----------------------------------------------------------------
-- Reels
-- ----------------------------------------------------------------
insert into public.reels (id, tag, title, subtitle, image_url, article_id, team_type, is_featured, reactions_base, published_at)
values
  ('r01', 'FEATURE', '13 things you may not know about Kai Havertz', 'Discover some interesting facts about our German international', 'local:media/reel_havertz.jpg', 'a05', 'men', true, 10, '2026-09-24T07:00:00Z'),
  ('r02', 'INTERVIEW', 'Arteta: "We showed the true character of this club"', 'The boss on a battling draw at the Etihad', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', 'a1111111-1111-1111-1111-111111111111', 'men', true, 21, '2026-09-22T22:00:00Z'),
  ('r03', 'WOMEN', 'Into the league phase!', 'Arsenal Women edge past HB Køge at Meadow Park', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', 'a5555555-5555-5555-5555-555555555555', 'women', true, 8, '2026-09-17T20:30:00Z'),
  ('r04', 'NEWS', 'Five things to know about the international break', 'Where our players are heading and when they are back', 'local:media/news_2.jpg', 'a02', 'men', false, 12, '2026-09-23T08:00:00Z'),
  ('r05', 'HALE END', 'U18s hit four against Tottenham', 'A sparkling derby display at Hale End', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', 'a6666666-6666-6666-6666-666666666666', 'academy', false, 4, '2026-09-20T14:00:00Z'),
  ('r06', 'TICKETS', 'Arsenal v Chelsea tickets', 'Member sales open on Monday', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'a07', 'men', false, 2, '2026-09-24T09:00:00Z')
on conflict (id) do update set
  tag = excluded.tag,
  title = excluded.title,
  subtitle = excluded.subtitle,
  image_url = excluded.image_url,
  article_id = excluded.article_id,
  team_type = excluded.team_type,
  is_featured = excluded.is_featured,
  reactions_base = excluded.reactions_base,
  published_at = excluded.published_at;

-- ----------------------------------------------------------------
-- Photo galleries (images rebuilt)
-- ----------------------------------------------------------------
insert into public.photo_galleries (id, title, team_type, cover_url, match_id, published_at)
values
  ('g01', 'Brighton v Arsenal: in pictures', 'men', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'm01', '2026-09-19T20:00:00Z'),
  ('g02', 'Wrighty''s Arsenal career in pictures', 'club', 'local:media/news_4.jpg', null, '2026-09-22T10:00:00Z'),
  ('g03', 'Arsenal Women v Man United: in pictures', 'women', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', 'w2627-03', '2026-09-20T15:00:00Z'),
  ('g04', 'Training: preparing for Leicester', 'men', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', 'm04', '2026-09-24T13:00:00Z')
on conflict (id) do update set
  title = excluded.title,
  team_type = excluded.team_type,
  cover_url = excluded.cover_url,
  match_id = excluded.match_id,
  published_at = excluded.published_at;

delete from public.photo_gallery_images;
insert into public.photo_gallery_images (id, gallery_id, image_url, caption, sort)
values
  ('g01-1', 'g01', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'Bukayo Saka takes on the Brighton defence', 1),
  ('g01-2', 'g01', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', 'The travelling Gooners in full voice', 2),
  ('g01-3', 'g01', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 'Martin Ødegaard lines up a free kick', 3),
  ('g01-4', 'g01', 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop', 'David Raya claims a cross', 4),
  ('g01-5', 'g01', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', 'The American Express Stadium before kick-off', 5),
  ('g02-1', 'g02', 'local:media/news_4.jpg', 'Ian Wright celebrates at Highbury', 1),
  ('g02-2', 'g02', 'local:media/news_3.jpg', 'Breaking the club scoring record in 1997', 2),
  ('g02-3', 'g02', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', 'The North Bank salutes its hero', 3),
  ('g02-4', 'g02', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', 'Back at the Emirates as a club ambassador', 4),
  ('g03-1', 'g03', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', 'Smilla Holmberg celebrates her late equaliser', 1),
  ('g03-2', 'g03', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', 'A bumper crowd at Emirates Stadium', 2),
  ('g03-3', 'g03', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 'Kim Little dictates play in midfield', 3),
  ('g04-1', 'g04', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', 'Warm-ups at Sobha Realty Training Centre', 1),
  ('g04-2', 'g04', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 'Rondo drills in the sunshine', 2),
  ('g04-3', 'g04', 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop', 'Goalkeeper session with Iñaki Caña', 3)
;

-- ----------------------------------------------------------------
-- Quizzes (questions rebuilt)
-- ----------------------------------------------------------------
insert into public.quizzes (id, title, description, team_type, cover_url, published_at)
values
  ('qz01', 'The Invincibles', 'How well do you know the 2003/04 season?', 'club', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', '2026-09-20T09:00:00Z'),
  ('qz02', 'Know your Emirates Stadium', 'Five questions about our home since 2006.', 'club', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', '2026-09-15T09:00:00Z'),
  ('qz03', 'Arsenal Women legends', 'Test your knowledge of our European champions.', 'women', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', '2026-09-18T09:00:00Z')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  team_type = excluded.team_type,
  cover_url = excluded.cover_url,
  published_at = excluded.published_at;

delete from public.quiz_questions;
insert into public.quiz_questions (id, quiz_id, sort, prompt, options, correct_index, explanation)
values
  ('qz01-q1', 'qz01', 1, 'In which season did Arsenal go unbeaten in the Premier League?', '["2002/03","2003/04","2004/05","1997/98"]'::jsonb, 1, 'The Invincibles went 38 league games unbeaten in 2003/04.'),
  ('qz01-q2', 'qz01', 2, 'How many games did the Invincibles draw in that league season?', '["12","6","10","8"]'::jsonb, 0, 'We won 26 and drew 12 of our 38 matches.'),
  ('qz01-q3', 'qz01', 3, 'Who was our top scorer that season?', '["Robert Pires","Dennis Bergkamp","Thierry Henry","Freddie Ljungberg"]'::jsonb, 2, 'Thierry Henry scored 30 league goals and won the Golden Boot.'),
  ('qz01-q4', 'qz01', 4, 'Which club ended the 49-game unbeaten run in October 2004?', '["Chelsea","Manchester United","Liverpool","Bolton Wanderers"]'::jsonb, 1, 'The run ended at Old Trafford on 24 October 2004.'),
  ('qz01-q5', 'qz01', 5, 'Who captained the Invincibles?', '["Tony Adams","Sol Campbell","Patrick Vieira","Ashley Cole"]'::jsonb, 2, 'Patrick Vieira lifted the golden Premier League trophy.'),
  ('qz02-q1', 'qz02', 1, 'In which year did we move to Emirates Stadium?', '["2004","2005","2006","2008"]'::jsonb, 2, 'We played our first game at the Emirates in July 2006.'),
  ('qz02-q2', 'qz02', 2, 'Where did Arsenal play before the Emirates?', '["White Hart Lane","Highbury","Wembley","Craven Cottage"]'::jsonb, 1, 'We spent 93 years at Highbury.'),
  ('qz02-q3', 'qz02', 3, 'Which stand sits at the north end of the stadium?', '["Clock End","North Bank","East Stand","West Stand"]'::jsonb, 1, 'The North Bank carries on the Highbury tradition.'),
  ('qz02-q4', 'qz02', 4, 'Who were our opponents in the first competitive game at the Emirates?', '["Aston Villa","Chelsea","Wigan Athletic","Hamburg"]'::jsonb, 0, 'It finished 1-1 against Aston Villa on 19 August 2006.'),
  ('qz02-q5', 'qz02', 5, 'Roughly how many supporters can the stadium hold?', '["45,000","52,000","60,000","75,000"]'::jsonb, 2, 'Emirates Stadium holds just over 60,000.'),
  ('qz03-q1', 'qz03', 1, 'In which year did Arsenal Women first win the UEFA Women’s Cup?', '["2003","2007","2011","2015"]'::jsonb, 1, 'We became the first English side to win it in 2007.'),
  ('qz03-q2', 'qz03', 2, 'Who scored the winner in the 2025 Women’s Champions League final?', '["Stina Blackstenius","Alessia Russo","Beth Mead","Mariona Caldentey"]'::jsonb, 0, 'Stina Blackstenius came off the bench to score against Barcelona.'),
  ('qz03-q3', 'qz03', 3, 'In which city was the 2025 final played?', '["Lisbon","Bilbao","Turin","Eindhoven"]'::jsonb, 0, 'The final was held at the Estádio José Alvalade in Lisbon.'),
  ('qz03-q4', 'qz03', 4, 'Where do Arsenal Women play most of their home league games?', '["Meadow Park","Kingsmeadow","Leigh Sports Village","The Hive"]'::jsonb, 0, 'Meadow Park in Borehamwood, alongside games at the Emirates.'),
  ('qz03-q5', 'qz03', 5, 'Which Arsenal captain lifted Euro 2022 with England?', '["Leah Williamson","Kim Little","Katie McCabe","Beth Mead"]'::jsonb, 0, 'Leah Williamson captained the Lionesses to the title at Wembley.')
;

-- ----------------------------------------------------------------
-- Experiences & tickets
-- ----------------------------------------------------------------
insert into public.experiences (team_type, id, category, title, subtitle, description, image_url, price_gbp, duration_minutes, schedule, book_url, sort)
values
  ('club', 'ex01', 'tour', 'Emirates Stadium Tour', 'Self-guided tour with audio guide', 'Walk in the footsteps of your heroes. Visit the home dressing room, the tunnel, the dugouts and the Directors’ Box, with an audio guide narrated by club legends.', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', 30, 90, 'Daily, 9:30am – 5:00pm (non-matchdays)', 'https://www.arsenal.com/tours', 1),
  ('club', 'ex02', 'legends', 'Legends Tour', 'Guided by an Arsenal legend', 'Hear the stories behind the trophies from a former Arsenal player on an exclusive guided tour of the stadium, finished off with a photo and Q&A session.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', 65, 120, 'Selected dates, 11:00am', 'https://www.arsenal.com/tours', 2),
  ('club', 'ex03', 'museum', 'Arsenal Museum', 'Over 130 years of history', 'From Dial Square to the Invincibles and beyond. See the golden Premier League trophy, historic kits and the stories that shaped the club.', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 12, 60, 'Daily, 10:00am – 5:00pm', 'https://www.arsenal.com/museum', 3),
  ('club', 'ex04', 'matchday', 'Matchday Hospitality', 'Club Level dining and padded seats', 'Enjoy a three-course meal, complimentary drinks and a padded seat on the halfway line for a men’s or women’s home match.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 295, 300, 'Home matchdays', 'https://www.arsenal.com/hospitality', 4),
  ('club', 'ex05', 'tour', 'Family Stadium Tour', 'Two adults and two juniors', 'The full Emirates Stadium tour experience at a family price, with an activity trail for younger Gooners.', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', 85, 90, 'Weekends and school holidays', 'https://www.arsenal.com/tours', 5)
on conflict (id) do update set
  team_type = excluded.team_type,
  category = excluded.category,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  image_url = excluded.image_url,
  price_gbp = excluded.price_gbp,
  duration_minutes = excluded.duration_minutes,
  schedule = excluded.schedule,
  book_url = excluded.book_url,
  sort = excluded.sort;

insert into public.ticket_sales (id, match_id, phase, opens_at, closes_at, price_from_gbp, status, buy_url)
values
  ('ts01', 'm04', 'General Sale', '2026-09-14T09:00:00Z', '2026-09-26T12:00:00Z', 36, 'open', 'https://www.arsenal.com/tickets'),
  ('ts02', 'm2627-06', 'Red Members Sale', '2026-09-21T09:00:00Z', '2026-09-29T12:00:00Z', 42, 'open', 'https://www.arsenal.com/tickets'),
  ('ts03', 'm2627-07', 'Members Ballot', '2026-09-28T09:00:00Z', '2026-09-30T12:00:00Z', 58, 'upcoming', 'https://www.arsenal.com/tickets'),
  ('ts04', 'm2627-14', 'Members Ballot', '2026-10-12T09:00:00Z', null, 58, 'upcoming', 'https://www.arsenal.com/tickets'),
  ('ts05', 'w2627-05', 'General Sale', '2026-09-10T09:00:00Z', null, 12, 'open', 'https://www.arsenal.com/tickets'),
  ('ts06', 'm2627-10', 'Red Members Sale', '2026-10-05T09:00:00Z', null, 36, 'upcoming', 'https://www.arsenal.com/tickets')
on conflict (id) do update set
  match_id = excluded.match_id,
  phase = excluded.phase,
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  price_from_gbp = excluded.price_from_gbp,
  status = excluded.status,
  buy_url = excluded.buy_url;

-- ----------------------------------------------------------------
-- Fan polls
-- ----------------------------------------------------------------
insert into public.fan_polls (id, title, description, category, ends_at, is_active, match_id)
values
  ('fp01', 'Player of the Match: Man City 2-2 Arsenal', 'Who was our standout performer at the Etihad?', 'Matchday Vote', '2026-10-01T23:00:00Z', true, 'm03'),
  ('fp02', 'Goal of the Month — September', 'Choose your favourite Arsenal goal from September.', 'Goal of the Month', '2026-10-05T23:00:00Z', true, null),
  ('fp03', 'Player of the Match: Ipswich Town 2-4 Arsenal', 'Who shone brightest at Portman Road?', 'Matchday Vote', '2026-09-30T23:00:00Z', true, 'm02')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  ends_at = excluded.ends_at,
  is_active = excluded.is_active,
  match_id = excluded.match_id;

insert into public.poll_options (id, poll_id, label, sub_label, image_url, votes_count)
values
  ('po01', 'fp01', 'Bukayo Saka', '1 goal, 4 key passes', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223340.png', 1248),
  ('po02', 'fp01', 'Gabriel', '1 goal, 7 clearances', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/226597.png', 892),
  ('po03', 'fp01', 'Declan Rice', '1 assist, 94% pass accuracy', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/204480.png', 635),
  ('po04', 'fp01', 'David Raya', '5 saves', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/154561.png', 412),
  ('po05', 'fp02', 'Saka vs Man City', 'Curler into the top corner', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/223340.png', 1530),
  ('po06', 'fp02', 'Nwaneri vs Ipswich', 'Left-footed strike from distance', null, 1890),
  ('po07', 'fp02', 'Ødegaard vs Newcastle', 'Free kick over the wall', 'https://resources.premierleague.com/premierleague25/photos/players/110x140/184029.png', 940),
  ('po08', 'fp03', 'Ethan Nwaneri', '1 goal', null, 811),
  ('po09', 'fp03', 'Gabriel Jesus', '1 goal, 1 assist', null, 540),
  ('po10', 'fp03', 'Myles Lewis-Skelly', '1 goal', null, 377)
on conflict (id) do update set
  poll_id = excluded.poll_id,
  label = excluded.label,
  sub_label = excluded.sub_label,
  image_url = excluded.image_url;

-- ----------------------------------------------------------------
-- Store
-- ----------------------------------------------------------------
insert into public.store_categories (id, parent_id, slug, title, image_url, position, show_in_menu)
values
  ('cat-sale', null, 'sale', '20% Off', null, 0, true),
  ('cat-new', null, 'new', 'New In', null, 1, true),
  ('cat-kit', null, 'kit', 'Kit', null, 2, true),
  ('cat-home-kit', 'cat-kit', 'home-kit', 'Home', null, 3, true),
  ('cat-away-kit', 'cat-kit', 'away-kit', 'Away', null, 4, true),
  ('cat-third-kit', 'cat-kit', 'third-kit', 'Third', null, 5, true),
  ('cat-goalkeeper', 'cat-kit', 'goalkeeper', 'Goalkeeper', null, 6, true),
  ('cat-adidas', null, 'adidas', 'adidas', null, 7, true),
  ('cat-training', 'cat-adidas', 'training', 'Training', null, 8, true),
  ('cat-pre-match', 'cat-training', 'pre-match', 'Pre-Match', null, 9, true),
  ('cat-european-range', 'cat-training', 'european-range', 'European Range', null, 10, true),
  ('cat-mens-training', 'cat-training', 'mens-training', 'Mens', null, 11, true),
  ('cat-womens-training', 'cat-training', 'womens-training', 'Womens', null, 12, true),
  ('cat-kids-training', 'cat-training', 'kids-training', 'Kids', null, 13, true),
  ('cat-training-accs', 'cat-training', 'training-accs', 'Accessories', null, 14, true),
  ('cat-adidas-collections', 'cat-adidas', 'adidas-collections', 'Fashion', null, 15, true),
  ('cat-originals', 'cat-adidas-collections', 'originals', 'Originals', null, 16, true),
  ('cat-tiro-travel', 'cat-adidas-collections', 'tiro-travel', 'Tiro Travel', null, 17, true),
  ('cat-dna-range', 'cat-adidas-collections', 'dna-range', 'DNA', null, 18, true),
  ('cat-as-seen-on-players', 'cat-adidas', 'as-seen-on-players', 'As Seen On Players', null, 19, true),
  ('cat-authentic-kit', 'cat-as-seen-on-players', 'authentic-kit', 'Authentic Kit', null, 20, true),
  ('cat-pro-trainingwear', 'cat-as-seen-on-players', 'pro-trainingwear', 'Pro Trainingwear', null, 21, true),
  ('cat-warm-up', 'cat-as-seen-on-players', 'warm-up', 'Warm Up', null, 22, true),
  ('cat-travel-wear', 'cat-as-seen-on-players', 'travel-wear', 'Travelwear', null, 23, true),
  ('cat-clothing', null, 'clothing', 'Clothing', null, 24, true),
  ('cat-mens-clothing', 'cat-clothing', 'mens-clothing', 'Mens', null, 25, true),
  ('cat-mens-tshirts', 'cat-mens-clothing', 'mens-tshirts', 'T-Shirts', null, 26, true),
  ('cat-mens-retro', 'cat-mens-clothing', 'mens-retro', 'Retro Shirts', null, 27, true),
  ('cat-mens-sweatshirts', 'cat-mens-clothing', 'mens-sweatshirts', 'Sweatshirts & Hoodies', null, 28, true),
  ('cat-mens-jackets', 'cat-mens-clothing', 'mens-jackets', 'Jackets & Coats', null, 29, true),
  ('cat-womens-clothing', 'cat-clothing', 'womens-clothing', 'Womens', null, 30, true),
  ('cat-womens-tshirts', 'cat-womens-clothing', 'womens-tshirts', 'T-Shirts', null, 31, true),
  ('cat-womens-sweatshirts', 'cat-womens-clothing', 'womens-sweatshirts', 'Sweatshirts & Hoodies', null, 32, true),
  ('cat-womens-jackets', 'cat-womens-clothing', 'womens-jackets', 'Jackets & Coats', null, 33, true),
  ('cat-kids-clothing', 'cat-clothing', 'kids-clothing', 'Kids & Baby', null, 34, true),
  ('cat-baby', 'cat-kids-clothing', 'baby', 'Baby', null, 35, true),
  ('cat-kids-kit', 'cat-kids-clothing', 'kids-kit', 'Kit', null, 36, true),
  ('cat-kids-tshirts', 'cat-kids-clothing', 'kids-tshirts', 'T-Shirts', null, 37, true),
  ('cat-arsenal-collections', 'cat-clothing', 'arsenal-collections', 'Collections', null, 38, true),
  ('cat-cold-weather', 'cat-arsenal-collections', 'cold-weather', 'Winter Essentials', null, 39, true),
  ('cat-matchday', 'cat-arsenal-collections', 'matchday', 'Match Day', null, 40, true),
  ('cat-best-sellers', 'cat-arsenal-collections', 'best-sellers', 'Best Sellers', null, 41, true),
  ('cat-awfc', 'cat-arsenal-collections', 'awfc', 'AWFC Collection', null, 42, true),
  ('cat-classics', 'cat-arsenal-collections', 'classics', 'Classics', null, 43, true),
  ('cat-accessories', null, 'accessories', 'Accessories', null, 44, true),
  ('cat-accessories-hats-caps', 'cat-accessories', 'accessories-hats-caps', 'Hats & Caps', null, 45, true),
  ('cat-scarves', 'cat-accessories', 'scarves', 'Scarves & Gloves', null, 46, true),
  ('cat-bags', 'cat-accessories', 'bags', 'Bags & Wallets', null, 47, true),
  ('cat-underwear-socks', 'cat-accessories', 'underwear-socks', 'Underwear & Socks', null, 48, true),
  ('cat-footwear', 'cat-accessories', 'footwear', 'Footwear', null, 49, true),
  ('cat-pet', 'cat-accessories', 'pet', 'Pets', null, 50, true),
  ('cat-champions', null, 'champions', 'Champions', null, 51, true),
  ('cat-memorabilia', null, 'memorabilia', 'Memorabilia', null, 52, true),
  ('cat-signature', 'cat-memorabilia', 'signature', 'Signature Collection', null, 53, true),
  ('cat-special-collection', 'cat-memorabilia', 'special-collection', 'Limited Edition', null, 54, true),
  ('cat-legends', 'cat-memorabilia', 'legends', 'Legends', null, 55, true),
  ('cat-photography', 'cat-memorabilia', 'photography', 'Photography & Prints', null, 56, true),
  ('cat-gifts', null, 'gifts', 'Gifts', null, 57, true),
  ('cat-toys', 'cat-gifts', 'toys', 'Toys & Games', null, 58, true),
  ('cat-gift-cards', 'cat-gifts', 'gift-cards', 'Gift Cards', null, 59, true),
  ('cat-souvenirs', 'cat-gifts', 'souvenirs', 'Souvenirs', null, 60, true),
  ('cat-home-car', 'cat-gifts', 'home-car', 'Homeware', null, 61, true),
  ('cat-books', 'cat-gifts', 'books', 'Books & Stationery', null, 62, true),
  ('cat-stadium-tours', null, 'stadium-tours', 'Stadium Tours', null, 63, true),
  ('cat-retro-shop', null, 'retro-shop', 'Retro', null, 64, true),
  ('cat-outlet', null, 'outlet', 'Outlet', null, 65, true),
  ('cat-essentials', 'cat-arsenal-collections', 'essentials', 'Essentials', null, 66, true)
on conflict (id) do update set
  parent_id = excluded.parent_id,
  slug = excluded.slug,
  title = excluded.title,
  image_url = excluded.image_url,
  position = excluded.position,
  show_in_menu = excluded.show_in_menu;

insert into public.store_size_charts (id, title, columns, rows)
values
  ('adult-shirt', 'Adult shirt size chart', array['Size', 'Chest', 'Waist', 'Hip']::text[], '[["XS","32.5-34\"","27.5-29\"","32-33.5\""],["S","34.5-36\"","29.5-31.5\"","34-36\""],["M","36.5-39\"","32-34.5\"","36.5-39\""],["L","39.5-42.5\"","35-38\"","39.5-42\""],["XL","43-46.5\"","38.5-42\"","42.5-45.5\""],["2XL","47-51\"","42.5-47\"","46-49\""],["3XL","51.5-56\"","47.5-52\"","49.5-53\""]]'::jsonb),
  ('womens-shirt', 'Womens shirt size chart', array['Size', 'UK', 'Bust', 'Waist']::text[], '[["XS","4-6","30.5-32\"","24-25.5\""],["S","8-10","32.5-34.5\"","26-28\""],["M","12-14","35-37\"","28.5-30.5\""],["L","16-18","37.5-40.5\"","31-34\""],["XL","20-22","41-44.5\"","34.5-38\""]]'::jsonb),
  ('kids', 'Kids size chart', array['Age', 'Height', 'Chest']::text[], '[["5-6Y","110-116cm","58-61cm"],["7-8Y","122-128cm","62-66cm"],["9-10Y","134-140cm","67-70cm"],["11-12Y","146-152cm","71-76cm"],["13-14Y","158-164cm","77-82cm"]]'::jsonb),
  ('baby', 'Baby size chart', array['Age', 'Height', 'Weight']::text[], '[["3-6M","62-68cm","6-8kg"],["6-9M","68-74cm","8-9kg"],["9-12M","74-80cm","9-10kg"],["12-18M","80-86cm","10-12kg"],["18-24M","86-92cm","12-13kg"]]'::jsonb)
on conflict (id) do update set
  title = excluded.title,
  columns = excluded.columns,
  rows = excluded.rows;

insert into public.store_products (id, category, title, description, price_gbp, price_usd, compare_at_price_gbp, compare_at_price_usd, main_image_url, gallery_urls, back_image_url, sizes, is_customizable, customisation_price_gbp, customisation_price_usd, badge, external_buy_url, brand, family_id, kit_role, profile, profile_group_id, size_chart_id, details, returnable, popularity, member_discount_eligible, is_active)
values
  ('kit-home-shirt-m', 'Kits', 'Arsenal adidas 26/27 Home Shirt', 'Marking 20 years at our modern home ground, the new home shirt echoes the Emirates Stadium’s architecture on the collar and cuffs, with the classic red body and white sleeves.', 85, 100, null, null, 'shirt:home', array['shirt:home', 'shirt:home:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:home:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, 'Best Seller', null, 'adidas', 'kit-2627-shirt', 'home', 'mens', 'kit-home-shirt', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","Dual-contrast adidas 3-stripe details"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Red / White","code":"MJHO2627","material":"100% recycled polyester"}'::jsonb, true, 1000, true, true),
  ('kit-home-shirt-w', 'Kits', 'Arsenal adidas Womens 26/27 Home Shirt', 'Marking 20 years at our modern home ground, the new home shirt echoes the Emirates Stadium’s architecture on the collar and cuffs, with the classic red body and white sleeves. Cut for a women’s fit.', 85, 100, null, null, 'shirt:home', array['shirt:home', 'shirt:home:back', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:home:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'home', 'womens', 'kit-home-shirt', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular women’s fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Red / White","code":"WKHO2627","material":"100% recycled polyester"}'::jsonb, true, 700, true, true),
  ('kit-home-shirt-k', 'Kits', 'Arsenal adidas Kids 26/27 Home Shirt', 'Marking 20 years at our modern home ground, the new home shirt echoes the Emirates Stadium’s architecture on the collar and cuffs, with the classic red body and white sleeves. Sized for young Gooners.', 65, 80, null, null, 'shirt:home', array['shirt:home', 'shirt:home:back']::text[], 'shirt:home:back', array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'home', 'kids', 'kit-home-shirt', 'kids', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular fit","model":null,"care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Red / White","code":"KJHO2627","material":"100% recycled polyester"}'::jsonb, true, 650, true, true),
  ('sp01', 'Kits', 'Arsenal adidas 26/27 Authentic Home Shirt', 'The exact shirt the players wear. Marking 20 years at our modern home ground, the new home shirt echoes the Emirates Stadium’s architecture on the collar and cuffs, with the classic red body and white sleeves. HEAT.RDY fabric and a heat-applied crest keep it light on match day.', 115, 150, null, null, 'shirt:home', array['shirt:home', 'shirt:home:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:home:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-authentic', 'home', 'mens', 'kit-home-authentic', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","HEAT.RDY technology","Heat-applied crest"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Red / White","code":"MAHO2627","material":"100% recycled polyester doubleknit"}'::jsonb, true, 600, true, true),
  ('kit-home-authentic-w', 'Kits', 'Arsenal adidas Womens 26/27 Authentic Home Shirt', 'As worn by Arsenal Women. Marking 20 years at our modern home ground, the new home shirt echoes the Emirates Stadium’s architecture on the collar and cuffs, with the classic red body and white sleeves.', 115, 150, null, null, 'shirt:home', array['shirt:home']::text[], 'shirt:home:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-authentic', 'home', 'womens', 'kit-home-authentic', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","HEAT.RDY technology"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Red / White","code":"WAHO2627","material":"100% recycled polyester"}'::jsonb, true, 400, true, true),
  ('kit-home-shorts-m', 'Kits', 'Arsenal adidas 26/27 Home Shorts', 'Match shorts to complete the 26/27 home kit.', 40, 60, null, null, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', 'kit-home-shorts', 'adult-shirt', '{"bullets":["Elasticated waist with drawcord","Climacool fabric"],"colour":"Red / White","code":"SHHO2627","material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 300, true, true),
  ('kit-home-socks', 'Kits', 'Arsenal adidas 26/27 Home Socks', 'Cushioned match socks in red / white.', 18, 25, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['S', 'M', 'L']::text[], false, 15, 20, null, null, 'adidas', null, null, 'unisex', null, null, '{}'::jsonb, true, 200, true, true),
  ('sp07', 'Kits', 'Arsenal adidas 26/27 Home Mini Kit', 'Shirt, shorts and socks for the smallest Gooners.', 55, 70, null, null, 'shirt:home', array['shirt:home']::text[], 'shirt:home:back', array['2-3Y', '3-4Y', '4-5Y', '5-6Y']::text[], true, 15, 20, null, null, 'adidas', null, null, 'kids', null, null, '{}'::jsonb, true, 350, true, true),
  ('sp02', 'Kits', 'Arsenal adidas 26/27 Away Shirt', 'A deep navy away shirt with a tonal cannon graphic and gold trims, built for big nights on the road.', 85, 100, null, null, 'shirt:away', array['shirt:away', 'shirt:away:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:away:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'away', 'mens', 'kit-away-shirt', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","Dual-contrast adidas 3-stripe details"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Collegiate Navy","code":"MJAW2627","material":"100% recycled polyester"}'::jsonb, true, 900, true, true),
  ('kit-away-shirt-w', 'Kits', 'Arsenal adidas Womens 26/27 Away Shirt', 'A deep navy away shirt with a tonal cannon graphic and gold trims, built for big nights on the road. Cut for a women’s fit.', 85, 100, null, null, 'shirt:away', array['shirt:away', 'shirt:away:back', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:away:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'away', 'womens', 'kit-away-shirt', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular women’s fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Collegiate Navy","code":"WKAW2627","material":"100% recycled polyester"}'::jsonb, true, 700, true, true),
  ('kit-away-shirt-k', 'Kits', 'Arsenal adidas Kids 26/27 Away Shirt', 'A deep navy away shirt with a tonal cannon graphic and gold trims, built for big nights on the road. Sized for young Gooners.', 65, 80, null, null, 'shirt:away', array['shirt:away', 'shirt:away:back']::text[], 'shirt:away:back', array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'away', 'kids', 'kit-away-shirt', 'kids', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular fit","model":null,"care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Collegiate Navy","code":"KJAW2627","material":"100% recycled polyester"}'::jsonb, true, 650, true, true),
  ('kit-away-authentic-m', 'Kits', 'Arsenal adidas 26/27 Authentic Away Shirt', 'The exact shirt the players wear. A deep navy away shirt with a tonal cannon graphic and gold trims, built for big nights on the road. HEAT.RDY fabric and a heat-applied crest keep it light on match day.', 115, 150, null, null, 'shirt:away', array['shirt:away', 'shirt:away:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:away:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-authentic', 'away', 'mens', 'kit-away-authentic', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","HEAT.RDY technology","Heat-applied crest"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Collegiate Navy","code":"MAAW2627","material":"100% recycled polyester doubleknit"}'::jsonb, true, 600, true, true),
  ('kit-away-authentic-w', 'Kits', 'Arsenal adidas Womens 26/27 Authentic Away Shirt', 'As worn by Arsenal Women. A deep navy away shirt with a tonal cannon graphic and gold trims, built for big nights on the road.', 115, 150, null, null, 'shirt:away', array['shirt:away']::text[], 'shirt:away:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-authentic', 'away', 'womens', 'kit-away-authentic', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","HEAT.RDY technology"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Collegiate Navy","code":"WAAW2627","material":"100% recycled polyester"}'::jsonb, true, 400, true, true),
  ('kit-away-shorts-m', 'Kits', 'Arsenal adidas 26/27 Away Shorts', 'Match shorts to complete the 26/27 away kit.', 40, 60, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', 'kit-away-shorts', 'adult-shirt', '{"bullets":["Elasticated waist with drawcord","Climacool fabric"],"colour":"Collegiate Navy","code":"SHAW2627","material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 300, true, true),
  ('kit-away-socks', 'Kits', 'Arsenal adidas 26/27 Away Socks', 'Cushioned match socks in collegiate navy.', 18, 25, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['S', 'M', 'L']::text[], false, 15, 20, null, null, 'adidas', null, null, 'unisex', null, null, '{}'::jsonb, true, 200, true, true),
  ('kit-away-minikit', 'Kits', 'Arsenal adidas 26/27 Away Mini Kit', 'Shirt, shorts and socks for the smallest Gooners.', 55, 70, null, null, 'shirt:away', array['shirt:away']::text[], 'shirt:away:back', array['2-3Y', '3-4Y', '4-5Y', '5-6Y']::text[], true, 15, 20, null, null, 'adidas', null, null, 'kids', null, null, '{}'::jsonb, true, 350, true, true),
  ('sp03', 'Kits', 'Arsenal adidas 26/27 Third Shirt', 'A modern take on the club’s famous yellow change strips with a subtle zigzag weave and maroon trims.', 85, 100, null, null, 'shirt:third', array['shirt:third', 'shirt:third:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:third:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, 'New', null, 'adidas', 'kit-2627-shirt', 'third', 'mens', 'kit-third-shirt', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","Dual-contrast adidas 3-stripe details"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Almost Yellow","code":"MJTH2627","material":"100% recycled polyester"}'::jsonb, true, 900, true, true),
  ('kit-third-shirt-w', 'Kits', 'Arsenal adidas Womens 26/27 Third Shirt', 'A modern take on the club’s famous yellow change strips with a subtle zigzag weave and maroon trims. Cut for a women’s fit.', 85, 100, null, null, 'shirt:third', array['shirt:third', 'shirt:third:back', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:third:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'third', 'womens', 'kit-third-shirt', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular women’s fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Almost Yellow","code":"WKTH2627","material":"100% recycled polyester"}'::jsonb, true, 700, true, true),
  ('kit-third-shirt-k', 'Kits', 'Arsenal adidas Kids 26/27 Third Shirt', 'A modern take on the club’s famous yellow change strips with a subtle zigzag weave and maroon trims. Sized for young Gooners.', 65, 80, null, null, 'shirt:third', array['shirt:third', 'shirt:third:back']::text[], 'shirt:third:back', array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'third', 'kids', 'kit-third-shirt', 'kids', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular fit","model":null,"care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Almost Yellow","code":"KJTH2627","material":"100% recycled polyester"}'::jsonb, true, 650, true, true),
  ('kit-third-authentic-m', 'Kits', 'Arsenal adidas 26/27 Authentic Third Shirt', 'The exact shirt the players wear. A modern take on the club’s famous yellow change strips with a subtle zigzag weave and maroon trims. HEAT.RDY fabric and a heat-applied crest keep it light on match day.', 115, 150, null, null, 'shirt:third', array['shirt:third', 'shirt:third:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:third:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-authentic', 'third', 'mens', 'kit-third-authentic', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","HEAT.RDY technology","Heat-applied crest"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Almost Yellow","code":"MATH2627","material":"100% recycled polyester doubleknit"}'::jsonb, true, 600, true, true),
  ('kit-third-authentic-w', 'Kits', 'Arsenal adidas Womens 26/27 Authentic Third Shirt', 'As worn by Arsenal Women. A modern take on the club’s famous yellow change strips with a subtle zigzag weave and maroon trims.', 115, 150, null, null, 'shirt:third', array['shirt:third']::text[], 'shirt:third:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-authentic', 'third', 'womens', 'kit-third-authentic', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","HEAT.RDY technology"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Almost Yellow","code":"WATH2627","material":"100% recycled polyester"}'::jsonb, true, 400, true, true),
  ('kit-third-shorts-m', 'Kits', 'Arsenal adidas 26/27 Third Shorts', 'Match shorts to complete the 26/27 third kit.', 40, 60, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', 'kit-third-shorts', 'adult-shirt', '{"bullets":["Elasticated waist with drawcord","Climacool fabric"],"colour":"Almost Yellow","code":"SHTH2627","material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 300, true, true),
  ('kit-third-socks', 'Kits', 'Arsenal adidas 26/27 Third Socks', 'Cushioned match socks in almost yellow.', 18, 25, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['S', 'M', 'L']::text[], false, 15, 20, null, null, 'adidas', null, null, 'unisex', null, null, '{}'::jsonb, true, 200, true, true),
  ('kit-goalkeeper-shirt-m', 'Kits', 'Arsenal adidas 26/27 Home Goalkeeper Shirt', 'The shirt our goalkeepers wear at the Emirates, with padded elbows on the long sleeve version.', 85, 100, null, null, 'shirt:gk', array['shirt:gk', 'shirt:gk:back', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:gk:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'goalkeeper', 'mens', 'kit-goalkeeper-shirt', 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","Dual-contrast adidas 3-stripe details"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Lime","code":"MJGO2627","material":"100% recycled polyester"}'::jsonb, true, 900, true, true),
  ('kit-goalkeeper-shirt-w', 'Kits', 'Arsenal adidas Womens 26/27 Home Goalkeeper Shirt', 'The shirt our goalkeepers wear at the Emirates, with padded elbows on the long sleeve version. Cut for a women’s fit.', 85, 100, null, null, 'shirt:gk', array['shirt:gk', 'shirt:gk:back', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], 'shirt:gk:back', array['XS', 'S', 'M', 'L', 'XL']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'goalkeeper', 'womens', 'kit-goalkeeper-shirt', 'womens-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular women’s fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Lime","code":"WKGO2627","material":"100% recycled polyester"}'::jsonb, true, 700, true, true),
  ('kit-goalkeeper-shirt-k', 'Kits', 'Arsenal adidas Kids 26/27 Home Goalkeeper Shirt', 'The shirt our goalkeepers wear at the Emirates, with padded elbows on the long sleeve version. Sized for young Gooners.', 65, 80, null, null, 'shirt:gk', array['shirt:gk', 'shirt:gk:back']::text[], 'shirt:gk:back', array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], true, 15, 20, null, null, 'adidas', 'kit-2627-shirt', 'goalkeeper', 'kids', 'kit-goalkeeper-shirt', 'kids', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck"],"fit":"Regular fit","model":null,"care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Lime","code":"KJGO2627","material":"100% recycled polyester"}'::jsonb, true, 650, true, true),
  ('kit-home-ls-m', 'Kits', 'Arsenal adidas 26/27 Home Long Sleeved Shirt', 'The 26/27 home shirt with long sleeves and ribbed cuffs.', 90, 110, null, null, 'shirt:home', array['shirt:home']::text[], 'shirt:home:back', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], true, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{}'::jsonb, true, 380, true, true),
  ('champions-home-shirt', 'Kits', 'Arsenal adidas Premier League Champions Home Shirt', 'Celebrate the title with the home shirt and gold Champions 26 printing on the back.', 120, 145, null, null, 'shirt:home:back:champions', array['shirt:home:back:champions', 'shirt:home']::text[], 'shirt:home:back:champions', array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, 'Champions', null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Embroidered Club crest at chest","Embroidered adidas badge of sport","Moisture-absorbing adidas Climacool technology","Round neck","Gold Champions 26 print"],"fit":"Slim fit","model":"Our model (6’0\") wears a size M and has a 38\" chest, 32\" waist","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry.","colour":"Red / White / Gold","code":"MJZCH26","material":"100% recycled polyester"}'::jsonb, false, 950, false, true),
  ('tr-prematch-jersey', 'Training', 'Arsenal adidas 26/27 Pre-Match Jersey', '26/27 Pre-Match Jersey: the gear the squad trains in at Sobha Realty Training Centre.', 60, 75, null, null, 'shirt:prematch', array['shirt:prematch']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, 'New', null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 171, true, true),
  ('tr-european-top', 'Training', 'Arsenal adidas 26/27 European Training Top', '26/27 European Training Top: the gear the squad trains in at Sobha Realty Training Centre.', 70, 90, null, null, 'shirt:training-euro', array['shirt:training-euro']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, 'New', null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 170, true, true),
  ('tr-training-jersey-w', 'Training', 'Arsenal adidas Womens 26/27 Training Jersey', 'Womens 26/27 Training Jersey: the gear the squad trains in at Sobha Realty Training Centre.', 45, 60, null, null, 'shirt:training', array['shirt:training']::text[], null, array['XS', 'S', 'M', 'L', 'XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'womens', null, 'womens-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 169, true, true),
  ('tr-training-jersey-k', 'Training', 'Arsenal adidas Kids 26/27 Training Jersey', 'Kids 26/27 Training Jersey: the gear the squad trains in at Sobha Realty Training Centre.', 35, 45, null, null, 'shirt:training', array['shirt:training']::text[], null, array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], false, 15, 20, null, null, 'adidas', null, null, 'kids', null, 'kids', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 168, true, true),
  ('tr-anthem-jacket', 'Training', 'Arsenal adidas 26/27 Anthem Jacket', '26/27 Anthem Jacket: the gear the squad trains in at Sobha Realty Training Centre.', 90, 110, null, null, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 167, true, true),
  ('sp04', 'Training', 'Arsenal adidas Pro Training Top', 'Pro Training Top: the gear the squad trains in at Sobha Realty Training Centre.', 75, 95, null, null, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 166, true, true),
  ('tr-travel-hoodie', 'Training', 'Arsenal adidas Tiro Travel Hoodie', 'Tiro Travel Hoodie: the gear the squad trains in at Sobha Realty Training Centre.', 70, 90, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 165, true, true),
  ('tr-travel-pants', 'Training', 'Arsenal adidas Tiro Travel Pants', 'Tiro Travel Pants: the gear the squad trains in at Sobha Realty Training Centre.', 55, 70, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 164, true, true),
  ('tr-originals-tee', 'Training', 'Arsenal adidas Originals Trefoil T-Shirt', 'Originals Trefoil T-Shirt: the gear the squad trains in at Sobha Realty Training Centre.', 35, 45, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 163, true, true),
  ('tr-dna-hoodie', 'Training', 'Arsenal adidas DNA Hoodie', 'DNA Hoodie: the gear the squad trains in at Sobha Realty Training Centre.', 65, 80, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 162, true, true),
  ('sp08', 'Training', 'Arsenal adidas Training Shorts', 'Training Shorts: the gear the squad trains in at Sobha Realty Training Centre.', 35, 45, null, null, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 161, true, true),
  ('tr-training-beanie', 'Training', 'Arsenal adidas Training Beanie', 'Training Beanie: the gear the squad trains in at Sobha Realty Training Centre.', 22, 30, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'adidas', null, null, 'unisex', null, null, '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 160, true, true),
  ('sp12', 'Training', 'Arsenal adidas Goalkeeper Gloves', 'Goalkeeper Gloves: the gear the squad trains in at Sobha Realty Training Centre.', 45, 58, null, null, 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop']::text[], null, array['7', '8', '9', '10', '11']::text[], false, 15, 20, null, null, 'adidas', null, null, 'unisex', null, null, '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 159, true, true),
  ('tr-football', 'Training', 'Arsenal adidas 26/27 Home Football Size 5', '26/27 Home Football Size 5: the gear the squad trains in at Sobha Realty Training Centre.', 22, 25, null, null, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], null, array['Size 5']::text[], false, 15, 20, 'Best Seller', null, 'adidas', null, null, 'unisex', null, null, '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 158, true, true),
  ('tr-mini-football', 'Training', 'Arsenal adidas 26/27 Mini Home Football Size 1', '26/27 Mini Home Football Size 1: the gear the squad trains in at Sobha Realty Training Centre.', 12, 15, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['Size 1']::text[], false, 15, 20, null, null, 'adidas', null, null, 'unisex', null, null, '{"bullets":["adidas AEROREADY fabric","Embroidered crest"],"material":"100% recycled polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 157, true, true),
  ('cl-cannon-tee', 'Training', 'Arsenal Cannon Graphic T-Shirt', 'Cannon Graphic T-Shirt in soft, everyday fabric with the club crest.', 25, 32, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 156, true, true),
  ('cl-crest-hoodie', 'Training', 'Arsenal Crest Hoodie', 'Crest Hoodie in soft, everyday fabric with the club crest.', 50, 65, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 155, true, true),
  ('cl-padded-jacket', 'Training', 'Arsenal Padded Jacket', 'Padded Jacket in soft, everyday fabric with the club crest.', 95, 120, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 154, true, true),
  ('cl-matchday-scarf-jacket', 'Training', 'Arsenal Matchday Rain Jacket', 'Matchday Rain Jacket in soft, everyday fabric with the club crest.', 70, 90, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 153, true, true),
  ('cl-womens-tee', 'Training', 'Arsenal Womens Script T-Shirt', 'Womens Script T-Shirt in soft, everyday fabric with the club crest.', 25, 32, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'womens', null, 'womens-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 152, true, true),
  ('cl-womens-hoodie', 'Training', 'Arsenal Womens Cropped Hoodie', 'Womens Cropped Hoodie in soft, everyday fabric with the club crest.', 50, 65, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'womens', null, 'womens-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 151, true, true),
  ('cl-womens-jacket', 'Training', 'Arsenal Womens Puffer Jacket', 'Womens Puffer Jacket in soft, everyday fabric with the club crest.', 95, 120, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'womens', null, 'womens-shirt', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 150, true, true),
  ('cl-kids-tee', 'Training', 'Arsenal Kids Cannon T-Shirt', 'Kids Cannon T-Shirt in soft, everyday fabric with the club crest.', 18, 24, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'kids', null, 'kids', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 149, true, true),
  ('cl-kids-hoodie', 'Training', 'Arsenal Kids Crest Hoodie', 'Kids Crest Hoodie in soft, everyday fabric with the club crest.', 35, 45, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'kids', null, 'kids', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 148, true, true),
  ('cl-baby-bodysuit', 'Training', 'Arsenal Baby Home Bodysuit', 'Baby Home Bodysuit in soft, everyday fabric with the club crest.', 18, 24, null, null, 'shirt:home', array['shirt:home']::text[], null, array['3-6M', '6-9M', '9-12M', '12-18M', '18-24M']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'baby', null, 'baby', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 147, true, true),
  ('cl-baby-kit', 'Training', 'Arsenal adidas 26/27 Home Baby Kit', 'adidas 26/27 Home Baby Kit in soft, everyday fabric with the club crest.', 45, 60, null, null, 'shirt:home', array['shirt:home']::text[], null, array['3-6M', '6-9M', '9-12M', '12-18M', '18-24M']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'baby', null, 'baby', '{"bullets":["Embroidered crest","Regular fit"],"material":"80% cotton, 20% polyester","care":"Machine wash at 30°C."}'::jsonb, true, 146, true, true),
  ('sp05', 'Retro', 'Arsenal 1991-93 Away "Bruised Banana" Shirt', 'The cult classic yellow and navy zigzag away shirt.', 65, 85, null, null, 'shirt:retro-9193', array['shirt:retro-9193']::text[], 'shirt:retro-9193:back', array['S', 'M', 'L', 'XL', '2XL']::text[], false, 15, 20, 'Heritage', null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Faithful recreation of the original","Embroidered vintage crest"],"material":"100% polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 320, true, true),
  ('rt-8889-home', 'Retro', 'Arsenal 1988-89 Home Shirt', 'The shirt from Anfield ’89 and the most dramatic title win of all.', 65, 85, null, null, 'shirt:retro-home', array['shirt:retro-home']::text[], 'shirt:retro-home:back', array['S', 'M', 'L', 'XL', '2XL']::text[], false, 15, 20, 'Heritage', null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Faithful recreation of the original","Embroidered vintage crest"],"material":"100% polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 320, true, true),
  ('rt-7172-away', 'Retro', 'Arsenal 1971 Double Away Shirt', 'Yellow and blue, as worn in the 1971 FA Cup final to seal the Double.', 65, 85, null, null, 'shirt:retro-7172', array['shirt:retro-7172']::text[], 'shirt:retro-7172:back', array['S', 'M', 'L', 'XL', '2XL']::text[], false, 15, 20, 'Heritage', null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Faithful recreation of the original","Embroidered vintage crest"],"material":"100% polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 320, true, true),
  ('rt-0304-home', 'Retro', 'Arsenal 2003-04 Invincibles Home Shirt', '49 unbeaten. The home shirt of the Invincibles season.', 65, 85, null, null, 'shirt:retro-home', array['shirt:retro-home']::text[], 'shirt:retro-home:back', array['S', 'M', 'L', 'XL', '2XL']::text[], false, 15, 20, 'Heritage', null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{"bullets":["Faithful recreation of the original","Embroidered vintage crest"],"material":"100% polyester","care":"If printed, do not wash for 24 hours. Wash inside out at 30°C. Iron inside out. Do not tumble dry."}'::jsonb, true, 320, true, true),
  ('sp09', 'Retro', 'Arsenal 1971 Double Winners Jacket', 'A heritage track jacket celebrating the first league and cup Double.', 75, 95, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['S', 'M', 'L', 'XL', '2XL']::text[], false, 15, 20, 'Limited', null, 'Arsenal', null, null, 'mens', null, 'adult-shirt', '{}'::jsonb, true, 141, true, true),
  ('sp06', 'Accessories', 'Arsenal Cannon Cuff Beanie', 'Cannon Cuff Beanie with the club crest.', 22, 28, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 140, true, true),
  ('sp10', 'Accessories', 'Arsenal Home Bar Scarf', 'Home Bar Scarf with the club crest.', 18, 24, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 139, true, true),
  ('ac-cap-red', 'Accessories', 'Arsenal ''47 Red Cap', '''47 Red Cap with the club crest.', 28, 35, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 138, true, true),
  ('ac-bobble', 'Accessories', 'Arsenal Bobble Hat', 'Bobble Hat with the club crest.', 18, 24, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 137, true, true),
  ('ac-gloves', 'Accessories', 'Arsenal Knitted Gloves', 'Knitted Gloves with the club crest.', 20, 25, null, null, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['S/M', 'L/XL']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 136, true, true),
  ('ac-backpack', 'Accessories', 'Arsenal adidas 26/27 Backpack', 'adidas 26/27 Backpack with the club crest.', 60, 60, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 135, true, true),
  ('ac-wallet', 'Accessories', 'Arsenal Leather Wallet', 'Leather Wallet with the club crest.', 25, 32, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 134, true, true),
  ('ac-socks-3pk', 'Accessories', 'Arsenal Socks 3 Pack', 'Socks 3 Pack with the club crest.', 15, 20, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['6-8', '9-11']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 133, true, true),
  ('ac-sliders', 'Accessories', 'Arsenal Crest Sliders', 'Crest Sliders with the club crest.', 25, 32, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['6', '7', '8', '9', '10', '11']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 132, true, true),
  ('ac-dog-shirt', 'Accessories', 'Arsenal Pet Football Shirt', 'Pet Football Shirt with the club crest.', 18, 24, null, null, 'shirt:home', array['shirt:home']::text[], null, array['XS', 'S', 'M', 'L']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 131, true, true),
  ('ac-dog-lead', 'Accessories', 'Arsenal Dog Lead', 'Dog Lead with the club crest.', 12, 16, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 130, true, true),
  ('mem-signed-shirt', 'Accessories', 'Signed 26/27 Home Shirt – First Team Squad', 'Signed 26/27 Home Shirt – First Team Squad. Supplied with a certificate of authenticity.', 450, 575, null, null, 'shirt:home:back', array['shirt:home:back']::text[], null, array['One Size']::text[], false, 15, 20, 'Limited', null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, false, 129, false, true),
  ('mem-signed-ball', 'Accessories', 'Signed Football – Arsenal Women', 'Signed Football – Arsenal Women. Supplied with a certificate of authenticity.', 150, 190, null, null, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, 'Limited', null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, false, 128, false, true),
  ('mem-legends-print', 'Accessories', 'Invincibles 49 Unbeaten Framed Print', 'Invincibles 49 Unbeaten Framed Print. Supplied with a certificate of authenticity.', 85, 110, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, false, 127, false, true),
  ('mem-emirates-print', 'Accessories', 'Emirates Stadium Panoramic Print', 'Emirates Stadium Panoramic Print. Supplied with a certificate of authenticity.', 45, 60, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, false, 126, false, true),
  ('mem-trophy-replica', 'Accessories', 'Premier League Trophy Replica 1:3', 'Premier League Trophy Replica 1:3. Supplied with a certificate of authenticity.', 95, 120, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, 'Champions', null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, false, 125, false, true),
  ('sp11', 'Accessories', 'Arsenal Crest Football', 'Crest Football, a gift for any Gooner.', 20, 26, null, null, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 124, true, true),
  ('gf-mug', 'Accessories', 'Arsenal Crest Mug', 'Crest Mug, a gift for any Gooner.', 10, 14, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 123, true, true),
  ('gf-stanley', 'Accessories', 'Arsenal Stanley Quencher 40oz', 'Stanley Quencher 40oz, a gift for any Gooner.', 45, 55, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 122, true, true),
  ('gf-pint', 'Accessories', 'Arsenal Pint Glass', 'Pint Glass, a gift for any Gooner.', 10, 14, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 121, true, true),
  ('gf-teddy', 'Accessories', 'Arsenal Gunnersaurus Soft Toy', 'Gunnersaurus Soft Toy, a gift for any Gooner.', 18, 24, null, null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 120, true, true),
  ('gf-lego', 'Accessories', 'Arsenal Emirates Stadium Building Set', 'Emirates Stadium Building Set, a gift for any Gooner.', 60, 80, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 119, true, true),
  ('gf-badge', 'Accessories', 'Arsenal Cannon Pin Badge', 'Cannon Pin Badge, a gift for any Gooner.', 5, 7, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 118, true, true),
  ('gf-flag', 'Accessories', 'Arsenal Crest Flag 5x3', 'Crest Flag 5x3, a gift for any Gooner.', 15, 20, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 117, true, true),
  ('gf-annual', 'Accessories', 'The Official Arsenal Annual 2027', 'The Official Annual 2027, a gift for any Gooner.', 10, 14, null, null, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 116, true, true),
  ('gf-giftcard', 'Accessories', 'Arsenal Direct Gift Card', 'Direct Gift Card, a gift for any Gooner.', 25, 30, null, null, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], null, array['One Size']::text[], false, 15, 20, null, null, 'Arsenal', null, null, 'unisex', null, null, '{}'::jsonb, true, 115, false, true),
  ('out-2526-home', 'Kits', 'Arsenal adidas 25/26 Home Shirt', 'Arsenal adidas 25/26 Home Shirt. Last season’s favourite, now reduced.', 50, 60, 85, 100, 'shirt:home', array['shirt:home']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, 'Outlet', null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{}'::jsonb, true, 114, false, true),
  ('out-2526-away', 'Kits', 'Arsenal adidas 25/26 Away Shirt', 'Arsenal adidas 25/26 Away Shirt. Last season’s favourite, now reduced.', 42, 50, 85, 100, 'shirt:away', array['shirt:away']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, 'Outlet', null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{}'::jsonb, true, 113, false, true),
  ('out-2526-training', 'Kits', 'Arsenal adidas 25/26 Training Top', 'Arsenal adidas 25/26 Training Top. Last season’s favourite, now reduced.', 35, 45, 60, 75, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[], false, 15, 20, 'Outlet', null, 'adidas', null, null, 'mens', null, 'adult-shirt', '{}'::jsonb, true, 112, false, true),
  ('out-womens-jacket', 'Kits', 'Arsenal Womens 25/26 Anthem Jacket', 'Arsenal Womens 25/26 Anthem Jacket. Last season’s favourite, now reduced.', 45, 55, 85, 100, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], null, array['XS', 'S', 'M', 'L', 'XL']::text[], false, 15, 20, 'Outlet', null, 'adidas', null, null, 'womens', null, 'womens-shirt', '{}'::jsonb, true, 111, false, true)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  description = excluded.description,
  price_gbp = excluded.price_gbp,
  price_usd = excluded.price_usd,
  compare_at_price_gbp = excluded.compare_at_price_gbp,
  compare_at_price_usd = excluded.compare_at_price_usd,
  main_image_url = excluded.main_image_url,
  gallery_urls = excluded.gallery_urls,
  back_image_url = excluded.back_image_url,
  sizes = excluded.sizes,
  is_customizable = excluded.is_customizable,
  customisation_price_gbp = excluded.customisation_price_gbp,
  customisation_price_usd = excluded.customisation_price_usd,
  badge = excluded.badge,
  external_buy_url = excluded.external_buy_url,
  brand = excluded.brand,
  family_id = excluded.family_id,
  kit_role = excluded.kit_role,
  profile = excluded.profile,
  profile_group_id = excluded.profile_group_id,
  size_chart_id = excluded.size_chart_id,
  details = excluded.details,
  returnable = excluded.returnable,
  popularity = excluded.popularity,
  member_discount_eligible = excluded.member_discount_eligible,
  is_active = excluded.is_active;

insert into public.store_product_variants (product_id, size, sku, stock, position)
values
  ('kit-home-shirt-m', 'XS', 'KIT-HOME-SHIRT-M-XS', 40, 1),
  ('kit-home-shirt-m', 'S', 'KIT-HOME-SHIRT-M-S', 40, 2),
  ('kit-home-shirt-m', 'M', 'KIT-HOME-SHIRT-M-M', 40, 3),
  ('kit-home-shirt-m', 'L', 'KIT-HOME-SHIRT-M-L', 4, 4),
  ('kit-home-shirt-m', 'XL', 'KIT-HOME-SHIRT-M-XL', 0, 5),
  ('kit-home-shirt-m', '2XL', 'KIT-HOME-SHIRT-M-2XL', 40, 6),
  ('kit-home-shirt-m', '3XL', 'KIT-HOME-SHIRT-M-3XL', 0, 7),
  ('kit-home-shirt-w', 'XS', 'KIT-HOME-SHIRT-W-XS', 40, 1),
  ('kit-home-shirt-w', 'S', 'KIT-HOME-SHIRT-W-S', 40, 2),
  ('kit-home-shirt-w', 'M', 'KIT-HOME-SHIRT-W-M', 40, 3),
  ('kit-home-shirt-w', 'L', 'KIT-HOME-SHIRT-W-L', 40, 4),
  ('kit-home-shirt-w', 'XL', 'KIT-HOME-SHIRT-W-XL', 40, 5),
  ('kit-home-shirt-k', '5-6Y', 'KIT-HOME-SHIRT-K-5-6Y', 40, 1),
  ('kit-home-shirt-k', '7-8Y', 'KIT-HOME-SHIRT-K-7-8Y', 40, 2),
  ('kit-home-shirt-k', '9-10Y', 'KIT-HOME-SHIRT-K-9-10Y', 40, 3),
  ('kit-home-shirt-k', '11-12Y', 'KIT-HOME-SHIRT-K-11-12Y', 40, 4),
  ('kit-home-shirt-k', '13-14Y', 'KIT-HOME-SHIRT-K-13-14Y', 40, 5),
  ('sp01', 'XS', 'SP01-XS', 40, 1),
  ('sp01', 'S', 'SP01-S', 40, 2),
  ('sp01', 'M', 'SP01-M', 40, 3),
  ('sp01', 'L', 'SP01-L', 3, 4),
  ('sp01', 'XL', 'SP01-XL', 40, 5),
  ('sp01', '2XL', 'SP01-2XL', 40, 6),
  ('sp01', '3XL', 'SP01-3XL', 0, 7),
  ('kit-home-authentic-w', 'XS', 'KIT-HOME-AUTHENTIC-W-XS', 40, 1),
  ('kit-home-authentic-w', 'S', 'KIT-HOME-AUTHENTIC-W-S', 40, 2),
  ('kit-home-authentic-w', 'M', 'KIT-HOME-AUTHENTIC-W-M', 40, 3),
  ('kit-home-authentic-w', 'L', 'KIT-HOME-AUTHENTIC-W-L', 40, 4),
  ('kit-home-authentic-w', 'XL', 'KIT-HOME-AUTHENTIC-W-XL', 40, 5),
  ('kit-home-shorts-m', 'XS', 'KIT-HOME-SHORTS-M-XS', 40, 1),
  ('kit-home-shorts-m', 'S', 'KIT-HOME-SHORTS-M-S', 40, 2),
  ('kit-home-shorts-m', 'M', 'KIT-HOME-SHORTS-M-M', 40, 3),
  ('kit-home-shorts-m', 'L', 'KIT-HOME-SHORTS-M-L', 40, 4),
  ('kit-home-shorts-m', 'XL', 'KIT-HOME-SHORTS-M-XL', 40, 5),
  ('kit-home-shorts-m', '2XL', 'KIT-HOME-SHORTS-M-2XL', 40, 6),
  ('kit-home-shorts-m', '3XL', 'KIT-HOME-SHORTS-M-3XL', 40, 7),
  ('kit-home-socks', 'S', 'KIT-HOME-SOCKS-S', 40, 1),
  ('kit-home-socks', 'M', 'KIT-HOME-SOCKS-M', 40, 2),
  ('kit-home-socks', 'L', 'KIT-HOME-SOCKS-L', 40, 3),
  ('sp07', '2-3Y', 'SP07-2-3Y', 40, 1),
  ('sp07', '3-4Y', 'SP07-3-4Y', 40, 2),
  ('sp07', '4-5Y', 'SP07-4-5Y', 40, 3),
  ('sp07', '5-6Y', 'SP07-5-6Y', 40, 4),
  ('sp02', 'XS', 'SP02-XS', 40, 1),
  ('sp02', 'S', 'SP02-S', 40, 2),
  ('sp02', 'M', 'SP02-M', 40, 3),
  ('sp02', 'L', 'SP02-L', 40, 4),
  ('sp02', 'XL', 'SP02-XL', 40, 5),
  ('sp02', '2XL', 'SP02-2XL', 40, 6),
  ('sp02', '3XL', 'SP02-3XL', 40, 7),
  ('kit-away-shirt-w', 'XS', 'KIT-AWAY-SHIRT-W-XS', 2, 1),
  ('kit-away-shirt-w', 'S', 'KIT-AWAY-SHIRT-W-S', 40, 2),
  ('kit-away-shirt-w', 'M', 'KIT-AWAY-SHIRT-W-M', 40, 3),
  ('kit-away-shirt-w', 'L', 'KIT-AWAY-SHIRT-W-L', 40, 4),
  ('kit-away-shirt-w', 'XL', 'KIT-AWAY-SHIRT-W-XL', 40, 5),
  ('kit-away-shirt-k', '5-6Y', 'KIT-AWAY-SHIRT-K-5-6Y', 40, 1),
  ('kit-away-shirt-k', '7-8Y', 'KIT-AWAY-SHIRT-K-7-8Y', 40, 2),
  ('kit-away-shirt-k', '9-10Y', 'KIT-AWAY-SHIRT-K-9-10Y', 40, 3),
  ('kit-away-shirt-k', '11-12Y', 'KIT-AWAY-SHIRT-K-11-12Y', 40, 4),
  ('kit-away-shirt-k', '13-14Y', 'KIT-AWAY-SHIRT-K-13-14Y', 40, 5),
  ('kit-away-authentic-m', 'XS', 'KIT-AWAY-AUTHENTIC-M-XS', 40, 1),
  ('kit-away-authentic-m', 'S', 'KIT-AWAY-AUTHENTIC-M-S', 40, 2),
  ('kit-away-authentic-m', 'M', 'KIT-AWAY-AUTHENTIC-M-M', 40, 3),
  ('kit-away-authentic-m', 'L', 'KIT-AWAY-AUTHENTIC-M-L', 40, 4),
  ('kit-away-authentic-m', 'XL', 'KIT-AWAY-AUTHENTIC-M-XL', 40, 5),
  ('kit-away-authentic-m', '2XL', 'KIT-AWAY-AUTHENTIC-M-2XL', 40, 6),
  ('kit-away-authentic-m', '3XL', 'KIT-AWAY-AUTHENTIC-M-3XL', 40, 7),
  ('kit-away-authentic-w', 'XS', 'KIT-AWAY-AUTHENTIC-W-XS', 40, 1),
  ('kit-away-authentic-w', 'S', 'KIT-AWAY-AUTHENTIC-W-S', 40, 2),
  ('kit-away-authentic-w', 'M', 'KIT-AWAY-AUTHENTIC-W-M', 40, 3),
  ('kit-away-authentic-w', 'L', 'KIT-AWAY-AUTHENTIC-W-L', 40, 4),
  ('kit-away-authentic-w', 'XL', 'KIT-AWAY-AUTHENTIC-W-XL', 40, 5),
  ('kit-away-shorts-m', 'XS', 'KIT-AWAY-SHORTS-M-XS', 40, 1),
  ('kit-away-shorts-m', 'S', 'KIT-AWAY-SHORTS-M-S', 40, 2),
  ('kit-away-shorts-m', 'M', 'KIT-AWAY-SHORTS-M-M', 40, 3),
  ('kit-away-shorts-m', 'L', 'KIT-AWAY-SHORTS-M-L', 40, 4),
  ('kit-away-shorts-m', 'XL', 'KIT-AWAY-SHORTS-M-XL', 40, 5),
  ('kit-away-shorts-m', '2XL', 'KIT-AWAY-SHORTS-M-2XL', 40, 6),
  ('kit-away-shorts-m', '3XL', 'KIT-AWAY-SHORTS-M-3XL', 40, 7),
  ('kit-away-socks', 'S', 'KIT-AWAY-SOCKS-S', 40, 1),
  ('kit-away-socks', 'M', 'KIT-AWAY-SOCKS-M', 40, 2),
  ('kit-away-socks', 'L', 'KIT-AWAY-SOCKS-L', 40, 3),
  ('kit-away-minikit', '2-3Y', 'KIT-AWAY-MINIKIT-2-3Y', 40, 1),
  ('kit-away-minikit', '3-4Y', 'KIT-AWAY-MINIKIT-3-4Y', 40, 2),
  ('kit-away-minikit', '4-5Y', 'KIT-AWAY-MINIKIT-4-5Y', 40, 3),
  ('kit-away-minikit', '5-6Y', 'KIT-AWAY-MINIKIT-5-6Y', 40, 4),
  ('sp03', 'XS', 'SP03-XS', 0, 1),
  ('sp03', 'S', 'SP03-S', 40, 2),
  ('sp03', 'M', 'SP03-M', 40, 3),
  ('sp03', 'L', 'SP03-L', 40, 4),
  ('sp03', 'XL', 'SP03-XL', 40, 5),
  ('sp03', '2XL', 'SP03-2XL', 40, 6),
  ('sp03', '3XL', 'SP03-3XL', 40, 7),
  ('kit-third-shirt-w', 'XS', 'KIT-THIRD-SHIRT-W-XS', 40, 1),
  ('kit-third-shirt-w', 'S', 'KIT-THIRD-SHIRT-W-S', 40, 2),
  ('kit-third-shirt-w', 'M', 'KIT-THIRD-SHIRT-W-M', 40, 3),
  ('kit-third-shirt-w', 'L', 'KIT-THIRD-SHIRT-W-L', 40, 4),
  ('kit-third-shirt-w', 'XL', 'KIT-THIRD-SHIRT-W-XL', 40, 5),
  ('kit-third-shirt-k', '5-6Y', 'KIT-THIRD-SHIRT-K-5-6Y', 40, 1),
  ('kit-third-shirt-k', '7-8Y', 'KIT-THIRD-SHIRT-K-7-8Y', 40, 2),
  ('kit-third-shirt-k', '9-10Y', 'KIT-THIRD-SHIRT-K-9-10Y', 40, 3),
  ('kit-third-shirt-k', '11-12Y', 'KIT-THIRD-SHIRT-K-11-12Y', 40, 4),
  ('kit-third-shirt-k', '13-14Y', 'KIT-THIRD-SHIRT-K-13-14Y', 40, 5),
  ('kit-third-authentic-m', 'XS', 'KIT-THIRD-AUTHENTIC-M-XS', 40, 1),
  ('kit-third-authentic-m', 'S', 'KIT-THIRD-AUTHENTIC-M-S', 40, 2),
  ('kit-third-authentic-m', 'M', 'KIT-THIRD-AUTHENTIC-M-M', 40, 3),
  ('kit-third-authentic-m', 'L', 'KIT-THIRD-AUTHENTIC-M-L', 40, 4),
  ('kit-third-authentic-m', 'XL', 'KIT-THIRD-AUTHENTIC-M-XL', 40, 5),
  ('kit-third-authentic-m', '2XL', 'KIT-THIRD-AUTHENTIC-M-2XL', 40, 6),
  ('kit-third-authentic-m', '3XL', 'KIT-THIRD-AUTHENTIC-M-3XL', 40, 7),
  ('kit-third-authentic-w', 'XS', 'KIT-THIRD-AUTHENTIC-W-XS', 40, 1),
  ('kit-third-authentic-w', 'S', 'KIT-THIRD-AUTHENTIC-W-S', 40, 2),
  ('kit-third-authentic-w', 'M', 'KIT-THIRD-AUTHENTIC-W-M', 40, 3),
  ('kit-third-authentic-w', 'L', 'KIT-THIRD-AUTHENTIC-W-L', 40, 4),
  ('kit-third-authentic-w', 'XL', 'KIT-THIRD-AUTHENTIC-W-XL', 40, 5),
  ('kit-third-shorts-m', 'XS', 'KIT-THIRD-SHORTS-M-XS', 40, 1),
  ('kit-third-shorts-m', 'S', 'KIT-THIRD-SHORTS-M-S', 40, 2),
  ('kit-third-shorts-m', 'M', 'KIT-THIRD-SHORTS-M-M', 40, 3),
  ('kit-third-shorts-m', 'L', 'KIT-THIRD-SHORTS-M-L', 40, 4),
  ('kit-third-shorts-m', 'XL', 'KIT-THIRD-SHORTS-M-XL', 40, 5),
  ('kit-third-shorts-m', '2XL', 'KIT-THIRD-SHORTS-M-2XL', 40, 6),
  ('kit-third-shorts-m', '3XL', 'KIT-THIRD-SHORTS-M-3XL', 40, 7),
  ('kit-third-socks', 'S', 'KIT-THIRD-SOCKS-S', 40, 1),
  ('kit-third-socks', 'M', 'KIT-THIRD-SOCKS-M', 40, 2),
  ('kit-third-socks', 'L', 'KIT-THIRD-SOCKS-L', 40, 3),
  ('kit-goalkeeper-shirt-m', 'XS', 'KIT-GOALKEEPER-SHIRT-M-XS', 40, 1),
  ('kit-goalkeeper-shirt-m', 'S', 'KIT-GOALKEEPER-SHIRT-M-S', 40, 2),
  ('kit-goalkeeper-shirt-m', 'M', 'KIT-GOALKEEPER-SHIRT-M-M', 40, 3),
  ('kit-goalkeeper-shirt-m', 'L', 'KIT-GOALKEEPER-SHIRT-M-L', 40, 4),
  ('kit-goalkeeper-shirt-m', 'XL', 'KIT-GOALKEEPER-SHIRT-M-XL', 40, 5),
  ('kit-goalkeeper-shirt-m', '2XL', 'KIT-GOALKEEPER-SHIRT-M-2XL', 40, 6),
  ('kit-goalkeeper-shirt-m', '3XL', 'KIT-GOALKEEPER-SHIRT-M-3XL', 40, 7),
  ('kit-goalkeeper-shirt-w', 'XS', 'KIT-GOALKEEPER-SHIRT-W-XS', 40, 1),
  ('kit-goalkeeper-shirt-w', 'S', 'KIT-GOALKEEPER-SHIRT-W-S', 40, 2),
  ('kit-goalkeeper-shirt-w', 'M', 'KIT-GOALKEEPER-SHIRT-W-M', 40, 3),
  ('kit-goalkeeper-shirt-w', 'L', 'KIT-GOALKEEPER-SHIRT-W-L', 40, 4),
  ('kit-goalkeeper-shirt-w', 'XL', 'KIT-GOALKEEPER-SHIRT-W-XL', 40, 5),
  ('kit-goalkeeper-shirt-k', '5-6Y', 'KIT-GOALKEEPER-SHIRT-K-5-6Y', 40, 1),
  ('kit-goalkeeper-shirt-k', '7-8Y', 'KIT-GOALKEEPER-SHIRT-K-7-8Y', 40, 2),
  ('kit-goalkeeper-shirt-k', '9-10Y', 'KIT-GOALKEEPER-SHIRT-K-9-10Y', 40, 3),
  ('kit-goalkeeper-shirt-k', '11-12Y', 'KIT-GOALKEEPER-SHIRT-K-11-12Y', 40, 4),
  ('kit-goalkeeper-shirt-k', '13-14Y', 'KIT-GOALKEEPER-SHIRT-K-13-14Y', 40, 5),
  ('kit-home-ls-m', 'XS', 'KIT-HOME-LS-M-XS', 40, 1),
  ('kit-home-ls-m', 'S', 'KIT-HOME-LS-M-S', 40, 2),
  ('kit-home-ls-m', 'M', 'KIT-HOME-LS-M-M', 40, 3),
  ('kit-home-ls-m', 'L', 'KIT-HOME-LS-M-L', 40, 4),
  ('kit-home-ls-m', 'XL', 'KIT-HOME-LS-M-XL', 40, 5),
  ('kit-home-ls-m', '2XL', 'KIT-HOME-LS-M-2XL', 40, 6),
  ('kit-home-ls-m', '3XL', 'KIT-HOME-LS-M-3XL', 40, 7),
  ('champions-home-shirt', 'XS', 'CHAMPIONS-HOME-SHIRT-XS', 40, 1),
  ('champions-home-shirt', 'S', 'CHAMPIONS-HOME-SHIRT-S', 40, 2),
  ('champions-home-shirt', 'M', 'CHAMPIONS-HOME-SHIRT-M', 40, 3),
  ('champions-home-shirt', 'L', 'CHAMPIONS-HOME-SHIRT-L', 40, 4),
  ('champions-home-shirt', 'XL', 'CHAMPIONS-HOME-SHIRT-XL', 40, 5),
  ('champions-home-shirt', '2XL', 'CHAMPIONS-HOME-SHIRT-2XL', 40, 6),
  ('champions-home-shirt', '3XL', 'CHAMPIONS-HOME-SHIRT-3XL', 40, 7),
  ('tr-prematch-jersey', 'XS', 'TR-PREMATCH-JERSEY-XS', 40, 1),
  ('tr-prematch-jersey', 'S', 'TR-PREMATCH-JERSEY-S', 40, 2),
  ('tr-prematch-jersey', 'M', 'TR-PREMATCH-JERSEY-M', 40, 3),
  ('tr-prematch-jersey', 'L', 'TR-PREMATCH-JERSEY-L', 40, 4),
  ('tr-prematch-jersey', 'XL', 'TR-PREMATCH-JERSEY-XL', 40, 5),
  ('tr-prematch-jersey', '2XL', 'TR-PREMATCH-JERSEY-2XL', 40, 6),
  ('tr-prematch-jersey', '3XL', 'TR-PREMATCH-JERSEY-3XL', 40, 7),
  ('tr-european-top', 'XS', 'TR-EUROPEAN-TOP-XS', 40, 1),
  ('tr-european-top', 'S', 'TR-EUROPEAN-TOP-S', 40, 2),
  ('tr-european-top', 'M', 'TR-EUROPEAN-TOP-M', 40, 3),
  ('tr-european-top', 'L', 'TR-EUROPEAN-TOP-L', 40, 4),
  ('tr-european-top', 'XL', 'TR-EUROPEAN-TOP-XL', 40, 5),
  ('tr-european-top', '2XL', 'TR-EUROPEAN-TOP-2XL', 40, 6),
  ('tr-european-top', '3XL', 'TR-EUROPEAN-TOP-3XL', 40, 7),
  ('tr-training-jersey-w', 'XS', 'TR-TRAINING-JERSEY-W-XS', 40, 1),
  ('tr-training-jersey-w', 'S', 'TR-TRAINING-JERSEY-W-S', 40, 2),
  ('tr-training-jersey-w', 'M', 'TR-TRAINING-JERSEY-W-M', 40, 3),
  ('tr-training-jersey-w', 'L', 'TR-TRAINING-JERSEY-W-L', 40, 4),
  ('tr-training-jersey-w', 'XL', 'TR-TRAINING-JERSEY-W-XL', 40, 5),
  ('tr-training-jersey-k', '5-6Y', 'TR-TRAINING-JERSEY-K-5-6Y', 40, 1),
  ('tr-training-jersey-k', '7-8Y', 'TR-TRAINING-JERSEY-K-7-8Y', 40, 2),
  ('tr-training-jersey-k', '9-10Y', 'TR-TRAINING-JERSEY-K-9-10Y', 40, 3),
  ('tr-training-jersey-k', '11-12Y', 'TR-TRAINING-JERSEY-K-11-12Y', 40, 4),
  ('tr-training-jersey-k', '13-14Y', 'TR-TRAINING-JERSEY-K-13-14Y', 40, 5),
  ('tr-anthem-jacket', 'XS', 'TR-ANTHEM-JACKET-XS', 40, 1),
  ('tr-anthem-jacket', 'S', 'TR-ANTHEM-JACKET-S', 40, 2),
  ('tr-anthem-jacket', 'M', 'TR-ANTHEM-JACKET-M', 40, 3),
  ('tr-anthem-jacket', 'L', 'TR-ANTHEM-JACKET-L', 40, 4),
  ('tr-anthem-jacket', 'XL', 'TR-ANTHEM-JACKET-XL', 40, 5),
  ('tr-anthem-jacket', '2XL', 'TR-ANTHEM-JACKET-2XL', 40, 6),
  ('tr-anthem-jacket', '3XL', 'TR-ANTHEM-JACKET-3XL', 40, 7),
  ('sp04', 'XS', 'SP04-XS', 40, 1),
  ('sp04', 'S', 'SP04-S', 40, 2),
  ('sp04', 'M', 'SP04-M', 40, 3),
  ('sp04', 'L', 'SP04-L', 40, 4),
  ('sp04', 'XL', 'SP04-XL', 40, 5),
  ('sp04', '2XL', 'SP04-2XL', 40, 6),
  ('sp04', '3XL', 'SP04-3XL', 40, 7),
  ('tr-travel-hoodie', 'XS', 'TR-TRAVEL-HOODIE-XS', 40, 1),
  ('tr-travel-hoodie', 'S', 'TR-TRAVEL-HOODIE-S', 40, 2),
  ('tr-travel-hoodie', 'M', 'TR-TRAVEL-HOODIE-M', 40, 3),
  ('tr-travel-hoodie', 'L', 'TR-TRAVEL-HOODIE-L', 40, 4),
  ('tr-travel-hoodie', 'XL', 'TR-TRAVEL-HOODIE-XL', 40, 5),
  ('tr-travel-hoodie', '2XL', 'TR-TRAVEL-HOODIE-2XL', 40, 6),
  ('tr-travel-hoodie', '3XL', 'TR-TRAVEL-HOODIE-3XL', 40, 7),
  ('tr-travel-pants', 'XS', 'TR-TRAVEL-PANTS-XS', 40, 1),
  ('tr-travel-pants', 'S', 'TR-TRAVEL-PANTS-S', 40, 2),
  ('tr-travel-pants', 'M', 'TR-TRAVEL-PANTS-M', 40, 3),
  ('tr-travel-pants', 'L', 'TR-TRAVEL-PANTS-L', 40, 4),
  ('tr-travel-pants', 'XL', 'TR-TRAVEL-PANTS-XL', 40, 5),
  ('tr-travel-pants', '2XL', 'TR-TRAVEL-PANTS-2XL', 40, 6),
  ('tr-travel-pants', '3XL', 'TR-TRAVEL-PANTS-3XL', 40, 7),
  ('tr-originals-tee', 'XS', 'TR-ORIGINALS-TEE-XS', 40, 1),
  ('tr-originals-tee', 'S', 'TR-ORIGINALS-TEE-S', 40, 2),
  ('tr-originals-tee', 'M', 'TR-ORIGINALS-TEE-M', 40, 3),
  ('tr-originals-tee', 'L', 'TR-ORIGINALS-TEE-L', 40, 4),
  ('tr-originals-tee', 'XL', 'TR-ORIGINALS-TEE-XL', 40, 5),
  ('tr-originals-tee', '2XL', 'TR-ORIGINALS-TEE-2XL', 40, 6),
  ('tr-originals-tee', '3XL', 'TR-ORIGINALS-TEE-3XL', 40, 7),
  ('tr-dna-hoodie', 'XS', 'TR-DNA-HOODIE-XS', 40, 1),
  ('tr-dna-hoodie', 'S', 'TR-DNA-HOODIE-S', 40, 2),
  ('tr-dna-hoodie', 'M', 'TR-DNA-HOODIE-M', 40, 3),
  ('tr-dna-hoodie', 'L', 'TR-DNA-HOODIE-L', 40, 4),
  ('tr-dna-hoodie', 'XL', 'TR-DNA-HOODIE-XL', 40, 5),
  ('tr-dna-hoodie', '2XL', 'TR-DNA-HOODIE-2XL', 40, 6),
  ('tr-dna-hoodie', '3XL', 'TR-DNA-HOODIE-3XL', 40, 7),
  ('sp08', 'XS', 'SP08-XS', 40, 1),
  ('sp08', 'S', 'SP08-S', 40, 2),
  ('sp08', 'M', 'SP08-M', 40, 3),
  ('sp08', 'L', 'SP08-L', 40, 4),
  ('sp08', 'XL', 'SP08-XL', 40, 5),
  ('sp08', '2XL', 'SP08-2XL', 40, 6),
  ('sp08', '3XL', 'SP08-3XL', 40, 7),
  ('tr-training-beanie', 'One Size', 'TR-TRAINING-BEANIE-ONESIZE', 40, 1),
  ('sp12', '7', 'SP12-7', 40, 1),
  ('sp12', '8', 'SP12-8', 40, 2),
  ('sp12', '9', 'SP12-9', 40, 3),
  ('sp12', '10', 'SP12-10', 40, 4),
  ('sp12', '11', 'SP12-11', 40, 5),
  ('tr-football', 'Size 5', 'TR-FOOTBALL-SIZE5', 40, 1),
  ('tr-mini-football', 'Size 1', 'TR-MINI-FOOTBALL-SIZE1', 40, 1),
  ('cl-cannon-tee', 'XS', 'CL-CANNON-TEE-XS', 40, 1),
  ('cl-cannon-tee', 'S', 'CL-CANNON-TEE-S', 40, 2),
  ('cl-cannon-tee', 'M', 'CL-CANNON-TEE-M', 40, 3),
  ('cl-cannon-tee', 'L', 'CL-CANNON-TEE-L', 40, 4),
  ('cl-cannon-tee', 'XL', 'CL-CANNON-TEE-XL', 40, 5),
  ('cl-cannon-tee', '2XL', 'CL-CANNON-TEE-2XL', 40, 6),
  ('cl-cannon-tee', '3XL', 'CL-CANNON-TEE-3XL', 40, 7),
  ('cl-crest-hoodie', 'XS', 'CL-CREST-HOODIE-XS', 40, 1),
  ('cl-crest-hoodie', 'S', 'CL-CREST-HOODIE-S', 40, 2),
  ('cl-crest-hoodie', 'M', 'CL-CREST-HOODIE-M', 40, 3),
  ('cl-crest-hoodie', 'L', 'CL-CREST-HOODIE-L', 40, 4),
  ('cl-crest-hoodie', 'XL', 'CL-CREST-HOODIE-XL', 40, 5),
  ('cl-crest-hoodie', '2XL', 'CL-CREST-HOODIE-2XL', 40, 6),
  ('cl-crest-hoodie', '3XL', 'CL-CREST-HOODIE-3XL', 40, 7),
  ('cl-padded-jacket', 'XS', 'CL-PADDED-JACKET-XS', 40, 1),
  ('cl-padded-jacket', 'S', 'CL-PADDED-JACKET-S', 40, 2),
  ('cl-padded-jacket', 'M', 'CL-PADDED-JACKET-M', 40, 3),
  ('cl-padded-jacket', 'L', 'CL-PADDED-JACKET-L', 40, 4),
  ('cl-padded-jacket', 'XL', 'CL-PADDED-JACKET-XL', 40, 5),
  ('cl-padded-jacket', '2XL', 'CL-PADDED-JACKET-2XL', 40, 6),
  ('cl-padded-jacket', '3XL', 'CL-PADDED-JACKET-3XL', 40, 7),
  ('cl-matchday-scarf-jacket', 'XS', 'CL-MATCHDAY-SCARF-JACKET-XS', 40, 1),
  ('cl-matchday-scarf-jacket', 'S', 'CL-MATCHDAY-SCARF-JACKET-S', 40, 2),
  ('cl-matchday-scarf-jacket', 'M', 'CL-MATCHDAY-SCARF-JACKET-M', 40, 3),
  ('cl-matchday-scarf-jacket', 'L', 'CL-MATCHDAY-SCARF-JACKET-L', 40, 4),
  ('cl-matchday-scarf-jacket', 'XL', 'CL-MATCHDAY-SCARF-JACKET-XL', 40, 5),
  ('cl-matchday-scarf-jacket', '2XL', 'CL-MATCHDAY-SCARF-JACKET-2XL', 40, 6),
  ('cl-matchday-scarf-jacket', '3XL', 'CL-MATCHDAY-SCARF-JACKET-3XL', 40, 7),
  ('cl-womens-tee', 'XS', 'CL-WOMENS-TEE-XS', 40, 1),
  ('cl-womens-tee', 'S', 'CL-WOMENS-TEE-S', 40, 2),
  ('cl-womens-tee', 'M', 'CL-WOMENS-TEE-M', 40, 3),
  ('cl-womens-tee', 'L', 'CL-WOMENS-TEE-L', 40, 4),
  ('cl-womens-tee', 'XL', 'CL-WOMENS-TEE-XL', 40, 5),
  ('cl-womens-hoodie', 'XS', 'CL-WOMENS-HOODIE-XS', 40, 1),
  ('cl-womens-hoodie', 'S', 'CL-WOMENS-HOODIE-S', 40, 2),
  ('cl-womens-hoodie', 'M', 'CL-WOMENS-HOODIE-M', 40, 3),
  ('cl-womens-hoodie', 'L', 'CL-WOMENS-HOODIE-L', 40, 4),
  ('cl-womens-hoodie', 'XL', 'CL-WOMENS-HOODIE-XL', 40, 5),
  ('cl-womens-jacket', 'XS', 'CL-WOMENS-JACKET-XS', 40, 1),
  ('cl-womens-jacket', 'S', 'CL-WOMENS-JACKET-S', 40, 2),
  ('cl-womens-jacket', 'M', 'CL-WOMENS-JACKET-M', 40, 3),
  ('cl-womens-jacket', 'L', 'CL-WOMENS-JACKET-L', 40, 4),
  ('cl-womens-jacket', 'XL', 'CL-WOMENS-JACKET-XL', 40, 5),
  ('cl-kids-tee', '5-6Y', 'CL-KIDS-TEE-5-6Y', 40, 1),
  ('cl-kids-tee', '7-8Y', 'CL-KIDS-TEE-7-8Y', 40, 2),
  ('cl-kids-tee', '9-10Y', 'CL-KIDS-TEE-9-10Y', 40, 3),
  ('cl-kids-tee', '11-12Y', 'CL-KIDS-TEE-11-12Y', 40, 4),
  ('cl-kids-tee', '13-14Y', 'CL-KIDS-TEE-13-14Y', 40, 5),
  ('cl-kids-hoodie', '5-6Y', 'CL-KIDS-HOODIE-5-6Y', 40, 1),
  ('cl-kids-hoodie', '7-8Y', 'CL-KIDS-HOODIE-7-8Y', 40, 2),
  ('cl-kids-hoodie', '9-10Y', 'CL-KIDS-HOODIE-9-10Y', 40, 3),
  ('cl-kids-hoodie', '11-12Y', 'CL-KIDS-HOODIE-11-12Y', 40, 4),
  ('cl-kids-hoodie', '13-14Y', 'CL-KIDS-HOODIE-13-14Y', 40, 5),
  ('cl-baby-bodysuit', '3-6M', 'CL-BABY-BODYSUIT-3-6M', 40, 1),
  ('cl-baby-bodysuit', '6-9M', 'CL-BABY-BODYSUIT-6-9M', 40, 2),
  ('cl-baby-bodysuit', '9-12M', 'CL-BABY-BODYSUIT-9-12M', 40, 3),
  ('cl-baby-bodysuit', '12-18M', 'CL-BABY-BODYSUIT-12-18M', 40, 4),
  ('cl-baby-bodysuit', '18-24M', 'CL-BABY-BODYSUIT-18-24M', 40, 5),
  ('cl-baby-kit', '3-6M', 'CL-BABY-KIT-3-6M', 40, 1),
  ('cl-baby-kit', '6-9M', 'CL-BABY-KIT-6-9M', 40, 2),
  ('cl-baby-kit', '9-12M', 'CL-BABY-KIT-9-12M', 40, 3),
  ('cl-baby-kit', '12-18M', 'CL-BABY-KIT-12-18M', 40, 4),
  ('cl-baby-kit', '18-24M', 'CL-BABY-KIT-18-24M', 40, 5),
  ('sp05', 'S', 'SP05-S', 40, 1),
  ('sp05', 'M', 'SP05-M', 40, 2),
  ('sp05', 'L', 'SP05-L', 40, 3),
  ('sp05', 'XL', 'SP05-XL', 40, 4),
  ('sp05', '2XL', 'SP05-2XL', 40, 5),
  ('rt-8889-home', 'S', 'RT-8889-HOME-S', 40, 1),
  ('rt-8889-home', 'M', 'RT-8889-HOME-M', 40, 2),
  ('rt-8889-home', 'L', 'RT-8889-HOME-L', 40, 3),
  ('rt-8889-home', 'XL', 'RT-8889-HOME-XL', 40, 4),
  ('rt-8889-home', '2XL', 'RT-8889-HOME-2XL', 40, 5),
  ('rt-7172-away', 'S', 'RT-7172-AWAY-S', 0, 1),
  ('rt-7172-away', 'M', 'RT-7172-AWAY-M', 40, 2),
  ('rt-7172-away', 'L', 'RT-7172-AWAY-L', 40, 3),
  ('rt-7172-away', 'XL', 'RT-7172-AWAY-XL', 40, 4),
  ('rt-7172-away', '2XL', 'RT-7172-AWAY-2XL', 40, 5),
  ('rt-0304-home', 'S', 'RT-0304-HOME-S', 40, 1),
  ('rt-0304-home', 'M', 'RT-0304-HOME-M', 40, 2),
  ('rt-0304-home', 'L', 'RT-0304-HOME-L', 40, 3),
  ('rt-0304-home', 'XL', 'RT-0304-HOME-XL', 40, 4),
  ('rt-0304-home', '2XL', 'RT-0304-HOME-2XL', 40, 5),
  ('sp09', 'S', 'SP09-S', 0, 1),
  ('sp09', 'M', 'SP09-M', 4, 2),
  ('sp09', 'L', 'SP09-L', 40, 3),
  ('sp09', 'XL', 'SP09-XL', 40, 4),
  ('sp09', '2XL', 'SP09-2XL', 40, 5),
  ('sp06', 'One Size', 'SP06-ONESIZE', 40, 1),
  ('sp10', 'One Size', 'SP10-ONESIZE', 40, 1),
  ('ac-cap-red', 'One Size', 'AC-CAP-RED-ONESIZE', 40, 1),
  ('ac-bobble', 'One Size', 'AC-BOBBLE-ONESIZE', 40, 1),
  ('ac-gloves', 'S/M', 'AC-GLOVES-SM', 40, 1),
  ('ac-gloves', 'L/XL', 'AC-GLOVES-LXL', 40, 2),
  ('ac-backpack', 'One Size', 'AC-BACKPACK-ONESIZE', 40, 1),
  ('ac-wallet', 'One Size', 'AC-WALLET-ONESIZE', 40, 1),
  ('ac-socks-3pk', '6-8', 'AC-SOCKS-3PK-6-8', 40, 1),
  ('ac-socks-3pk', '9-11', 'AC-SOCKS-3PK-9-11', 40, 2),
  ('ac-sliders', '6', 'AC-SLIDERS-6', 40, 1),
  ('ac-sliders', '7', 'AC-SLIDERS-7', 40, 2),
  ('ac-sliders', '8', 'AC-SLIDERS-8', 40, 3),
  ('ac-sliders', '9', 'AC-SLIDERS-9', 40, 4),
  ('ac-sliders', '10', 'AC-SLIDERS-10', 40, 5),
  ('ac-sliders', '11', 'AC-SLIDERS-11', 40, 6),
  ('ac-dog-shirt', 'XS', 'AC-DOG-SHIRT-XS', 40, 1),
  ('ac-dog-shirt', 'S', 'AC-DOG-SHIRT-S', 40, 2),
  ('ac-dog-shirt', 'M', 'AC-DOG-SHIRT-M', 40, 3),
  ('ac-dog-shirt', 'L', 'AC-DOG-SHIRT-L', 40, 4),
  ('ac-dog-lead', 'One Size', 'AC-DOG-LEAD-ONESIZE', 40, 1),
  ('mem-signed-shirt', 'One Size', 'MEM-SIGNED-SHIRT-ONESIZE', 3, 1),
  ('mem-signed-ball', 'One Size', 'MEM-SIGNED-BALL-ONESIZE', 40, 1),
  ('mem-legends-print', 'One Size', 'MEM-LEGENDS-PRINT-ONESIZE', 40, 1),
  ('mem-emirates-print', 'One Size', 'MEM-EMIRATES-PRINT-ONESIZE', 40, 1),
  ('mem-trophy-replica', 'One Size', 'MEM-TROPHY-REPLICA-ONESIZE', 40, 1),
  ('sp11', 'One Size', 'SP11-ONESIZE', 40, 1),
  ('gf-mug', 'One Size', 'GF-MUG-ONESIZE', 40, 1),
  ('gf-stanley', 'One Size', 'GF-STANLEY-ONESIZE', 40, 1),
  ('gf-pint', 'One Size', 'GF-PINT-ONESIZE', 40, 1),
  ('gf-teddy', 'One Size', 'GF-TEDDY-ONESIZE', 40, 1),
  ('gf-lego', 'One Size', 'GF-LEGO-ONESIZE', 40, 1),
  ('gf-badge', 'One Size', 'GF-BADGE-ONESIZE', 40, 1),
  ('gf-flag', 'One Size', 'GF-FLAG-ONESIZE', 40, 1),
  ('gf-annual', 'One Size', 'GF-ANNUAL-ONESIZE', 40, 1),
  ('gf-giftcard', 'One Size', 'GF-GIFTCARD-ONESIZE', 40, 1),
  ('out-2526-home', 'XS', 'OUT-2526-HOME-XS', 40, 1),
  ('out-2526-home', 'S', 'OUT-2526-HOME-S', 40, 2),
  ('out-2526-home', 'M', 'OUT-2526-HOME-M', 40, 3),
  ('out-2526-home', 'L', 'OUT-2526-HOME-L', 40, 4),
  ('out-2526-home', 'XL', 'OUT-2526-HOME-XL', 40, 5),
  ('out-2526-home', '2XL', 'OUT-2526-HOME-2XL', 40, 6),
  ('out-2526-home', '3XL', 'OUT-2526-HOME-3XL', 40, 7),
  ('out-2526-away', 'XS', 'OUT-2526-AWAY-XS', 40, 1),
  ('out-2526-away', 'S', 'OUT-2526-AWAY-S', 40, 2),
  ('out-2526-away', 'M', 'OUT-2526-AWAY-M', 40, 3),
  ('out-2526-away', 'L', 'OUT-2526-AWAY-L', 40, 4),
  ('out-2526-away', 'XL', 'OUT-2526-AWAY-XL', 40, 5),
  ('out-2526-away', '2XL', 'OUT-2526-AWAY-2XL', 40, 6),
  ('out-2526-away', '3XL', 'OUT-2526-AWAY-3XL', 40, 7),
  ('out-2526-training', 'XS', 'OUT-2526-TRAINING-XS', 40, 1),
  ('out-2526-training', 'S', 'OUT-2526-TRAINING-S', 40, 2),
  ('out-2526-training', 'M', 'OUT-2526-TRAINING-M', 40, 3),
  ('out-2526-training', 'L', 'OUT-2526-TRAINING-L', 40, 4),
  ('out-2526-training', 'XL', 'OUT-2526-TRAINING-XL', 40, 5),
  ('out-2526-training', '2XL', 'OUT-2526-TRAINING-2XL', 40, 6),
  ('out-2526-training', '3XL', 'OUT-2526-TRAINING-3XL', 40, 7),
  ('out-womens-jacket', 'XS', 'OUT-WOMENS-JACKET-XS', 40, 1),
  ('out-womens-jacket', 'S', 'OUT-WOMENS-JACKET-S', 40, 2),
  ('out-womens-jacket', 'M', 'OUT-WOMENS-JACKET-M', 40, 3),
  ('out-womens-jacket', 'L', 'OUT-WOMENS-JACKET-L', 40, 4),
  ('out-womens-jacket', 'XL', 'OUT-WOMENS-JACKET-XL', 40, 5)
on conflict (product_id, size) do update set
  sku = excluded.sku,
  position = excluded.position;

delete from public.store_product_categories;
insert into public.store_product_categories (product_id, category_id, position)
values
  ('kit-home-shirt-m', 'cat-home-kit', 0),
  ('kit-home-shirt-m', 'cat-kit', 1),
  ('kit-home-shirt-m', 'cat-mens-clothing', 2),
  ('kit-home-shirt-m', 'cat-best-sellers', 3),
  ('kit-home-shirt-m', 'cat-matchday', 4),
  ('kit-home-shirt-w', 'cat-home-kit', 0),
  ('kit-home-shirt-w', 'cat-kit', 1),
  ('kit-home-shirt-w', 'cat-womens-clothing', 2),
  ('kit-home-shirt-w', 'cat-awfc', 3),
  ('kit-home-shirt-k', 'cat-home-kit', 0),
  ('kit-home-shirt-k', 'cat-kit', 1),
  ('kit-home-shirt-k', 'cat-kids-clothing', 2),
  ('kit-home-shirt-k', 'cat-kids-kit', 3),
  ('sp01', 'cat-home-kit', 0),
  ('sp01', 'cat-kit', 1),
  ('sp01', 'cat-authentic-kit', 2),
  ('sp01', 'cat-as-seen-on-players', 3),
  ('kit-home-authentic-w', 'cat-home-kit', 0),
  ('kit-home-authentic-w', 'cat-kit', 1),
  ('kit-home-authentic-w', 'cat-authentic-kit', 2),
  ('kit-home-authentic-w', 'cat-awfc', 3),
  ('kit-home-shorts-m', 'cat-home-kit', 0),
  ('kit-home-shorts-m', 'cat-kit', 1),
  ('kit-home-socks', 'cat-home-kit', 0),
  ('kit-home-socks', 'cat-kit', 1),
  ('kit-home-socks', 'cat-underwear-socks', 2),
  ('sp07', 'cat-home-kit', 0),
  ('sp07', 'cat-kit', 1),
  ('sp07', 'cat-kids-kit', 2),
  ('sp07', 'cat-kids-clothing', 3),
  ('sp02', 'cat-away-kit', 0),
  ('sp02', 'cat-kit', 1),
  ('sp02', 'cat-mens-clothing', 2),
  ('sp02', 'cat-best-sellers', 3),
  ('sp02', 'cat-matchday', 4),
  ('kit-away-shirt-w', 'cat-away-kit', 0),
  ('kit-away-shirt-w', 'cat-kit', 1),
  ('kit-away-shirt-w', 'cat-womens-clothing', 2),
  ('kit-away-shirt-w', 'cat-awfc', 3),
  ('kit-away-shirt-k', 'cat-away-kit', 0),
  ('kit-away-shirt-k', 'cat-kit', 1),
  ('kit-away-shirt-k', 'cat-kids-clothing', 2),
  ('kit-away-shirt-k', 'cat-kids-kit', 3),
  ('kit-away-authentic-m', 'cat-away-kit', 0),
  ('kit-away-authentic-m', 'cat-kit', 1),
  ('kit-away-authentic-m', 'cat-authentic-kit', 2),
  ('kit-away-authentic-m', 'cat-as-seen-on-players', 3),
  ('kit-away-authentic-w', 'cat-away-kit', 0),
  ('kit-away-authentic-w', 'cat-kit', 1),
  ('kit-away-authentic-w', 'cat-authentic-kit', 2),
  ('kit-away-authentic-w', 'cat-awfc', 3),
  ('kit-away-shorts-m', 'cat-away-kit', 0),
  ('kit-away-shorts-m', 'cat-kit', 1),
  ('kit-away-socks', 'cat-away-kit', 0),
  ('kit-away-socks', 'cat-kit', 1),
  ('kit-away-socks', 'cat-underwear-socks', 2),
  ('kit-away-minikit', 'cat-away-kit', 0),
  ('kit-away-minikit', 'cat-kit', 1),
  ('kit-away-minikit', 'cat-kids-kit', 2),
  ('kit-away-minikit', 'cat-kids-clothing', 3),
  ('sp03', 'cat-third-kit', 0),
  ('sp03', 'cat-kit', 1),
  ('sp03', 'cat-mens-clothing', 2),
  ('sp03', 'cat-best-sellers', 3),
  ('sp03', 'cat-matchday', 4),
  ('kit-third-shirt-w', 'cat-third-kit', 0),
  ('kit-third-shirt-w', 'cat-kit', 1),
  ('kit-third-shirt-w', 'cat-womens-clothing', 2),
  ('kit-third-shirt-w', 'cat-awfc', 3),
  ('kit-third-shirt-k', 'cat-third-kit', 0),
  ('kit-third-shirt-k', 'cat-kit', 1),
  ('kit-third-shirt-k', 'cat-kids-clothing', 2),
  ('kit-third-shirt-k', 'cat-kids-kit', 3),
  ('kit-third-authentic-m', 'cat-third-kit', 0),
  ('kit-third-authentic-m', 'cat-kit', 1),
  ('kit-third-authentic-m', 'cat-authentic-kit', 2),
  ('kit-third-authentic-m', 'cat-as-seen-on-players', 3),
  ('kit-third-authentic-w', 'cat-third-kit', 0),
  ('kit-third-authentic-w', 'cat-kit', 1),
  ('kit-third-authentic-w', 'cat-authentic-kit', 2),
  ('kit-third-authentic-w', 'cat-awfc', 3),
  ('kit-third-shorts-m', 'cat-third-kit', 0),
  ('kit-third-shorts-m', 'cat-kit', 1),
  ('kit-third-socks', 'cat-third-kit', 0),
  ('kit-third-socks', 'cat-kit', 1),
  ('kit-third-socks', 'cat-underwear-socks', 2),
  ('kit-goalkeeper-shirt-m', 'cat-goalkeeper', 0),
  ('kit-goalkeeper-shirt-m', 'cat-kit', 1),
  ('kit-goalkeeper-shirt-m', 'cat-mens-clothing', 2),
  ('kit-goalkeeper-shirt-m', 'cat-best-sellers', 3),
  ('kit-goalkeeper-shirt-m', 'cat-matchday', 4),
  ('kit-goalkeeper-shirt-w', 'cat-goalkeeper', 0),
  ('kit-goalkeeper-shirt-w', 'cat-kit', 1),
  ('kit-goalkeeper-shirt-w', 'cat-womens-clothing', 2),
  ('kit-goalkeeper-shirt-w', 'cat-awfc', 3),
  ('kit-goalkeeper-shirt-k', 'cat-goalkeeper', 0),
  ('kit-goalkeeper-shirt-k', 'cat-kit', 1),
  ('kit-goalkeeper-shirt-k', 'cat-kids-clothing', 2),
  ('kit-goalkeeper-shirt-k', 'cat-kids-kit', 3),
  ('kit-home-ls-m', 'cat-home-kit', 0),
  ('kit-home-ls-m', 'cat-kit', 1),
  ('kit-home-ls-m', 'cat-cold-weather', 2),
  ('champions-home-shirt', 'cat-champions', 0),
  ('champions-home-shirt', 'cat-home-kit', 1),
  ('champions-home-shirt', 'cat-kit', 2),
  ('tr-prematch-jersey', 'cat-pre-match', 0),
  ('tr-prematch-jersey', 'cat-training', 1),
  ('tr-prematch-jersey', 'cat-mens-training', 2),
  ('tr-european-top', 'cat-european-range', 0),
  ('tr-european-top', 'cat-training', 1),
  ('tr-european-top', 'cat-mens-training', 2),
  ('tr-training-jersey-w', 'cat-womens-training', 0),
  ('tr-training-jersey-w', 'cat-training', 1),
  ('tr-training-jersey-w', 'cat-awfc', 2),
  ('tr-training-jersey-k', 'cat-kids-training', 0),
  ('tr-training-jersey-k', 'cat-training', 1),
  ('tr-training-jersey-k', 'cat-kids-clothing', 2),
  ('tr-anthem-jacket', 'cat-warm-up', 0),
  ('tr-anthem-jacket', 'cat-as-seen-on-players', 1),
  ('tr-anthem-jacket', 'cat-mens-jackets', 2),
  ('sp04', 'cat-pro-trainingwear', 0),
  ('sp04', 'cat-as-seen-on-players', 1),
  ('sp04', 'cat-mens-training', 2),
  ('tr-travel-hoodie', 'cat-tiro-travel', 0),
  ('tr-travel-hoodie', 'cat-travel-wear', 1),
  ('tr-travel-hoodie', 'cat-adidas-collections', 2),
  ('tr-travel-hoodie', 'cat-mens-sweatshirts', 3),
  ('tr-travel-pants', 'cat-tiro-travel', 0),
  ('tr-travel-pants', 'cat-travel-wear', 1),
  ('tr-travel-pants', 'cat-adidas-collections', 2),
  ('tr-originals-tee', 'cat-originals', 0),
  ('tr-originals-tee', 'cat-adidas-collections', 1),
  ('tr-originals-tee', 'cat-mens-tshirts', 2),
  ('tr-dna-hoodie', 'cat-dna-range', 0),
  ('tr-dna-hoodie', 'cat-adidas-collections', 1),
  ('tr-dna-hoodie', 'cat-mens-sweatshirts', 2),
  ('tr-dna-hoodie', 'cat-cold-weather', 3),
  ('sp08', 'cat-mens-training', 0),
  ('sp08', 'cat-training', 1),
  ('tr-training-beanie', 'cat-training-accs', 0),
  ('tr-training-beanie', 'cat-training', 1),
  ('tr-training-beanie', 'cat-accessories-hats-caps', 2),
  ('tr-training-beanie', 'cat-cold-weather', 3),
  ('sp12', 'cat-training-accs', 0),
  ('sp12', 'cat-goalkeeper', 1),
  ('tr-football', 'cat-training-accs', 0),
  ('tr-football', 'cat-toys', 1),
  ('tr-football', 'cat-best-sellers', 2),
  ('tr-mini-football', 'cat-training-accs', 0),
  ('tr-mini-football', 'cat-toys', 1),
  ('cl-cannon-tee', 'cat-mens-tshirts', 0),
  ('cl-cannon-tee', 'cat-mens-clothing', 1),
  ('cl-cannon-tee', 'cat-essentials', 2),
  ('cl-crest-hoodie', 'cat-mens-sweatshirts', 0),
  ('cl-crest-hoodie', 'cat-mens-clothing', 1),
  ('cl-crest-hoodie', 'cat-cold-weather', 2),
  ('cl-crest-hoodie', 'cat-classics', 3),
  ('cl-padded-jacket', 'cat-mens-jackets', 0),
  ('cl-padded-jacket', 'cat-mens-clothing', 1),
  ('cl-padded-jacket', 'cat-cold-weather', 2),
  ('cl-matchday-scarf-jacket', 'cat-mens-jackets', 0),
  ('cl-matchday-scarf-jacket', 'cat-matchday', 1),
  ('cl-womens-tee', 'cat-womens-tshirts', 0),
  ('cl-womens-tee', 'cat-womens-clothing', 1),
  ('cl-womens-tee', 'cat-awfc', 2),
  ('cl-womens-hoodie', 'cat-womens-sweatshirts', 0),
  ('cl-womens-hoodie', 'cat-womens-clothing', 1),
  ('cl-womens-hoodie', 'cat-cold-weather', 2),
  ('cl-womens-jacket', 'cat-womens-jackets', 0),
  ('cl-womens-jacket', 'cat-womens-clothing', 1),
  ('cl-womens-jacket', 'cat-cold-weather', 2),
  ('cl-kids-tee', 'cat-kids-tshirts', 0),
  ('cl-kids-tee', 'cat-kids-clothing', 1),
  ('cl-kids-hoodie', 'cat-kids-clothing', 0),
  ('cl-kids-hoodie', 'cat-cold-weather', 1),
  ('cl-baby-bodysuit', 'cat-baby', 0),
  ('cl-baby-bodysuit', 'cat-kids-clothing', 1),
  ('cl-baby-kit', 'cat-baby', 0),
  ('cl-baby-kit', 'cat-kids-kit', 1),
  ('cl-baby-kit', 'cat-home-kit', 2),
  ('sp05', 'cat-retro-shop', 0),
  ('sp05', 'cat-mens-retro', 1),
  ('sp05', 'cat-classics', 2),
  ('rt-8889-home', 'cat-retro-shop', 0),
  ('rt-8889-home', 'cat-mens-retro', 1),
  ('rt-8889-home', 'cat-classics', 2),
  ('rt-7172-away', 'cat-retro-shop', 0),
  ('rt-7172-away', 'cat-mens-retro', 1),
  ('rt-7172-away', 'cat-classics', 2),
  ('rt-0304-home', 'cat-retro-shop', 0),
  ('rt-0304-home', 'cat-mens-retro', 1),
  ('rt-0304-home', 'cat-classics', 2),
  ('sp09', 'cat-retro-shop', 0),
  ('sp09', 'cat-mens-jackets', 1),
  ('sp09', 'cat-special-collection', 2),
  ('sp06', 'cat-accessories-hats-caps', 0),
  ('sp06', 'cat-accessories', 1),
  ('sp06', 'cat-cold-weather', 2),
  ('sp10', 'cat-scarves', 0),
  ('sp10', 'cat-accessories', 1),
  ('sp10', 'cat-matchday', 2),
  ('sp10', 'cat-best-sellers', 3),
  ('ac-cap-red', 'cat-accessories-hats-caps', 0),
  ('ac-cap-red', 'cat-accessories', 1),
  ('ac-bobble', 'cat-accessories-hats-caps', 0),
  ('ac-bobble', 'cat-cold-weather', 1),
  ('ac-gloves', 'cat-scarves', 0),
  ('ac-gloves', 'cat-cold-weather', 1),
  ('ac-backpack', 'cat-bags', 0),
  ('ac-backpack', 'cat-accessories', 1),
  ('ac-wallet', 'cat-bags', 0),
  ('ac-wallet', 'cat-gifts', 1),
  ('ac-socks-3pk', 'cat-underwear-socks', 0),
  ('ac-socks-3pk', 'cat-accessories', 1),
  ('ac-sliders', 'cat-footwear', 0),
  ('ac-sliders', 'cat-accessories', 1),
  ('ac-dog-shirt', 'cat-pet', 0),
  ('ac-dog-shirt', 'cat-accessories', 1),
  ('ac-dog-lead', 'cat-pet', 0),
  ('mem-signed-shirt', 'cat-signature', 0),
  ('mem-signed-shirt', 'cat-memorabilia', 1),
  ('mem-signed-ball', 'cat-signature', 0),
  ('mem-signed-ball', 'cat-memorabilia', 1),
  ('mem-signed-ball', 'cat-awfc', 2),
  ('mem-legends-print', 'cat-legends', 0),
  ('mem-legends-print', 'cat-photography', 1),
  ('mem-legends-print', 'cat-memorabilia', 2),
  ('mem-emirates-print', 'cat-photography', 0),
  ('mem-emirates-print', 'cat-memorabilia', 1),
  ('mem-trophy-replica', 'cat-special-collection', 0),
  ('mem-trophy-replica', 'cat-champions', 1),
  ('mem-trophy-replica', 'cat-memorabilia', 2),
  ('sp11', 'cat-toys', 0),
  ('sp11', 'cat-gifts', 1),
  ('gf-mug', 'cat-home-car', 0),
  ('gf-mug', 'cat-gifts', 1),
  ('gf-mug', 'cat-best-sellers', 2),
  ('gf-stanley', 'cat-home-car', 0),
  ('gf-stanley', 'cat-gifts', 1),
  ('gf-pint', 'cat-home-car', 0),
  ('gf-pint', 'cat-gifts', 1),
  ('gf-teddy', 'cat-toys', 0),
  ('gf-teddy', 'cat-gifts', 1),
  ('gf-teddy', 'cat-kids-clothing', 2),
  ('gf-lego', 'cat-toys', 0),
  ('gf-lego', 'cat-gifts', 1),
  ('gf-badge', 'cat-souvenirs', 0),
  ('gf-badge', 'cat-gifts', 1),
  ('gf-flag', 'cat-souvenirs', 0),
  ('gf-flag', 'cat-matchday', 1),
  ('gf-annual', 'cat-books', 0),
  ('gf-annual', 'cat-gifts', 1),
  ('gf-giftcard', 'cat-gift-cards', 0),
  ('gf-giftcard', 'cat-gifts', 1),
  ('out-2526-home', 'cat-outlet', 0),
  ('out-2526-away', 'cat-outlet', 0),
  ('out-2526-training', 'cat-outlet', 0),
  ('out-womens-jacket', 'cat-outlet', 0)
;

insert into public.store_print_specials (id, label, number, position)
values
  ('champions-26', 'CHAMPIONS', '26', 1)
on conflict (id) do update set
  label = excluded.label,
  number = excluded.number,
  position = excluded.position;

insert into public.store_patches (id, name, price_gbp, price_usd, position)
values
  ('pl', 'Premier League', 10, 12, 1),
  ('ucl', 'Champions League', 11, 13, 2),
  ('wsl', 'WSL', 8, 10, 3),
  ('uwcl', 'Womens Champions League', 11, 13, 4),
  ('wcc', 'Womens Champions Cup', 8, 10, 5),
  ('wcc-uwcl', 'Womens Champions Cup + WCL', 20, 25, 6),
  ('wcc-wsl', 'Womens Champions Cup + WSL', 16, 20, 7)
on conflict (id) do update set
  name = excluded.name,
  price_gbp = excluded.price_gbp,
  price_usd = excluded.price_usd,
  position = excluded.position;

insert into public.store_print_options (product_id, team_type, player_price_gbp, player_price_usd, name_price_gbp, name_price_usd, number_price_gbp, number_price_usd, fonts)
values
  ('kit-home-shirt-m', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-home-shirt-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('kit-home-shirt-k', 'men', 12, 16, 6, 8, 6, 8, array['premier_league', 'arsenal']::text[]),
  ('sp01', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-home-authentic-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('sp07', 'men', 12, 16, 6, 8, 6, 8, array['premier_league', 'arsenal']::text[]),
  ('sp02', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-away-shirt-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('kit-away-shirt-k', 'men', 12, 16, 6, 8, 6, 8, array['premier_league', 'arsenal']::text[]),
  ('kit-away-authentic-m', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-away-authentic-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('kit-away-minikit', 'men', 12, 16, 6, 8, 6, 8, array['premier_league', 'arsenal']::text[]),
  ('sp03', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-third-shirt-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('kit-third-shirt-k', 'men', 12, 16, 6, 8, 6, 8, array['premier_league', 'arsenal']::text[]),
  ('kit-third-authentic-m', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-third-authentic-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('kit-goalkeeper-shirt-m', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[]),
  ('kit-goalkeeper-shirt-w', 'women', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'pride']::text[]),
  ('kit-goalkeeper-shirt-k', 'men', 12, 16, 6, 8, 6, 8, array['premier_league', 'arsenal']::text[]),
  ('kit-home-ls-m', 'men', 15, 20, 7.5, 10, 7.5, 10, array['premier_league', 'arsenal']::text[])
on conflict (product_id) do update set
  team_type = excluded.team_type,
  player_price_gbp = excluded.player_price_gbp,
  player_price_usd = excluded.player_price_usd,
  name_price_gbp = excluded.name_price_gbp,
  name_price_usd = excluded.name_price_usd,
  number_price_gbp = excluded.number_price_gbp,
  number_price_usd = excluded.number_price_usd,
  fonts = excluded.fonts;

delete from public.store_product_patches;
insert into public.store_product_patches (product_id, patch_id)
values
  ('kit-home-shirt-m', 'pl'),
  ('kit-home-shirt-m', 'ucl'),
  ('kit-home-shirt-w', 'wsl'),
  ('kit-home-shirt-w', 'uwcl'),
  ('kit-home-shirt-w', 'wcc'),
  ('kit-home-shirt-w', 'wcc-uwcl'),
  ('kit-home-shirt-w', 'wcc-wsl'),
  ('kit-home-shirt-k', 'pl'),
  ('kit-home-shirt-k', 'ucl'),
  ('sp01', 'pl'),
  ('sp01', 'ucl'),
  ('kit-home-authentic-w', 'wsl'),
  ('kit-home-authentic-w', 'uwcl'),
  ('kit-home-authentic-w', 'wcc'),
  ('kit-home-authentic-w', 'wcc-uwcl'),
  ('kit-home-authentic-w', 'wcc-wsl'),
  ('sp02', 'pl'),
  ('sp02', 'ucl'),
  ('kit-away-shirt-w', 'wsl'),
  ('kit-away-shirt-w', 'uwcl'),
  ('kit-away-shirt-w', 'wcc'),
  ('kit-away-shirt-w', 'wcc-uwcl'),
  ('kit-away-shirt-w', 'wcc-wsl'),
  ('kit-away-shirt-k', 'pl'),
  ('kit-away-shirt-k', 'ucl'),
  ('kit-away-authentic-m', 'pl'),
  ('kit-away-authentic-m', 'ucl'),
  ('kit-away-authentic-w', 'wsl'),
  ('kit-away-authentic-w', 'uwcl'),
  ('kit-away-authentic-w', 'wcc'),
  ('kit-away-authentic-w', 'wcc-uwcl'),
  ('kit-away-authentic-w', 'wcc-wsl'),
  ('sp03', 'pl'),
  ('sp03', 'ucl'),
  ('kit-third-shirt-w', 'wsl'),
  ('kit-third-shirt-w', 'uwcl'),
  ('kit-third-shirt-w', 'wcc'),
  ('kit-third-shirt-w', 'wcc-uwcl'),
  ('kit-third-shirt-w', 'wcc-wsl'),
  ('kit-third-shirt-k', 'pl'),
  ('kit-third-shirt-k', 'ucl'),
  ('kit-third-authentic-m', 'pl'),
  ('kit-third-authentic-m', 'ucl'),
  ('kit-third-authentic-w', 'wsl'),
  ('kit-third-authentic-w', 'uwcl'),
  ('kit-third-authentic-w', 'wcc'),
  ('kit-third-authentic-w', 'wcc-uwcl'),
  ('kit-third-authentic-w', 'wcc-wsl'),
  ('kit-goalkeeper-shirt-m', 'pl'),
  ('kit-goalkeeper-shirt-m', 'ucl'),
  ('kit-goalkeeper-shirt-w', 'wsl'),
  ('kit-goalkeeper-shirt-w', 'uwcl'),
  ('kit-goalkeeper-shirt-w', 'wcc'),
  ('kit-goalkeeper-shirt-w', 'wcc-uwcl'),
  ('kit-goalkeeper-shirt-w', 'wcc-wsl'),
  ('kit-goalkeeper-shirt-k', 'pl'),
  ('kit-goalkeeper-shirt-k', 'ucl'),
  ('kit-home-ls-m', 'pl'),
  ('kit-home-ls-m', 'ucl')
;

insert into public.store_promotions (id, title, percent_off, product_id, category_id, starts_at, ends_at, active)
values
  ('promo-away', '20% off selected lines', 20, null, 'cat-away-kit', null, null, true),
  ('promo-third', '20% off selected lines', 20, null, 'cat-third-kit', null, null, true),
  ('promo-winter', '20% off Winter Essentials', 20, null, 'cat-cold-weather', null, null, true),
  ('promo-backpack', '20% off', 20, 'ac-backpack', null, null, null, true)
on conflict (id) do update set
  title = excluded.title,
  percent_off = excluded.percent_off,
  product_id = excluded.product_id,
  category_id = excluded.category_id,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  active = excluded.active;

insert into public.store_shipping_rates (zone, method, label, eta, price_gbp, price_usd, free_over_gbp, free_over_usd, position)
values
  ('UK', 'standard', 'Standard delivery', '3-5 working days', 4.95, 6.5, 75, 100, 1),
  ('UK', 'express', 'Express delivery', '1-2 working days', 7.95, 10.5, null, null, 2),
  ('UK', 'nominated', 'Nominated day', 'Choose your day at dispatch', 9.95, 13, null, null, 3),
  ('EU', 'standard', 'Standard delivery', '5-8 working days', 9.95, 12.5, 150, 190, 1),
  ('EU', 'express', 'Express delivery', '2-4 working days', 19.95, 25, null, null, 2),
  ('US', 'standard', 'Standard delivery', '5-10 working days', 9.95, 12, 120, 150, 1),
  ('US', 'express', 'Express delivery', '2-4 working days', 19.95, 25, null, null, 2),
  ('ROW', 'standard', 'Standard delivery', '7-14 working days', 14.95, 19.95, 180, 230, 1),
  ('ROW', 'express', 'Express delivery', '3-6 working days', 29.95, 39, null, null, 2)
on conflict (zone, method) do update set
  label = excluded.label,
  eta = excluded.eta,
  price_gbp = excluded.price_gbp,
  price_usd = excluded.price_usd,
  free_over_gbp = excluded.free_over_gbp,
  free_over_usd = excluded.free_over_usd,
  position = excluded.position;

insert into public.gift_cards (code, currency, initial_balance, balance, expires_at, active)
values
  ('GOONERGIFT25', 'GBP', 25, 25, null, true),
  ('GOONERGIFT500', 'GBP', 500, 500, null, true),
  ('GOONERUSD50', 'USD', 50, 50, null, true)
on conflict (code) do update set
  currency = excluded.currency,
  initial_balance = excluded.initial_balance,
  expires_at = excluded.expires_at,
  active = excluded.active;

insert into public.store_reviews (id, product_id, user_id, author_name, country, rating, title, body, verified, helpful_count, unhelpful_count, created_at)
values
  ('rev-kit-home-shirt-m-1', 'kit-home-shirt-m', null, 'Kevin L.', 'GB', 5, 'Looks good. Feels good.', 'Looks good. Feels good. Is good.', true, 0, 0, '2026-09-20T00:00:00.000Z'),
  ('rev-kit-home-shirt-m-2', 'kit-home-shirt-m', null, 'Brian H.', 'GB', 5, 'Excellent product', 'The shirt was easy to order and arrived in good time. Very happy with it.', true, 3, 0, '2026-09-11T00:00:00.000Z'),
  ('rev-kit-home-shirt-m-3', 'kit-home-shirt-m', null, 'Gerard S.', 'IE', 5, 'New home shirt', 'Pretty good delivery to Ireland and the printing is spot on.', true, 6, 1, '2026-09-02T00:00:00.000Z'),
  ('rev-kit-home-shirt-m-4', 'kit-home-shirt-m', null, 'Jon J.', 'GB', 4, 'Great shirt, runs small', 'Lovely quality but I’d size up if you like a looser fit.', true, 0, 0, '2026-08-24T00:00:00.000Z'),
  ('rev-kit-home-shirt-m-5', 'kit-home-shirt-m', null, 'Mark C.', 'GB', 5, 'Perfect gift', 'Bought for my son’s birthday, he hasn’t taken it off since.', true, 3, 0, '2026-08-15T00:00:00.000Z'),
  ('rev-kit-home-shirt-m-6', 'kit-home-shirt-m', null, 'Priya K.', 'GB', 5, 'Brilliant printing', 'Name and number printed perfectly and it arrived within the week.', true, 6, 1, '2026-08-06T00:00:00.000Z'),
  ('rev-kit-home-shirt-m-7', 'kit-home-shirt-m', null, 'Sam T.', 'US', 4, 'Good quality', 'Nice material and colours. Delivery took a few days longer than expected.', true, 0, 0, '2026-07-28T00:00:00.000Z'),
  ('rev-sp01-1', 'sp01', null, 'Jon J.', 'GB', 5, 'Excellent product', 'The shirt was easy to order and arrived in good time. Very happy with it.', true, 1, 0, '2026-09-13T00:00:00.000Z'),
  ('rev-sp01-2', 'sp01', null, 'Mark C.', 'GB', 5, 'New home shirt', 'Pretty good delivery to Ireland and the printing is spot on.', true, 4, 0, '2026-09-04T00:00:00.000Z'),
  ('rev-sp01-3', 'sp01', null, 'Priya K.', 'GB', 4, 'Great shirt, runs small', 'Lovely quality but I’d size up if you like a looser fit.', true, 7, 1, '2026-08-26T00:00:00.000Z'),
  ('rev-sp01-4', 'sp01', null, 'Sam T.', 'US', 5, 'Perfect gift', 'Bought for my son’s birthday, he hasn’t taken it off since.', true, 1, 0, '2026-08-17T00:00:00.000Z'),
  ('rev-sp01-5', 'sp01', null, 'Aisha B.', 'GB', 5, 'Brilliant printing', 'Name and number printed perfectly and it arrived within the week.', true, 4, 0, '2026-08-08T00:00:00.000Z'),
  ('rev-sp01-6', 'sp01', null, 'Lars N.', 'NO', 4, 'Good quality', 'Nice material and colours. Delivery took a few days longer than expected.', true, 7, 1, '2026-07-30T00:00:00.000Z'),
  ('rev-sp01-7', 'sp01', null, 'Chidi O.', 'NG', 5, 'Looks good. Feels good.', 'Looks good. Feels good. Is good.', true, 1, 0, '2026-07-21T00:00:00.000Z'),
  ('rev-kit-home-shirt-w-1', 'kit-home-shirt-w', null, 'Sam T.', 'US', 5, 'New home shirt', 'Pretty good delivery to Ireland and the printing is spot on.', true, 2, 0, '2026-09-06T00:00:00.000Z'),
  ('rev-kit-home-shirt-w-2', 'kit-home-shirt-w', null, 'Aisha B.', 'GB', 4, 'Great shirt, runs small', 'Lovely quality but I’d size up if you like a looser fit.', true, 5, 0, '2026-08-28T00:00:00.000Z'),
  ('rev-kit-home-shirt-w-3', 'kit-home-shirt-w', null, 'Lars N.', 'NO', 5, 'Perfect gift', 'Bought for my son’s birthday, he hasn’t taken it off since.', true, 8, 1, '2026-08-19T00:00:00.000Z'),
  ('rev-kit-home-shirt-k-1', 'kit-home-shirt-k', null, 'Chidi O.', 'NG', 4, 'Great shirt, runs small', 'Lovely quality but I’d size up if you like a looser fit.', true, 3, 0, '2026-08-30T00:00:00.000Z'),
  ('rev-kit-home-shirt-k-2', 'kit-home-shirt-k', null, 'Kevin L.', 'GB', 5, 'Perfect gift', 'Bought for my son’s birthday, he hasn’t taken it off since.', true, 6, 0, '2026-08-21T00:00:00.000Z'),
  ('rev-kit-home-shirt-k-3', 'kit-home-shirt-k', null, 'Brian H.', 'GB', 5, 'Brilliant printing', 'Name and number printed perfectly and it arrived within the week.', true, 0, 1, '2026-08-12T00:00:00.000Z'),
  ('rev-sp02-1', 'sp02', null, 'Gerard S.', 'IE', 5, 'Perfect gift', 'Bought for my son’s birthday, he hasn’t taken it off since.', true, 4, 0, '2026-08-23T00:00:00.000Z'),
  ('rev-sp02-2', 'sp02', null, 'Jon J.', 'GB', 5, 'Brilliant printing', 'Name and number printed perfectly and it arrived within the week.', true, 7, 0, '2026-08-14T00:00:00.000Z'),
  ('rev-sp02-3', 'sp02', null, 'Mark C.', 'GB', 4, 'Good quality', 'Nice material and colours. Delivery took a few days longer than expected.', true, 1, 1, '2026-08-05T00:00:00.000Z'),
  ('rev-sp03-1', 'sp03', null, 'Priya K.', 'GB', 5, 'Brilliant printing', 'Name and number printed perfectly and it arrived within the week.', true, 5, 0, '2026-08-16T00:00:00.000Z'),
  ('rev-sp03-2', 'sp03', null, 'Sam T.', 'US', 4, 'Good quality', 'Nice material and colours. Delivery took a few days longer than expected.', true, 8, 0, '2026-08-07T00:00:00.000Z'),
  ('rev-sp03-3', 'sp03', null, 'Aisha B.', 'GB', 5, 'Looks good. Feels good.', 'Looks good. Feels good. Is good.', true, 2, 1, '2026-07-29T00:00:00.000Z'),
  ('rev-tr-football-1', 'tr-football', null, 'Lars N.', 'NO', 4, 'Good quality', 'Nice material and colours. Delivery took a few days longer than expected.', true, 6, 0, '2026-08-09T00:00:00.000Z'),
  ('rev-tr-football-2', 'tr-football', null, 'Chidi O.', 'NG', 5, 'Looks good. Feels good.', 'Looks good. Feels good. Is good.', true, 0, 0, '2026-07-31T00:00:00.000Z'),
  ('rev-tr-football-3', 'tr-football', null, 'Kevin L.', 'GB', 5, 'Excellent product', 'The shirt was easy to order and arrived in good time. Very happy with it.', true, 3, 1, '2026-07-22T00:00:00.000Z'),
  ('rev-sp10-1', 'sp10', null, 'Brian H.', 'GB', 5, 'Looks good. Feels good.', 'Looks good. Feels good. Is good.', true, 7, 0, '2026-08-02T00:00:00.000Z'),
  ('rev-sp10-2', 'sp10', null, 'Gerard S.', 'IE', 5, 'Excellent product', 'The shirt was easy to order and arrived in good time. Very happy with it.', true, 1, 0, '2026-07-24T00:00:00.000Z'),
  ('rev-sp10-3', 'sp10', null, 'Jon J.', 'GB', 5, 'New home shirt', 'Pretty good delivery to Ireland and the printing is spot on.', true, 4, 1, '2026-07-15T00:00:00.000Z'),
  ('rev-champions-home-shirt-1', 'champions-home-shirt', null, 'Mark C.', 'GB', 5, 'Excellent product', 'The shirt was easy to order and arrived in good time. Very happy with it.', true, 8, 0, '2026-07-26T00:00:00.000Z'),
  ('rev-champions-home-shirt-2', 'champions-home-shirt', null, 'Priya K.', 'GB', 5, 'New home shirt', 'Pretty good delivery to Ireland and the printing is spot on.', true, 2, 0, '2026-07-17T00:00:00.000Z'),
  ('rev-champions-home-shirt-3', 'champions-home-shirt', null, 'Sam T.', 'US', 4, 'Great shirt, runs small', 'Lovely quality but I’d size up if you like a looser fit.', true, 5, 1, '2026-07-08T00:00:00.000Z')
on conflict (id) do update set
  product_id = excluded.product_id,
  user_id = excluded.user_id,
  author_name = excluded.author_name,
  country = excluded.country,
  rating = excluded.rating,
  title = excluded.title,
  body = excluded.body,
  verified = excluded.verified,
  created_at = excluded.created_at;

insert into public.store_questions (id, product_id, user_id, author_name, question, answer, answered_at, created_at)
values
  ('q-home-fit', 'kit-home-shirt-m', null, 'Tom', 'Is this the same fit as last season’s shirt?', 'Yes, the 26/27 replica shirt has the same slim fit as 25/26. If you prefer a looser fit, go one size up.', '2026-08-02T10:00:00Z', '2026-08-01T09:00:00Z'),
  ('q-home-print', 'kit-home-shirt-m', null, 'Hannah', 'How long does printing add to delivery?', 'Printed shirts are dispatched within 2 working days, then standard delivery times apply.', '2026-08-10T10:00:00Z', '2026-08-09T15:00:00Z')
on conflict (id) do update set
  product_id = excluded.product_id,
  user_id = excluded.user_id,
  author_name = excluded.author_name,
  question = excluded.question,
  answer = excluded.answer,
  answered_at = excluded.answered_at,
  created_at = excluded.created_at;

insert into public.store_home_modules (id, kind, title, position, active, payload)
values
  ('hero', 'hero', '20% OFF (ALMOST) EVERYTHING', 1, true, '{"subtitle":"* Selected styles only. Exclusions apply.","cta":"Shop all","href":"/store/c/sale","background":"gradient"}'::jsonb),
  ('ticker', 'ticker', null, 2, true, '{"items":["Members get 10% off","Buy direct and support your club","FREE standard delivery on UK orders over £75","Printed to order in 2 working days"]}'::jsonb),
  ('tabs', 'product_tabs', null, 3, true, '{"tabs":[{"label":"20% off","source":"sale"},{"label":"New in","source":"new"}]}'::jsonb),
  ('adidas', 'collection_carousel', 'adidas Collections', 4, true, '{"items":[{"title":"Trainingwear - NEW","image":"shirt:training-euro","href":"/store/c/training"},{"title":"Third Kit - 20% off selected lines","image":"shirt:third","href":"/store/c/third-kit"},{"title":"Away Kit - 20% off selected lines","image":"shirt:away","href":"/store/c/away-kit"},{"title":"Home Kit","image":"shirt:home","href":"/store/c/home-kit"},{"title":"Travelwear","image":"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop","href":"/store/c/travel-wear"}]}'::jsonb),
  ('categories', 'category_carousel', 'Shop by Category', 5, true, '{"items":[{"title":"Stadium Tours","image":"https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop","href":"/store/tours"},{"title":"Autumn/Winter","image":"https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop","href":"/store/c/cold-weather"},{"title":"Kids","image":"https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop","href":"/store/c/kids-clothing"},{"title":"Champions 25/26","image":"shirt:home:back:champions","href":"/store/c/champions"},{"title":"Pets","image":"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop","href":"/store/c/pet"},{"title":"Match Day Collection","image":"https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop","href":"/store/c/matchday"},{"title":"Retro Classics Shirts","image":"shirt:retro-9193","href":"/store/c/retro-shop"}]}'::jsonb),
  ('players', 'player_carousel', 'Shop by Player', 6, true, '{"teams":["men","women"],"limit":12,"men_product":"kit-home-shirt-m","women_product":"kit-home-shirt-w"}'::jsonb),
  ('bestsellers', 'product_carousel', 'Best Sellers', 7, true, '{"category":"best-sellers"}'::jsonb),
  ('trust', 'trust', null, 8, true, '{}'::jsonb)
on conflict (id) do update set
  kind = excluded.kind,
  title = excluded.title,
  position = excluded.position,
  active = excluded.active,
  payload = excluded.payload;

insert into public.promo_codes (percent_off, amount_off_gbp, amount_off_usd, free_shipping, min_subtotal_gbp, min_subtotal_usd, code, description)
values
  (10, null, null, false, 0, 0, 'GOONER10', '10% off your order'),
  (null, 10, 13, false, 60, 80, 'NORTHLONDON', '£10 / $13 off orders over £60 / $80'),
  (null, null, null, true, 0, 0, 'FREESHIP', 'Free delivery')
on conflict (code) do update set
  percent_off = excluded.percent_off,
  amount_off_gbp = excluded.amount_off_gbp,
  amount_off_usd = excluded.amount_off_usd,
  free_shipping = excluded.free_shipping,
  min_subtotal_gbp = excluded.min_subtotal_gbp,
  min_subtotal_usd = excluded.min_subtotal_usd,
  description = excluded.description;

-- ----------------------------------------------------------------
-- Legal
-- ----------------------------------------------------------------
insert into public.legal_documents (slug, title, updated_at, body)
values
  ('terms', 'Terms Of Use', '2026-09-01T00:00:00Z', 'These terms apply to your use of The Arsenal app. By using the app you agree to them.

1. Your account
You must provide accurate details when you create an account and keep your password secure. You are responsible for activity on your account. You can delete your account at any time from Settings.

2. Content
Articles, videos, photos and match data in the app are provided for personal, non-commercial use. You may share links to content using the share options in the app, but you may not copy or redistribute the content itself.

3. Fan features
Reactions, polls, predictions and quizzes are for entertainment. We may remove votes or predictions that we believe were submitted unfairly.

4. Tickets and bookings
Ticket and tour purchases are subject to the terms shown at the point of sale. Seats allocated in the app are personal to you and may not be resold.

5. Changes
We may update these terms from time to time. The date at the top shows when they last changed.

Contact us from Settings if you have any questions.'),
  ('privacy', 'Privacy Policy', '2026-09-01T00:00:00Z', 'This policy explains what we collect when you use The Arsenal app and how we use it.

What we collect
• Account details: your name, email address and any profile details you add, such as phone number, date of birth, country and postcode.
• Preferences: your notification choices, favourite team, currency, language and calendar sync settings.
• Activity: reactions, poll votes, predictions, quiz scores, bookmarks, tickets and tour bookings.
• Diagnostics: anonymous crash and performance data used to improve the app.

How we use it
We use your data to run your account, personalise what you see (for example the For You feed), send the notifications you have switched on and deliver tickets and bookings.

Marketing
We only send marketing messages if you opt in under Personal Details. You can opt out at any time.

Your rights
You can view and edit your details in the app. Deleting your account from Settings permanently removes your profile and all associated activity.

Contact us from Settings to ask about your data.'),
  ('delivery', 'Delivery Information', '2026-09-01T00:00:00Z', 'We deliver worldwide from the club''s warehouse in London.

UK
Standard delivery (3-5 working days) is £4.95, or free on orders over £75. Express delivery (1-2 working days) is £7.95 and nominated day delivery is £9.95.

Europe
Standard delivery (5-8 working days) is £9.95, or free over £150. Express delivery (2-4 working days) is £19.95.

United States
Standard delivery (5-10 working days) is $12, or free over $150. Express delivery (2-4 working days) is $25.

Rest of the world
Standard delivery (7-14 working days) and express delivery (3-6 working days) are priced at checkout.

Printed items
Shirts printed with a name, number, patch or Champions print are dispatched within 2 working days, then the delivery times above apply.

Duties and taxes
Orders delivered outside the UK may be charged import duties and taxes by the destination country.'),
  ('returns', 'Returns & Refunds', '2026-09-01T00:00:00Z', 'We understand that sometimes things just don''t work out. If for any reason you are unhappy with your purchase, you can return it within 28 days of receipt.

How to return
Open My Orders in your account, choose the order and tap Request a return. Select the items and a reason, and we''ll email your return label.

Personalised items
We are unable to accept returns for items printed to your specification with a player''s name, a personalised name and/or squad number, a patch or Champions printing, unless they are faulty. Please check your personalisation details and size carefully before ordering.

Refunds
Refunds are made to your original payment method within 5 working days of your return arriving. Gift card payments are refunded to the gift card.

Faulty items
If an item is faulty, contact us from Settings and we''ll arrange a replacement or refund.')
on conflict (slug) do update set
  title = excluded.title,
  updated_at = excluded.updated_at,
  body = excluded.body;

commit;
