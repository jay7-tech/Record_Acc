'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCommitHorizontal, Star, BookMarked, Users } from 'lucide-react';

type Stats = {
  publicRepos: number;
  followers: number;
  stars: number;
};

const GITHUB_USER = 'jay7-tech';
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Pulls real, live numbers from the public GitHub REST API at runtime
 * (no auth, no backend) — a small proof-of-work strip that's actually
 * backed by data instead of a decorative, hand-typed stat.
 */
export function GithubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [thisYearCount, setThisYearCount] = useState<number | null>(null);
  const [commitsFailed, setCommitsFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
        const user = await userRes.json();
        const repos: Array<{ stargazers_count: number }> = await reposRes.json();

        if (cancelled) return;
        setStats({
          publicRepos: user.public_repos ?? 0,
          followers: user.followers ?? 0,
          stars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    // Separate, independent fetch: GitHub's own commit-search API is too
    // unreliable for this (it only indexes default-branch commits and
    // routinely undercounts), so the total comes from the same
    // contribution-calendar data your GitHub profile's graph is built from —
    // a free, no-auth, CORS-friendly mirror of it. A hiccup here should
    // never take down the main stats strip above.
    async function loadCommits() {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=${CURRENT_YEAR}`);
        if (!res.ok) throw new Error('contributions api error');
        const data: { total?: Record<string, number> } = await res.json();
        if (!cancelled) setThisYearCount(data.total?.[String(CURRENT_YEAR)] ?? 0);
      } catch {
        if (!cancelled) setCommitsFailed(true);
      }
    }

    load();
    loadCommits();
    return () => { cancelled = true; };
  }, []);

  if (failed) return null;

  const items = [
    { label: 'Public Repos', value: stats?.publicRepos, icon: BookMarked },
    { label: 'Stars Earned', value: stats?.stars, icon: Star },
    { label: 'Followers', value: stats?.followers, icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
    >
      <span className="mono-label text-[10px] text-muted-foreground">Live from GitHub</span>
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <Icon className="h-3.5 w-3.5 text-signal" />
          <span className="font-semibold text-foreground tabular-nums">
            {value === undefined ? (
              <span className="inline-block h-3 w-5 animate-pulse rounded bg-muted align-middle" />
            ) : value}
          </span>
          <span className="text-muted-foreground">{label}</span>
        </div>
      ))}

      {!commitsFailed && (
        <div className="flex items-center gap-2 text-sm">
          <GitCommitHorizontal className="h-3.5 w-3.5 text-ember" />
          <span className="font-semibold text-ember tabular-nums">
            {thisYearCount === null ? (
              <span className="inline-block h-3 w-6 animate-pulse rounded bg-muted align-middle" />
            ) : thisYearCount}
          </span>
          <span className="text-muted-foreground">contributions in {CURRENT_YEAR}</span>
        </div>
      )}
    </motion.div>
  );
}
