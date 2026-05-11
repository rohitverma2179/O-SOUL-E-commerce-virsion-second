import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  return (
    <div className="container-osoul flex min-h-[80vh] items-center justify-center py-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Welcome Back</p>
          <h1 className="mt-3 font-serif text-4xl">Login to O'Soul</h1>
          <p className="mt-2 text-sm text-muted-foreground italic">Your comfort history awaits.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="email" 
                required
                className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-foreground/50"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="password" 
                required
                className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-foreground/50"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground font-medium text-background transition hover:bg-foreground/90">
            Login
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground italic">Don't have an account? </span>
          <Link to="/signup" className="font-medium underline underline-offset-4">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
