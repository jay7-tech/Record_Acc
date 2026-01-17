import { HeroSection } from "@/components/sections/hero-section";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { CuratedWorkSection } from "@/components/sections/curated-work-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SkillsDock } from "@/components/sections/skills-dock";
import { AboutSection } from "@/components/sections/about-section";
import { AestheticBackground } from "@/components/aesthetic-background";
import { HudOverlay } from "@/components/ui/hud-overlay";

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden relative min-h-screen">
      <AestheticBackground />
      <HudOverlay />
      <HeroSection />
      <SkillsMarquee />
      <div className="container px-4 md:px-6 space-y-24 md:space-y-32 my-24 md:my-32">
        <AboutSection />

        {/* Decorative Glassy Line - Cosmic Theme */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center py-8">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          <div className="absolute w-2/3 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/80 to-transparent blur-[3px]" />
          <div className="relative z-10 w-3 h-3 rotate-45 border border-violet-500 bg-background shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            <div className="absolute inset-0 m-0.5 bg-violet-500 animate-pulse" />
          </div>
        </div>

        <SkillsDock />

        {/* Glassy Line Art Separator - Cosmic Theme */}
        <div className="relative w-full max-w-4xl mx-auto py-8 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          <div className="absolute w-2/3 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/80 to-transparent blur-[3px]" />
          <div className="relative z-10 w-3 h-3 rotate-45 border border-fuchsia-500 bg-background shadow-[0_0_20px_rgba(192,132,252,0.6)]">
            <div className="absolute inset-0 m-0.5 bg-fuchsia-500 animate-pulse" />
          </div>
        </div>
        <CuratedWorkSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </div>
  );
}
