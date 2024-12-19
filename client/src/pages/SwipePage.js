// src/pages/SwipePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SwipePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNextUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/swipe/next', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
      } catch (err) {
        console.error('Failed to fetch next user', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNextUser();
  }, []);

  const handleSwipe = async (direction) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/swipe', 
        { 
          targetUserId: currentUser._id, 
          direction 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Fetch next user after swiping
      const response = await axios.get('http://localhost:5000/api/swipe/next', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Swipe failed', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <p className="text-gray-700">No more users to swipe. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">{currentUser.username}</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {currentUser.techStack?.map((tech, index) => (
                <span 
                  key={index} 
                  className="bg-primary text-white px-2 py-1 rounded text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {currentUser.codeSnippet && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Code Snippet</label>
              <pre className="bg-code-bg text-white p-4 rounded overflow-x-auto">
                <code>{currentUser.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {currentUser.bio && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
              <p className="bg-gray-100 p-2 rounded">{currentUser.bio}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => handleSwipe('left')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
          >
            Pass
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipePage;