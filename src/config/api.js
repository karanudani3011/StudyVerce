// ─── API Configuration for StudyVerse Backend ────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Makes an authenticated API request to the StudyVerse backend.
 * Automatically attaches JWT token from localStorage.
 */
export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sv_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // If body is FormData (file upload), remove Content-Type to let browser set it
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

/**
 * Shorthand helpers
 */
export const apiGet = (endpoint) => api(endpoint, { method: 'GET' });

export const apiPost = (endpoint, body) =>
  api(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiPut = (endpoint, body) =>
  api(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiUpload = (endpoint, formData) =>
  api(endpoint, {
    method: 'POST',
    body: formData,
  });

export const apiDelete = (endpoint) => api(endpoint, { method: 'DELETE' });

export default api;
