# sync-football-data

Imports the club's men's fixtures and live scores, and the Premier League
table, from [football-data.org](https://www.football-data.org/) (free plan)
into `public.matches` and `public.standings`.

- Matches are upserted on `matches.external_id` (`fd:<id>`), so line-ups,
  stats and timeline rows added by staff are kept.
- Free-plan competitions only: Premier League and Champions League. FA Cup,
  League Cup, friendlies, women's and academy matches stay staff-managed.
- Goal alerts for imported matches come from live score changes
  (`notify_score_change` trigger), since the free plan has no goal timeline.
- The app refreshes the match centre and fixtures list through Supabase
  Realtime when rows change.
- Free plan: 10 requests per minute, and live scores may lag behind real time.

## Deploy

```sh
supabase functions deploy sync-football-data --no-verify-jwt
supabase secrets set FOOTBALL_DATA_TOKEN=<token from football-data.org>
supabase secrets set SYNC_CRON_SECRET=<long random string>
# Optional overrides (defaults shown):
# FOOTBALL_DATA_TEAM_ID=57  CLUB_NAME=Arsenal  CLUB_STADIUM="Emirates Stadium"
# FOOTBALL_DATA_SEASON=<start year, e.g. 2026; defaults to the current season>
```

`CLUB_NAME` must match the API's short team name and `public.club_name()`.

## Schedule

Uses the same Vault `project_url` secret as `send-notifications`:

```sql
select vault.create_secret('<same SYNC_CRON_SECRET>', 'sync_cron_secret');

-- Fixtures and live scores: every minute (1 API request).
select cron.schedule('sync-football-data', '* * * * *', $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/sync-football-data',
    headers := jsonb_build_object('Authorization', 'Bearer ' ||
      (select decrypted_secret from vault.decrypted_secrets where name = 'sync_cron_secret'))
  );
$$);

-- Fixtures plus the league table: every 15 minutes (2 API requests).
select cron.schedule('sync-football-data-standings', '*/15 * * * *', $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/sync-football-data?standings=1',
    headers := jsonb_build_object('Authorization', 'Bearer ' ||
      (select decrypted_secret from vault.decrypted_secrets where name = 'sync_cron_secret'))
  );
$$);
```

## Tests

```sh
deno test supabase/functions/sync-football-data/mapping_test.ts
```
