import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Calculator,
  CircleDollarSign,
  Dices,
  History,
  Home,
  PlusSquare,
  Receipt,
  Repeat,
  Trophy,
  User,
  UserSearch,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { APP_ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Sidebar nav registry. Order here defines display order. */
const NAV_ITEMS: readonly NavItem[] = [
  { to: APP_ROUTES.home, label: 'Inicio', icon: Home },
  { to: APP_ROUTES.sales, label: 'Ventas', icon: Receipt },
  {
    to: APP_ROUTES.branchTotals,
    label: 'Totales Por Sucursal',
    icon: CircleDollarSign,
  },
  {
    to: APP_ROUTES.sellerReport,
    label: 'Reporte Diario Vendedor',
    icon: UserSearch,
  },
  {
    to: APP_ROUTES.branchFlowReport,
    label: 'Reporte Flujo Sucursal',
    icon: BarChart3,
  },
  {
    to: APP_ROUTES.billing,
    label: 'Facturación Por Apuestas',
    icon: PlusSquare,
  },
  { to: APP_ROUTES.winners, label: 'Ganadores', icon: Trophy },
  { to: APP_ROUTES.expenses, label: 'Gastos', icon: Wallet },
  { to: APP_ROUTES.movements, label: 'Movimientos', icon: Repeat },
  {
    to: APP_ROUTES.movementsCalc,
    label: 'Cálculo Movimientos',
    icon: Calculator,
  },
  { to: APP_ROUTES.users, label: 'Usuarios', icon: User },
  { to: APP_ROUTES.draws, label: 'Sorteos', icon: Dices },
  { to: APP_ROUTES.latestResults, label: 'Últimos Resultados', icon: History },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => (
        <SidebarNavItem key={item.to} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

function SidebarNavItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
            : 'text-foreground/75 hover:bg-secondary hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'size-5 shrink-0 transition-colors',
              isActive
                ? 'text-primary-foreground'
                : 'text-foreground/60 group-hover:text-foreground',
            )}
            strokeWidth={isActive ? 2.4 : 2}
          />
          <span
            className={cn('truncate font-medium', isActive && 'font-semibold')}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}
