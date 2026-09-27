import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, appleProvider } from '../config/firebase';
import { apiPost, apiGet, apiPut } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const fetchUnreadCounts = useCallback(async () => {
    const token = localStorage.getItem('sv_token');
    if (!token) return;
    try {
      const res = await apiGet('/messages/unread-count');
      if (res && res.success && typeof res.count === 'number') {
        setUnreadMessagesCount(res.count);
      }
    } catch (e) {
      // ignore
    }
  }, []);

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
          // If role is admin, tutor/faculty, fetch respective profile; otherwise fetch user profile
          const endpoint = cachedUser?.role === 'admin' 
            ? '/admin/me' 
            : (cachedUser?.role === 'tutor' || cachedUser?.role === 'faculty' ? '/tutors/me' : '/auth/me');
          const data = await apiGet(endpoint).catch(() => apiGet('/auth/me'));
          if (data && data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('sv_user', JSON.stringify(data.user));
            setIsAuthenticated(true);
          }
          fetchUnreadCounts();
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
  }, [fetchUnreadCounts]);

  // Helper to persist user to state and localStorage
  const saveUserSession = (userData, token) => {
    if (token) localStorage.setItem('sv_token', token);
    setUser(userData);
    localStorage.setItem('sv_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    return userData;
  };

  // ─── Update user profile from server ──────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('sv_token');
    if (!token) return null;
    
    try {
      const endpoint = user?.role === 'admin' 
        ? '/admin/me' 
        : (user?.role === 'tutor' || user?.role === 'faculty' ? '/tutors/me' : '/auth/me');
      const data = await apiGet(endpoint).catch(() => apiGet('/auth/me'));
      if (data && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('sv_user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (error) {
      console.warn('Failed to refresh user:', error.message);
    }
    return null;
  }, [user?.role]);

  // ─── Update local user state (for immediate UI feedback) ──────────────────────
  const updateUser = useCallback((userData) => {
    setUser(prev => prev ? ({ ...prev, ...userData }) : null);
  }, []);

  // ─── Register with email/password ───────────────────────────────────────────
  const register = useCallback(async ({ name, email, password, role = 'student' }) => {
    try {
      const data = await apiPost('/auth/register', { name, email, password, role });
      if (data.success) {
        if (data.requireOtp) {
          return data;
        }
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      throw err;
    }
  }, []);

  // ─── Register Tutor / Faculty ───────────────────────────────────────────────
  const registerTutor = useCallback(async (tutorData) => {
    try {
      const data = await apiPost('/tutors/register', tutorData);
      if (data.success) {
        if (data.requireOtp) {
          return data;
        }
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Tutor registration failed');
    } catch (err) {
      throw err;
    }
  }, []);

  // ─── Verify Registration OTP ───────────────────────────────────────────────
  const verifyRegistrationOtp = useCallback(async ({ email, otp }) => {
    const data = await apiPost('/auth/verify-otp', { email, otp });
    if (data.success && data.user) {
      return saveUserSession(data.user, data.token);
    }
    throw new Error(data.message || 'Verification failed');
  }, []);

  // ─── Resend Registration OTP ───────────────────────────────────────────────
  const resendRegistrationOtp = useCallback(async ({ email }) => {
    const data = await apiPost('/auth/resend-otp', { email });
    if (data.success) {
      return data;
    }
    throw new Error(data.message || 'Failed to resend verification code');
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
       setUser(data.user);
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

  // ─── Login Admin ────────────────────────────────────────────────────────────
  const loginAdmin = useCallback(async ({ adminId, password }) => {
    try {
      const data = await apiPost('/admin/login', { adminId, password });
      if (data.success) {
        return saveUserSession(data.user, data.token);
      }
      throw new Error(data.message || 'Admin login failed');
    } catch (err) {
throw err;
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser,
      isAuthenticated, login, register, registerTutor, verifyRegistrationOtp, resendRegistrationOtp, loginTutor, loginAdmin, logout, loginWithProvider,
      notificationsCount, setNotificationsCount,
      unreadMessagesCount, setUnreadMessagesCount,
      fetchUnreadCounts,
      searchQuery, setSearchQuery,
      addXP,
      updateUser,
      refreshUser,
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
