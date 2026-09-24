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
insert into public.store_products (id, category, title, description, price_gbp, price_usd, main_image_url, gallery_urls, sizes, is_customizable, badge, external_buy_url)
values
  ('sp01', 'Kits', 'Arsenal 26/27 Home Authentic Shirt', 'Engineered for peak performance at the Emirates: the iconic red body, crisp white sleeves and moisture-wicking HEAT.RDY technology.', 115, 145, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], array['S', 'M', 'L', 'XL', '2XL']::text[], true, 'New Season', 'https://arsenaldirect.arsenal.com'),
  ('sp02', 'Kits', 'Arsenal 26/27 Away Shirt', 'A modern away shirt with breathable AEROREADY fabric and a tonal cannon pattern.', 85, 110, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop']::text[], array['S', 'M', 'L', 'XL', '2XL']::text[], true, 'Away Kit', 'https://arsenaldirect.arsenal.com'),
  ('sp03', 'Kits', 'Arsenal 26/27 Third Shirt', 'A modern reimagining of 1990s flair with bold trims.', 85, 110, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop']::text[], array['S', 'M', 'L', 'XL']::text[], true, 'Third Kit', 'https://arsenaldirect.arsenal.com'),
  ('sp04', 'Training', 'Arsenal Pro Training Top', 'As worn by the squad at Sobha Realty Training Centre. Quarter-zip collar with thumbholes.', 70, 90, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop']::text[], array['XS', 'S', 'M', 'L', 'XL', '2XL']::text[], false, 'Training Wear', 'https://arsenaldirect.arsenal.com'),
  ('sp05', 'Retro', 'Arsenal 1991/93 "Bruised Banana" Away Shirt', 'The cult classic retro jersey with its iconic zigzag pattern.', 65, 85, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop']::text[], array['S', 'M', 'L', 'XL']::text[], false, 'Heritage', 'https://arsenaldirect.arsenal.com'),
  ('sp06', 'Accessories', 'Arsenal Cannon Cuff Beanie', 'Knitted beanie with the embroidered Arsenal cannon.', 22, 28, 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop', array['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop']::text[], array['One Size']::text[], false, null, 'https://arsenaldirect.arsenal.com')
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  description = excluded.description,
  price_gbp = excluded.price_gbp,
  price_usd = excluded.price_usd,
  main_image_url = excluded.main_image_url,
  gallery_urls = excluded.gallery_urls,
  sizes = excluded.sizes,
  is_customizable = excluded.is_customizable,
  badge = excluded.badge,
  external_buy_url = excluded.external_buy_url;

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

Contact us from Settings to ask about your data.')
on conflict (slug) do update set
  title = excluded.title,
  updated_at = excluded.updated_at,
  body = excluded.body;

commit;
