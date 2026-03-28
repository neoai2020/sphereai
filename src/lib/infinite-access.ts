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
