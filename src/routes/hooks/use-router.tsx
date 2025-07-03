// src/routes/hooks/use-router.tsx - Debug version
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Add debug logging
console.log('=== USE-ROUTER DEBUG ===');
console.log('React from useMemo import:', typeof useMemo);

// Check if React is available globally
console.log('Global React:', typeof (globalThis as any).React);
console.log('Window React:', typeof (window as any).React);

// DEBUG
import * as React from 'react'; // was import React from 'react';
console.log('use-router React:', React);
console.log('use-router React.useContext:', typeof React?.useContext);

export function useRouter() {
  console.log('useRouter: About to call useNavigate()');
  console.log('useNavigate function:', useNavigate);

  try {
    const navigate = useNavigate();
    console.log('useRouter: useNavigate() succeeded');

    const router = useMemo(
      () => ({
        back: () => navigate(-1),
        forward: () => navigate(1),
        reload: () => window.location.reload(),
        push: (href: string) => navigate(href),
        replace: (href: string) => navigate(href, { replace: true })
      }),
      [navigate]
    );

    return router;
  } catch (error) {
    console.error('useRouter: useNavigate() failed:', error);
    console.error('React at error time:', React);
    throw error;
  }
}
