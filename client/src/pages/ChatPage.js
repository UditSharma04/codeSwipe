// src/pages/ChatPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { matchId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>
        {matchId ? (
          <p>Chat with match {matchId}</p>
        ) : (
          <p>Select a match to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;