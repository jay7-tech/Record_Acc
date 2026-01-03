import { HeroSection } from "@/components/sections/hero-section";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { CuratedWorkSection } from "@/components/sections/curated-work-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SkillsDock } from "@/components/sections/skills-dock";
import { AboutSection } from "@/components/sections/about-section";
import { AestheticBackground } from "@/components/aesthetic-background";

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden relative min-h-screen">
      <AestheticBackground />
      <HeroSection />
      <SkillsMarquee />
      <div className="container px-4 md:px-6 space-y-24 md:space-y-32 my-24 md:my-32">
        <AboutSection />

        {/* Decorative Glassy Line */}
        <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center opacity-70">
          <div className="absolute inset-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm" />
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_2px_rgba(96,165,250,0.5)]" />
        </div>

        <SkillsDock />

        {/* Glassy Line Art Separator - Bright Version */}
        <div className="relative w-full max-w-4xl mx-auto py-8 flex items-center justify-center opacity-90">
          {/* Main Gradient Line - Stronger */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Glow Effect - Intense */}
          <div className="absolute w-2/3 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent blur-[3px]" />

          {/* Center Diamond/Art Element - Shining */}
          <div className="relative z-10 w-3 h-3 rotate-45 border border-primary bg-background shadow-[0_0_20px_rgba(255,193,7,0.6)]">
            <div className="absolute inset-0 m-0.5 bg-primary animate-pulse" />
          </div>
        </div>
        <CuratedWorkSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </div>
  );
}
