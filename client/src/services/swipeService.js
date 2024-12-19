import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/swipe',
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

export const getNextProfile = async () => {
  try {
    const response = await API.get('/next');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch next profile');
  }
};

export const submitSwipe = async (targetUserId, direction) => {
  try {
    const response = await API.post('/', {
      targetUserId,
      direction
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to process swipe');
  }
};

export const getRequestCount = async () => {
  try {
    const response = await API.get('/requests/count');
    return response.data.count;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch request count');
  }
}; 