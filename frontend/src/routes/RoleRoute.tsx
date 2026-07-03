import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { type Role } from '@/types/usuario';

interface RoleRouteProps {
  allowedRoles: Role[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}