import { NextResponse } from "next/server";

import { refreshGtfsStaticData } from "@/lib/gtfs-refresh";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await refreshGtfsStaticData();

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown refresh error";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}