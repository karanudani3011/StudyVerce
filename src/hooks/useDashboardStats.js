import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../config/api';

export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet('/users/dashboard');
      if (res.success) {
        setStats(res.stats);
        setUser(res.user);
      } else {
        throw new Error(res.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    user,
    loading,
    error,
    refreshStats,
  };
};