import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';

export const useStudentDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [educators, setEducators] = useState([]);
  const [loadingEducators, setLoadingEducators] = useState(true);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getDashboardStats();
      if (data && data.success) {
        setStats(data.stats || {});
        setEnrolledCourses(Array.isArray(data.enrolledCourses) ? data.enrolledCourses : []);
        setRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : []);
        setDailyTasks(Array.isArray(data.dailyTasks) ? data.dailyTasks : []);
      } else {
        throw new Error(data?.message || 'Failed to load student dashboard data.');
      }
    } catch (err) {
      console.error('useStudentDashboard Error:', err);
      setError(err.message || 'Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await dashboardService.getLeaderboard(10);
      if (res && res.success && Array.isArray(res.data)) {
        setLeaderboard(res.data);
      }
    } catch (err) {
      console.warn('Leaderboard fetch warning:', err.message);
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  const fetchEducators = useCallback(async () => {
    setLoadingEducators(true);
    try {
      const res = await dashboardService.getEducators(5);
      if (res && res.success && Array.isArray(res.data)) {
        setEducators(res.data.map(t => ({
          id: t._id,
          name: t.name,
          avatar: t.avatar,
          subject: t.department || t.title || 'Education',
          followers: `${t.followers || '0'}`,
          verified: t.isVerified || false,
        })));
      }
    } catch (err) {
      console.warn('Educators fetch warning:', err.message);
    } finally {
      setLoadingEducators(false);
    }
  }, []);

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await dashboardService.getQuizzes();
      if (res && res.success && Array.isArray(res.quizzes)) {
        setAvailableQuizzes(res.quizzes);
      }
    } catch (err) {
      console.warn('Quizzes fetch warning:', err.message);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchDashboardData();
      fetchLeaderboard();
      fetchEducators();
      fetchQuizzes();
    }
  }, [user, fetchDashboardData, fetchLeaderboard, fetchEducators, fetchQuizzes]);

  const toggleTask = (taskId) => {
    setDailyTasks(prev =>
      prev.map(task =>
        (task._id === taskId || task.id === taskId)
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return {
    loading,
    error,
    stats,
    enrolledCourses,
    recentActivity,
    dailyTasks,
    setDailyTasks,
    toggleTask,
    leaderboard,
    loadingLeaderboard,
    educators,
    loadingEducators,
    availableQuizzes,
    refreshDashboard: fetchDashboardData,
  };
};
