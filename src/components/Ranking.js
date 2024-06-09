// src/components/Ranking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Ranking() {
  const { id } = useParams();
  const [currentPair, setCurrentPair] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-ranking/${id}`);
        const pairs = generateComparisons(response.data.items);
        setComparisons(pairs);
        setCurrentPair(pairs[0]);
      } catch (error) {
        console.error('Error fetching ranking:', error);
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
    return pairs;
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
        setResults(response.data);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <div className="ranking">
      <h1>Ranking</h1>
      {results ? (
        <div>
          <h2>Final Results</h2>
          <ol>
            {results.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      ) : (
        currentPair && (
          <div>
            <p>Select the better option:</p>
            <button onClick={() => handleVote(currentPair.item1)}>{currentPair.item1}</button>
            <button onClick={() => handleVote(currentPair.item2)}>{currentPair.item2}</button>
          </div>
        )
      )}
    </div>
  );
}

export default Ranking;
