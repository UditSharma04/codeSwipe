import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/users`,
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

export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
}; 