import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

interface Message {
  sender: string;
  content: string;
}

interface ChatRoomProps {
  selectedRoom: string;
  username: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ selectedRoom, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedRoom) {
      socket.emit('findRoom', selectedRoom);
      socket.on('foundRoom', (roomMessages: Message[]) => {
        setMessages(roomMessages);
      });

      socket.on('roomMessage', (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off('foundRoom');
        socket.off('roomMessage');
      };
    }
  }, [selectedRoom]);

  const sendMessage = () => {
    if (message.trim()) {
      const msg = {
        room_id: selectedRoom,
        message: message,
        user: username,
      };

      socket.emit('newMessage', msg);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold">{selectedRoom}</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.sender === username ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === username ? 'bg-orange-200' : 'bg-gray-100'
                }`}
              >
                <strong>{msg.sender}: </strong> {msg.content}
              </div>
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full bg-orange-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
