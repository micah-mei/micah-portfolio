"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const LINE_1_LABEL = "> tech_stack:";
const LINE_1_VALUE =
  " Java, Python, C, React, Node.js, HTML, CSS, JavaScript, TypeScript, SQL, Docker, Git, GitHub.";
const LINE_2_LABEL = "> core_competencies:";
const LINE_2_VALUE =
  " Product Strategy, Agile Methodologies, User Research, Data Analysis.";

function TypeLine({
  label,
  value,
  startDelay,
  active,
  onComplete,
}: {
  label: string;
  value: string;
  startDelay: number;
  active: boolean;
  onComplete?: () => void;
}) {
  const [count, setCount] = useState(0);
  const doneCb = useRef(onComplete);
  doneCb.current = onComplete;

  useEffect(() => {
    if (!active) return;
    setCount(0);
    let cancelled = false;
    const timeouts: number[] = [];

    const start = window.setTimeout(() => {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setCount(i);
        if (i < value.length) {
          timeouts.push(window.setTimeout(step, 24));
        } else {
          doneCb.current?.();
        }
      };
      step();
    }, startDelay);
    timeouts.push(start);

    return () => {
      cancelled = true;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [active, value.length, startDelay]);

  const typed = value.slice(0, count);
  const done = count >= value.length;

  return (
    <p className="min-h-[1.5em] font-mono text-sm text-silver/90 md:text-base">
      <span className="text-cyan">{label}</span>
      <span className="text-silver/80">
        {typed}
        {!done && active && (
          <motion.span
            className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-cyan align-middle"
            animate={{ opacity: [1, 0.2] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        )}
      </span>
    </p>
  );
}

export function TerminalReadout() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [line2Go, setLine2Go] = useState(false);

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-24 md:px-10 md:py-28">
      <h2 className="mb-10 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        ~/sys/readout
      </h2>
      <div
        ref={ref}
        className="overflow-hidden rounded-lg border border-white/10 bg-[#141414] shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[10px] text-silver/35">
            micah@portfolio — zsh
          </span>
        </div>
        <div className="space-y-4 px-4 py-5 md:px-6 md:py-6">
          <TypeLine
            label={LINE_1_LABEL}
            value={LINE_1_VALUE}
            startDelay={200}
            active={inView}
            onComplete={() => setLine2Go(true)}
          />
          <TypeLine
            label={LINE_2_LABEL}
            value={LINE_2_VALUE}
            startDelay={0}
            active={inView && line2Go}
          />
        </div>
      </div>
    </section>
  );
}
