import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * RoleProtectedRoute
 * Wraps children and only renders them if the logged-in user
 * has one of the allowedRoles. Otherwise redirects to dashboard.
 */
export const RoleProtectedRoute = ({ allowedRoles = [], children, fallback = null }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return null;

  if (!allowedRoles.includes(user?.role)) {
    return fallback;
  }

  return children;
};
