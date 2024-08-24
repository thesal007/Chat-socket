import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      navigate('/chat'); // Navigate to the chat room after setting the profile
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-6">Set Your Profile</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          placeholder="Enter your username..."
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 text-white p-2 rounded-lg"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default SetProfile;
