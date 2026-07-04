-- Run this in the Supabase SQL editor for your project.
-- Public, read-only content tables for the relax page's curated
-- backgrounds and YouTube tracks. No insert/update/delete policies are
-- defined, so all content changes happen from the Supabase dashboard.

create table relax_backgrounds (
  id text primary key,
  label_vi text not null,
  label_en text not null,
  image_url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);
alter table relax_backgrounds enable row level security;
create policy "public read active backgrounds" on relax_backgrounds
  for select using (is_active = true);

create table relax_tracks (
  id text primary key,
  label_vi text not null,
  label_en text not null,
  youtube_id text not null,
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default true
);
alter table relax_tracks enable row level security;
create policy "public read active tracks" on relax_tracks
  for select using (is_active = true);

-- Example seed rows — replace image_url / youtube_id with your own picks.
-- Note: avoid picking ended YouTube livestream recordings for youtube_id —
-- they often fail to embed ("This live stream recording is not available" /
-- "We're processing this video"). Regular (non-live) uploads are reliable.
insert into relax_backgrounds (id, label_vi, label_en, image_url, sort_order) values
  ('forest', 'Rừng', 'Forest', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', 1),
  ('ocean', 'Biển', 'Ocean', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 2);

insert into relax_tracks (id, label_vi, label_en, youtube_id, icon, sort_order) values
  ('lofi-study', 'Lo-fi học bài', 'Lo-fi study beats', 'P4r9LeM7DiQ', '🎧', 1),
  ('rain-ambience', 'Tiếng mưa', 'Rain ambience', 'BSmYxnvUDHw', '🌧️', 2);
