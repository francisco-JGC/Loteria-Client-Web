import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AdminShell } from '@/app/layout/admin-shell';
import { ProtectedRoute } from '@/app/router/protected-route';
import { RoleGate } from '@/app/router/role-gate';
import { LoginPage } from '@/features/auth/pages/login-page';
import { LatestResultsPage } from '@/features/draw-results/pages/latest-results-page';
import { DrawsPage } from '@/features/games/pages/draws-page';
import { HomePage } from '@/features/home/pages/home-page';
import { UsersPage } from '@/features/users/pages/users-page';
import { APP_ROUTES } from '@/shared/constants/routes';

/**
 * Router assembled with route objects rather than JSX for clarity.
 *
 * Every path here matches a sidebar item in `SidebarNav`. Real feature pages
 * will progressively replace the `<Placeholder />` slots.
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
                element: <Navigate to={APP_ROUTES.home} replace />,
              },
              {
                path: APP_ROUTES.home,
                element: <HomePage />,
              },
              {
                path: APP_ROUTES.sales,
                element: <Placeholder title="Ventas" />,
              },
              {
                path: APP_ROUTES.branchTotals,
                element: <Placeholder title="Totales Por Sucursal" />,
              },
              {
                path: APP_ROUTES.sellerReport,
                element: <Placeholder title="Reporte Diario Vendedor" />,
              },
              {
                path: APP_ROUTES.branchFlowReport,
                element: <Placeholder title="Reporte Flujo Sucursal" />,
              },
              {
                path: APP_ROUTES.billing,
                element: <Placeholder title="Facturación Por Apuestas" />,
              },
              {
                path: APP_ROUTES.winners,
                element: <Placeholder title="Ganadores" />,
              },
              {
                path: APP_ROUTES.expenses,
                element: <Placeholder title="Gastos" />,
              },
              {
                path: APP_ROUTES.movements,
                element: <Placeholder title="Movimientos" />,
              },
              {
                path: APP_ROUTES.movementsCalc,
                element: <Placeholder title="Cálculo Movimientos" />,
              },
              {
                path: APP_ROUTES.users,
                element: <UsersPage />,
              },
              {
                path: APP_ROUTES.draws,
                element: <DrawsPage />,
              },
              {
                path: APP_ROUTES.latestResults,
                element: <LatestResultsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={APP_ROUTES.home} replace /> },
]);

function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm">
        Próximamente — esta sección se conectará al backend en una siguiente
        iteración.
      </p>
    </div>
  );
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
