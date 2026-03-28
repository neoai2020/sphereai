/**
 * Regression checks for Infinite gate (run: npx tsx scripts/verify-infinite-access-logic.ts).
 * CI/local: run 3x — for i in 1 2 3; do npx tsx scripts/verify-infinite-access-logic.ts || exit 1; done
 */
import { userHasInfiniteAccess } from "../src/lib/infinite-access";

let failures = 0;
function t(name: string, cond: boolean) {
  if (!cond) {
    console.error("FAIL:", name);
    failures++;
  }
}

t("grants when user_subscriptions.has_infinite is true", userHasInfiniteAccess({ has_infinite: true }, null));
t("grants when auth metadata plan is infinite (lower)", userHasInfiniteAccess(null, { plan: "infinite" }));
t("grants when auth metadata plan is INFINITE (mixed case)", userHasInfiniteAccess(null, { plan: "INFINITE" }));
t("denies when no subscription row and no plan", !userHasInfiniteAccess(null, null));
t("denies when has_infinite false and plan not infinite", !userHasInfiniteAccess({ has_infinite: false }, { plan: "free" }));
t("subscription wins over missing plan", userHasInfiniteAccess({ has_infinite: true }, undefined));

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("infinite-access logic: all checks passed");
