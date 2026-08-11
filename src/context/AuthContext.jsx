import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, appleProvider } from '../config/firebase';
import { MOCK_USER } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize with Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          ...MOCK_USER,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          username: `@${(firebaseUser.displayName || firebaseUser.email.split('@')[0]).toLowerCase().replace(/\s+/g, '')}`,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || MOCK_USER.avatar,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithProvider = useCallback(async (providerName) => {
    try {
      let provider;
      if (providerName === 'Google') {
        provider = googleProvider;
      } else if (providerName === 'GitHub') {
        provider = githubProvider;
      } else if (providerName === 'Apple') {
        provider = appleProvider;
      } else {
        throw new Error(`Unsupported auth provider: ${providerName}`);
      }

      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error(`${providerName} Sign-In Error:`, error);
      throw error;
    }
  }, []);

  const login = useCallback((data = {}) => {
    setUser(prev => ({ ...MOCK_USER, ...prev, ...data }));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const addXP = useCallback((amount) => {
    setUser(prev => prev ? ({ ...prev, xp: prev.xp + amount }) : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, setUser,
      isAuthenticated, login, logout, loginWithProvider,
      notificationsCount, setNotificationsCount,
      searchQuery, setSearchQuery,
      addXP,
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

