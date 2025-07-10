// src/routes/index.tsx
import FormPage from '@/pages/form';
import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const TerminalPage = lazy(() => import('@/pages/terminal'));
const StudentPage = lazy(() => import('@/pages/students'));
const StudentDetailPage = lazy(
  () => import('@/pages/students/StudentDetailPage')
);
/*
import DashboardLayout from '@/components/layout/dashboard-layout'
import DashboardPage from '@/pages/dashboard'
import TerminalPage from '@/pages/terminal'
import SignInPage from '@/pages/auth/signin';
import StudentPage from '@/pages/students';
import StudentDetailPage from '@/pages/students/StudentDetailPage'
*/
// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true
        },
        {
          path: 'team',
          element: <StudentPage /> // Modify this component
        },
        {
          path: 'team/details',
          element: <StudentDetailPage /> // Modify this component
        },
        {
          path: 'form',
          element: <FormPage />
        },
        {
          path: 'identity-stores',
          element: <div>Identity Stores</div> // Create this component
        },
        {
          path: 'network-security',
          element: <div>Network Security</div> // Create this component
        },
        {
          path: 'data-stores',
          element: <div>Data Stores</div> // Create this component
        },
        {
          path: 'terminal',
          element: <TerminalPage /> // Create this component
        },
        {
          path: 'chat',
          element: <div>Chat</div> // Create this component
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];
  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
