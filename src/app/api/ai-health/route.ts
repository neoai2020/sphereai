import { NextResponse } from "next/server";
import { callAI } from "@/lib/rapidapi/generate";
import { getLastAiProvider, setLastAiProvider } from "@/lib/openrouter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.AI_HEALTH_SECRET;
  if (!secret || req.headers.get("x-ai-health-secret") !== secret) {
    return new NextResponse(null, { status: 404 });
  }

  const started = Date.now();
  try {
    setLastAiProvider(null);
    const text = await callAI("Reply with the single word ok", 0);
    return NextResponse.json({
      ok: true,
      provider: getLastAiProvider(),
      ms: Date.now() - started,
      sample: text.slice(0, 40),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err), ms: Date.now() - started },
      { status: 502 }
    );
  }
}
