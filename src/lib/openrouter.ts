const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export type AiProvider = "openrouter" | "rapidapi";

export let lastAiProvider: AiProvider | null = null;

export function setLastAiProvider(provider: AiProvider | null): void {
  lastAiProvider = provider;
}

export function getLastAiProvider(): AiProvider | null {
  return lastAiProvider;
}

export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

export async function openRouterChat(
  messages: { role: string; content: string }[],
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-Title": "SphereAI",
  };
  const referer = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  if (referer) headers["HTTP-Referer"] = referer;

  const body: Record<string, unknown> = {
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    messages,
  };
  if (opts.temperature !== undefined) body.temperature = opts.temperature;
  if (opts.maxTokens !== undefined) body.max_tokens = opts.maxTokens;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(opts.timeoutMs ?? 45000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenRouter HTTP ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenRouter returned empty content");
  }
  return content;
}
