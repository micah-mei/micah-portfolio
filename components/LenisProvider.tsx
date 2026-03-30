"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let scrollTriggerRegistered = false;

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lenis: InstanceType<typeof Lenis> | null = null;
    let scrollFn: ((time: number) => void) | null = null;
    let onRefresh: (() => void) | null = null;

    try {
      if (!scrollTriggerRegistered) {
        gsap.registerPlugin(ScrollTrigger);
        scrollTriggerRegistered = true;
      }

      document.documentElement.classList.add("lenis");

      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      scrollFn = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(scrollFn);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && value !== undefined && lenis) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis?.scroll ?? 0;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      onRefresh = () => lenis?.resize();
      ScrollTrigger.addEventListener("refresh", onRefresh);
      ScrollTrigger.refresh();
    } catch (e) {
      console.warn("[LenisProvider] smooth scroll disabled:", e);
      document.documentElement.classList.remove("lenis");
      try {
        lenis?.destroy();
      } catch {
        /* ignore */
      }
      return;
    }

    return () => {
      document.documentElement.classList.remove("lenis");
      try {
        if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
        if (scrollFn) gsap.ticker.remove(scrollFn);
        lenis?.destroy();
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh();
      } catch (e) {
        console.warn("[LenisProvider] cleanup:", e);
      }
    };
  }, []);

  return <>{children}</>;
}
