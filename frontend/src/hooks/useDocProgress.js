import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const LOCAL_STORAGE_KEY = 'th_docs_read_progress';

function readLocalProgress() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeLocalProgress(set) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Private browsing / storage disabled - progress just won't persist,
    // not worth surfacing an error for.
  }
}

/**
 * Real reading-progress tracking for the docs portal, honest about the
 * difference between the two audiences it serves:
 *
 * - Logged-in users get real, backend-persisted progress tied to their
 *   account (via /docs/progress) - it follows them across devices and
 *   sessions, which is what actually matters for a customer working
 *   through onboarding docs over several days.
 * - Anonymous visitors (most homepage/marketing traffic) get a
 *   browser-local fallback via localStorage - still genuinely useful
 *   (their progress persists across a session and repeat visits on the
 *   same browser), just not synced anywhere, since there's no account to
 *   tie it to.
 *
 * Both paths expose the exact same shape, so callers don't need to know
 * or care which one is active.
 */
export function useDocProgress() {
  const { user } = useAuth();
  const [readSlugs, setReadSlugs] = useState(() => (user ? new Set() : readLocalProgress()));
  const [loaded, setLoaded] = useState(!user);

  useEffect(() => {
    if (!user) { setReadSlugs(readLocalProgress()); setLoaded(true); return; }
    setLoaded(false);
    client.get('/docs/progress').then(({ data }) => {
      setReadSlugs(new Set(data.readSlugs || []));
    }).catch(() => setReadSlugs(new Set())).finally(() => setLoaded(true));
  }, [user]);

  const markRead = useCallback((slug) => {
    setReadSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      if (!user) writeLocalProgress(next);
      return next;
    });
    if (user) {
      client.post('/docs/progress', { slug }).catch(() => {});
    }
  }, [user]);

  return { readSlugs, markRead, loaded, isSynced: !!user };
}
