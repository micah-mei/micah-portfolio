/** Public resume PDF (served from `/public/Resume/`). */
export const RESUME_PDF_HREF = "/Resume/Micah_Yutao_Mei_Resume.pdf";

/** Client-safe URLs for footer social icons (set in `.env.local`). */
export function getPublicSocialLinks(): {
  linkedin: string;
  github: string;
  email: string;
} {
  return {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ?? "",
    github: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() ?? "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  };
}
