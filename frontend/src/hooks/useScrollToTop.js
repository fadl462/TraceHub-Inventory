import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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
    if (ref.current) ref.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return ref;
}
