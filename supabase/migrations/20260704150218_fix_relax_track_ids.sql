-- The originally seeded YouTube IDs were ended livestreams that no longer play
-- ("This live stream recording is not available."). Replace with stable,
-- regular (non-live) uploads verified to embed correctly.
update relax_tracks set youtube_id = 'P4r9LeM7DiQ' where id = 'lofi-study';
update relax_tracks set youtube_id = 'BSmYxnvUDHw' where id = 'rain-ambience';
