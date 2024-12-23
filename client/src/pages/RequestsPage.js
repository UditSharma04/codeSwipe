import React, { useState, useEffect } from 'react';
import { getRequests, respondToRequest } from '../services/requestService';
import { toast } from 'react-hot-toast';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        setError(error.message);
        toast.error('Failed to load connection requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (targetUserId, action) => {
    try {
      await respondToRequest(targetUserId, action);
      
      // Remove the request from the list
      setRequests(prev => prev.filter(req => req._id !== targetUserId));
      
      // Show success message
      toast.success(
        action === 'accept' 
          ? 'Connection accepted!' 
          : 'Request declined'
      );
    } catch (error) {
      console.error('Error responding to request:', error);
      toast.error('Failed to process response');
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
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white neubrutalism p-6 text-center">
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
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request._id} 
                className="bg-white neubrutalism p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{request.username}</h2>
                    <div className="flex flex-wrap gap-2">
                      {request.techStack?.map((tech, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 px-2 py-1 neubrutalism text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleResponse(request._id, 'accept')}
                      className="flex-1 sm:flex-initial bg-primary px-6 py-2 neubrutalism hover:opacity-90"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(request._id, 'decline')}
                      className="flex-1 sm:flex-initial bg-gray-100 px-6 py-2 neubrutalism hover:bg-gray-200"
                    >
                      Decline
                    </button>
                  </div>
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