import { DEFAULT_CONTACT_EMAIL } from "@/lib/contactInbox";

/** Public resume PDF (served from `/public/Resume/`). */
export const RESUME_PDF_HREF = "/Resume/Micah2026Resume.pdf";

/** Env overrides when set; defaults so footer icons work without Vercel `NEXT_PUBLIC_*` vars. */
const DEFAULT_PUBLIC_SOCIAL = {
  linkedin: "https://www.linkedin.com/in/micahmei",
  github: "https://github.com/micah-mei",
  email: DEFAULT_CONTACT_EMAIL,
} as const;

export function getPublicSocialLinks(): {
  linkedin: string;
  github: string;
  email: string;
} {
  return {
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ||
      DEFAULT_PUBLIC_SOCIAL.linkedin,
    github:
      process.env.NEXT_PUBLIC_GITHUB_URL?.trim() ||
      DEFAULT_PUBLIC_SOCIAL.github,
    email:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
      DEFAULT_PUBLIC_SOCIAL.email,
  };
}
