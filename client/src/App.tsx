import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SetProfile from './page/SetProfile';
import Chat from './page/Chat';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetProfile />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
