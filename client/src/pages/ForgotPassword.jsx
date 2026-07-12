import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "A password reset link has been sent to your email address.");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
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
            Trouble logging in?
          </p>
          <h1 className="mt-3 font-serif text-4xl">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground italic">
            Enter your email and we'll send you a link to get back into your account.
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
          </div>
        )}

        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1 font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="email" 
                  required
                  className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-olive/50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground font-medium text-background transition hover:bg-foreground/90 disabled:opacity-75"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
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

export default ForgotPassword;
