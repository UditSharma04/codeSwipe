// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import CodeDisplay from '../components/CodeDisplay';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="bg-white neubrutalism p-4 sm:p-6">
          <i className="bi bi-code-slash text-xl me-2"></i>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white neubrutalism p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/profile/setup')}
                className="bg-primary px-4 py-2 neubrutalism hover:opacity-90"
              >
                <i className="bi bi-gear-fill me-2"></i>
                Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-400 text-white px-4 py-2 neubrutalism hover:opacity-90"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white neubrutalism p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Username</label>
              <div className="bg-gray-50 p-3 neubrutalism">
                {profile?.username}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <div className="bg-gray-50 p-3 neubrutalism">
                {profile?.email}
              </div>
            </div>

            {profile?.bio && (
              <div>
                <label className="block text-sm font-bold mb-2">Bio</label>
                <div className="bg-gray-50 p-3 neubrutalism">
                  {profile.bio}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2">Tech Stack</label>
              <div className="flex flex-wrap gap-2">
                {profile?.techStack?.map((tech, index) => (
                  <span 
                    key={index} 
                    className="bg-primary text-white px-3 py-1.5 neubrutalism"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {profile?.codeSnippet && (
              <div>
                <label className="block text-sm font-bold mb-2">Code Snippet</label>
                <CodeDisplay 
                  code={profile.codeSnippet.code}
                  language={profile.codeSnippet.language}
                />
              </div>
            )}

            {profile?.favoriteProject && (
              <div>
                <label className="block text-sm font-bold mb-2">Favorite Project</label>
                <div className="bg-gray-50 p-4 neubrutalism">
                  <h3 className="font-bold mb-2">{profile.favoriteProject.title}</h3>
                  <p className="text-gray-600 mb-3">{profile.favoriteProject.description}</p>
                  {profile.favoriteProject.githubUrl && (
                    <a 
                      href={profile.favoriteProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <i className="bi bi-github me-2"></i>
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; // Corrected export