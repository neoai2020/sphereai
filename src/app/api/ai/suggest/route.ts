import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSEO } from "@/lib/rapidapi/generate";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productName, productDescription } = await request.json();

    if (!productName || !productDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const suggestions = await generateSEO(productName, productDescription);
    return NextResponse.json(suggestions);
  } catch (err) {
    console.error("AI Suggestion failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI suggestion failed" },
      { status: 500 }
    );
  }
}
