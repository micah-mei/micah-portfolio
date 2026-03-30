"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { FRAME_COUNT, HERO_SCROLL_VH } from "@/lib/constants";
import { ScrollDownCue } from "@/components/ScrollDownCue";

/**
 * Native scroll progress for the hero track (Framer useScroll + document was unreliable).
 * progress 0 = top of section at viewport top; 1 = end of section at viewport top.
 */
function heroScrollProgress(section: HTMLElement): number {
  const vh = window.innerHeight;
  const range = section.offsetHeight - vh;
  if (range <= 0) return 0;
  const top = section.getBoundingClientRect().top;
  const scrolled = -top;
  return Math.min(1, Math.max(0, scrolled / range));
}

export function HeroScroll() {
  const spacerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { images, isReady, progress: loadProgress, error: loadError } =
    useImagePreloader({
      frameCount: FRAME_COUNT,
    });
  const hasAnyFrame = Boolean(images?.some((img) => img?.naturalWidth));

  const scrollProgress = useMotionValue(0);
  const [handedOff, setHandedOff] = useState(false);
  const handedOffRef = useRef(false);
  const lastFrame = useRef(-1);
  const rafRef = useRef(0);

  const overlayOpacity = useTransform(scrollProgress, [0.68, 0.84], [0, 1]);
  const vignetteStrength = useTransform(
    scrollProgress,
    [0, 0.4],
    [1, 0.85],
  );

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const img = images?.[index];
      if (img?.complete && img.naturalWidth) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (w - dw) / 2;
        const dy = (h - dh) / 2;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
      }
    },
    [images],
  );

  useEffect(() => {
    const section = spacerRef.current;
    if (!section) return;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const p = heroScrollProgress(section);
      scrollProgress.set(p);

      const nextHanded = p >= 0.92;
      if (nextHanded !== handedOffRef.current) {
        handedOffRef.current = nextHanded;
        setHandedOff(nextHanded);
      }

      const max = Math.max(0, FRAME_COUNT - 1);
      const idx = Math.min(max, Math.floor(p * max + 1e-6));
      if (idx !== lastFrame.current) {
        lastFrame.current = idx;
        drawFrame(idx);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame, scrollProgress]);

  useEffect(() => {
    lastFrame.current = -1;
  }, [images, isReady]);

  useEffect(() => {
    const onResize = () => {
      lastFrame.current = -1;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Avoid negative z-index: it can paint under the root layer and break Safari/compositing.
     After handoff, park at z-0 and hide so z-10 content reads cleanly (no bleed-through). */
  const shellClass = handedOff
    ? "fixed inset-0 z-0 h-screen w-full overflow-hidden pointer-events-none opacity-0"
    : "sticky top-0 z-0 h-screen w-full overflow-hidden";

  return (
    <section
      id="home"
      ref={spacerRef}
      className="relative"
      style={{ height: `${HERO_SCROLL_VH * 100}vh` }}
      aria-label="Hero sequence"
    >
      <div className={shellClass}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />

        {!isReady && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-pitch"
            style={{ backgroundColor: "#000000" }}
          >
            <p
              className="font-mono text-sm"
              style={{
                fontFamily: "ui-monospace, monospace",
                color: "rgba(0, 240, 255, 0.85)",
              }}
            >
              loading_sequence… {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}

        {isReady && !hasAnyFrame && (
          <div
            className="absolute inset-0 z-[4] flex items-center justify-center bg-pitch px-6"
            style={{ backgroundColor: "#000000" }}
          >
            <p
              className="max-w-md text-center font-mono text-xs leading-relaxed text-red-400/90"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              Hero frames did not load (120 JPEGs under /sequence1/). Hard-refresh
              (Cmd+Shift+R), confirm{" "}
              <span className="text-cyan/80">npm run dev</span> shows the Local URL
              you are opening, and that{" "}
              <span className="text-cyan/80">public/sequence1</span> is present.
              {loadError?.message ? (
                <span className="mt-2 block text-silver/50">
                  {loadError.message.slice(0, 200)}
                </span>
              ) : null}
            </p>
          </div>
        )}

        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] flex flex-col justify-end bg-gradient-to-t from-pitch/90 via-pitch/20 to-transparent px-6 pb-16 md:px-12 md:pb-24"
          style={{ opacity: vignetteStrength }}
        />

        <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-end px-6 pb-12 md:px-12 md:pb-20">
          {isReady && hasAnyFrame ? (
            <div className="pointer-events-auto flex w-full flex-col items-start md:pb-0.5">
              <ScrollDownCue scrollProgress={scrollProgress} />
            </div>
          ) : null}
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-[3] bg-black/92 supports-[backdrop-filter]:bg-black/80 supports-[backdrop-filter]:backdrop-blur-md"
          style={{ opacity: overlayOpacity }}
        />
      </div>
    </section>
  );
}
