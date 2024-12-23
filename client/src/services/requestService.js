import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

// Add response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getRequests = async () => {
  try {
    const response = await API.get('/requests');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login again');
    }
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