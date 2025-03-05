import { JSX } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};
