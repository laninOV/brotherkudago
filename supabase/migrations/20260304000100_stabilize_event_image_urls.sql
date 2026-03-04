-- Stabilize event image URLs that frequently fail in browser (403 / ORB).
-- This migration updates existing records in already-provisioned databases.

update public.events
set image = '/iloveeventfest_files/peter-van-rooijen-band-s800x600.jpg'
where id = 'db-evt-001';

update public.events
set image = '/iloveeventfest_files/uitvoering-popkoor-haarlemmermeer-s800x600.jpg'
where id = 'db-evt-007';

update public.events
set image = '/iloveeventfest_files/uitvoering-popkoor-haarlemmermeer-s800x600.jpg'
where id = 'db-evt-004';
