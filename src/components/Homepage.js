// src/components/Homepage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Homepage.css';

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
    <div className="base">
      <a className='logo' href="/parwise-ranking">
        <h1>Parwise Ranking</h1>
         <img src={process.env.PUBLIC_URL + '/logo192.png'} alt='parwise ranking logo'></img>
      </a>
      <div className='buttons'>
        <button className='createRanking' onClick={() => navigate('/create-ranking')}>Create a Ranking</button>
        <div className='code'>
          <input
            type="text"
            placeholder="Enter ranking code"
            value={code}
            onChange={handleCodeChange}
            onKeyUp={(e) => {if (e.key === "Enter") {handleJoin()}}}
          />
          <button onClick={handleJoin}>Join Ranking</button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
