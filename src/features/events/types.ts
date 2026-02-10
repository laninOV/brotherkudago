export type EventCategory = "event" | "cafe" | "walk" | "place";
export type EventCurrency = "RUB" | "EUR" | "USD";

export type EventPrice = {
  min?: number;
  max?: number;
  currency: EventCurrency;
};

export type EventRecord = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  city: string;
  venue: string;
  address?: string;
  lat: number;
  lng: number;
  category?: EventCategory;
  durationMin?: number;
  price?: EventPrice;
  tags?: string[];
  image?: string;
  description?: string;
  url?: string;
};

export type DatePreset = "today" | "week" | "all";

export type EventsFilters = {
  category?: EventCategory;
  nearLat?: number;
  nearLng?: number;
  radiusKm?: number;
  priceMax?: number;
  datePreset?: DatePreset;
};

export type EventsPage = {
  events: EventRecord[];
  pageInfo: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export type GetEventsPageOptions = EventsFilters & {
  limit?: number;
  cursor?: string | null;
};
