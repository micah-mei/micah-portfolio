"use client";

import { useEffect, useState } from "react";
import { frameUrl } from "@/lib/constants";

export type PreloadState = {
  images: HTMLImageElement[] | null;
  progress: number;
  isReady: boolean;
  error: Error | null;
};

type Options = {
  frameCount: number;
  concurrency?: number;
  perImageTimeoutMs?: number;
  maxWaitMs?: number;
};

function loadImageWithTimeout(
  src: string,
  timeoutMs: number,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let settled = false;

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      img.onload = null;
      img.onerror = null;
      img.src = "";
      reject(new Error(`timeout: ${src}`));
    }, timeoutMs);

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (ok) resolve(img);
      else reject(new Error(`failed: ${src}`));
    };

    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = src;
  });
}

export function useImagePreloader({
  frameCount,
  concurrency = 6,
  perImageTimeoutMs = 30_000,
  maxWaitMs = 180_000,
}: Options): PreloadState {
  const [images, setImages] = useState<HTMLImageElement[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (frameCount <= 0) {
      setIsReady(true);
      return () => {
        cancelled = true;
      };
    }

    const slots: (HTMLImageElement | null)[] = new Array(frameCount).fill(
      null,
    );
    let completed = 0;
    let nextIndex = 0;
    let firstErr: Error | null = null;

    const bump = () => {
      completed += 1;
      if (!cancelled) setProgress(completed / frameCount);
    };

    const worker = async () => {
      while (!cancelled) {
        const i = nextIndex++;
        if (i >= frameCount) break;
        try {
          const img = await loadImageWithTimeout(
            frameUrl(i),
            perImageTimeoutMs,
          );
          slots[i] = img;
          void img.decode?.().catch(() => {});
        } catch (e) {
          if (!firstErr)
            firstErr = e instanceof Error ? e : new Error(String(e));
        } finally {
          bump();
        }
      }
    };

    const pool = Math.min(concurrency, frameCount);

    const finish = () => {
      if (cancelled) return;
      if (firstErr) setError(firstErr);
      const loaded = slots.filter(Boolean) as HTMLImageElement[];
      if (loaded.length === frameCount) {
        setImages(slots as HTMLImageElement[]);
      } else if (loaded.length > 0) {
        setImages(slots as HTMLImageElement[]);
      } else {
        setImages(null);
      }
      setIsReady(true);
    };

    const loadAll = Promise.all(
      Array.from({ length: pool }, () => worker()),
    ).then(() => {});

    const deadline = new Promise<void>((resolve) => {
      window.setTimeout(resolve, maxWaitMs);
    });

    void Promise.race([loadAll, deadline]).then(() => {
      if (!cancelled) finish();
    });

    return () => {
      cancelled = true;
    };
  }, [frameCount, concurrency, perImageTimeoutMs, maxWaitMs]);

  return { images, progress, isReady, error };
}
