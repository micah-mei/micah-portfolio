"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const CMD = "> cat about_micah.md";
const BODY =
  "Hi, I'm Micah, a driven Product Management enthusiast and dual-degree student pursuing Computer Science and Business at Western University. I specialize in building user-focused applications and I'm passionate about leveraging AI and full-stack development to solve real-world problems.";

export function AboutReadme() {
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-8% 0px" });
  const [cmdShown, setCmdShown] = useState(0);
  const [bodyVisible, setBodyVisible] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setCmdShown(0);
    setBodyVisible(false);
    let cancelled = false;
    const timeouts: number[] = [];
    let i = 0;

    const typeCmd = () => {
      if (cancelled) return;
      i += 1;
      setCmdShown(i);
      if (i < CMD.length) {
        timeouts.push(window.setTimeout(typeCmd, 32));
      } else {
        timeouts.push(
          window.setTimeout(() => {
            if (!cancelled) setBodyVisible(true);
          }, 280),
        );
      }
    };

    timeouts.push(window.setTimeout(typeCmd, 400));

    return () => {
      cancelled = true;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [inView]);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative z-10 mx-auto max-w-3xl scroll-mt-6 px-6 py-20 md:px-10 md:py-28"
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        About
      </h2>
      <div
        className="overflow-hidden rounded-xl border border-white/12 bg-black/35 shadow-2xl backdrop-blur-[16px]"
        style={{ WebkitBackdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[10px] tracking-wide text-silver/40">
            about_micah.md — readonly
          </span>
        </div>

        <div className="px-4 py-6 md:px-7 md:py-8">
          <p className="min-h-[1.4em] font-mono text-sm text-cyan md:text-base">
            {CMD.slice(0, cmdShown)}
            {cmdShown < CMD.length && inView && (
              <motion.span
                className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-cyan align-middle"
                animate={{ opacity: [1, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.55 }}
              />
            )}
          </p>

          <motion.div
            initial={false}
            animate={
              bodyVisible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 border-l-2 border-cyan/35 pl-4 md:pl-5"
          >
            <p className="font-sans text-sm leading-relaxed text-silver/85 md:text-base md:leading-relaxed">
              {BODY}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
