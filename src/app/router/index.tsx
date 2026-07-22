import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AdminShell } from '@/app/layout/admin-shell';
import { ProtectedRoute } from '@/app/router/protected-route';
import { RoleGate } from '@/app/router/role-gate';
import { LoginPage } from '@/features/auth/pages/login-page';
import { UserRole } from '@/features/auth/types';
import { LatestResultsPage } from '@/features/draw-results/pages/latest-results-page';
import { DrawsPage } from '@/features/games/pages/draws-page';
import { HomePage } from '@/features/home/pages/home-page';
import { BranchFlowPage } from '@/features/movements/pages/branch-flow-page';
import { ExpensesPage } from '@/features/movements/pages/expenses-page';
import { MovementsBalancePage } from '@/features/movements/pages/movements-balance-page';
import { MovementsPage } from '@/features/movements/pages/movements-page';
import { BillingPage } from '@/features/reports/pages/billing-page';
import { BranchTotalsPage } from '@/features/reports/pages/branch-totals-page';
import { SellerReportPage } from '@/features/reports/pages/seller-report-page';
import { SaleLimitsPage } from '@/features/sale-limits/pages/sale-limits-page';
import { SucursalConfigPage } from '@/features/sale-points/pages/sucursal-config-page';
import { SucursalesPage } from '@/features/sale-points/pages/sucursales-page';
import { SalesPage } from '@/features/tickets/pages/sales-page';
import { UsersPage } from '@/features/users/pages/users-page';
import { WinnersPage } from '@/features/winners/pages/winners-page';
import { APP_ROUTES } from '@/shared/constants/routes';

const router = createBrowserRouter([
  {
    path: APP_ROUTES.login,
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGate allow={[UserRole.ADMIN, UserRole.PARTNER]} />,
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
                element: <SalesPage />,
              },
              {
                path: APP_ROUTES.branchTotals,
                element: <BranchTotalsPage />,
              },
              {
                path: APP_ROUTES.sellerReport,
                element: <SellerReportPage />,
              },
              {
                path: APP_ROUTES.branchFlowReport,
                element: <BranchFlowPage />,
              },
              {
                path: APP_ROUTES.billing,
                element: <BillingPage />,
              },
              {
                path: APP_ROUTES.winners,
                element: <WinnersPage />,
              },
              {
                path: APP_ROUTES.expenses,
                element: <ExpensesPage />,
              },
              {
                path: APP_ROUTES.movements,
                element: <MovementsPage />,
              },
              {
                path: APP_ROUTES.movementsCalc,
                element: <MovementsBalancePage />,
              },
              {
                path: APP_ROUTES.users,
                element: <UsersPage />,
              },
              {
                path: APP_ROUTES.sucursales,
                element: <SucursalesPage />,
              },
              {
                path: APP_ROUTES.sucursalConfig,
                element: <SucursalConfigPage />,
              },
              {
                path: APP_ROUTES.draws,
                element: <DrawsPage />,
              },
              {
                path: APP_ROUTES.saleLimits,
                element: <SaleLimitsPage />,
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

export function AppRouter() {
  return <RouterProvider router={router} />;
}
