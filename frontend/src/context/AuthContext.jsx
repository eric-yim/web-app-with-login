/**
 * Authentication context for managing user state
 */

import { createContext, useContext, useState } from 'react';
import { authApi, getToken, setToken, clearToken } from '../api/client';
import { useAsyncEffectOnce } from '../hooks/useEffectOnce';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useAsyncEffectOnce(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      clearToken();
    } finally {
      setLoading(false);
    }
  });

  // Google OAuth login
  const login = async (code) => {
    const result = await authApi.googleCallback(code);
    setToken(result.token);

    // Load full user data via getMe
    const userData = await authApi.getMe();
    setUser(userData);

    return { ...result, user: userData };
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
