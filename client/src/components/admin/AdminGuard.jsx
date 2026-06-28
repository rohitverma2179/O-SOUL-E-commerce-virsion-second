import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/api';

const AdminGuard = ({ children }) => {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/me`, { credentials: 'include' })
      .then((response) => setStatus(response.ok ? 'authenticated' : 'guest'))
      .catch(() => setStatus('guest'));
  }, []);

  if (status === 'loading') return <div className="grid min-h-screen place-items-center bg-slate-950 text-white">Checking admin session...</div>;
  if (status === 'guest') return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
};

export default AdminGuard;
