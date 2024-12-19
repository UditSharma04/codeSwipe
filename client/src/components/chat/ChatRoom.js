const ChatRoom = ({ matchId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} 
               className={`mb-4 ${message.isMine ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg ${
              message.isMine ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom; 