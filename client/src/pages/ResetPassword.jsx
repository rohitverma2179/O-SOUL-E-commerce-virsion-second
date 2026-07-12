import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Reset token is missing from the URL. Please request a new link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Your password has been reset successfully.");
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-osoul flex min-h-[80vh] items-center justify-center py-20">
      <div className="w-full max-w-md space-y-8 bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Create new credentials
          </p>
          <h1 className="mt-3 font-serif text-4xl">
            New Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground italic">
            Enter a strong password for your O'Soul account.
          </p>
        </div>

        {/* Success/Error Alerts */}
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-xs font-medium text-destructive italic text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-md bg-olive/10 border border-olive/20 p-4 text-xs font-medium text-olive italic text-center flex flex-col items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-olive" />
            <span>{message}</span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">Redirecting to login...</span>
          </div>
        )}

        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1 font-bold">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="password" 
                  required
                  className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-olive/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1 font-bold">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="password" 
                  required
                  className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-olive/50"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !token}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground font-medium text-background transition hover:bg-foreground/90 disabled:opacity-75"
            >
              {loading ? "Resetting..." : "Reset Password"}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        ) : null}

        <div className="text-center text-sm pt-2 border-t border-border/40 mt-4">
          <Link to="/login" className="font-semibold underline underline-offset-4 hover:text-olive transition-colors text-xs uppercase tracking-widest">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
