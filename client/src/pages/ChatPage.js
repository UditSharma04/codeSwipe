// src/pages/ChatPage.js
import React from 'react';

const ChatPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white neubrutalism p-4">
          <h2 className="text-xl font-bold mb-4">Matches</h2>
          <div className="space-y-2">
            <div className="p-2 bg-primary neubrutalism cursor-pointer">
              Sarah Developer
            </div>
            <div className="p-2 bg-primary neubrutalism cursor-pointer">
              John Coder
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white neubrutalism p-4">
          <div className="chat-window overflow-y-auto mb-4">
            <div className="space-y-2">
              <div className="bg-primary p-2 neubrutalism max-w-[80%] ml-auto">
                Hey! I saw you're working with React too!
              </div>
              <div className="bg-gray-100 p-2 neubrutalism max-w-[80%]">
                Yes! I love React. What kind of projects are you working on?
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 p-2 neubrutalism" 
              placeholder="Type your message..."
            />
            <button className="bg-primary px-4 py-2 neubrutalism">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;