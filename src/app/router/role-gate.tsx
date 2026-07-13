import { Navigate, Outlet } from 'react-router-dom';

import { useSession } from '@/features/auth/hooks/use-session';
import { APP_ROUTES } from '@/shared/constants/routes';

import type { UserRole } from '@/features/auth/types';

interface Props {
  allow: UserRole[];
}

/** Restricts nested routes to users whose role is in `allow`. */
export function RoleGate({ allow }: Props) {
  const session = useSession();
  if (!session) {
    return <Navigate to={APP_ROUTES.login} replace />;
  }
  if (!allow.includes(session.user.role)) {
    return <Navigate to={APP_ROUTES.dashboard} replace />;
  }
  return <Outlet />;
}
