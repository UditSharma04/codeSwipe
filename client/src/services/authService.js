// src/services/authService.js
import axios from 'axios';

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // Ensure this matches your backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

export const register = async (userData) => {
  try {
    const response = await API.post('/register', {
      ...userData,
      techStack: [], // Array of technologies
      githubUsername: '', // Optional GitHub integration
      favoriteProject: {
        title: '',
        description: '',
        techUsed: [],
        githubUrl: ''
      },
      interests: [], // What they like working on
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