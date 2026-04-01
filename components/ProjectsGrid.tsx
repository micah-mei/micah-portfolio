"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const ANTIFRAGILE_SCREENSHOT = "/antifragile-pic/antifragile-dashboard.png";
const AEE_PLATFORM_SCREENSHOT = "/AEET-pic/aee-platform-screenshot.png";

function AeePlatformScreenshot() {
  return (
    <figure className="overflow-hidden rounded-lg border border-white/10 bg-black/50 shadow-lg shadow-black/40">
      <img
        src={AEE_PLATFORM_SCREENSHOT}
        alt={
          "AE&E Geomicrobial Technologies corporate platform: public site UI from the linked deployment"
        }
        width={2940}
        height={1666}
        loading="lazy"
        decoding="async"
        className="h-auto w-full object-cover object-top"
      />
      <figcaption className="border-t border-white/10 px-3 py-2 font-mono text-[10px] text-silver/45">
        Linked live build (corporate platform)
      </figcaption>
    </figure>
  );
}

function AntifragileDashboardShot() {
  return (
    <figure className="overflow-hidden rounded-lg border border-white/10 bg-black/50 shadow-lg shadow-black/40">
      <img
        src={ANTIFRAGILE_SCREENSHOT}
        alt="Antifragile Streamlit dashboard: allocations, equity curves, and crash-window overlays vs a 60/40 benchmark"
        width={2940}
        height={1666}
        loading="lazy"
        decoding="async"
        className="h-auto w-full object-cover object-top"
      />
      <figcaption className="border-t border-white/10 px-3 py-2 font-mono text-[10px] text-silver/45">
        Live app UI (Streamlit)
      </figcaption>
    </figure>
  );
}

function projectModalTitleId(cmd: string): string {
  const slug = cmd.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `project-modal-${slug || "project"}`;
}

type Project = {
  cmd: string;
  name: string;
  year: string;
  /** One–two lines on the card face */
  summary: string;
  /** Full write-up shown in the modal */
  detail: React.ReactNode;
  subtitle?: string;
  role?: string;
  link?: string;
  repoLink?: string;
};

const linkClass =
  "inline-flex items-center gap-1.5 font-mono text-xs text-cyan/85 underline decoration-cyan/35 underline-offset-4 transition hover:text-cyan hover:decoration-cyan/60";

