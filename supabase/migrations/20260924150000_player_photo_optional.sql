-- Some youth players have no official Premier League photo yet.
alter table public.players alter column photo_url drop not null;
