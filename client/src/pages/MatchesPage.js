// src/pages/MatchesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/matches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(response.data);
      } catch (err) {
        console.error('Failed to fetch matches', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleStartChat = (matchId) => {
    navigate(`/chat/${matchId}`);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
        {matches.length === 0 ? (
          <div className="text-center text-gray-600">
            No matches yet. Keep swiping to find your perfect coding partner!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div 
                key={match._id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{match.username}</h2>
                    <p className="text-gray-600">{match.email}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tech Stack</label>
                  <div className="flex flex-wrap gap-2">
                    {match.techStack?.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-primary text-white px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleStartChat(match._id)}
                  className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded"
                >
                  Start Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;