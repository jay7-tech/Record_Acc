'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitCommitHorizontal, Star, BookMarked, Users } from 'lucide-react';

type Stats = {
  publicRepos: number;
  followers: number;
  stars: number;
};

type YearCommits = { year: number; count: number };

const GITHUB_USER = 'jay7-tech';
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR];

/**
 * Pulls real, live numbers from the public GitHub REST API at runtime
 * (no auth, no backend) — a small proof-of-work strip that's actually
 * backed by data instead of a decorative, hand-typed stat.
 */
export function GithubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [commits, setCommits] = useState<YearCommits[] | null>(null);
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

    // Separate, independent fetch: the per-year commit count comes from the
    // (unauthenticated, rate-limited) search API, so a hiccup here should
    // never take down the main stats strip above.
    async function loadCommits() {
      try {
        const results = await Promise.all(
          YEARS.map(async (year) => {
            const res = await fetch(
              `https://api.github.com/search/commits?q=author:${GITHUB_USER}+author-date:${year}-01-01..${year}-12-31`,
              { headers: { Accept: 'application/vnd.github.cloak-preview+json' } }
            );
            if (!res.ok) throw new Error('commit search error');
            const data = await res.json();
            return { year, count: data.total_count ?? 0 };
          })
        );
        if (!cancelled) setCommits(results);
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

  const maxCommits = commits ? Math.max(1, ...commits.map((c) => c.count)) : 1;

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
          <GitCommitHorizontal className="h-3.5 w-3.5 text-signal" />
          <div className="flex items-end gap-1 h-4" title={commits?.map((c) => `${c.year}: ${c.count}`).join(' · ')}>
            {(commits ?? YEARS.map((year) => ({ year, count: undefined }))).map(({ year, count }) => (
              <div
                key={year}
                className="w-1.5 rounded-sm bg-signal/70"
                style={{
                  height: count === undefined ? 6 : Math.max(3, Math.round((count / maxCommits) * 16)),
                }}
              />
            ))}
          </div>
          <span className="text-muted-foreground">Commits / yr</span>
        </div>
      )}
    </motion.div>
  );
}
