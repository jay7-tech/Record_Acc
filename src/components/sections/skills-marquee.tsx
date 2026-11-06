
import { marqueeSkills } from "@/lib/data";

export function SkillsMarquee() {
  const skills = [...marqueeSkills, ...marqueeSkills, ...marqueeSkills, ...marqueeSkills];

  const MarqueeContent = () => (
    <div className="flex shrink-0 animate-marquee min-w-full items-center">
      {skills.map((skill, index) => (
        <div key={index} className="flex items-center">
          <span className="mx-6 text-lg font-semibold tracking-wider">
            {skill}
          </span>
          <span className="text-xl">&#x2022;</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full py-24 z-10 my-10 select-none pointer-events-none">
      {/* Background Strap */}
      <div className="absolute inset-0 rotate-6 flex items-center justify-center opacity-60 blur-[1px]">
        <div className="relative w-[200%] h-14 bg-blue-500/20 backdrop-blur-sm flex items-center text-blue-600/40 border-y border-blue-500/10">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
      {/* Main/Foreground Strap */}
      <div className="relative -rotate-6 flex items-center justify-center z-10">
        <div className="relative w-[200%] h-14 bg-blue-500/10 dark:bg-blue-400/10 backdrop-blur-md flex items-center text-blue-600 dark:text-blue-100 border-y border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </div>
  );
}
