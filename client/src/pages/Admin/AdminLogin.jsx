import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Shield, User } from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.message || 'Login failed');
      navigate('/admin/catalog', { replace: true });
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch'
        ? 'Cannot reach the server. Make sure the backend is running on port 5000.'
        : requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">O'SOUL <span className="ml-1 text-lg uppercase tracking-widest text-blue-500">Admin</span></h1>
          <p className="mt-2 text-slate-400">Sign in to manage products and combos.</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="admin-username" className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input id="admin-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500" placeholder="Enter username" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input id="admin-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 py-4 pl-12 pr-12 text-white outline-none focus:border-blue-500" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label="Show or hide password">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60">
              {isLoading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
