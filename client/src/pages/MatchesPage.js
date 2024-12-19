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
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="bg-white neubrutalism p-4 sm:p-6">
          <i className="bi bi-code-slash text-xl me-2"></i>
          Loading matches...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white neubrutalism p-6 mb-8">
          <h1 className="text-3xl font-bold">Your Matches</h1>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white neubrutalism p-8 text-center">
            <i className="bi bi-heart text-4xl mb-4 text-gray-400"></i>
            <p className="text-gray-600">No matches yet. Keep swiping to find your perfect coding partner!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div 
                key={match._id} 
                className="bg-white neubrutalism p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-1">{match.username}</h2>
                  <p className="text-gray-600 mb-4">{match.email}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.techStack?.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-200 text-black px-2 py-1 neubrutalism text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStartChat(match._id)}
                    className="flex-1 bg-primary px-4 py-2 neubrutalism hover:opacity-90 text-black"
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Start Chat
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${match._id}`)}
                    className="flex-1 bg-gray-100 px-4 py-2 neubrutalism hover:bg-gray-200 text-black"
                  >
                    <i className="bi bi-person me-2"></i>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;