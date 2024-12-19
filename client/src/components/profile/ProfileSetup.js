import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    techStack: [],
    githubUsername: '',
    codeSnippet: {
      language: 'JavaScript',
      code: '',
      description: ''
    },
    favoriteProject: {
      title: '',
      description: '',
      techUsed: [],
      githubUrl: ''
    }
  });

  const techOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 
    'TypeScript', 'C++', 'Ruby', 'PHP', 'Swift',
    'Go', 'Rust', 'Kotlin', 'Vue.js', 'Angular'
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
    try {
      // Add your API call here to update profile
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white neubrutalism p-6">
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

          {/* Code Snippet */}
          <div>
            <label className="block text-sm font-bold mb-2">Featured Code Snippet</label>
            <select
              value={formData.codeSnippet.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                codeSnippet: { ...prev.codeSnippet, language: e.target.value }
              }))}
              className="w-full p-2 mb-2 neubrutalism"
            >
              {techOptions.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <textarea
              value={formData.codeSnippet.code}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                codeSnippet: { ...prev.codeSnippet, code: e.target.value }
              }))}
              className="w-full p-2 neubrutalism font-mono"
              rows="6"
              placeholder="Paste your code snippet here..."
            />
          </div>

          {/* Favorite Project */}
          <div>
            <label className="block text-sm font-bold mb-2">Favorite Project</label>
            <input
              type="text"
              value={formData.favoriteProject.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                favoriteProject: { ...prev.favoriteProject, title: e.target.value }
              }))}
              className="w-full p-2 mb-2 neubrutalism"
              placeholder="Project title"
            />
            <textarea
              value={formData.favoriteProject.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                favoriteProject: { ...prev.favoriteProject, description: e.target.value }
              }))}
              className="w-full p-2 neubrutalism"
              rows="3"
              placeholder="Project description..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2 neubrutalism bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 neubrutalism bg-primary"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;