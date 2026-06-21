import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (session restore)
  const checkAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 403 && data.data?.unverified) {
        // User is registered but not verified
        return { success: false, unverified: true, email: data.data.email, message: data.message };
      }
      if (data.success) {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: data.message || "Invalid credentials" };
    } catch (err) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (fullName, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();
      if (data.success && data.data?.unverified) {
        return { success: true, unverified: true, email: data.data.user?.email || email };
      }
      if (data.success) {
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: data.message || "Google Login failed" };
    } catch (err) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        return { success: true, user: data.data.user };
      }
      return { success: false, message: data.message || "Verification failed" };
    } catch (err) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      googleLogin,
      verifyEmail,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};