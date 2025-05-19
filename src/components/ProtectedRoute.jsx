// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  const roles = user.publicMetadata?.roles || [];
  if (!allowedRoles.some((role) => roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;