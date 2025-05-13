
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthGuardProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

/**
 * AuthGuard component protects routes that require authentication
 * or admin privileges
 */
const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show nothing while authentication state is being loaded
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to home if admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render the protected route
  return <>{children}</>;
};

export default AuthGuard;
