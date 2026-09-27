import { useState, useCallback } from 'react';
import { apiGet, apiPost } from '../config/api';

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizzes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await apiGet(`/quizzes${query ? `?${query}` : ''}`);
      if (res.success) {
        setQuizzes(res.quizzes);
        return res;
      }
      throw new Error(res.message || 'Failed to fetch quizzes');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizById = useCallback(async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/quizzes/${quizId}`);
      if (res.success) {
        setCurrentQuiz(res.quiz);
        return res.quiz;
      }
      throw new Error(res.message || 'Quiz not found');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitQuiz = useCallback(async (quizId, answers, timeSpentSeconds) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost(`/quizzes/${quizId}/submit`, { answers, timeSpentSeconds });
      if (res.success) {
        setResult(res);
        return res;
      }
      throw new Error(res.message || 'Failed to submit quiz');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyAttempts = useCallback(async (limit = 20, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/quizzes/attempts/my?limit=${limit}&page=${page}`);
      if (res.success) {
        setAttempts(res.attempts);
        return res;
      }
      throw new Error(res.message || 'Failed to fetch attempts');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttempt = useCallback(async (attemptId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/quizzes/attempts/${attemptId}`);
      if (res.success) {
        return res.attempt;
      }
      throw new Error(res.message || 'Attempt not found');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizzesByCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/quizzes/course/${courseId}`);
      if (res.success) {
        return res.quizzes;
      }
      throw new Error(res.message || 'Failed to fetch quizzes');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    quizzes,
    currentQuiz,
    attempts,
    result,
    loading,
    error,
    fetchQuizzes,
    fetchQuizById,
    submitQuiz,
    fetchMyAttempts,
    fetchAttempt,
    fetchQuizzesByCourse,
    clearResult,
  };
};