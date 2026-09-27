import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../config/api';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('xp');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = useCallback(async (leaderboardType = type) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/leaderboard?limit=50&type=${leaderboardType}`);
      if (res.success && res.data) {
        setLeaderboard(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const fetchMyRank = useCallback(async () => {
    try {
      const res = await apiGet('/leaderboard/my-rank');
      if (res.success && res.data) {
        setMyRank(res.data);
      }
    } catch (err) {
      console.error('My rank fetch error:', err.message);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiGet('/leaderboard/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Stats fetch error:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchMyRank();
    fetchStats();
  }, [type, fetchLeaderboard, fetchMyRank, fetchStats]);

  const filteredLeaderboard = leaderboard.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    leaderboard: filteredLeaderboard,
    rawLeaderboard: leaderboard,
    myRank,
    stats,
    loading,
    error,
    type,
    setType,
    searchQuery,
    setSearchQuery,
    fetchLeaderboard,
    fetchMyRank,
    fetchStats,
  };
};