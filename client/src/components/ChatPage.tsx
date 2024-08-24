import React, { useEffect, useState, useRef, RefObject } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  name: string;
  socketID: string;
}

interface ChatPageProps {
  socket: Socket;
}

const ChatPage: React.FC<ChatPageProps> = ({ socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingStatus, setTypingStatus] = useState<string>('');
  const lastMessageRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessageResponse = (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('messageResponse', handleMessageResponse);

    return () => {
      socket.off('messageResponse', handleMessageResponse);
    };
  }, [socket]);

  useEffect(() => {
    const handleTypingResponse = (data: string) => {
      setTypingStatus(data);
    };

    socket.on('typingResponse', handleTypingResponse);

    return () => {
      socket.off('typingResponse', handleTypingResponse);
    };
  }, [socket]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className='chat__main'>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
