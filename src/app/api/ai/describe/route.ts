import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateProductDescription } from "@/lib/rapidapi/generate";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productName } = await request.json();

    if (!productName) {
      return NextResponse.json({ error: "Missing product name" }, { status: 400 });
    }

    const description = await generateProductDescription(productName);
    return NextResponse.json({ description });
  } catch (err) {
    console.error("Description generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
