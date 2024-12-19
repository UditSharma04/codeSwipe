// src/pages/SwipePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SwipePage = () => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const { user } = useAuth();

  const fetchNextUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/swipe/next', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch next user', err);
      if (err.response?.status === 404) {
        setCurrentProfile(null);
        setError('No more users to swipe. Check back later!');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch next user');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextUser();
  }, []);

  const handleSwipe = async (direction) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/swipe', 
        { 
          targetUserId: currentProfile._id, 
          direction 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Show match notification if it's a match
      if (response.data.matched) {
        setMatchedUser(response.data.matchedUser);
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 3000); // Hide after 3 seconds
      }
      
      // Animate out current profile
      setCurrentProfile(null);
      
      // Fetch next user after animation
      setTimeout(fetchNextUser, 300);
    } catch (err) {
      console.error('Swipe failed', err);
      setError(err.message);
    }
  };

  // Match notification overlay
  const MatchNotification = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">It's a Match! 🎉</h2>
        <p>You and {matchedUser?.username} can now chat!</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AnimatePresence>
        {showMatch && <MatchNotification />}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {currentProfile && (
            <motion.div
              key={currentProfile._id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              {/* Code Display Section */}
              {currentProfile.codeSnippet && currentProfile.codeSnippet.code && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Featured Code</h3>
                  <pre className="bg-code-bg text-white p-4 rounded overflow-x-auto">
                    <code>{currentProfile.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
              
              {/* Tech Stack Section */}
              {currentProfile.techStack && currentProfile.techStack.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Project Section */}
              {currentProfile.favoriteProject && currentProfile.favoriteProject.title && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Favorite Project</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium">{currentProfile.favoriteProject.title}</h4>
                    <p className="text-gray-600">{currentProfile.favoriteProject.description}</p>
                  </div>
                </div>
              )}

              {/* Username Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Developer</h3>
                <p className="text-gray-800">{currentProfile.username}</p>
              </div>

              {/* Bio Section */}
              {currentProfile.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  <p className="text-gray-600">{currentProfile.bio}</p>
                </div>
              )}
              
              {/* Swipe Buttons */}
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwipe('left')}
                  className="bg-red-500 text-white p-4 rounded-full shadow-lg"
                >
                  Skip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSwipe('right')}
                  className="bg-green-500 text-white p-4 rounded-full shadow-lg"
                >
                  Connect
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {error.includes('No more users') ? '👋 All Caught Up!' : 'Oops!'}
              </h3>
              <p className="text-gray-600">
                {error}
              </p>
              {error.includes('No more users') && (
                <button 
                  onClick={() => {
                    setError(null);
                    fetchNextUser();
                  }}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        {!currentProfile && !loading && !error && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-700">Loading next profile...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipePage;