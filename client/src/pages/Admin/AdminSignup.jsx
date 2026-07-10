import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../lib/api';
import { Shield, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

const AdminSignup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, password, role: 'superadmin' }),
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
            <Check className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-slate-400">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-olive mb-4 shadow-xl shadow-olive/20">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">O'SOUL <span className="text-olive text-lg uppercase tracking-widest ml-1">Join</span></h1>
          <p className="text-slate-400 mt-2">Create your administrative access account.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-olive transition-colors" size={20} />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-olive transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none transition-all"
                  placeholder="admin@osoul.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-olive transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-olive/20 focus:border-olive outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-olive hover:bg-olive/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-olive/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              Create Account
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <button onClick={() => navigate('/admin/login')} className="text-olive font-bold hover:underline">Log In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
