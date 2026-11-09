'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, FolderGit2, Briefcase, Mail, FileDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
  { name: 'Projects', href: '#projects', icon: FolderGit2 },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Contact', href: '#contact', icon: Mail },
  { name: 'CV', href: '/JayadeepGowda_CV.pdf?v=2', target: '_blank', icon: FileDown },
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
            <SheetContent side="top" className="rounded-b-3xl pt-10 pb-8 overflow-hidden">
              {/* Soft ambient glow behind the menu — echoes the hero's crystal
                  palette so opening the menu feels like part of the same
                  designed experience, not a bare system sheet. */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/20 blur-[70px] pointer-events-none" />
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="relative flex flex-col items-stretch gap-2">
                {navLinks.slice(0, 3).map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <SheetClose asChild key={link.href}>
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                      >
                        <Link
                          href={link.href}
                          target={link.target}
                          className="group flex items-center gap-3 w-full text-lg font-medium py-3 px-4 rounded-xl transition-colors hover:bg-primary/10"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-4 w-4" />
                          </span>
                          {link.name}
                        </Link>
                      </motion.div>
                    </SheetClose>
                  );
                })}

                <SheetClose asChild>
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.18 }}
                  >
                    <Link
                      href="/JayadeepGowda_CV.pdf?v=2"
                      target="_blank"
                      className="mt-1 flex items-center justify-between w-full text-base font-semibold py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg shadow-primary/25"
                    >
                      <span className="flex items-center gap-2">
                        <FileDown className="h-4 w-4" />
                        Download CV
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </SheetClose>

                <div className="mt-3 flex justify-center">
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
