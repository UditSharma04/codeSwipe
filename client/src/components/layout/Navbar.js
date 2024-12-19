// src/components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-500">
              CodeSwipe
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/swipe" className="text-gray-700 hover:text-blue-500">
                Swipe
              </Link>
              <Link to="/requests" className="text-gray-700 hover:text-blue-500">
                Requests
              </Link>
              <Link to="/matches" className="text-gray-700 hover:text-blue-500">
                Matches
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-500">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;