import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost } from '../config/api';

export const useStudySession = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const fetchActiveSession = useCallback(async () => {
    try {
      const res = await apiGet('/study-sessions/active');
      if (res.success) {
        setActiveSession(res.session);
        if (res.session) {
          setElapsedTime(res.session.elapsedSeconds || 0);
        }
      }
    } catch (err) {
      console.error('Fetch active session error:', err.message);
    }
  }, []);

  const fetchStats = useCallback(async (period = 'week') => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/study-sessions/stats?period=${period}`);
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch study stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (limit = 20, page = 1) => {
    try {
      const res = await apiGet(`/study-sessions/history?limit=${limit}&page=${page}`);
      if (res.success) {
        setHistory(res.sessions);
      }
    } catch (err) {
      console.error('Fetch history error:', err.message);
    }
  }, []);

  const startSession = useCallback(async (courseId, lectureId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost('/study-sessions/start', { courseId, lectureId });
      if (res.success) {
        setActiveSession(res.session);
        setElapsedTime(0);
        return res.session;
      }
      throw new Error(res.message || 'Failed to start session');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const stopSession = useCallback(async (sessionId, pause = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost('/study-sessions/stop', { sessionId, pause });
      if (res.success) {
        if (!pause) {
          setActiveSession(null);
          setElapsedTime(0);
          // Refresh stats after completing session
          await fetchStats();
        }
        return res;
      }
      throw new Error(res.message || 'Failed to stop session');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  // Timer for active session
  useEffect(() => {
    let timer = null;
    if (activeSession && !activeSession.paused) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeSession]);

  useEffect(() => {
    fetchActiveSession();
    fetchStats();
  }, [fetchActiveSession, fetchStats]);

  return {
    activeSession,
    stats,
    history,
    loading,
    error,
    elapsedTime,
    startSession,
    stopSession,
    fetchActiveSession,
    fetchStats,
    fetchHistory,
  };
};