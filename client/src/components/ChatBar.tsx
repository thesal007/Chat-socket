import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface User {
  socketID: string;
  userName: string;
}

interface ChatBarProps {
  socket: Socket;
}

const ChatBar: React.FC<ChatBarProps> = ({ socket }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleNewUserResponse = (data: User[]) => {
      setUsers(data);
    };

    socket.on("newUserResponse", handleNewUserResponse);

    // Cleanup on unmount
    return () => {
      socket.off("newUserResponse", handleNewUserResponse);
    };
  }, [socket]);

  return (
    <div className='chat__sidebar'>
      <h2>Open Chat</h2>
      <div>
        <h4 className='chat__header'>ACTIVE USERS</h4>
        <div className='chat__users'>
          {users.map(user => (
            <p key={user.socketID}>{user.userName}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
