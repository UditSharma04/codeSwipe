// src/pages/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

const ChatPage = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('https://codeswipe.onrender.com/api/matches', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  // Handle match selection and load chat history
  useEffect(() => {
    if (selectedMatch && socket) {
      const chatId = [user.id, selectedMatch._id].sort().join('-');
      
      // Join the chat room
      socket.emit('join_chat', chatId);
      setNewMessage('');
      // Fetch chat history
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`https://codeswipe.onrender.com/api/messages/${chatId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedMatch, socket, user.id]);

  // Listen for new messages
  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || !socket) return;

    const chatId = [user.id, selectedMatch._id].sort().join('-');
    const messageData = {
      chatId,
      content: newMessage,
      sender: user.id,
      timestamp: new Date(),
      senderName: user.username
    };

    // Emit the message through socket
    socket.emit('send_message', messageData);

    // Save message to database
    try {
      await axios.post('https://codeswipe.onrender.com/api/messages', messageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setNewMessage('');
  };

  // Add emoji to message
  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  // Add a click outside handler to close the emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matches List */}
        <div className="bg-white neubrutalism p-6">
          <h2 className="text-xl font-bold mb-4">Matches</h2>
          <div className="space-y-3">
            {matches.map((match) => (
              <button
                key={match._id}
                onClick={() => setSelectedMatch(match)}
                className={`w-full p-3 text-left transition-transform duration-200 
                  ${selectedMatch?._id === match._id 
                    ? 'bg-black text-primary border-3 border-black transform -translate-y-0.5 -translate-x-0.5 font-bold shadow-[4px_4px_0px_0px_theme(colors.primary)]' 
                    : 'bg-primary neubrutalism hover:bg-opacity-90'}`}
              >
                <div className="flex items-center">
                  <span className="flex-grow">{match.username}</span>
                  {selectedMatch?._id === match._id && (
                    <span className="text-primary">●</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 bg-white neubrutalism p-6">
          {selectedMatch ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 neubrutalism">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold border-2 border-black">
                    {selectedMatch.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold">{selectedMatch.username}</span>
                </div>
                <Link 
                  to={`/profile/${selectedMatch._id}`} 
                  className="text-gray-600 hover:text-black flex items-center gap-1 mr-2 transition-all duration-200 hover:scale-105 hover:font-semibold"
                >
                  View Profile 
                  <span className="text-xl transition-transform duration-200 group-hover:translate-x-1">›</span>
                </Link>
              </div>

              {/* Messages */}
              <div className="chat-window overflow-y-auto mb-4 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === user.id
                            ? 'bg-primary text-black neubrutalism'
                            : 'bg-gray-100 neubrutalism'
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full p-3 pr-10 neubrutalism"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform"
                    >
                      😊
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-primary neubrutalism hover:opacity-90 text-black"
                  >
                    Send
                  </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 emoji-picker-container">
                    <div className="neubrutalism bg-white p-2">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={400}
                      />
                    </div>
                  </div>
                )}
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a match to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;