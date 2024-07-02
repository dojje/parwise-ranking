// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Homepage from './components/Homepage';
import CreateRanking from './components/CreateRanking';
import Ranking from './components/Ranking';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/parwise-ranking" element={<Homepage></Homepage>} />
        <Route path="/create-ranking" element={<CreateRanking></CreateRanking>} />
        <Route path="/rank/:id" element={<Ranking/>} />
      </Routes>
    </Router>
  );
}

export default App;
