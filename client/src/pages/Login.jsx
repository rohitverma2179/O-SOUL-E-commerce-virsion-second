import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isResending, setIsResending] = useState(false);

  const { login, googleLogin, verifyEmail, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirection route (defaults to shop or home)
  const from = location.state?.from?.pathname || '/shop';

  // Dynamic GIS script loading
  useEffect(() => {
    const scriptId = 'google-gis-client';
    let script = document.getElementById(scriptId);

    const initializeGoogleButton = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '512626231482-0pdqpssacmkfg1e96e247tgk277bg2ap.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            theme: 'outline', 
            size: 'large', 
            width: '380',
            text: 'signin_with',
            shape: 'rectangular'
          }
        );
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleButton;
      document.head.appendChild(script);
    } else {
      initializeGoogleButton();
    } 
  }, [showOtpScreen]); // Re-render button if we return to login form

  const handleGoogleCredentialResponse = async (response) => {
    setError(null);
    setMessage(null);
    const result = await googleLogin(response.credential);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else if (result.unverified) {
      setVerificationEmail(result.email || email);
      setShowOtpScreen(true);
      setMessage("Your account is registered but unverified. An OTP has been sent to your email.");
    } else {
      setError(result.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    const result = await verifyEmail(verificationEmail, otp.trim());
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("A new 6-digit verification code has been sent to your email.");
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container-osoul flex min-h-[80vh] items-center justify-center py-20">
      <div className="w-full max-w-md space-y-8 bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
        
        {/* Header Section */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            {showOtpScreen ? "Security Verification" : "Welcome Back"}
          </p>
          <h1 className="mt-3 font-serif text-4xl">
            {showOtpScreen ? "Verify Email" : "Login to O'Soul"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground italic">
            {showOtpScreen ? `We sent a code to ${verificationEmail}` : "Your comfort history awaits."}
          </p>
        </div>

        {/* Success/Error Alerts */}
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-xs font-medium text-destructive italic text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-md bg-olive/10 border border-olive/20 p-4 text-xs font-medium text-olive italic text-center">
            {message}
          </div>
        )}

        {/* Render UI Forms */}
        {!showOtpScreen ? (
          <div className="space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1 font-bold">Email Address</label>
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

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Password</label>
                  {/* <Link to="/forgot-password" size="sm" className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100 font-medium">Forgot?</Link> */}
                </div>
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

              <button 
                type="submit" 
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground font-medium text-background transition hover:bg-foreground/90 disabled:opacity-75"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            {/* SSO / Divider */}
            <div className="space-y-4">
              {/* <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">or</span>
                <div className="flex-grow border-t border-border"></div>
              </div> */}

              {/* <div className="flex flex-col items-center justify-center space-y-2">
                <div id="google-signin-btn" className="w-full flex justify-center"></div>
              </div> */}
            </div>

            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground italic font-medium">Don't have an account? </span>
              <Link to="/signup" className="font-semibold underline underline-offset-4 hover:text-olive transition-colors">Create one</Link>
            </div>
          </div>
        ) : (
          /* OTP Screen */
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground ml-1 font-bold block text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  className="h-12 w-full rounded-md border border-border bg-background pl-10 pr-4 text-center text-lg tracking-[0.45em] font-mono outline-none transition focus:border-olive/50"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-center italic mt-1">
                Check your spam folder if the email does not arrive in a few minutes.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground font-medium text-background transition hover:bg-foreground/90 disabled:opacity-75"
              >
                {loading ? "Verifying Code..." : "Verify Code"}
              </button>

              <div className="flex items-center justify-between px-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpScreen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Login
                </button>
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResendOtp}
                  className="text-xs font-bold uppercase tracking-widest text-olive hover:text-olive/80 transition-colors disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
