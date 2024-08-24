import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  socket: Socket;
}

const Home: React.FC<HomeProps> = ({ socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    socket.emit('newUser', { userName, socketID: socket.id });
    navigate('/chat');
  };

  return (
    <form className='home__container' onSubmit={handleSubmit}>
      <h2 className='home__header'>Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        minLength={6}
        name="username"
        id='username'
        className='username__input'
        value={userName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
      />
      <button className='home__cta' type="submit">SIGN IN</button>
    </form>
  );
};

export default Home;
