import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lms_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('lms_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('lms_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('lms_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      handleAuthSuccess(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      handleAuthSuccess(data);
      toast.success('Registration successful! Welcome aboard.');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const demoLogin = async (role = 'student') => {
    try {
      const data = await authService.demoLogin(role);
      handleAuthSuccess(data);
      toast.success(`Logged in as Demo ${role.toUpperCase()}`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Demo login failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isInstructor: user?.role === 'instructor' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    login,
    register,
    demoLogin,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