const projects: Project[] = [
  {
    cmd: "./aee-platform.open",
    name: "AE&E Corporate Platform",
    subtitle: "Corporate web platform redesign & delivery",
    role: "Project Management Intern · Beijing",
    year: "2025",
    summary:
      "Accelerated a decade-old platform redesign: user research, Figma prototypes, 50→15 strategic journeys, PRDs and stories, and cross-timezone sprint leadership through a responsive Next.js launch.",
    link: "https://aee-t.vercel.app",
    detail: (
      <div className="space-y-4 text-sm leading-relaxed text-silver/65">
        <AeePlatformScreenshot />
        <div className="space-y-2">
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              The context
            </span>
            <br />
            AE&amp;E Geomicrobial Technologies needed alignment on a long-running
            public platform refresh—executive vision, engineering constraints, and a
            dated information architecture had to come together quickly.
          </p>
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              What I did
            </span>
            <br />
            Ran initial user research and built high-fidelity Figma prototypes to
            bridge leadership and engineering. Wrote product requirements, user
            stories, and acceptance criteria while compressing a complex 50-page
            sitemap into 15 streamlined user journeys. Facilitated sprint planning
            and led cross-timezone collaboration between the CEO and the development
            team to ship a responsive experience.
          </p>
        </div>
        <div className="space-y-2 border-l border-cyan/25 pl-3 font-mono text-[11px] leading-relaxed text-silver/55 md:text-xs">
          <p>
            <span className="text-cyan/85">delivery (resume):</span> Responsive Next.js
            web application; Figma; PRDs, user stories, acceptance criteria
          </p>
          <p>
            <span className="text-cyan/85">linked build stack:</span> React (CRA +
            CRACO), Tailwind CSS, Radix UI, React Router; FastAPI; MongoDB
          </p>
        </div>
      </div>
    ),
  },
  {
    cmd: "./antifragile.sim",
    name: "The Antifragile Portfolio",
    subtitle: "Barbell Strategy Simulator & Quantitative Backtester",
    role: "Lead Developer & Product Creator",
    year: "2026",
    summary:
      "Live Streamlit backtest: Taleb-style barbell vs 60/40, yfinance pipeline, crash overlays, Render deploy.",
    link: "https://barbell-dashboard.onrender.com",
    repoLink: "https://github.com/micah-mei/antifragile",
    detail: (
      <div className="space-y-4 text-sm leading-relaxed text-silver/65">
        <AntifragileDashboardShot />
        <div className="space-y-2">
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              The context
            </span>
            <br />
            Traditional financial forecasting leans on normal distributions, which
            understates risk in standard 60/40 (equities/bonds) portfolios. History
            is shaped by fat-tailed shocks—2008 and the 2020 COVID crash—where the
            &quot;fragile middle&quot; breaks down into deep drawdowns and ruin risk.
          </p>
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              The product
            </span>
            <br />I built a live data app to interactively backtest Nassim Nicholas
            Taleb&apos;s barbell idea: heavy weight (e.g. ~90%) in hyper-safe,
            liquid short-term Treasuries and a small, capped sleeve in convex
            exposure (e.g. volatility-tracking ETFs). The UI shows how that posture
            behaves through crashes versus a conventional blend.
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan/75">
            Key features
          </h4>
          <ul className="list-outside list-disc space-y-2 pl-5 text-xs leading-relaxed text-silver/60 md:text-[13px]">
            <li className="pl-1">
              Interactive simulation: sidebar allocations update equity curves
              against historical regimes in real time.
            </li>
            <li className="pl-1">
              UI safeguards: speculative weights clamp automatically so totals never
              exceed 100% and the safe sleeve fills the remainder.
            </li>
            <li className="pl-1">
              Visual analytics: highlights major crash windows so users contrast
              drawdowns of a 60/40 benchmark vs barbell convexity.
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan/75">
            Engineering
          </h4>
          <ul className="list-outside list-disc space-y-2 pl-5 text-xs leading-relaxed text-silver/60 md:text-[13px]">
            <li className="pl-1">
              Data pipeline: yfinance + pandas with resilient column selection (Adj
              Close vs Close, MultiIndex handling).
            </li>
            <li className="pl-1">
              Timezone normalization via naive calendar dates before row drops,
              fixing cross-ticker misalignment and silent data loss.
            </li>
            <li className="pl-1">
              <code className="text-cyan/70">@st.cache_data</code> on loads to cut
              API churn and rate limits during rapid slider use.
            </li>
            <li className="pl-1">
              IaC: <code className="text-cyan/70">render.yaml</code> blueprint for
              continuous deploy to Render.
            </li>
          </ul>
        </div>
        <div className="space-y-2 border-l border-cyan/25 pl-3 font-mono text-[11px] leading-relaxed text-silver/55 md:text-xs">
          <p>
            <span className="text-cyan/85">frontend:</span> Streamlit, Matplotlib
          </p>
          <p>
            <span className="text-cyan/85">backend &amp; data:</span> Python, Pandas,
            yfinance
          </p>
          <p>
            <span className="text-cyan/85">deploy:</span> Git, Render, YAML
          </p>
        </div>
      </div>
    ),
  },
  {
    cmd: "./shelfie.exe",
    name: "Shelfie",
    subtitle: "Smart Pantry Tracker · digital inventory & food-waste reduction",
    role: "Product Strategy & UI/UX Design",
    year: "2026",
    summary:
      "Product strategy for a household inventory app—PRDs for proactive expiry alerts, real-time household sync, and AI receipt scanning to cut waste and build trust.",
    detail: (
      <div className="space-y-4 text-sm leading-relaxed text-silver/65">
        <div className="space-y-2">
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              The product
            </span>
            <br />
            Shelfie targets household food waste with a digital pantry: clearer
            visibility into what you have, when it expires, and how the whole
            household stays in sync.
          </p>
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              What I owned
            </span>
            <br />
            Led product strategy end-to-end—defining requirements for proactive
            expiry push notifications, real-time household syncing, and an
            AI-powered receipt scanning flow that turns paper receipts into
            structured pantry data, with emphasis on model confidence, UX trust, and
            retention hooks.
          </p>
        </div>
      </div>
    ),
  },
  {
    cmd: "./task-manager.sh",
    name: "AI Task Management System",
    subtitle: "LLMs · goal decomposition",
    role: "Product Design & LLM integration",
    year: "2025",
    summary:
      "AI-enabled task app that lowers friction on complex goals—requirements, LLM integration, and automatic generation of actionable sub-tasks with dependencies.",
    detail: (
      <div className="space-y-4 text-sm leading-relaxed text-silver/65">
        <div className="space-y-2">
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              The problem
            </span>
            <br />
            Starting on ambitious goals is slow when users must manually break work
            into tasks, dependencies, and order of operations.
          </p>
          <p>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">
              What I shipped
            </span>
            <br />
            Defined product requirements and integrated large language models so the
            product turns a stated goal into a validated subgraph of sub-tasks—
            including parallel workstreams—reducing startup friction for planners
            and operators.
          </p>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-cyan/70 md:text-xs">
          {`$ ingest goal --model gpt-4
> parsing intent… OK
> subgraph: 4 tasks (2 parallel)
$ run planner --depth 2
● write_spec → ● scaffold_api → ○ ship`}
        </pre>
      </div>
    ),
  },
];

