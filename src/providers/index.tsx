// services/frontend/dashboard/src/providers/index.tsx

// DEBUG
// Add this to the TOP of src/providers/index.tsx
console.log('=== PROVIDERS/INDEX DEBUG ===');
import * as React from 'react'; // was import React from 'react';
console.log('providers/index React:', React);
console.log('providers/index React.ReactNode:', typeof React?.ReactNode);

import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '@/providers/theme-provider';
import { SidebarProvider } from '@/hooks/use-sidebar';

export const queryClient = new QueryClient();

const ErrorFallback = ({ error }: FallbackProps) => {
  console.log('ErrorFallback: About to call useRouter()');
  console.log('ErrorFallback React at call time:', React);

  try {
    const router = useRouter();
    console.log('ErrorFallback: useRouter() succeeded');

    console.log('error', error);
    return (
      <div
        className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
        role="alert"
      >
        <h2 className="text-2xl font-semibold">
          Ooops, something went wrong :(
        </h2>
        <pre className="text-2xl font-bold">{error.message}</pre>
        <pre>{error.stack}</pre>
        <Button className="mt-4" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  } catch (routerError) {
    console.error('ErrorFallback: useRouter() failed:', routerError);
    console.error('React at router error time:', React);

    // Fallback UI when even the error fallback fails
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center text-red-500">
        <h2>Critical Error: Router Failed</h2>
        <pre>{error.message}</pre>
        <pre>Router Error: {routerError.message}</pre>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
};

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <HelmetProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools />
              <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  );
}
