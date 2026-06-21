import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        {/* Sleek aesthetic olive loader */}
        <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-olive/20 border-t-olive"></div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Loading O'Soul Secure Portal...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and keep track of where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
