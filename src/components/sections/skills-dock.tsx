"use client";

import { skills } from '@/lib/data';
import { AnimatedSection } from '../animated-section';
import React from 'react';
import {
  SiMongodb, SiReact, SiNodedotjs, SiPython, SiTypescript,
  SiJavascript, SiDocker, SiGit, SiWebrtc,
  SiTailwindcss, SiOpencv, SiCplusplus,
  SiPostgresql, SiFastapi, SiLangchain, SiOllama, SiPytorch, SiNextdotjs,
  SiTensorflow, SiOnnx, SiRos, SiHuggingface, SiLinux, SiIntel,
} from 'react-icons/si';
import { Bot, ScanLine, Cpu, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Magnetic } from '@/components/ui/magnetic';

const AntigravityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <defs>
      <linearGradient id="antigravity-gradient" x1="0%" y1="100%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#818CF8" />
      </linearGradient>
    </defs>
    <path d="M20 80 C20 30, 80 30, 80 80" fill="none" stroke="url(#antigravity-gradient)" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const iconMap: { [key: string]: React.ElementType } = {
  SiMongodb, SiReact, SiNodedotjs, SiPython, SiTypescript, SiJavascript,
  SiDocker, SiGit, SiWebrtc, SiTailwindcss, SiOpencv, SiCplusplus,
  SiPostgresql, SiFastapi, SiLangchain, SiOllama, SiPytorch, SiNextdotjs,
  SiTensorflow, SiOnnx, SiRos, SiHuggingface, SiLinux, SiIntel,
  Bot, ScanLine, Cpu, Target, AntigravityIcon,
};

// Each brand logo keeps its real-world color instead of being flattened to
// a single neutral tone — the tile itself stays uniform blue glass so the
// wall still reads as one cohesive system.
const BRAND_COLOR: Record<string, string> = {
  SiPython: '#4B8BBE',
  SiJavaScript: '#F7DF1E',
  SiJavascript: '#F0DB4F',
  SiTypescript: '#3178C6',
  SiCplusplus: '#659AD2',
  SiPostgresql: '#4169E1',
  SiMongodb: '#47A248',
  SiFastapi: '#05998B',
  SiNodedotjs: '#5FA04E',
  SiReact: '#58C4DC',
  SiNextdotjs: '#A8C7FA',
  SiTailwindcss: '#38BDF8',
  SiDocker: '#2496ED',
  SiGit: '#F1502F',
  SiPytorch: '#EE4C2C',
  SiLangchain: '#2EB88A',
  SiOllama: '#9CA3AF',
  SiWebrtc: '#5FC9F3',
  SiOpencv: '#8CA7D8',
  SiTensorflow: '#FF6F00',
  SiOnnx: '#9B9B9B',
  SiRos: '#22ADF2',
  SiHuggingface: '#FFBD59',
  SiLinux: '#E8B339',
  SiIntel: '#0071C5',
  Bot: '#38BDF8',
  ScanLine: '#38BDF8',
  Cpu: '#38BDF8',
  Target: '#38BDF8',
  AntigravityIcon: '#38BDF8',
};

// Ordering only — skills are no longer grouped into separate sections,
// just laid out in this sequence so related logos still drift near each other.
const CATEGORY_ORDER = ['Languages', 'AI & Machine Learning', 'Frameworks & Web', 'Systems & Tooling'] as const;

const CATEGORY_MAP: Record<string, typeof CATEGORY_ORDER[number]> = {
  'Python': 'Languages',
  'JavaScript': 'Languages',
  'TypeScript': 'Languages',
  'C++': 'Languages',
  'SQL': 'Languages',
  'Machine Learning': 'AI & Machine Learning',
  'Computer Vision': 'AI & Machine Learning',
  'Large Language Models': 'AI & Machine Learning',
  'LangChain': 'AI & Machine Learning',
  'Ollama': 'AI & Machine Learning',
  'TensorFlow': 'AI & Machine Learning',
  'ONNX': 'AI & Machine Learning',
  'OpenCV': 'AI & Machine Learning',
  'Antigravity': 'AI & Machine Learning',
  'PyTorch': 'AI & Machine Learning',
  'YOLO': 'AI & Machine Learning',
  'Hugging Face': 'AI & Machine Learning',
  'OpenVINO': 'AI & Machine Learning',
  'React': 'Frameworks & Web',
  'Next.js': 'Frameworks & Web',
  'Node.js': 'Frameworks & Web',
  'FastAPI': 'Frameworks & Web',
  'Tailwind CSS': 'Frameworks & Web',
  'MongoDB': 'Systems & Tooling',
  'Docker': 'Systems & Tooling',
  'Git': 'Systems & Tooling',
  'Embedded Systems': 'Systems & Tooling',
  'WebRTC': 'Systems & Tooling',
  'ROS2': 'Systems & Tooling',
  'Linux': 'Systems & Tooling',
};

export function SkillsDock() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
  };

  const item = {
    hidden: { y: 24, opacity: 0, scale: 0.85 },
    show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 140, damping: 14 } },
  };

  const orderedSkills = [...skills].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(CATEGORY_MAP[a.name] ?? 'Systems & Tooling');
    const bi = CATEGORY_ORDER.indexOf(CATEGORY_MAP[b.name] ?? 'Systems & Tooling');
    return ai - bi;
  });

  return (
    <AnimatedSection id="skills">
      <div className="text-center">
        <p className="mono-label text-sm text-muted-foreground">/ 03 Stack</p>
        <h2 className="font-headline text-4xl md:text-5xl mt-2">
          The Build <span className="text-gradient-signal">Manifesto</span>
        </h2>
      </div>

      <motion.div
        className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-14 md:gap-x-14 md:gap-y-16 max-w-5xl mx-auto py-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        {orderedSkills.map((skill) => {
          const Icon = typeof skill.icon === 'string' ? iconMap[skill.icon] : skill.icon;
          const iconKey = typeof skill.icon === 'string' ? skill.icon : skill.name;
          const brandColor = BRAND_COLOR[iconKey] ?? 'hsl(var(--signal))';
          return (
            <Magnetic key={skill.name}>
              <motion.div
                variants={item}
                className="group flex flex-col items-center gap-2"
              >
                {Icon && (
                  <Icon
                    className="h-11 w-11 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_10px_rgba(56,189,248,0.15)]"
                    style={{ color: brandColor }}
                  />
                )}
                <span className="text-[11px] font-medium leading-tight text-foreground/60 text-center transition-colors group-hover:text-foreground">
                  {skill.name}
                </span>
              </motion.div>
            </Magnetic>
          );
        })}
      </motion.div>
    </AnimatedSection>
  );
}
