import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TECH_STACK_OPTIONS = [
  'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go',
  'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask',
  'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes'
];

const INTEREST_OPTIONS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'AI/Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'Game Development',
  'Blockchain'
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    techStack: [],
    bio: '',
    favoriteProject: {
      title: '',
      description: '',
      techUsed: [],
      githubUrl: ''
    },
    interests: [],
    codeSnippet: {
      language: '',
      code: '',
      description: ''
    },
    experience: 'Beginner',
    availability: 'Open to chat'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTechStackChange = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/swipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Developer Profile</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tech Stack Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tech Stack (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_OPTIONS.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechStackChange(tech)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.techStack.includes(tech)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Tell others about yourself..."
            />
          </div>

          {/* Favorite Project */}
          <div className="space-y-4">
            <h3 className="font-semibold">Favorite Project</h3>
            <input
              type="text"
              placeholder="Project Title"
              value={formData.favoriteProject.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                favoriteProject: { ...prev.favoriteProject, title: e.target.value }
              }))}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Project Description"
              value={formData.favoriteProject.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                favoriteProject: { ...prev.favoriteProject, description: e.target.value }
              }))}
              className="w-full p-2 border rounded"
              rows="3"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={formData.favoriteProject.githubUrl}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                favoriteProject: { ...prev.favoriteProject, githubUrl: e.target.value }
              }))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              What are you interested in?
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestChange(interest)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.interests.includes(interest)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <div className="space-y-4">
            <h3 className="font-semibold">Share a Code Snippet</h3>
            <input
              type="text"
              placeholder="Programming Language"
              value={formData.codeSnippet.language}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                codeSnippet: { ...prev.codeSnippet, language: e.target.value }
              }))}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Paste your code here..."
              value={formData.codeSnippet.code}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                codeSnippet: { ...prev.codeSnippet, code: e.target.value }
              }))}
              className="w-full p-2 border rounded font-mono"
              rows="5"
            />
            <input
              type="text"
              placeholder="Brief description of what this code does"
              value={formData.codeSnippet.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                codeSnippet: { ...prev.codeSnippet, description: e.target.value }
              }))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Experience Level
            </label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Availability
            </label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="Open to chat">Open to chat</option>
              <option value="Looking for collaborators">Looking for collaborators</option>
              <option value="Currently busy">Currently busy</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded ${
              loading
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold`}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;