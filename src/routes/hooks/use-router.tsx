// src/routes/hooks/use-router.tsx
import { useMemo } from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';

// adding type safety interface to help catch mistakes
interface SafeRouter {
  back: () => void;
  forward: () => void;
  reload: () => void;
  push: (href: string) => void;
  replace: (href: string) => void;
}

const emptyRouter = {
  back: () => {},
  forward: () => {},
  reload: () => {},
  push: (_: string) => {},
  replace: (_: string) => {}
};

export function useRouter(): SafeRouter {
  let router = emptyRouter;

  if (!useInRouterContext()) {
    console.warn(
      '[useRouter] called outside <BrowserRouter> context. Returning no-op router.'
    );
    return router;
  }

  try {
    const navigate = useNavigate();
    router = useMemo(
      () => ({
        back: () => navigate(-1),
        forward: () => navigate(1),
        reload: () => window.location.reload(),
        push: (href: string) => navigate(href),
        replace: (href: string) => navigate(href, { replace: true })
      }),
      [navigate]
    );
  } catch (error) {
    console.error(`useRouter: useNavigate failed with error: ${error}`);
    throw error;
  }

  return router;
}
