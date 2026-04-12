import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from './LoadingState';

function ProtectedRoute({ children }) {
  const { isAdminAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Strictly check if admin session is active
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
