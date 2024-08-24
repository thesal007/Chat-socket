import React, { useState, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import { Socket } from 'socket.io-client';

interface ChatFooterProps {
  socket: Socket;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ socket }) => {
  const [message, setMessage] = useState<string>('');

  const handleTyping = () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      socket.emit('typing', `${userName} is typing`);
    }
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = localStorage.getItem('userName');
    if (message.trim() && userName) {
      socket.emit('message', {
        text: message,
        name: userName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
      setMessage('');
    }
  };

  return (
    <div className='chat__footer'>
      <form className='form' onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder='Write message'
          className='message'
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleTyping()}
        />
        <button className="sendBtn" type="submit">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
