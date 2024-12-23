// src/pages/MatchesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, searchMatches, removeMatch } from '../services/matchService';
import { toast } from 'react-hot-toast';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        console.log('Fetching matches...'); // Debug log
        const data = await getMatches();
        console.log('Matches received:', data); // Debug log
        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setError(error.message);
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery) return;

    const searchTimeout = setTimeout(async () => {
      try {
        const data = await searchMatches(searchQuery);
        setMatches(data);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to search matches');
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleRemoveMatch = async (matchId) => {
    try {
      await removeMatch(matchId);
      setMatches(matches.filter(match => match._id !== matchId));
      toast.success('Match removed successfully');
    } catch (error) {
      console.error('Error removing match:', error);
      toast.error('Failed to remove match');
    }
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
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white neubrutalism p-6 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-primary px-4 py-2 neubrutalism"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white neubrutalism p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">Your Matches</h1>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 neubrutalism"
              />
            </div>
          </div>
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
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-xl font-bold">{match.username}</h2>
                    <button
                      onClick={() => handleRemoveMatch(match._id)}
                      className="text-red-400 hover:text-red-500 p-1"
                      title="Remove Match"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
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
                    onClick={() => navigate(`/chat/${match._id}`)}
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