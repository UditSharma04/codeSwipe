// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to CodeSwipe</h1>
        
        {user && (
          <div className="mb-6 text-center">
            <p className="text-xl">Hello, {user.username}!</p>
          </div>
        )}

        <div className="space-y-4">
          <Link 
            to="/swipe" 
            className="block w-full bg-primary hover:bg-blue-600 text-white py-3 rounded text-center"
          >
            Start Swiping
          </Link>
          
          <Link 
            to="/matches" 
            className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-center"
          >
            View Matches
          </Link>
          
          <Link 
            to="/profile" 
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded text-center"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;