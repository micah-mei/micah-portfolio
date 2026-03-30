/**
 * Slower than native `behavior: "smooth"` so scroll-driven hero scrubbing
 * can read intermediate positions frame-by-frame.
 */

let scrollSession = 0;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function smoothScrollDocumentTo(
  targetY: number,
  options?: {
    durationMs?: number;
    /** Linear animation progress 0→1 (time-based, not eased). */
    onProgress?: (linearT: number) => void;
    onComplete?: () => void;
  },
): void {
  const onComplete = options?.onComplete;
  const onProgress = options?.onProgress;
  const finish = () => {
    onComplete?.();
  };

  const session = ++scrollSession;
  const startY = window.scrollY;
  const maxY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const clamped = Math.min(maxY, Math.max(0, targetY));
  const delta = clamped - startY;
  if (Math.abs(delta) < 0.5) {
    onProgress?.(1);
    queueMicrotask(finish);
    return;
  }

  const fromDistance = Math.abs(delta) * 2.2;
  const durationMs =
    options?.durationMs ??
    Math.min(5500, Math.max(1800, fromDistance));

  const t0 = performance.now();

  function frame(now: number) {
    if (session !== scrollSession) return;
    const t = Math.min(1, (now - t0) / durationMs);
    onProgress?.(t);
    const y = startY + delta * easeInOutCubic(t);
    window.scrollTo(0, y);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      finish();
    }
  }

  requestAnimationFrame(frame);
}

export function scrollMarginTopPx(el: HTMLElement): number {
  const raw = getComputedStyle(el).scrollMarginTop;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export function documentScrollYForElementTop(el: HTMLElement): number {
  const top = el.getBoundingClientRect().top + window.scrollY;
  return top - scrollMarginTopPx(el);
}
