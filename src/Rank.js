import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate for navigation

function Rank() {
  const location = useLocation(); // Hook to access the current location's state
  const navigate = useNavigate(); // Hook for navigation
  const { items, rankingName, question } = location.state; // Extract items, ranking name, and question from location state
  const [currentPair, setCurrentPair] = useState(null); // State for the current pair of items being compared
  const [comparisons, setComparisons] = useState([]); // State for the list of comparisons
  const [currentIndex, setCurrentIndex] = useState(0); // State for the current index in the comparisons list
  const [ranking, setRanking] = useState([]); // State for the final ranking

  // Generate comparisons pairs when items change
  useEffect(() => {
    const pairs = generateComparisons(items);
    setComparisons(pairs);
    if (pairs.length > 0) {
      setCurrentPair(pairs[0]);
    }
  }, [items]);

  // Update the current pair when the current index changes
  useEffect(() => {
    if (comparisons.length > 0 && currentIndex < comparisons.length) {
      setCurrentPair(comparisons[currentIndex]);
    } else if (comparisons.length > 0) {
      setRanking(generateFinalRanking(items, comparisons)); // Generate the final ranking if all comparisons are done
    }
  }, [currentIndex, comparisons, items]);

  const handleChoice = (choice) => {
    comparisons[currentIndex].result = choice; // Update the result of the current comparison
    setCurrentIndex(currentIndex + 1); // Move to the next comparison
  };

  // Function to generate all possible pairs of items for comparison
  const generateComparisons = (items) => {
    const pairs = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        pairs.push({ item1: items[i], item2: items[j], result: null });
      }
    }
    return pairs;
  };

  // Function to generate the final ranking based on comparison results
  const generateFinalRanking = (items, comparisons) => {
    const scores = new Map(items.map(item => [item, 0]));

    comparisons.forEach(({ item1, item2, result }) => {
      if (result === -1) {
        scores.set(item1, scores.get(item1) + 1);
      } else if (result === 1) {
        scores.set(item2, scores.get(item2) + 1);
      }
    });

    return [...items].sort((a, b) => scores.get(b) - scores.get(a)); // Sort items by scores in descending order
  };

  return (
    <div>
      <h1>{rankingName}</h1>
      {ranking.length === 0 ? (
        <div>
          <p>{question}</p>
          {currentPair && (
            <div>
              <button onClick={() => handleChoice(-1)}>{currentPair.item1}</button>
              <button onClick={() => handleChoice(1)}>{currentPair.item2}</button>
              <button onClick={() => handleChoice(0)}>Equal</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Final Ranking</h2>
          <ol>
            {ranking.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
          <button onClick={() => navigate('/')}>Start Over</button> {/* Button to start over */}
        </div>
      )}
    </div>
  );
}

export default Rank; // Export the Rank component as the default export
