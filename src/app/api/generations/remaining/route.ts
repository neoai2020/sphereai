import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  SITE_FORGE_GENERATION_LIMIT,
  SITE_FORGE_WINDOW_HOURS,
  siteForgeGenerationWindowStartISO,
} from "@/lib/site-forge-generation-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const since = siteForgeGenerationWindowStartISO();

    const { count, error } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);

    if (error) {
      throw error;
    }

    const used = count ?? 0;
    const limit = SITE_FORGE_GENERATION_LIMIT;
    const remaining = Math.max(0, limit - used);

    let nextSlotAt: string | null = null;
    if (remaining === 0 && used > 0) {
      const { data: oldestRows } = await supabase
        .from("generations")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(1);

      const oldest = oldestRows?.[0]?.created_at;
      if (oldest) {
        nextSlotAt = new Date(
          new Date(oldest).getTime() + SITE_FORGE_WINDOW_HOURS * 60 * 60 * 1000
        ).toISOString();
      }
    }

    return NextResponse.json({
      used,
      remaining,
      limit,
      windowHours: SITE_FORGE_WINDOW_HOURS,
      nextSlotAt,
    });
  } catch (error) {
    console.error("Remaining generations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
