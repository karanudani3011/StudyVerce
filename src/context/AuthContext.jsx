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

  // ─── Load user from stored JWT or localStorage on app boot ──────────────────
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('sv_token');
      const storedUserStr = localStorage.getItem('sv_user');
      let cachedUser = null;
      if (storedUserStr) {
        try { cachedUser = JSON.parse(storedUserStr); } catch (e) {}
      }

      if (cachedUser) {
        setUser(cachedUser);
        setIsAuthenticated(true);
      }

      if (token) {
        try {
          // If role is tutor/faculty, fetch tutor profile; otherwise fetch user profile
          const endpoint = cachedUser?.role === 'tutor' || cachedUser?.role === 'faculty' ? '/tutors/me' : '/auth/me';
          const data = await apiGet(endpoint).catch(() => apiGet('/auth/me'));
          if (data && data.success && data.user) {
            const updatedUser = { ...DEFAULT_USER_STATS, ...cachedUser, ...data.user };
            setUser(updatedUser);
            localStorage.setItem('sv_user', JSON.stringify(updatedUser));
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.warn('Backend session validation warning:', error.message);
          if (cachedUser) {
            setUser(cachedUser);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('sv_token');
            localStorage.removeItem('sv_user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Helper to persist user to state and localStorage
  const saveUserSession = (userData, token) => {
    if (token) localStorage.setItem('sv_token', token);
    const fullUser = { ...DEFAULT_USER_STATS, ...userData };
    setUser(fullUser);
    localStorage.setItem('sv_user', JSON.stringify(fullUser));
    setIsAuthenticated(true);
    return fullUser;
  };

  // ─── Register with email/password ───────────────────────────────────────────
  const register = useCallback(async ({ name, email, password, role = 'student' }) => {
    try {
      const data = await apiPost('/auth/register', { name, email, password, role });
      if (data.success) {
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
        console.warn('Backend server offline/unreachable, falling back to local session');
        const mockUser = {
          id: 'usr_' + Date.now(),
          name,
          email,
          username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
          role,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        };
        return saveUserSession(mockUser, 'local_token_' + Date.now());
      }
      throw err;
    }
  }, []);

  // ─── Register Tutor / Faculty ───────────────────────────────────────────────
  const registerTutor = useCallback(async (tutorData) => {
    try {
      const data = await apiPost('/tutors/register', tutorData);
      if (data.success) {
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Tutor registration failed');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
        console.warn('Backend server offline/unreachable, falling back to local tutor session');
        const mockUser = {
          id: 'tut_' + Date.now(),
          name: tutorData.name,
          email: tutorData.email,
          username: `@${tutorData.name.toLowerCase().replace(/\s+/g, '')}`,
          role: tutorData.role || 'tutor',
          institution: tutorData.institution || 'Stanford University',
          department: tutorData.department || 'Computer Science & AI',
          title: tutorData.title || 'Faculty / Lead Instructor',
          isVerified: true,
          avatar: `https://i.pravatar.cc/150?u=${tutorData.email}`,
        };
        return saveUserSession(mockUser, 'local_tutor_token_' + Date.now());
      }
      throw err;
    }
  }, []);

  // ─── Login with email/password ──────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    try {
      const data = await apiPost('/auth/login', { email, password });
      if (data.success) {
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
        console.warn('Backend server offline/unreachable, falling back to local session');
        const mockUser = {
          id: 'usr_demo',
          name: email.split('@')[0].replace('.', ' '),
          email,
          username: `@${email.split('@')[0]}`,
          role: email.includes('admin') ? 'admin' : email.includes('tutor') ? 'tutor' : 'student',
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        };
        return saveUserSession(mockUser, 'local_token_demo');
      }
      throw err;
    }
  }, []);

  // ─── Login Tutor / Faculty ──────────────────────────────────────────────────
  const loginTutor = useCallback(async ({ email, password }) => {
    try {
      const data = await apiPost('/tutors/login', { email, password });
      if (data.success) {
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Tutor login failed');
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.message.includes('NetworkError')) {
        const mockUser = {
          id: 'tut_demo',
          name: email.split('@')[0],
          email,
          username: `@${email.split('@')[0]}`,
          role: 'tutor',
          institution: 'Stanford University',
          department: 'Computer Science & AI',
          title: 'Faculty / Lead Instructor',
          isVerified: true,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
        };
        return saveUserSession(mockUser, 'local_tutor_token_demo');
      }
      throw err;
    }
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
    localStorage.removeItem('sv_user');
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
      isAuthenticated, login, register, registerTutor, loginTutor, logout, loginWithProvider,
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
