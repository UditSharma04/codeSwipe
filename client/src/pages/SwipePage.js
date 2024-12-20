// src/pages/SwipePage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNextProfile, submitSwipe } from '../services/swipeService';
import toast from 'react-hot-toast';
import { useWindowSize } from '../hooks/useWindowSize';
import CodeDisplay from '../components/CodeDisplay';

const SwipePage = () => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const { width } = useWindowSize();

  const fetchNextProfile = async () => {
    try {
      setLoading(true);
      const profile = await getNextProfile();
      if (profile) {
        setCurrentProfile(profile);
        setNoMoreProfiles(false);
      } else {
        setCurrentProfile(null);
        setNoMoreProfiles(true);
      }
    } catch (error) {
      if (error.message === 'No more profiles available') {
        setNoMoreProfiles(true);
        setCurrentProfile(null);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextProfile();
  }, []);

  const handleSwipe = async (direction) => {
    if (!currentProfile || loading) return;

    setSwipeDirection(direction);
    
    try {
      await submitSwipe(currentProfile._id, direction);
      
      if (direction === 'right') {
        if (currentProfile.hasLikedBack) {
          toast.success(
            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">It's a match! 🎉</span>
              <span className="text-sm">You and {currentProfile.username} can now chat</span>
            </div>,
            {
              duration: 4000,
              icon: '👋',
            }
          );
        } else {
          toast.success(
            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">Connection Request Sent!</span>
              <span className="text-sm">Waiting for {currentProfile.username} to respond</span>
            </div>,
            {
              duration: 3000,
              icon: '✨',
            }
          );
        }
      } else {
        toast(
          <div className="flex items-center">
            <span>Maybe next time</span>
          </div>,
          {
            icon: '👋',
            duration: 1500,
            style: {
              background: '#6B7280',
              color: '#fff',
            },
          }
        );
      }
      
      setTimeout(() => {
        setSwipeDirection(null);
        fetchNextProfile();
      }, 500);
    } catch (error) {
      toast.error(error.message);
      setSwipeDirection(null);
    }
  };

  if (loading && !currentProfile) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="bg-white neubrutalism p-4 sm:p-6">
          <i className="bi bi-code-slash text-xl me-2"></i>
          Loading profiles...
        </div>
      </div>
    );
  }

  if (noMoreProfiles) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="bg-white neubrutalism p-8 text-center">
          <i className="bi bi-emoji-dizzy text-4xl mb-4 text-gray-400"></i>
          <h2 className="text-xl font-bold mb-2">No More Profiles</h2>
          <p className="text-gray-600">
            Looks like you've seen all available profiles!
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back later for new developers
          </p>
          <button
            onClick={fetchNextProfile}
            className="mt-4 bg-primary px-4 py-2 neubrutalism hover:opacity-90"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="bg-white neubrutalism p-4 sm:p-6 text-center">
          No more profiles to show right now!
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4">
      <div className="mx-auto max-w-md">
        <AnimatePresence>
          <motion.div 
            className="bg-white neubrutalism p-4 sm:p-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: swipeDirection === 'left' ? -1000 : swipeDirection === 'right' ? 1000 : 0
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col">
              <CodeDisplay 
                code={currentProfile.codeSnippet?.code}
                language={currentProfile.codeSnippet?.language}
              />

              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold">{currentProfile.username}</h2>
                
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {currentProfile.techStack?.map((tech, index) => (
                    <span key={index} className="bg-primary px-2 sm:px-3 py-1 neubrutalism text-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-sm sm:text-base">{currentProfile.bio}</p>
                
                {currentProfile.githubUsername && (
                  <div>
                    <a 
                      href={`https://github.com/${currentProfile.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black text-sm sm:text-base"
                    >
                      <i className="bi bi-github me-2"></i>
                      {currentProfile.githubUsername}
                    </a>
                  </div>
                )}

                {currentProfile.favoriteProject && (
                  <div className="p-2 sm:p-3 bg-gray-50 neubrutalism">
                    <h3 className="font-bold mb-1 text-sm sm:text-base">Favorite Project</h3>
                    <p className="text-xs sm:text-sm">{currentProfile.favoriteProject.title}</p>
                    <p className="text-xs text-gray-600">{currentProfile.favoriteProject.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-3 sm:gap-4 mt-4">
                <motion.button 
                  onClick={() => handleSwipe('left')} 
                  className="bg-red-400 p-3 sm:p-4 neubrutalism"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  <i className="bi bi-x-lg text-base sm:text-xl"></i>
                </motion.button>
                <motion.button 
                  onClick={() => handleSwipe('right')} 
                  className="bg-primary p-3 sm:p-4 neubrutalism"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  <i className="bi bi-heart-fill text-base sm:text-xl"></i>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipePage;