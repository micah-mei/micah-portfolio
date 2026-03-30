"use client";

import { useCallback, useRef, useState } from "react";
import {
  documentScrollYForElementTop,
  smoothScrollDocumentTo,
} from "@/lib/smoothScroll";

const LINKS = [
  { id: "home" as const, label: "Home" },
  { id: "about" as const, label: "About" },
  { id: "experience" as const, label: "Experience" },
  { id: "projects" as const, label: "Projects" },
  { id: "contact" as const, label: "Contact" },
] as const;

const TELEPORT_MSG = "> teleporting…";

/** Fade readout as linear scroll time approaches 1 (closer to destination). */
function teleportReadoutOpacity(linearT: number): number {
  if (linearT <= 0.4) return 1;
  const u = (linearT - 0.4) / 0.6;
  return Math.max(0, 1 - u * u);
}

export function SiteNav() {
  const [teleporting, setTeleporting] = useState(false);
  const [teleportFade, setTeleportFade] = useState(1);
  const finishRef = useRef<(() => void) | null>(null);

  const scrollToSection = useCallback(
    (hash: (typeof LINKS)[number]["id"]) => {
      if (teleporting) return;

      const onComplete = () => {
        finishRef.current = null;
        requestAnimationFrame(() => {
          setTeleporting(false);
          setTeleportFade(1);
        });
      };

      setTeleportFade(1);
      setTeleporting(true);
      finishRef.current = onComplete;

      const targetY =
        hash === "home"
          ? 0
          : (() => {
              const el = document.getElementById(hash);
              return el ? documentScrollYForElementTop(el) : null;
            })();

      if (targetY === null) {
        queueMicrotask(onComplete);
        return;
      }

      smoothScrollDocumentTo(targetY, {
        onProgress: (t) => setTeleportFade(teleportReadoutOpacity(t)),
        onComplete,
      });

      const safetyMs = 7000;
      window.setTimeout(() => {
        if (finishRef.current === onComplete) {
          finishRef.current = null;
          setTeleporting(false);
          setTeleportFade(1);
        }
      }, safetyMs);
    },
    [teleporting],
  );

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-start justify-between gap-3 px-4 pt-4 md:px-8 md:pt-6">
        <div className="pointer-events-auto flex min-w-0 flex-col gap-0.5">
          <h1 className="shrink-0 font-mono text-xl font-medium tracking-[0.06em] text-cyan md:text-2xl">
            Micah Mei.
          </h1>
          <p className="max-w-[16rem] font-sans text-[11px] font-normal leading-snug tracking-wide text-silver/55 md:max-w-none md:text-[0.8125rem] md:leading-snug md:tracking-[0.02em]">
            CS @ Western University
          </p>
        </div>
        <nav aria-label="Page sections" aria-busy={teleporting}>
          <ul className="pointer-events-auto flex flex-wrap items-center justify-end gap-1 rounded-lg border border-white/10 bg-black/55 px-2 py-1.5 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-black/40 md:gap-0 md:px-3 md:py-2">
            {LINKS.map(({ id, label }, i) => (
              <li key={id} className="flex items-center">
                {i > 0 ? (
                  <span
                    className="mx-1 hidden h-3 w-px bg-white/15 md:block"
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  disabled={teleporting}
                  onClick={() => scrollToSection(id)}
                  className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-silver/65 transition-colors hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan/50 disabled:pointer-events-none disabled:opacity-35 md:px-2.5 md:text-[11px]"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {teleporting ? (
        <div className="pointer-events-none fixed left-1/2 top-[4.25rem] z-[60] max-w-[min(90vw,28rem)] -translate-x-1/2 px-4 md:top-[5.25rem]">
          <p
            role="status"
            aria-live="polite"
            style={{ opacity: teleportFade }}
            className="border border-cyan/25 bg-black/80 px-3 py-2 font-mono text-[10px] tracking-wide text-cyan/90 shadow-[0_0_24px_rgba(0,240,255,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-black/55 md:text-[11px]"
          >
            {TELEPORT_MSG}
          </p>
        </div>
      ) : null}
    </>
  );
}
