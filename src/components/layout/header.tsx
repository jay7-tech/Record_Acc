'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CommandPaletteTrigger } from '@/components/command-palette-trigger';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

const navLinks = [
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
  { name: 'CV', href: '/JayadeepGowda_CV.pdf?v=2', target: '_blank' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-fit">
      <nav className="flex items-center gap-2 sm:gap-4 px-2.5 sm:px-3 py-2 rounded-full border border-black/10 bg-white/30 dark:border-white/10 dark:bg-black/30 shadow-lg backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-full group-hover:scale-110 transition-transform">
            <Image
              src="/images/project-assets/icon.54fa1035.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="hidden md:inline font-bold text-foreground whitespace-nowrap">Jaydeep Gowda</span>
        </Link>

        {/* Full nav — tablet and up */}
        <div className="h-6 w-px bg-border hidden sm:block"></div>
        <ul className="hidden sm:flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Button variant="ghost" size="sm" asChild>
                <Link href={link.href} target={link.target}>{link.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
        <div className="h-6 w-px bg-border hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-1">
          <CommandPaletteTrigger />
          <ThemeToggle />
        </div>

        {/* Mobile: hamburger opens a sheet with the links, theme toggle stays visible */}
        <div className="flex sm:hidden items-center gap-0.5">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="rounded-b-3xl pt-10 pb-8">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col items-center gap-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      target={link.target}
                      className="w-full text-center text-lg font-medium py-3 rounded-xl transition-colors hover:bg-muted"
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-2">
                  <CommandPaletteTrigger />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
