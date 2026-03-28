/** Full Site Forge builds allowed per user per rolling window (server-enforced). */
export const SITE_FORGE_GENERATION_LIMIT = 5;

/** Rolling window length in hours (matches Postgres interval in migration 004). */
export const SITE_FORGE_WINDOW_HOURS = 24;

/** ISO timestamp: count generations with `created_at >= this` (rolling 24h from now, UTC). */
export function siteForgeGenerationWindowStartISO(nowMs: number = Date.now()): string {
  return new Date(nowMs - SITE_FORGE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
}
