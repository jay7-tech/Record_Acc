'use client';

import { Search } from 'lucide-react';

export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
      className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-signal/40 hover:text-foreground"
      aria-label="Open command palette"
    >
      <Search className="h-3 w-3" />
      <kbd className="mono-label text-[10px]">&#8984;K</kbd>
    </button>
  );
}
