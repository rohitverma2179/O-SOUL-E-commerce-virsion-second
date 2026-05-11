import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
  };

  return (
    <div className="container-osoul flex min-h-[80vh] items-center justify-center py-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Start Your Journey</p>
          <h1 className="mt-3 font-serif text-4xl">Join O'Soul</h1>
          <p className="mt-2 text-sm text-muted-foreground italic">Experience everyday comfort at its best.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                required
                className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-foreground/50"
                placeholder="Rohit"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

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
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1">Password</label>
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
            Create Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground italic">Already have an account? </span>
          <Link to="/login" className="font-medium underline underline-offset-4">Login</Link>
        </div>

        <p className="text-center text-[10px] text-muted-foreground italic">
          By joining, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;
