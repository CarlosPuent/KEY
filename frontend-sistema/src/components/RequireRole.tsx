import { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ROLES_NAMESPACE = 'https://fullstackauth.com/roles';

export default function RequireRole({ role, children }: { role: 'alumno' | 'profesor' | 'registroAcademico'; children: JSX.Element }) {
  const { user, isLoading } = useAuth0();
  const location = useLocation();
  if (isLoading) return <p>Cargando permisos…</p>;
  const roles: string[] = (user?.[ROLES_NAMESPACE] as string[]) || [];
  if (!roles.includes(role)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
}