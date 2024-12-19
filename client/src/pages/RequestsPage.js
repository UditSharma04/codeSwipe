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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Connection Requests</h1>
        
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No pending connection requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div 
                key={request._id} 
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{request.username}</h2>
                  <p className="text-gray-600">{request.bio}</p>
                </div>

                {request.techStack?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {request.techStack.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleRequest(request._id, 'accept')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(request._id, 'decline')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                  >
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