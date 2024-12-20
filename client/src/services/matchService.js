import axios from 'axios';

export const searchMatches = async (query) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/matches/search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search matches');
  }
};

export const removeMatch = async (matchId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/matches/${matchId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove match');
  }
}; 