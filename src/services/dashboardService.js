import { apiGet } from '../config/api';

export const dashboardService = {
  getDashboardStats: async () => {
    return await apiGet('/users/dashboard');
  },

  getMyEnrolledCourses: async () => {
    return await apiGet('/courses/enrolled/my');
  },

  getLeaderboard: async (limit = 10) => {
    return await apiGet(`/leaderboard?limit=${limit}`);
  },

  getEducators: async (limit = 5) => {
    return await apiGet(`/tutors?limit=${limit}`);
  },

  getQuizzes: async () => {
    return await apiGet('/quizzes');
  },

  getStudyTasks: async () => {
    return await apiGet('/study-tasks');
  },
};
