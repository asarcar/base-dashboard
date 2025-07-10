// src/routes/hooks/use-pathname
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

/**
 * Safe hook for retrieving pathname.
 * Prevents runtime crash if called outside <BrowserRouter> context.
 */
export function usePathname(): string {
  try {
    const { pathname } = useLocation();
    return useMemo(() => pathname, [pathname]);
  } catch (err) {
    console.warn('[usePathname] used outside of Router:', err);
    return ''; // avoid .startsWith(undefined)
  }
}
