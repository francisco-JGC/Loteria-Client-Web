import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Ticket, X } from 'lucide-react';

import { SidebarNav } from '@/app/layout/sidebar-nav';
import { useSidebarStore } from '@/app/layout/sidebar-store';
import { useLogout, useSession } from '@/features/auth/hooks/use-session';
import { APP_ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

export function AdminShell() {
  const session = useSession();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const openSidebar = useSidebarStore((s) => s.open);
  const closeSidebar = useSidebarStore((s) => s.close);

  // Close the mobile drawer whenever the route changes so a tap on a nav
  // item both navigates and hides the overlay.
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.login, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Backdrop (mobile only) */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:sticky md:top-0 md:h-screen md:translate-x-0',
        )}
      >
        <SidebarHeader onClose={closeSidebar} />

        <div className="flex-1 overflow-y-auto">
          <SidebarNav onNavigate={closeSidebar} />
        </div>

        <SidebarFooter
          name={session?.user.name ?? '—'}
          role={session?.user.role ?? ''}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar onOpenSidebar={openSidebar} />
        <main className="min-w-0 flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-border px-5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Ticket className="size-5" strokeWidth={2.4} />
      </div>
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
        onClick={onClose}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
        aria-label="Cerrar menú"
        title="Cerrar menú"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function SidebarFooter({
  name,
  role,
  onLogout,
}: {
  name: string;
  role: string;
  onLogout: () => void;
}) {
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="truncate text-xs uppercase tracking-wide text-muted-foreground">
            {role}
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}

function MobileTopbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex size-9 items-center justify-center rounded-md text-foreground hover:bg-secondary"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Ticket className="size-4" strokeWidth={2.4} />
        </div>
        <span className="text-sm font-black tracking-tight">Lotería</span>
      </div>
    </header>
  );
}
