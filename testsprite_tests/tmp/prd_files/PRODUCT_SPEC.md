# Product Specification — Micah Mei Portfolio

**Version:** 1.0  
**Product type:** Personal marketing site (single-page portfolio)  
**Primary stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS  

---

## 1. Purpose & vision

Deliver a **distinctive, terminal-inspired portfolio** that presents Micah Mei’s academic profile, experience, and projects while signaling comfort with product, CS, and tooling. The experience should feel **crafted** (scroll-driven hero, motion, monospace accents) without sacrificing **readability**, **accessibility basics**, or **reliable contact**.

---

## 2. Goals

| Goal | Description |
|------|-------------|
| **First impression** | Hero uses a **full-viewport JPEG sequence** (120 frames) scrubbed by scroll to create a memorable, high-signal opening. |
| **Credibility** | Clear headline, GPA, school/degree framing, and structured experience + project narratives. |
| **Inbound contact** | Working **contact form** that delivers email via **Resend** to a configured inbox. |
| **Performance** | Preload strategy for hero frames; scroll/draw paths optimized (rAF, frame deduplication). |
| **Maintainability** | Content largely lives in component-local data or constants; env-based secrets for email. |

### Non-goals

- Multi-page routing or blog/CMS (out of scope for v1).
- Authentication or member areas.
- Lenis/smooth-scroll reintroduction unless explicitly re-specified (native scroll is intentional for hero scrubbing).

---

## 3. Target audience

- Recruiters and hiring managers (internships / new grad / early career).
- Faculty, collaborators, or peers scanning for CS + business hybrid profile.
- Visitors who expect a **fast, professional** site that still shows **design and technical taste**.

---

## 4. User-facing experience

### 4.1 Information architecture (single page)

Order on `/`:

1. **Hero** — Full-viewport canvas sequence + name, subtitle (degree / GPA), scroll-driven vignette and end-of-hero handoff.
2. **About** — Terminal-styled block (`about_micah.md` metaphor).
3. **Experience** — Timeline-style list (`~/experience.log`) with roles, orgs, dates, highlights.
4. **Projects** — Grid of project cards with GSAP-driven hover affordances and CLI-flavored labels.
5. **Terminal readout** — Additional narrative / terminal aesthetic section.
6. **Footer / contact** — CLI-style form (`~/contact`) and legal/location copy.

### 4.2 Functional requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| F-1 | Hero scroll range is configurable (`HERO_SCROLL_VH`); progress maps to frame index 0…N−1. | P0 |
| F-2 | Hero frames load from `/public/sequence1/` using `ezgif-frame-001.jpg` … `ezgif-frame-120.jpg`. | P0 |
| F-3 | Loading state shown until preload finishes or fails; user-facing message if **no** frames decode. | P0 |
| F-4 | Optional **custom cursor** (fine pointer only) with error boundary so failures do not brick the page. | P1 |
| F-5 | Contact **POST** to `/api/contact` with JSON `{ name, email, message }`; validation and size limits server-side. | P0 |
| F-6 | Contact success and failure messages surfaced in the UI (including Resend validation hints when applicable). | P0 |
| F-7 | Legacy image URLs `/sequence-1/:id.jpg` rewrite to current sequence paths (middleware). | P1 |

### 4.3 Content (representative — edit in components)

- **SEO:** Title “Micah Mei — Portfolio”; description references Computer Science, Ivey Business, Western University.
- **Experience entries:** e.g. PM intern (AE&E Geomicrobial), Digital Marketing Strategist (GD Hub), with dated highlights.
- **Projects:** e.g. Smart Pantry Tracker, AI Task Management, Dropshipping venture — each with command-style label and body/hover copy.

---

## 5. Technical specification

### 5.1 Runtime & tooling

- **Node:** compatible with Next 14 LTS expectations.
- **Scripts:** `dev` (fixed port **3042** in `package.json`), `build`, `start`, `lint`.
- **Fonts:** Inter (Google), Geist Mono (`geist` package, transpiled in `next.config.mjs`).

### 5.2 Key dependencies

- `next`, `react`, `react-dom`
- `framer-motion` — hero overlays, section motion, cursor springs
- `gsap` — project card interactions
- `resend` — transactional email from API route
- `tailwindcss` — layout and tokens via `globals.css` / Tailwind config

### 5.3 API — `POST /api/contact`

- **Auth:** none (public form); rate limiting not specified in v1 (consider for production hardening).
- **Env:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL` required; optional `CONTACT_FROM` after domain verification.
- **Behavior:** HTML + plain-text email; `replyTo` set to submitter’s email; HTML escaped for injection.
- **Resend test mode:** With default `onboarding@resend.dev`, `CONTACT_TO_EMAIL` must match the Resend account email until a domain is verified.

### 5.4 Static assets

- **Hero:** 120 JPEGs under `public/sequence1/`; URLs built by `lib/constants.ts` (`frameUrl`, `FRAME_COUNT`, etc.).
- **Middleware:** Rewrites old path pattern to current assets to support cached clients.

### 5.5 Quality bar

- `npm run build` completes without type or lint errors (per project ESLint config).
- No secrets committed; `.env.local` gitignored; `.env.example` documents variables.

---

## 6. UX & visual language

- **Theme:** Dark background (`#000` / pitch), silver body text, cyan accents, monospace for “CLI” sections.
- **Motion:** Scroll-linked hero; Framer for opacity/position on overlays; GSAP quickTo-style feel on project hover.
- **Accessibility:** Semantic sections/headings where implemented; decorative cursor should not be sole affordance for critical actions (form remains standard inputs).

---

## 7. Deployment & operations

- **Hosting:** Compatible with Vercel or any Node host that runs Next.js 14.
- **Env in production:** Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and after verification `CONTACT_FROM`.
- **Asset integrity:** `public/sequence1` must be present in the deployment artifact (commit or CI upload).

---

## 8. Success metrics (portfolio context)

- **Qualitative:** Positive recruiter/faculty feedback; form submissions received without manual forwarding.
- **Quantitative (optional):** Lighthouse performance/accessibility spot checks; zero 404s on hero frame URLs in production logs.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Large hero payload | JPEG sequence count/size documented; preload concurrency/timeouts tuned in `useImagePreloader`. |
| Resend test restrictions | Documented in `.env.example` and API error hints. |
| Wrong dev URL / port confusion | Dev script pins port 3042; users open matching Local URL. |
| Contact spam | Future: honeypot, rate limit, or Turnstile (not in current scope). |

---

## 10. Open items / backlog (suggested)

- Remove unused Lenis dependency if permanently dropped, or re-integrate with scroll-safe pattern.
- Optional analytics (privacy-respecting) for traffic and form conversion.
- `sitemap.xml` / `robots.txt` if SEO expansion is needed.
- Automated E2E tests (e.g. Playwright) for hero load and contact happy path.

---

## 11. Document control

| Field | Value |
|-------|--------|
| Repository root | `micah-portfolio` (Micah Mei portfolio) |
| Canonical entry | `app/page.tsx` → sections as listed in §4.1 |
| Spec owner | Product owner / author |

*This specification reflects the codebase as of the document date; update sections when features or content change.*
