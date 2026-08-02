import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Disable the browser's own automatic scroll restoration once, at module
// load - it can otherwise re-apply a remembered scroll position after our
// own reset below, especially right after a lazy-loaded route's real
// content finishes painting (see the comment in the effect for why).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/**
 * React Router doesn't reset scroll position on navigation by default -
 * and in layouts like ours, the scrollable element is an inner <main> with
 * its own overflow-y-auto (not the window), so a plain window.scrollTo(0,0)
 * on route change wouldn't do anything. This resets both the window and
 * the given container ref to the top whenever the route path changes.
 */
export function useScrollToTop() {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const reset = () => {
      if (ref.current) ref.current.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    // Reset immediately (covers the common case)...
    reset();
    // ...and again after the next paint. Lazy-loaded route targets (most
    // pages here are React.lazy()) render their real content asynchronously
    // behind a brief Suspense fallback - an immediate reset can happen
    // before that real content (with its real, different height) has
    // actually painted, so a second reset once the browser has caught up
    // makes sure the final rendered page is the one that's actually at the
    // top, not just the fallback.
    const raf = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return ref;
}
