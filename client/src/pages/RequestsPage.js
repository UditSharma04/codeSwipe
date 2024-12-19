import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/swipe/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async (targetUserId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/swipe/respond', 
        { targetUserId, action },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Show success toast
      toast.success(
        action === 'accept' 
          ? '🎉 Connection accepted!' 
          : '👋 Request declined'
      );

      // Refresh requests list
      fetchRequests();
    } catch (err) {
      console.error('Failed to process request', err);
      toast.error('Failed to process request');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="bg-white neubrutalism p-4 sm:p-6">
          <i className="bi bi-code-slash text-xl me-2"></i>
          Loading requests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white neubrutalism p-6 mb-8">
          <h1 className="text-3xl font-bold">Connection Requests</h1>
        </div>
        
        {requests.length === 0 ? (
          <div className="bg-white neubrutalism p-8 text-center">
            <i className="bi bi-inbox text-4xl mb-4 text-gray-400"></i>
            <p className="text-gray-600">No pending connection requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div 
                key={request._id} 
                className="bg-white neubrutalism p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2">{request.username}</h2>
                  <p className="text-gray-600 mb-4">{request.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {request.techStack?.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-primary text-white px-2 py-1 neubrutalism text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleRequest(request._id, 'accept')}
                    className="flex-1 bg-green-500 text-white px-4 py-2 neubrutalism hover:opacity-90"
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(request._id, 'decline')}
                    className="flex-1 bg-red-400 text-white px-4 py-2 neubrutalism hover:opacity-90"
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage; 