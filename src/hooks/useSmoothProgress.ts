"use client";

import { useEffect, useRef, useState } from "react";

const TICK_MS = 200;
const CRAWL_LIMIT = 99;

/**
 * Display value for a progress bar that never sits still while work runs.
 *
 * `floor` is confirmed progress (a real step finished). `ceiling` is where the
 * current step ends, and `expectedMs` is roughly how long that step takes.
 * The bar eases from floor toward ceiling over that time, then keeps crawling
 * by fractions toward 99 so a slow step still visibly moves. It never goes backward.
 */
export function useSmoothProgress({
  floor,
  ceiling,
  running,
  expectedMs = 30_000,
}: {
  floor: number;
  ceiling: number;
  running: boolean;
  expectedMs?: number;
}): number {
  const [value, setValue] = useState(0);
  const target = useRef({ floor, ceiling, expectedMs });

  useEffect(() => {
    target.current = { floor, ceiling, expectedMs };
  });

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setValue((current) => {
        const { floor: f, ceiling: c, expectedMs: ms } = target.current;
        let next = Math.max(current, f);

        if (next < c - 0.3) {
          const rate = 1 - Math.exp(-(TICK_MS * 1.2) / Math.max(ms, 1000));
          next += Math.max((c - next) * rate, 0.02);
        } else {
          next += Math.max((CRAWL_LIMIT - next) * 0.0003, 0.01);
        }

        return Math.min(CRAWL_LIMIT, next);
      });
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      setValue(0);
    };
  }, [running]);

  return running ? Math.max(value, floor) : floor;
}
