import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface Props { children: ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading, error } = useAuth0();
  if (isLoading) return <p>Cargando…</p>;
  if (error)     return <p>Error: {error.message}</p>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}
