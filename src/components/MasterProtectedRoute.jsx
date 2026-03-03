import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MasterProtectedRoute({ children }) {
  const { user, loading, isMaster } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated but not a master, redirect to admin dashboard
  if (!isMaster()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User is authenticated and is a master
  return children;
}
