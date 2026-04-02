"use client";

import { motion } from "framer-motion";
import { RESUME_PDF_HREF } from "@/lib/publicSocial";

function IconResume({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </svg>
  );
}

const experiences = [
  {
    title: "Technical Project Management Intern",
    org: "AE&E Geomicrobial Technologies Inc.",
    location: "Beijing, China",
    dates: "May 2025 – Aug. 2025",
    bullets: [
      "Accelerated project alignment for a decade-old platform redesign by bridging the gap between executive vision and engineering constraints through initial user research and high-fidelity Figma prototypes.",
      "Streamlined the development lifecycle, successfully reducing a complex 50-page sitemap into 15 strategic user journeys, by drafting structured PRDs and user flows.",
      "Ensured the timely delivery of a responsive Next.js web application by tracking project KPIs and collaborating closely with engineering and ops teams.",
    ],
  },
  {
    title: "Product Growth Strategist",
    org: "GD Hub Smart Trading Group",
    location: "Vancouver, BC, Canada",
    dates: "Nov. 2024 – Apr. 2025",
    bullets: [
      "Scaled personalized client outreach capacity by 3x and reduced content turnaround time by 40% by leading the end-to-end development of an automated AI-avatar workflow.",
      "Secured executive buy-in for new AI features, overcoming initial stakeholder skepticism, by analyzing engagement data and building a realistic functional prototype using Synthesia.",
      "Iterated on growth mechanisms and informed ongoing product decisions by supporting A/B testing and leveraging basic data analysis to deliver cost-efficient automation strategies.",
    ],
  },
  {
    title: "First Year Representative",
    org: "Tech for Social Impact (TSI)",
    location: "London, ON, Canada",
    dates: "Sep. 2024 – Apr. 2025",
    bullets: [
      "Spearheaded B2B market research to identify small-to-medium enterprises constrained by legacy web infrastructure, generating targeted lead lists for the organization.",
      "Conducted digital needs analyses to quantify the potential sales impact and operational benefits of modernizing client web platforms with technologies like React and Node.js.",
    ],
  },
];

const nodeVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function ExperiencePath() {
  return (
    <section
      id="experience"
      className="relative z-10 mx-auto max-w-3xl scroll-mt-6 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/experience.log
        </h2>
        <a
          href={RESUME_PDF_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/12 bg-black/30 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-silver/70 transition-colors hover:border-cyan/35 hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan/50 md:text-xs"
          aria-label="View resume (PDF, opens in new tab)"
        >
          <IconResume className="h-4 w-4 shrink-0 md:h-[18px] md:w-[18px]" />
          View resume
        </a>
      </div>

      <div className="relative">
        <div
          className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-cyan via-cyan/50 to-transparent shadow-[0_0_12px_rgba(0,240,255,0.35)] md:left-[9px]"
          aria-hidden
        />

        <ul className="flex flex-col gap-20 pb-4">
          {experiences.map((exp, i) => (
            <motion.li
              key={`${exp.org}-${exp.dates}`}
              className="relative pl-10 md:pl-12"
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-12% 0px" }}
              variants={nodeVariants}
            >
              <span
                className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center md:top-2"
                aria-hidden
              >
                <span className="h-2.5 w-2.5 rounded-full border border-cyan bg-charcoal shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              </span>
              <div
                className="absolute left-[7px] top-[18px] hidden h-px w-5 bg-cyan/35 md:left-[9px] md:block md:w-6"
                aria-hidden
              />

              <p className="font-mono text-[11px] text-cyan/90 md:text-xs">
                {exp.dates}
              </p>
              <h3 className="mt-1 font-sans text-lg font-medium text-silver md:text-xl">
                {exp.title}
              </h3>
              <p className="mt-0.5 font-mono text-xs text-silver/50 md:text-sm">
                @ {exp.org}
              </p>
              <p className="mt-1 font-mono text-[11px] text-silver/40 md:text-xs">
                {exp.location}
              </p>
              <ul className="mt-4 max-w-xl list-none space-y-3 p-0 text-sm leading-relaxed text-silver/75 md:text-base">
                {exp.bullets.map((bullet, bi) => (
                  <li key={bi} className="flex gap-2.5">
                    <span className="shrink-0 font-mono text-cyan/60" aria-hidden>
                      –
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
