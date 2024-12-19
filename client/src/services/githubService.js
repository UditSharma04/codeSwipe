export const connectGitHub = async (code) => {
  try {
    const response = await API.post('/auth/github', { code });
    return response.data;
  } catch (error) {
    throw new Error('GitHub connection failed');
  }
};

export const syncGitHubProfile = async () => {
  try {
    const response = await API.get('/github/sync');
    return response.data;
  } catch (error) {
    throw new Error('GitHub sync failed');
  }
}; 