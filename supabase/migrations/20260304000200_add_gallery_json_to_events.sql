alter table public.events
add column if not exists gallery_json jsonb not null default '[]'::jsonb;

alter table public.events
drop constraint if exists events_gallery_json_array_check;

alter table public.events
add constraint events_gallery_json_array_check
check (jsonb_typeof(gallery_json) = 'array');