function ProjectLinks({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (!project.link && !project.repoLink) return null;
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 ${className ?? ""}`}>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {project.repoLink ? "Live app" : "View live site"}
          <span aria-hidden className="text-[10px] opacity-80">
            ↗
          </span>
        </a>
      ) : null}
      {project.repoLink ? (
        <a
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          GitHub
          <span aria-hidden className="text-[10px] opacity-80">
            ↗
          </span>
        </a>
      ) : null}
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close project details"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={projectModalTitleId(project.cmd)}
        className="relative z-[1] min-w-0 max-h-[min(88vh,900px)] w-full max-w-2xl overflow-y-auto overflow-x-hidden break-words rounded-xl border border-white/15 bg-charcoal/95 p-6 shadow-2xl shadow-cyan/5 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-cyan/90">{project.cmd}</p>
            <h2
              id={projectModalTitleId(project.cmd)}
              className="mt-2 font-sans text-xl font-medium text-silver md:text-2xl"
            >
              {project.name}{" "}
              <span className="font-mono text-base font-normal text-silver/40">
                ({project.year})
              </span>
            </h2>
            {project.subtitle ? (
              <p className="mt-2 text-sm text-silver/55">{project.subtitle}</p>
            ) : null}
            {project.role ? (
              <p className="mt-1 font-mono text-[11px] text-silver/45">
                {project.role}
              </p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-silver/70 transition hover:border-cyan/35 hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan/50"
          >
            Close
          </button>
        </div>
        <div className="mt-6">{project.detail}</div>
        <ProjectLinks project={project} className="mt-8 border-t border-white/10 pt-6" />
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    try {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${r.width / 2}px`);
      el.style.setProperty("--my", `${r.height / 2}px`);
      xTo.current = gsap.quickTo(el, "--mx", { duration: 0.2, unit: "px" });
      yTo.current = gsap.quickTo(el, "--my", { duration: 0.2, unit: "px" });
    } catch {
      xTo.current = null;
      yTo.current = null;
    }
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
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-lg backdrop-blur-[12px] transition-[border-color] duration-300 hover:border-cyan/25"
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
            "radial-gradient(circle 140px at var(--mx) var(--my), rgba(0,240,255,0.12), transparent 55%)",
        }}
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${project.name} (${project.year}) — open project details`}
        className="relative z-[1] flex w-full flex-col items-stretch gap-0 p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan/50"
      >
        <span className="block font-mono text-xs text-cyan/90">{project.cmd}</span>
        <span className="mt-2 block font-sans text-lg font-medium text-silver">
          {project.name}{" "}
          <span className="font-mono text-sm font-normal text-silver/40">
            ({project.year})
          </span>
        </span>
        {project.subtitle ? (
          <span className="mt-1.5 line-clamp-2 block text-sm text-silver/50">
            {project.subtitle}
          </span>
        ) : null}
        {project.role ? (
          <span className="mt-1 block font-mono text-[10px] text-silver/35 md:text-[11px]">
            {project.role}
          </span>
        ) : null}
        <span className="mt-3 block text-sm leading-snug text-silver/60">
          {project.summary}
        </span>
        <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-cyan/75 transition group-hover:text-cyan">
          Open details
          <span aria-hidden className="text-xs">
            →
          </span>
        </span>
      </button>
    </div>
  );
}

export function ProjectsGrid() {
  const [openCmd, setOpenCmd] = useState<string | null>(null);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const openProject = openCmd
    ? projects.find((p) => p.cmd === openCmd) ?? null
    : null;

  const closeModal = useCallback(() => setOpenCmd(null), []);

  useEffect(() => {
    setPortalEl(document.body);
  }, []);

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
          <ProjectCard
            key={p.cmd}
            project={p}
            onOpen={() => setOpenCmd(p.cmd)}
          />
        ))}
      </div>
      {openProject && portalEl
        ? createPortal(
            <ProjectModal project={openProject} onClose={closeModal} />,
            portalEl,
          )
        : null}
    </section>
  );
}
