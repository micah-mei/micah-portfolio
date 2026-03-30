import { HeroScroll } from "@/components/HeroScroll";
import { AboutReadme } from "@/components/AboutReadme";
import { ExperiencePath } from "@/components/ExperiencePath";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { TerminalReadout } from "@/components/TerminalReadout";
import { NetworkFooter } from "@/components/NetworkFooter";
import { SiteNav } from "@/components/SiteNav";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-pitch">
      <SiteNav />
      <HeroScroll />
      <div className="relative z-10">
        <AboutReadme />
        <ExperiencePath />
        <ProjectsGrid />
        <TerminalReadout />
        <NetworkFooter />
      </div>
    </main>
  );
}
