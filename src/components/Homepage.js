// src/components/Homepage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleCodeChange = (e) => setCode(e.target.value);
  const handleJoin = () => {
    if (code) {
      navigate(`/rank/${code}`);
    }
  };

  return (
    <div className="homepage">
      <h1>Pairwise Ranking</h1>
      <div>
        <button onClick={() => navigate('/create-ranking')}>Create a Ranking</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter ranking code"
          value={code}
          onChange={handleCodeChange}
        />
        <button onClick={handleJoin}>Join Ranking</button>
      </div>
    </div>
  );
}

export default Homepage;
