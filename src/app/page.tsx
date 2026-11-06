import { HeroSection } from "@/components/sections/hero-section";
import { AiLabSection } from "@/components/sections/ai-lab-section";
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
      <div className="container px-4 md:px-6 space-y-16 md:space-y-32 mt-12 md:mt-32 mb-6 md:mb-16">
        <AiLabSection />

        {/* Decorative Glassy Line - AI Lab to Profile */}
        <div className="relative w-full max-w-4xl mx-auto py-5 md:py-6 flex items-center justify-center">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
          <div className="absolute w-2/3 h-[2px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent blur-[3px]" />
          <div className="relative z-10 w-3 h-3 rotate-45 border border-sky-500 bg-background shadow-[0_0_20px_rgba(56,189,248,0.6)]">
            <div className="absolute inset-0 m-0.5 bg-sky-500 animate-pulse" />
          </div>
        </div>

        <div className="-my-6 md:-my-10">
          <AboutSection />
        </div>

        {/* Decorative Glassy Line - Cosmic Theme */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center py-2 -mb-10 md:-mb-14">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          <div className="absolute w-2/3 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/80 to-transparent blur-[3px]" />
          <div className="relative z-10 w-3 h-3 rotate-45 border border-violet-500 bg-background shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            <div className="absolute inset-0 m-0.5 bg-violet-500 animate-pulse" />
          </div>
        </div>

        <SkillsDock />

        {/* Glassy Line Art Separator - Cosmic Theme */}
        <div className="relative w-full max-w-4xl mx-auto py-2 -mt-10 md:-mt-14 flex items-center justify-center">
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
