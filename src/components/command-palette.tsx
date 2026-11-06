'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import {
  ArrowRight, Github, Linkedin, Mail, FileDown, Sun, Moon,
  User, Code2, Briefcase, Sparkles, Search,
} from 'lucide-react';
import { personalInfo } from '@/lib/data';
import { cn } from '@/lib/utils';

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ElementType;
  action: () => void;
};

/**
 * ⌘K / Ctrl+K command palette — a small, very recognizable signal that
 * whoever built this site thinks like a software engineer, not just a
 * designer. Fuzzy-filters a flat list of navigation + utility actions,
 * fully keyboard-navigable.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const goTo = useCallback((hash: string) => {
    if (window.location.pathname !== '/') {
      router.push(`/${hash}`);
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [router]);

  const commands: Command[] = useMemo(() => [
    { id: 'about', label: 'Go to About', icon: User, action: () => goTo('#about') },
    { id: 'skills', label: 'Go to Skills', icon: Code2, action: () => goTo('#skills') },
    { id: 'projects', label: 'Go to Projects', icon: Sparkles, action: () => goTo('#projects') },
    { id: 'experience', label: 'Go to Experience', icon: Briefcase, action: () => goTo('#experience') },
    { id: 'contact', label: 'Go to Contact', icon: Mail, action: () => goTo('#contact') },
    {
      id: 'email', label: 'Copy email address', hint: personalInfo.email, icon: Mail,
      action: () => navigator.clipboard?.writeText(personalInfo.email),
    },
    {
      id: 'github', label: 'Open GitHub profile', icon: Github,
      action: () => window.open('https://github.com/jay7-tech', '_blank'),
    },
    {
      id: 'linkedin', label: 'Open LinkedIn profile', icon: Linkedin,
      action: () => window.open('https://linkedin.com/in/jay7788', '_blank'),
    },
    {
      id: 'cv', label: 'Download resume (PDF)', icon: FileDown,
      action: () => window.open('/JayadeepGowda_CV.pdf', '_blank'),
    },
    {
      id: 'theme', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
  ], [goTo, theme, setTheme]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q));
  }, [query, commands]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const run = useCallback((cmd: Command) => {
    cmd.action();
    close();
  }, [close]);

  // Global ⌘K / Ctrl+K toggle, plus a custom event so other components
  // (e.g. the header's hint button) can open it without shared state.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') close();
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('open-command-palette', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('open-command-palette', onOpenEvent);
    };
  }, [close]);

  useEffect(() => setActiveIndex(0), [query]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault();
      run(filtered[activeIndex]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          onKeyDown={onListKeyDown}
          className="fixed left-1/2 top-[18%] z-[201] w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-sky-400/20 bg-card/95 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Jump to a section, copy email, open GitHub…"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <kbd className="mono-label hidden sm:inline rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">esc</kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matching command.</p>
            )}
            {filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => run(cmd)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    i === activeIndex ? 'bg-signal/10 text-foreground' : 'text-foreground/80'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', i === activeIndex ? 'text-signal' : 'text-muted-foreground')} />
                  <span className="flex-1">{cmd.label}</span>
                  {cmd.hint && <span className="text-xs text-muted-foreground">{cmd.hint}</span>}
                  {i === activeIndex && <ArrowRight className="h-3.5 w-3.5 text-signal" />}
                </button>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
