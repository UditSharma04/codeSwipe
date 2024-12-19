import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../services/authService';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);
  const [bio, setBio] = useState('');
  const [favoriteProject, setFavoriteProject] = useState({
    title: '',
    description: ''
  });

  const techOptions = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'React', 
    'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'MongoDB', 
    'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes'
  ];

  const handleTechSelect = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter(t => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await updateProfile({
        techStack: selectedTech,
        bio,
        favoriteProject
      });
      
      navigate('/profile');
    } catch (err) {
      console.error('Profile Setup Error:', err);
      setError(err.message || 'Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Developer Profile</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tech Stack (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {techOptions.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechSelect(tech)}
                  className={`px-3 py-1 rounded ${
                    selectedTech.includes(tech)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Favorite Project
            </label>
            <input
              type="text"
              value={favoriteProject.title}
              onChange={(e) => setFavoriteProject({
                ...favoriteProject,
                title: e.target.value
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Project Title"
            />
            <textarea
              value={favoriteProject.description}
              onChange={(e) => setFavoriteProject({
                ...favoriteProject,
                description: e.target.value
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="Project Description"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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