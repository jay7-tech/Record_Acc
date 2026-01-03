import { personalInfo } from '@/lib/data';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 px-4 bg-background/60 backdrop-blur-xl z-50 relative mt-auto overflow-hidden border-t border-white/5">
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">

        {/* Copyright */}
        <div className="text-sm text-muted-foreground font-medium text-center md:text-left">
          &copy; {currentYear} <span className="text-foreground font-bold tracking-tight">Jayadeep Gowda</span>.
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          {personalInfo.socials.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-full hover:bg-white/5 transition-all duration-300"
                aria-label={social.name}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300 relative z-10" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
