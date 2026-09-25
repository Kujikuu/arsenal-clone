# send-notifications

Delivers queued push notifications (`public.notification_events`) through
[Expo Push](https://docs.expo.dev/push-notifications/sending-notifications/).
Database triggers queue goals, team news, full time, breaking news
(`articles.is_breaking`) and ticket sales; kick-off reminders are queued by
`enqueue_kickoff_reminders()` on every run. Recipients follow each user's
toggles in `public.user_settings`.

## Deploy

```sh
supabase functions deploy send-notifications --no-verify-jwt
supabase secrets set NOTIFY_CRON_SECRET=<long random string>
# Optional, if "Enhanced push security" is on for the Expo project:
supabase secrets set EXPO_ACCESS_TOKEN=<expo access token>
```

## Schedule (every minute)

Enable the `pg_cron` and `pg_net` extensions, store the URL and secret in
Vault, then schedule the call:

```sql
select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
select vault.create_secret('<same NOTIFY_CRON_SECRET>', 'notify_cron_secret');

select cron.schedule(
  'send-notifications',
  '* * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
           || '/functions/v1/send-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'notify_cron_secret')
    )
  );
  $$
);
```

## Device credentials

- iOS: EAS creates the APNs key on the first `eas build` (or `eas credentials`).
- Android: create a Firebase project, add `google-services.json` and set
  `expo.android.googleServicesFile` in `app.json`, then upload the FCM V1
  service-account key with `eas credentials`.

Events older than 30 minutes are marked `expired` instead of being sent, so
bulk imports and seeding never flood devices.
