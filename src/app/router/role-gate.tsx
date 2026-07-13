import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

import { useLogout, useSession } from '@/features/auth/hooks/use-session';
import { APP_ROUTES } from '@/shared/constants/routes';

import type { UserRole } from '@/features/auth/types';

interface Props {
  allow: UserRole[];
}

/**
 * Restricts nested routes to users whose role is in `allow`.
 *
 * If the user is authenticated but lacks the role, we render a "no access"
 * screen with a logout button. Redirecting instead would loop the user back
 * to a route they still cannot reach.
 */
export function RoleGate({ allow }: Props) {
  const session = useSession();
  if (!session) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }
  if (!allow.includes(session.user.role)) {
    return <ForbiddenView />;
  }
  return <Outlet />;
}

function ForbiddenView() {
  const logout = useLogout();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate(APP_ROUTES.login, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldOff className="size-7" />
        </div>
        <h1 className="text-xl font-bold mb-2">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Este panel es solo para administradores. Usa la aplicación móvil
          para tu cuenta de vendedor.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="h-10 px-4 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
