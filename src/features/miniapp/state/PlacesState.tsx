"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { EventRecord } from "@/features/events/types";
import { PLACES as FALLBACK_PLACES } from "../data/places";
import type { Place } from "../model/place";

type PlacesStateValue = {
  places: Place[];
  loading: boolean;
  error: string | null;
};

const PlacesStateContext = createContext<PlacesStateValue | null>(null);

function eventToPlace(event: EventRecord): Place {
  const minPrice = event.price?.min ?? 0;
  const price =
    minPrice >= 3500 ? "$$$" : minPrice >= 1200 ? "$$" : "$";

  return {
    id: event.id,
    title: event.title,
    category: event.category ?? "event",
    tags: event.tags ?? [],
    address: event.address ?? `${event.city}, ${event.venue}`,
    lat: Number.isFinite(event.lat) ? event.lat : 55.7522,
    lng: Number.isFinite(event.lng) ? event.lng : 37.6156,
    price,
    openNow: true,
    durationMin: event.durationMin ?? 90,
    image: event.image,
    photos: event.image ? [event.image] : [],
    description: event.description,
    url: event.url,
  };
}

async function loadAllEvents(limit = 120): Promise<EventRecord[]> {
  const results: EventRecord[] = [];
  let cursor: string | null = null;
  let guard = 0;

  while (guard < 10) {
    guard += 1;
    const url = new URL("/api/events", window.location.origin);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("datePreset", "all");
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Events API failed: ${response.status}`);

    const payload = (await response.json()) as {
      events?: EventRecord[];
      pageInfo?: { hasMore?: boolean; nextCursor?: string | null };
    };

    const pageEvents = Array.isArray(payload.events) ? payload.events : [];
    results.push(...pageEvents);

    const hasMore = Boolean(payload.pageInfo?.hasMore);
    cursor = payload.pageInfo?.nextCursor ?? null;
    if (!hasMore || !cursor) break;
  }

  return results;
}

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>(FALLBACK_PLACES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const events = await loadAllEvents();
        if (!cancelled && events.length > 0) {
          setPlaces(events.map(eventToPlace));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown load error");
          setPlaces(FALLBACK_PLACES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      places,
      loading,
      error,
    }),
    [places, loading, error]
  );

  return <PlacesStateContext.Provider value={value}>{children}</PlacesStateContext.Provider>;
}

export function usePlacesState() {
  const state = useContext(PlacesStateContext);
  if (!state) throw new Error("usePlacesState must be used inside PlacesProvider");
  return state;
}
