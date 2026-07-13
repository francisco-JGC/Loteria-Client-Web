import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AdminShell } from '@/app/layout/admin-shell';
import { ProtectedRoute } from '@/app/router/protected-route';
import { RoleGate } from '@/app/router/role-gate';
import { LoginPage } from '@/features/auth/pages/login-page';
import { APP_ROUTES } from '@/shared/constants/routes';

/**
 * Router assembled with route objects rather than JSX for clarity.
 *
 * Layout:
 *   /login                    → LoginPage
 *   /*  (protected + admin)   → AdminShell
 *     /dashboard              → placeholder for now
 *     /games                  → placeholder
 *     /schedules              → placeholder
 *     /draw-results           → placeholder
 *     /sale-points            → placeholder
 *     /users                  → placeholder
 *     /tickets                → placeholder
 */
const router = createBrowserRouter([
  {
    path: APP_ROUTES.login,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGate allow={['admin']} />,
        children: [
          {
            element: <AdminShell />,
            children: [
              {
                path: APP_ROUTES.root,
                element: <Navigate to={APP_ROUTES.dashboard} replace />,
              },
              {
                path: APP_ROUTES.dashboard,
                element: <Placeholder title="Dashboard" />,
              },
              {
                path: APP_ROUTES.games.list,
                element: <Placeholder title="Juegos" />,
              },
              {
                path: APP_ROUTES.schedules,
                element: <Placeholder title="Horarios" />,
              },
              {
                path: APP_ROUTES.drawResults,
                element: <Placeholder title="Resultados" />,
              },
              {
                path: APP_ROUTES.salePoints,
                element: <Placeholder title="Puestos de venta" />,
              },
              {
                path: APP_ROUTES.users,
                element: <Placeholder title="Usuarios" />,
              },
              {
                path: APP_ROUTES.tickets.list,
                element: <Placeholder title="Boletos" />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={APP_ROUTES.dashboard} replace /> },
]);

function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm">Próximamente</p>
    </div>
  );
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
