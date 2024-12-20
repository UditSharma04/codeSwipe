// src/pages/MatchesPage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { searchMatches, removeMatch } from '../services/matchService';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/ui/ConfirmModal';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const searchDebounceRef = useRef(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

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

  const handleSearch = async (query) => {
    try {
      setSearching(true);
      const results = await searchMatches(query);
      setMatches(results);
    } catch (error) {
      toast.error('Failed to search matches');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (searchQuery) {
      searchDebounceRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      fetchMatches();
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleStartChat = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  const handleRemoveMatch = (matchId, matchName) => {
    setSelectedMatch({ id: matchId, name: matchName });
    setModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMatch) return;
    
    try {
      await removeMatch(selectedMatch.id);
      setMatches(prevMatches => prevMatches.filter(match => match._id !== selectedMatch.id));
      toast.success('Match removed successfully');
    } catch (error) {
      toast.error('Failed to remove match');
    }
    setSelectedMatch(null);
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
    <>
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

          {searching && (
            <div className="text-center py-4">
              <i className="bi bi-search me-2"></i>
              Searching...
            </div>
          )}

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
                        onClick={() => handleRemoveMatch(match._id, match.username)}
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

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMatch(null);
        }}
        onConfirm={handleConfirmRemove}
        matchName={selectedMatch?.name || ''}
      />
    </>
  );
};

export default MatchesPage;