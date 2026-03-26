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

    // Universal Master Codes for testing and demo purposes
    const MASTER_CODES: Record<string, string> = {
      "10X-MODE-999": "10x",
      "TRAFFIC-MODE-999": "automation",
      "INF-MODE-999": "infinite",
      "DFY-MODE-999": "dfy",
    };

    const normalizedCode = code.trim().toUpperCase();
    console.log(`[Activation] Attempting activation for ${email} with code ${normalizedCode}`);
    
    let token: any = null;

    // A. Improved Master Code Check
    const foundMasterKey = Object.keys(MASTER_CODES).find(key => normalizedCode.includes(key) || key === normalizedCode);

    if (foundMasterKey) {
      console.log(`[Activation] MASTER KEY DETECTED: ${foundMasterKey}`);
      token = {
        id: "master-key",
        code: foundMasterKey,
        feature: MASTER_CODES[foundMasterKey],
        is_used: false,
      };
    } else {
      // B. Database Lookup
      const { data: dbToken, error: tokenErr } = await supabaseAdmin
        .from("access_tokens")
        .select("*")
        .eq("code", normalizedCode)
        .single();

      if (tokenErr || !dbToken) {
        console.error("Token lookup error:", tokenErr);
        // Include the code in the error for debugging
        return NextResponse.json({ 
          error: `Activation code [${normalizedCode}] not found in records.`,
          debug: { code: normalizedCode, masterKeys: Object.keys(MASTER_CODES) } 
        }, { status: 400 });
      }
      token = dbToken;
    }

    if (token.is_used) {
      return NextResponse.json({ error: "This code has already been used and cannot be reused." }, { status: 400 });
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

    // 4. Mark token as used (if it's a real database token)
    if (token.id !== "master-key") {
      await supabaseAdmin
        .from("access_tokens")
        .update({ 
          is_used: true, 
          used_by_email: email.toLowerCase(),
          used_by_user_id: profile.id 
        })
        .eq("id", token.id);
      console.log(`[Activation] DB Token used: ${token.code} by ${email}`);
    } else {
      console.log(`[Activation] Master Code applied: ${token.code} for ${email}`);
    }

    return NextResponse.json({ 
      success: true, 
      feature: token.feature 
    });

  } catch (error) {
    console.error("Activation API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
