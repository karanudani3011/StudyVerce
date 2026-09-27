import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../config/api';

export const meetingService = {
  // Get all meetings visible to current user (role-filtered by server)
  getMeetings: async () => {
    return await apiGet('/meetings');
  },

  // Get single meeting by ID
  getMeetingById: async (id) => {
    return await apiGet(`/meetings/${id}`);
  },

  // Create new meeting (Faculty -> Students, Admin -> Faculty)
  createMeeting: async (meetingData) => {
    return await apiPost('/meetings', meetingData);
  },

  // Update existing meeting
  updateMeeting: async (id, updateData) => {
    return await apiPut(`/meetings/${id}`, updateData);
  },

  // Cancel meeting
  cancelMeeting: async (id) => {
    return await apiPatch(`/meetings/${id}/cancel`, {});
  },

  // Delete meeting
  deleteMeeting: async (id) => {
    return await apiDelete(`/meetings/${id}`);
  },
};
