update public.events
set
  image = '/events/podolsk/podolsk-01.jpg',
  gallery_json = '[
    "/events/podolsk/podolsk-01.jpg",
    "/events/podolsk/podolsk-02.jpg",
    "/events/podolsk/podolsk-03.jpg",
    "/events/podolsk/podolsk-04.jpg",
    "/events/podolsk/podolsk-05.jpg",
    "/events/podolsk/podolsk-06.jpg",
    "/events/podolsk/podolsk-07.jpg"
  ]'::jsonb
where id = 'db-evt-010';
