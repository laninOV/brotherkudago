import { NextResponse } from "next/server";
import { getEventsDbHealth } from "@/lib/events-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getEventsDbHealth();

  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
  });
}
