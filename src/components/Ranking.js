// src/components/Ranking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../Ranking.css";

function Ranking() {
  const { id } = useParams();
  const [currentPair, setCurrentPair] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(false);
  const [rankData, setRankData] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-ranking/${id}`);
        setRankData(response.data);
        const pairs = generateComparisons(response.data.items);
        setComparisons(pairs);
        setCurrentPair(pairs[0]);
      } catch (error) {
        console.error('Error fetching ranking:', error);
        setError(true)
      }
    };
    fetchRanking();
  }, [id]);

  const generateComparisons = (items) => {
    const pairs = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        pairs.push({ item1: items[i], item2: items[j], result: null });
      }
    }

    let shuffled = pairs
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    return shuffled;
  };

  const handleVote = async (result) => {
    try {
      const pair = comparisons[currentIndex];
      pair.result = result;
      await axios.post('http://localhost:5000/submit-vote', { ...pair, ranking_id: id });
      const nextIndex = currentIndex + 1;
      if (nextIndex < comparisons.length) {
        setCurrentIndex(nextIndex);
        setCurrentPair(comparisons[nextIndex]);
      } else {
        const response = await axios.get(`http://localhost:5000/final-ranking/${id}`);
        console.log(response.data)
        setResults(response.data);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <div className="base">

      <a className='logo' href="/parwise-ranking">
        {error
          ? <h1>Code not found :&#40;</h1>
          : <h1>Ranking</h1>
        }
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt='parwise ranking logo'></img>
      </a>
      {results ? (
        <div>
          <h2>{rankData.name}</h2>
          <ol>
            {results.final_order.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
          <i>{Math.floor(results.nvotes / comparisons.length)} votes</i>
        </div>
      ) : (
        currentPair && (
          <>
          <div className='voting'>
            {rankData.question}
            <div className='voteButtons'>
              <button onClick={() => handleVote(currentPair.item1)}>{currentPair.item1}</button>
              <button onClick={() => handleVote(currentPair.item2)}>{currentPair.item2}</button>
            </div>
          </div>
          </>
        )
      )}
    </div>
  );
}

export default Ranking;
// http://localhost:3000/rank/onujbt4
