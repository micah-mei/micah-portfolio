"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const OUTER_SPRING = { stiffness: 400, damping: 34, mass: 0.38 };
const INNER_SPRING = { stiffness: 220, damping: 28, mass: 0.5 };

function isInteractiveTarget(el: Element | null): boolean {
  if (!el || el === document.documentElement || el === document.body)
    return false;
  const node = el as HTMLElement;
  if (node.closest("[data-no-cursor-hover]")) return false;
  if (node.closest("a[href], button, [role='button'], [role='link']"))
    return true;
  if (node.closest("input, textarea, select, label")) return true;
  if (node.closest(".cursor-pointer")) return true;
  return false;
}

function subscribePointerFine(mq: MediaQueryList, apply: () => void) {
  apply();
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }
  mq.addListener(apply);
  return () => mq.removeListener(apply);
}

export function TerminalCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);
  const visibleRef = useRef(false);
  visibleRef.current = visible;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const outerX = useSpring(x, OUTER_SPRING);
  const outerY = useSpring(y, OUTER_SPRING);
  const innerX = useSpring(x, INNER_SPRING);
  const innerY = useSpring(y, INNER_SPRING);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    const unsub = subscribePointerFine(mq, apply);
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visibleRef.current) setVisible(true);

      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        try {
          const under = document.elementFromPoint(e.clientX, e.clientY);
          setHovering(isInteractiveTarget(under));
        } catch {
          setHovering(false);
        }
      });
    };

    const onLeave = () => {
      setVisible(false);
      setHovering(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const arm = "absolute h-2.5 w-2.5 border-2 border-cyan";
  const glow = { boxShadow: "0 0 14px rgba(0, 240, 255, 0.22)" };

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          className="relative h-12 w-12"
          animate={{ scale: hovering ? 1.18 : 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <span
            className={`${arm} left-0 top-0 border-b-0 border-r-0`}
            style={glow}
          />
          <span className={`${arm} right-0 top-0 border-b-0 border-l-0`} />
          <span className={`${arm} bottom-0 left-0 border-l-0 border-t-0`} />
          <span className={`${arm} bottom-0 right-0 border-r-0 border-t-0`} />

          <AnimatePresence>
            {hovering && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="absolute inset-[-5px] rounded-md border border-cyan/35"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          x: innerX,
          y: innerY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="relative flex h-6 w-6 items-center justify-center">
          <motion.div
            className="h-1.5 w-1.5 rounded-[1px] bg-cyan shadow-[0_0_12px_rgba(0,240,255,0.9)]"
            animate={{
              scale: hovering ? [1, 1.4, 1] : 1,
              opacity: hovering ? [1, 0.5, 1] : 1,
            }}
            transition={{
              duration: hovering ? 0.85 : 0.2,
              repeat: hovering ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
          <span className="pointer-events-none absolute h-px w-4 bg-cyan/45" />
          <span className="pointer-events-none absolute h-4 w-px bg-cyan/45" />
        </div>
      </motion.div>
    </>
  );
}
