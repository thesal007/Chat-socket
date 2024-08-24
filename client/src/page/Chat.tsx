import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

interface Message {
  sender: string;
  content: string;
}

interface ChatRoom {
  id: string;
  name: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newRoomName, setNewRoomName] = useState('');

  const username = localStorage.getItem('username') || '';

  // Initialize the audio for the message tone
  const messageTone = new Audio('/message-tone.mp3');

  useEffect(() => {
    socket.on('roomsList', (rooms: ChatRoom[]) => {
      setRooms(rooms);
    });

    socket.on('roomMessage', (newMessage: Message) => {
      if (selectedRoom) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedRoom.name]: [...(prevMessages[selectedRoom.name] || []), newMessage],
        }));

        // Play the message tone when a new message is received
        messageTone.play();
      }
    });

    return () => {
      socket.off('roomsList');
      socket.off('roomMessage');
    };
  }, [selectedRoom, messageTone]);

  const createRoom = () => {
    if (newRoomName.trim()) {
      socket.emit('createRoom', newRoomName);
      setNewRoomName('');
    }
  };

  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    socket.emit('findRoom', room.id);
    socket.on('foundRoom', (roomMessages: Message[]) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room.name]: roomMessages,
      }));
    });
  };

  const sendMessage = () => {
    if (message.trim() && selectedRoom) {
      const msg = {
        room_id: selectedRoom.id,
        content: message,
        sender: username,
      };

      socket.emit('newMessage', msg);

      // Play the message tone when a message is sent
      messageTone.play();

      setMessage('');
    }
  };

  return (
    <div className="min-h-[90vh] flex bg-gradient-to-r from-orange-400 to-orange-500">
      <div className="w-1/3 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Create a Room</h2>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Enter room name..."
          />
          <button
            onClick={createRoom}
            className="w-full bg-orange-500 text-white p-2 rounded-lg"
          >
            Create Room
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Rooms</h2>
          <ul>
            {rooms.map((room) => (
              <li
                key={room.id}
                onClick={() => selectRoom(room)}
                className={`flex items-center p-4 cursor-pointer ${
                  selectedRoom?.id === room.id ? 'bg-gray-100' : ''
                }`}
              >
                <div>
                  <p className="text-lg font-semibold">{room.name}</p>
                  <p className="text-sm text-gray-500">Click to join...</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">{selectedRoom ? selectedRoom.name : 'Select a Room'}</h2>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {selectedRoom && messages[selectedRoom.name] ? (
            messages[selectedRoom.name].map((msg, index) => (
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
                  <strong>{msg.sender}:</strong> {msg.content}
                </div>
              </div>
            ))
          ) : (
            <p>No messages</p>
          )}
        </div>
        {selectedRoom && (
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
        )}
      </div>
    </div>
  );
};

export default Chat;
