import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Infinite dashboard access matches the sidebar + activation flow:
 * `user_subscriptions.has_infinite` (set by /api/activate), with optional auth metadata fallback.
 */
export function userHasInfiniteAccess(
  subscription: { has_infinite?: boolean | null } | null | undefined,
  userMetadata?: { plan?: string | null } | null
): boolean {
  if (subscription?.has_infinite === true) return true;
  const plan = userMetadata?.plan?.toLowerCase();
  return plan === "infinite";
}

/** Server-side: load subscription row and apply same rules as the Infinite dashboard gate. */
export async function getUserHasInfiniteAccess(
  supabase: SupabaseClient,
  userId: string,
  userMetadata: { plan?: string | null } | null | undefined
): Promise<boolean> {
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("has_infinite")
    .eq("user_id", userId)
    .maybeSingle();
  return userHasInfiniteAccess(sub, userMetadata ?? undefined);
}
