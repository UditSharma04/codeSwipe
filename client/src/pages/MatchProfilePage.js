import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/profileService';
import { toast } from 'react-hot-toast';

const MatchProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError(error.message);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

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
      <div className="max-w-4xl mx-auto bg-white neubrutalism p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{profile?.username}</h1>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="bg-primary px-4 py-2 neubrutalism hover:opacity-90"
          >
            Back to Chat
          </button>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {profile?.techStack?.map((tech, index) => (
              <span 
                key={index}
                className="bg-gray-100 px-3 py-1.5 neubrutalism"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Bio</h2>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
        )}

        {/* GitHub Username */}
        {profile?.githubUsername && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">GitHub</h2>
            <a 
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              @{profile.githubUsername}
            </a>
          </div>
        )}

        {/* Favorite Project */}
        {profile?.favoriteProject && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Favorite Project</h2>
            <div className="bg-gray-50 neubrutalism p-4">
              <h3 className="font-bold mb-2">{profile.favoriteProject.title}</h3>
              <p className="text-gray-600 mb-3">{profile.favoriteProject.description}</p>
              {profile.favoriteProject.techUsed?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.favoriteProject.techUsed.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-200 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Snippet */}
        {profile?.codeSnippet?.code && (
          <div>
            <h2 className="text-xl font-bold mb-3">Featured Code</h2>
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <div className="mb-2 text-gray-400">{profile.codeSnippet.language}</div>
              <pre className="overflow-x-auto">
                <code>{profile.codeSnippet.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchProfilePage; 