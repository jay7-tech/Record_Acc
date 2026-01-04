import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
    { name: 'CV', href: '/resume.pdf', target: '_blank' },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-4 px-3 py-2 rounded-full border border-black/10 bg-white/30 dark:border-white/10 dark:bg-black/30 shadow-lg backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full group-hover:scale-110 transition-transform">
            <Image
              src="/images/project-assets/icon.54fa1035.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="hidden sm:inline font-bold text-foreground">Jaydeep Gowda</span>
        </Link>
        <div className="h-6 w-px bg-border hidden sm:block"></div>
        <ul className="flex items-center gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Button variant="ghost" size="sm" asChild>
                <Link href={link.href} target={link.target}>{link.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <div className="h-6 w-px bg-border hidden sm:block"></div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
