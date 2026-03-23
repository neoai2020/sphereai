import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (error) {
      throw error;
    }

    const used = count || 0;
    const limit = 5;

    return NextResponse.json({
      used,
      remaining: Math.max(0, limit - used),
      limit,
    });
  } catch (error) {
    console.error("Remaining generations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
