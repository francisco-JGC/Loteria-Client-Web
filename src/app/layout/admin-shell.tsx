import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  MapPin,
  Receipt,
  Trophy,
  Users,
} from 'lucide-react';

import { useLogout, useSession } from '@/features/auth/hooks/use-session';
import { APP_ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: APP_ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: APP_ROUTES.games.list, label: 'Juegos', icon: Gamepad2 },
  { to: APP_ROUTES.schedules, label: 'Horarios', icon: Calendar },
  { to: APP_ROUTES.drawResults, label: 'Resultados', icon: Trophy },
  { to: APP_ROUTES.salePoints, label: 'Puestos', icon: MapPin },
  { to: APP_ROUTES.users, label: 'Usuarios', icon: Users },
  { to: APP_ROUTES.tickets.list, label: 'Boletos', icon: Receipt },
] as const;

export function AdminShell() {
  const session = useSession();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="border-r border-border bg-card">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <span className="font-black text-lg tracking-tight">
            Lotería <span className="text-primary">Admin</span>
          </span>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/80 hover:bg-secondary',
                )
              }
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {session?.user.name} · <span className="uppercase">{session?.user.role}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate(APP_ROUTES.login, { replace: true });
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
