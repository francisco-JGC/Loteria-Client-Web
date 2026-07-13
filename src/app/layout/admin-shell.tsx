import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, LogOut, Ticket } from 'lucide-react';

import { SidebarNav } from '@/app/layout/sidebar-nav';
import { useSidebarStore } from '@/app/layout/sidebar-store';
import { useLogout, useSession } from '@/features/auth/hooks/use-session';
import { APP_ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

export function AdminShell() {
  const session = useSession();
  const logout = useLogout();
  const navigate = useNavigate();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleSidebar = useSidebarStore((s) => s.toggle);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.login, { replace: true });
  };

  return (
    <div
      className={cn(
        'grid min-h-screen bg-background transition-[grid-template-columns] duration-200',
        collapsed ? 'grid-cols-[72px_1fr]' : 'grid-cols-[280px_1fr]',
      )}
    >
      <aside className="flex flex-col overflow-hidden border-r border-border bg-card">
        <div
          className={cn(
            'flex h-16 items-center gap-3 border-b border-border',
            collapsed ? 'justify-center px-2' : 'px-5',
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="size-5" strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black leading-tight tracking-tight">
                  Lotería
                </div>
                <div className="text-xs text-muted-foreground leading-tight">
                  Panel de administración
                </div>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Contraer menú"
                title="Contraer menú"
              >
                <ChevronsLeft className="size-4" />
              </button>
            </>
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center border-b border-border p-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Expandir menú"
              title="Expandir menú"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <SidebarNav collapsed={collapsed} />
        </div>

        <div className="border-t border-border p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg py-2',
              collapsed ? 'flex-col gap-2 px-0' : 'px-2',
            )}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground"
              title={session?.user.name ?? ''}
            >
              {(session?.user.name ?? '?').slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {session?.user.name ?? '—'}
                </div>
                <div className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                  {session?.user.role ?? ''}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 overflow-x-hidden p-6">
        <Outlet />
      </main>
    </div>
  );
}
