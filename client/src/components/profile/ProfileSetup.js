import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../services/authService';
import { toast } from 'react-hot-toast';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    techStack: [],
    bio: '',
    githubUsername: '',
    favoriteProject: {
      title: '',
      description: '',
      techUsed: [],
      githubUrl: ''
    },
    codeSnippet: {
      language: '',
      code: '',
      description: ''
    },
    interests: [],
    availability: 'Looking for collaborators',
    experience: 'Intermediate'
  });
  const [loading, setLoading] = useState(false);

  const techOptions = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 
    'Node.js', 'MongoDB', 'SQL', 'TypeScript', 'Go',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Rust'
  ];

  const handleTechSelect = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting profile data:', formData); // Debug log
      const response = await updateProfile(formData);
      console.log('Profile update response:', response); // Debug log
      
      toast.success('Profile updated successfully!');
      navigate('/swipe');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Setup Your CodeSwipe Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-bold mb-2">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {techOptions.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechSelect(tech)}
                  className={`px-3 py-1 neubrutalism ${
                    formData.techStack.includes(tech)
                      ? 'bg-primary'
                      : 'bg-gray-100'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-2 neubrutalism"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* GitHub Username */}
          <div>
            <label className="block text-sm font-bold mb-2">GitHub Username</label>
            <input
              type="text"
              value={formData.githubUsername}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUsername: e.target.value }))}
              className="w-full p-2 neubrutalism"
              placeholder="Your GitHub username"
            />
          </div>

          {/* Favorite Project */}
          <div>
            <h3 className="text-lg font-bold mb-3">Favorite Project</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.favoriteProject.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  favoriteProject: {
                    ...prev.favoriteProject,
                    title: e.target.value
                  }
                }))}
                className="w-full p-2 neubrutalism"
                placeholder="Project title"
              />
              <textarea
                value={formData.favoriteProject.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  favoriteProject: {
                    ...prev.favoriteProject,
                    description: e.target.value
                  }
                }))}
                className="w-full p-2 neubrutalism"
                rows="3"
                placeholder="Project description"
              />
              <input
                type="text"
                value={formData.favoriteProject.githubUrl}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  favoriteProject: {
                    ...prev.favoriteProject,
                    githubUrl: e.target.value
                  }
                }))}
                className="w-full p-2 neubrutalism"
                placeholder="GitHub repository URL"
              />
            </div>
          </div>

          {/* Code Snippet */}
          <div>
            <h3 className="text-lg font-bold mb-3">Featured Code Snippet</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.codeSnippet.language}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  codeSnippet: {
                    ...prev.codeSnippet,
                    language: e.target.value
                  }
                }))}
                className="w-full p-2 neubrutalism"
                placeholder="Programming language"
              />
              <textarea
                value={formData.codeSnippet.code}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  codeSnippet: {
                    ...prev.codeSnippet,
                    code: e.target.value
                  }
                }))}
                className="w-full p-2 neubrutalism font-mono"
                rows="6"
                placeholder="Paste your code snippet here..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-primary neubrutalism ${
              loading ? 'opacity-50' : 'hover:opacity-90'
            }`}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;