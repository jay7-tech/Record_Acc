"use client";

import { useEffect } from "react";

/**
 * Browsers remember scroll position across a page refresh by default
 * (`history.scrollRestoration = 'auto'`), so reloading the homepage after
 * scrolling down drops you back where you were instead of at the hero.
 * We want every fresh load to open on the hero/top section, but we don't
 * want to break intentional anchor links (e.g. `/#ai-lab` from the Lab
 * page's "Back to portfolio" link) or normal in-app client-side navigation.
 *
 * Mounted once in the root layout, this runs only on a true document load
 * (hard refresh, direct URL visit, or external link in) — not on
 * client-side route transitions, since the root layout persists across
 * those. It opts the browser out of automatic scroll restoration, then
 * scrolls to top only when the URL carries no hash to honor.
 */
export function ScrollRestoration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
