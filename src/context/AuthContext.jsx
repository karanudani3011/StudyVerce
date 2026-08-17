import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, appleProvider } from '../config/firebase';
import { apiPost, apiGet, apiPut } from '../config/api';

const AuthContext = createContext(null);

// Default fallback stats for fresh users
const DEFAULT_USER_STATS = {
  xp: 1250,
  streak: 5,
  dailyGoalMinutes: 60,
  currentGoalMinutes: 45,
  level: 'Intermediate',
  followers: 0,
  following: 0,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // ─── Load user from stored JWT on app boot ──────────────────────────────────
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('sv_token');
      if (token) {
        try {
          const data = await apiGet('/auth/me');
          if (data.success && data.user) {
            setUser({ ...DEFAULT_USER_STATS, ...data.user });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Token validation failed:', error.message);
          localStorage.removeItem('sv_token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ─── Register with email/password ───────────────────────────────────────────
  const register = useCallback(async ({ name, email, password }) => {
    const data = await apiPost('/auth/register', { name, email, password });
    if (data.success) {
      localStorage.setItem('sv_token', data.token);
      setUser({ ...DEFAULT_USER_STATS, ...data.user });
      setIsAuthenticated(true);
      return data.user;
    }
    throw new Error(data.message || 'Registration failed');
  }, []);

  // ─── Login with email/password ──────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const data = await apiPost('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('sv_token', data.token);
      setUser({ ...DEFAULT_USER_STATS, ...data.user });
      setIsAuthenticated(true);
      return data.user;
    }
    throw new Error(data.message || 'Login failed');
  }, []);

  // ─── Login / Register with Social Provider (Google, GitHub, Apple) ─────────
  const loginWithProvider = useCallback(async (providerName) => {
    let provider;
    if (providerName === 'Google') provider = googleProvider;
    else if (providerName === 'GitHub') provider = githubProvider;
    else if (providerName === 'Apple') provider = appleProvider;
    else throw new Error(`Unsupported auth provider: ${providerName}`);

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Sync with backend
    const data = await apiPost('/auth/google', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      photoURL: firebaseUser.photoURL,
    });

    if (data.success) {
      localStorage.setItem('sv_token', data.token);
      setUser({ ...DEFAULT_USER_STATS, ...data.user });
      setIsAuthenticated(true);
      return data.user;
    }
    throw new Error('Social auth sync failed');
  }, []);

  // ─── Forgot Password — sends OTP email ─────────────────────────────────────
  const forgotPassword = useCallback(async (email) => {
    const data = await apiPost('/auth/forgot-password', { email });
    if (data.success) return data;
    throw new Error(data.message || 'Failed to send reset email');
  }, []);

  // ─── Reset Password — verifies OTP & sets new password ─────────────────────
  const resetPassword = useCallback(async (email, otp, newPassword) => {
    const data = await apiPost('/auth/reset-password', { email, otp, newPassword });
    if (data.success) return data;
    throw new Error(data.message || 'Failed to reset password');
  }, []);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signOut Error:', error);
    }
    localStorage.removeItem('sv_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ─── Add XP helper ──────────────────────────────────────────────────────────
  const addXP = useCallback((amount) => {
    setUser(prev => prev ? ({ ...prev, xp: prev.xp + amount }) : null);
  }, []);

  // ─── Update User Profile ────────────────────────────────────────────────────
  const updateUserProfile = useCallback(async (profileData) => {
    const data = await apiPut('/users/profile', profileData);
    if (data.success && data.user) {
      setUser(prev => ({ ...prev, ...data.user }));
      return data.user;
    }
    throw new Error(data.message || 'Failed to update profile');
  }, []);

  // ─── Toggle Course Wishlist ─────────────────────────────────────────────────
  const toggleCourseWishlist = useCallback(async (courseId) => {
    const data = await apiPost('/users/wishlist', { courseId });
    if (data.success && data.wishlistedCourses) {
      setUser(prev => prev ? ({ ...prev, wishlistedCourses: data.wishlistedCourses }) : null);
      return data.wishlistedCourses;
    }
    throw new Error(data.message || 'Failed to toggle wishlist');
  }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser,
      isAuthenticated, login, register, logout, loginWithProvider,
      notificationsCount, setNotificationsCount,
      searchQuery, setSearchQuery,
      addXP,
      updateUserProfile,
      toggleCourseWishlist,
      forgotPassword,
      resetPassword,
      activeTab, setActiveTab,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
