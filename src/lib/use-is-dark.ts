'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether <html> currently has the "dark" class, reactively — so
 * canvas-drawn UI (which can't use Tailwind's `dark:` variant) can repaint
 * itself the moment the theme toggle flips.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  );

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
