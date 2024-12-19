import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MatchProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { matchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/matches/${matchId}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [matchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white neubrutalism p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black font-bold text-2xl border-3 border-black">
              {profile?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.username}</h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary neubrutalism"
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
                className="px-3 py-1 bg-primary neubrutalism text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Bio</h2>
          <p className="text-gray-700">{profile?.bio}</p>
        </div>

        {/* GitHub */}
        {profile?.githubUsername && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">GitHub</h2>
            <a 
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <i className="bi bi-github text-xl"></i>
              {profile.githubUsername}
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