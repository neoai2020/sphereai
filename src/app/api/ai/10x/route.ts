import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
import { createClient } from "@/lib/supabase/server";
import { generateFacebookPosts } from "@/lib/rapidapi/generate";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productName, productDescription, productLink } = await request.json();

    if (!productName || !productDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const posts = await generateFacebookPosts(productName, productDescription, productLink);

    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
