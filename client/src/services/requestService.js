import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/swipe`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRequests = async () => {
  try {
    const response = await API.get('/requests');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch requests');
  }
};

export const respondToRequest = async (targetUserId, action) => {
  try {
    const response = await API.post('/respond', {
      targetUserId,
      action
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to respond to request');
  }
}; 