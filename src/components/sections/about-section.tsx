import Image from 'next/image';
import { personalInfo } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedSection } from '../animated-section';

export function AboutSection() {
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile-picture');

  return (
    <AnimatedSection id="about" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        <div className="md:col-span-1 flex justify-center relative group">
          {/* Tech HUD Effect Container */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">

            {/* 1. Outer Rotating Dashed Ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-[spin_10s_linear_infinite]" />

            {/* 2. Inner Counter-Rotating Tech Arc */}
            <div className="absolute inset-2 rounded-full border-2 border-t-primary/60 border-r-transparent border-b-transparent border-l-transparent animate-[spin_3s_linear_infinite_reverse]" />

            {/* 3. Pulsing Glow Layer */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />

            {profileImage && (
              <div className="relative w-60 h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_30px_rgba(255,193,7,0.3)] z-10 transition-transform duration-500 group-hover:scale-95">
                <Image
                  src={profileImage.imageUrl}
                  alt="A photo of Jaydeep Gowda"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={profileImage.imageHint}
                />
              </div>
            )}

            {/* 4. Orbiting Dot (Satellite) */}
            <div className="absolute inset-0 animate-[spin_6s_linear_infinite]">
              <div className="w-3 h-3 bg-primary rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,193,7,1)]" />
            </div>
          </div>
        </div>
        <div className="md:col-span-2 text-center md:text-left">
          <h2 className="font-headline text-3xl md:text-4xl mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground">
            {personalInfo.summary}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
