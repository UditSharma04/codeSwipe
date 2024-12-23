// src/services/authService.js
import axios from 'axios';

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const register = async (userData) => {
  try {
    const response = await API.post('/register', {
      ...userData,
      techStack: [],
      githubUsername: '',
      favoriteProject: {
        title: '',
        description: '',
        techUsed: [],
        githubUrl: ''
      },
      interests: [],
      codeSnippet: {
        language: '',
        code: '',
        description: ''
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/login', credentials);
    return {
      token: response.data.token,
      isProfileComplete: response.data.isProfileComplete
    };
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Login failed'
    );
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await API.get('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Fetched profile data:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Profile Fetch Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch profile'
    );
  }
};

export const updateProfile = async (profileData) => {
  try {
    console.log('Sending profile update request with data:', profileData); // Debug log
    const token = localStorage.getItem('token');
    const response = await API.put('/profile', profileData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Profile update response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Profile Update Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update profile'
    );
  }
};