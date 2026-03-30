"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

type Project = {
  cmd: string;
  name: string;
  year: string;
  body: React.ReactNode;
  hover: string;
  /** Live site / demo URL */
  link?: string;
};

const projects: Project[] = [
  {
    cmd: "./aee-platform.open",
    name: "AE&E Corporate Platform",
    year: "2025",
    link: "https://aee-t.vercel.app",
    hover:
      "Strategic redesign: distilled a complex sitemap into streamlined user journeys—clearer navigation and stronger retention on the corporate site.",
    body: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-silver/65">
          Product and UX direction for AE&amp;E Geomicrobial Technologies&apos; public
          platform—information architecture, navigation, and alignment with stakeholders
          through launch.
        </p>
        <div className="space-y-2 border-l border-cyan/25 pl-3 font-mono text-[11px] leading-relaxed text-silver/55 md:text-xs">
          <p>
            <span className="text-cyan/85">frontend:</span> React (CRA + CRACO),
            Tailwind CSS, Radix UI, React Router
          </p>
          <p>
            <span className="text-cyan/85">backend:</span> FastAPI service with
            MongoDB
          </p>
        </div>
      </div>
    ),
  },
  {
    cmd: "./shelfie.exe",
    name: "Smart Pantry Tracker",
    year: "2026",
    hover:
      "Product strategy for an AI-powered receipt scanning feature: user journeys, edge cases, and phased rollout.",
    body: (
      <p className="text-sm leading-relaxed text-silver/65">
        Receipt → structured pantry data. Strategy for model confidence, UX
        trust, and retention hooks.
      </p>
    ),
  },
  {
    cmd: "./task-manager.sh",
    name: "AI Task Management System",
    year: "2025",
    hover:
      "LLM pipeline decomposes goals into actionable sub-tasks with validation and dependency hints.",
    body: (
      <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-cyan/70 md:text-xs">
        {`$ ingest goal --model gpt-4
> parsing intent… OK
> subgraph: 4 tasks (2 parallel)
$ run planner --depth 2
● write_spec → ● scaffold_api → ○ ship`}
      </pre>
    ),
  },
  {
    cmd: "./gonggis.run",
    name: "Dropshipping Venture",
    year: "2025",
    hover:
      "Creative + analytics flywheel: content experiments tied to conversion and supplier lead times.",
    body: (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-cyan/90">
            views_total
          </span>
          <span className="rounded border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[10px] text-silver">
            2M+
          </span>
        </div>
        <div className="h-10 rounded border border-white/10 bg-gradient-to-r from-cyan/20 via-white/5 to-transparent" />
        <p className="font-mono text-[10px] text-silver/45">
          Gonggi toys — short-form funnel → storefront velocity
        </p>
      </div>
    ),
  },
];

function ProjectCard({ project }: { project: Project }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${r.width / 2}px`);
    el.style.setProperty("--my", `${r.height / 2}px`);
    xTo.current = gsap.quickTo(el, "--mx", { duration: 0.2, unit: "px" });
    yTo.current = gsap.quickTo(el, "--my", { duration: 0.2, unit: "px" });
    return () => {
      xTo.current = null;
      yTo.current = null;
    };
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el || !xTo.current || !yTo.current) return;
    const r = el.getBoundingClientRect();
    xTo.current(e.clientX - r.left);
    yTo.current(e.clientY - r.top);
  };

  const onLeave = () => {
    const el = rootRef.current;
    if (!el || !xTo.current || !yTo.current) return;
    const r = el.getBoundingClientRect();
    xTo.current(r.width / 2);
    yTo.current(r.height / 2);
  };

  return (
    <div
      ref={rootRef}
      role="article"
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-[12px] transition-[border-color] duration-300 hover:border-cyan/25"
      style={
        {
          "--mx": "0px",
          "--my": "0px",
        } as React.CSSProperties
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle 140px at var(--mx) var(--my), rgba(0,240,255,0.15), transparent 55%)",
        }}
      />
      <div className="relative z-[1]">
        <p className="font-mono text-xs text-cyan/90">{project.cmd}</p>
        <h3 className="mt-2 font-sans text-lg font-medium text-silver">
          {project.name}{" "}
          <span className="font-mono text-sm font-normal text-silver/40">
            ({project.year})
          </span>
        </h3>
        <div className="mt-4">{project.body}</div>
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-cyan/85 underline decoration-cyan/35 underline-offset-4 transition hover:text-cyan hover:decoration-cyan/60"
          >
            View live site
            <span aria-hidden className="text-[10px] opacity-80">
              ↗
            </span>
          </a>
        ) : null}
        <p className="mt-4 max-h-0 overflow-hidden font-mono text-xs leading-relaxed text-cyan/80 opacity-0 transition-all duration-300 group-hover:mt-5 group-hover:max-h-40 group-hover:opacity-100">
          {project.hover}
        </p>
      </div>
    </div>
  );
}

export function ProjectsGrid() {
  return (
    <section
      id="projects"
      className="relative z-10 mx-auto max-w-6xl scroll-mt-6 px-6 py-24 md:px-10 md:py-28"
    >
      <h2 className="mb-12 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
        ~/bin/projects
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.cmd} project={p} />
        ))}
      </div>
    </section>
  );
}
