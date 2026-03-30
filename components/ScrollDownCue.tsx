"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Scroll affordance tuned to skills-lock.json intents (impeccable family):
 * animate / onboard / arrange / delight / polish / quieter / typeset / colorize —
 * one calm motion, clear hierarchy, cyan token, subtle typography, no noisy effects.
 */
export function ScrollDownCue({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const groupOpacity = useTransform(scrollProgress, [0, 0.1, 0.24], [1, 0.5, 0]);

  const nudgeScroll = () => {
    const step = Math.min(window.innerHeight * 0.42, 520);
    window.scrollBy({ top: step, behavior: "auto" });
  };

  return (
    <motion.div
      style={{ opacity: groupOpacity }}
      className="flex w-max flex-col items-start"
    >
      <button
        type="button"
        onClick={nudgeScroll}
        className="group flex flex-col items-center gap-1.5 rounded-md px-2 py-2 text-cyan/75 transition-colors hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan/50"
      >
        <span className="sr-only">Scroll down to continue</span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-silver/50 group-hover:text-silver/70">
          Scroll
        </span>
        <motion.span
          aria-hidden
          className="inline-flex text-current"
          animate={reduceMotion ? { y: 0 } : { y: [0, 5, 0] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 2.1,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1],
                }
          }
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
            <path d="M6 15l6 6 6-6" />
          </svg>
        </motion.span>
      </button>
    </motion.div>
  );
}
