/* utils — helpers ported from the aurora-weather reference (utils.js) */

export const clamp = (v: number, a: number, b: number) =>
  Math.min(b, Math.max(a, v));

/** FNV-1a string hash → uint32 */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 seeded PRNG — deterministic mock data */
export function mulberry(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

/** rAF tween with easeOutCubic; fn receives the interpolated value */
export function tween(
  from: number,
  to: number,
  ms: number,
  fn: (v: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      fn(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

/** collapse bursts of events into one animation-frame call */
export function rafThrottle<A extends unknown[]>(fn: (...args: A) => void) {
  let queued = false;
  let lastArgs: A;
  return (...args: A) => {
    lastArgs = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(...lastArgs);
    });
  };
}
