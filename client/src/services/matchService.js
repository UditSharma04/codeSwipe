import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/matches`,
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

export const getMatches = async () => {
  try {
    const response = await API.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch matches');
  }
};

export const searchMatches = async (query) => {
  try {
    const response = await API.get(`/search?query=${query}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search matches');
  }
};

export const removeMatch = async (matchId) => {
  try {
    const response = await API.delete(`/${matchId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove match');
  }
}; 