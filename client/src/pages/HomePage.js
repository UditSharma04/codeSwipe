// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white neubrutalism p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
          <p className="text-gray-600">Ready to connect with amazing developers?</p>
        </div>

        {/* Profile Update Reminder */}
        <div className="bg-primary text-black neubrutalism p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🌟</div>
            <div>
              <h2 className="text-xl font-bold mb-2">Keep Your Profile Shining!</h2>
              <p className="mb-4">
                Just like your code, your profile deserves regular updates! 
                Share your latest projects, new tech skills, and awesome code snippets 
                to attract the perfect coding partners. ✨
              </p>
              <button
                onClick={() => navigate('/profile/edit')}
                className="bg-black text-primary px-4 py-2 neubrutalism hover:opacity-90"
              >
                <i className="bi bi-pencil me-2"></i>
                Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white neubrutalism p-6">
            <h3 className="text-xl font-bold mb-4">Start Swiping</h3>
            <p className="text-gray-600 mb-4">
              Discover developers who share your passion for coding! 
              Find your next project partner. 🤝
            </p>
            <button
              onClick={() => navigate('/swipe')}
              className="bg-primary px-4 py-2 neubrutalism hover:opacity-90 w-full"
            >
              <i className="bi bi-arrow-left-right me-2"></i>
              Go to Swipe
            </button>
          </div>

          <div className="bg-white neubrutalism p-6">
            <h3 className="text-xl font-bold mb-4">Check Your Matches</h3>
            <p className="text-gray-600 mb-4">
              Connect with developers who matched with you! 
              Start collaborating on exciting projects. 💻
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/matches')}
                className="flex-1 bg-primary px-4 py-2 neubrutalism hover:opacity-90"
              >
                <i className="bi bi-people me-2"></i>
                View Matches
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="bg-black text-primary px-4 py-2 neubrutalism hover:opacity-90 transform transition-transform hover:scale-105"
              >
                <i className="bi bi-chat-dots-fill"></i>
                <div className="flex h-2 w-2 relative mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;