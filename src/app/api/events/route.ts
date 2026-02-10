import { NextResponse } from "next/server";
import { getEventsPageFromDb } from "@/lib/events-repo";
import type { DatePreset, EventCategory } from "@/features/events/types";

export const dynamic = "force-dynamic";

function parseNumber(value: string | null) {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseCategory(value: string | null): EventCategory | undefined {
  if (value == null) return undefined;
  if (value === "event" || value === "cafe" || value === "walk" || value === "place") {
    return value;
  }
  return undefined;
}

function parseDatePreset(value: string | null): DatePreset | undefined {
  if (value == null) return undefined;
  if (value === "today" || value === "week" || value === "all") return value;
  return undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = Number(searchParams.get("limit") ?? "12");
    const limit = Number.isFinite(rawLimit) ? rawLimit : 12;
    const cursor = searchParams.get("cursor");

    const page = await getEventsPageFromDb({
      limit,
      cursor,
      category: parseCategory(searchParams.get("category")),
      nearLat: parseNumber(searchParams.get("nearLat")),
      nearLng: parseNumber(searchParams.get("nearLng")),
      radiusKm: parseNumber(searchParams.get("radiusKm")),
      priceMax: parseNumber(searchParams.get("priceMax")),
      datePreset: parseDatePreset(searchParams.get("datePreset")) ?? "all",
    });

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      {
        events: [],
        pageInfo: {
          limit: 12,
          hasMore: false,
          nextCursor: null,
        },
        error: "Failed to load events from database.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
