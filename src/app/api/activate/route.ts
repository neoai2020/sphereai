import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Use Service Role key for administrative tasks like updating subscriptions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json();

    if (!code || !email) {
      return NextResponse.json({ error: "Missing code or email" }, { status: 400 });
    }

    // 1. Check if token is valid and not used
    const { data: token, error: tokenErr } = await supabaseAdmin
      .from("access_tokens")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_used", false)
      .single();

    if (tokenErr || !token) {
      return NextResponse.json({ error: "Invalid or already used activation code." }, { status: 400 });
    }

    // 2. Check if user exists in profiles table
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "User account not found. Please sign up first with this email." }, { status: 404 });
    }

    // 3. Grant access: Update the relevant feature flag
    const featureColumn = `has_${token.feature}`;
    const upgradeData: any = {
      user_id: profile.id,
      status: "active",
    };
    upgradeData[featureColumn] = true;

    const { error: subErr } = await supabaseAdmin
      .from("user_subscriptions")
      .upsert(upgradeData, { onConflict: "user_id" });

    if (subErr) {
      console.error("Sub update error:", subErr);
      return NextResponse.json({ error: "Could not update subscription." }, { status: 500 });
    }

    // 4. Mark token as used
    await supabaseAdmin
      .from("access_tokens")
      .update({ 
        is_used: true, 
        used_by_email: email.toLowerCase(),
        used_by_user_id: profile.id 
      })
      .eq("id", token.id);

    return NextResponse.json({ 
      success: true, 
      feature: token.feature 
    });

  } catch (error) {
    console.error("Activation API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
