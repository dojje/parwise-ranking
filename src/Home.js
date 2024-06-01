import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Home() {
  const [items, setItems] = useState([]); // State for storing the list of items
  const [itemInput, setItemInput] = useState(''); // State for the current item input
  const [rankingName, setRankingName] = useState(''); // State for the ranking name
  const [question, setQuestion] = useState(''); // State for the comparison question
  const navigate = useNavigate(); // Hook for navigation

  const handleAddItem = () => {
    if (itemInput.trim()) { // If the input is not empty
      setItems([...items, itemInput.trim()]); // Add the new item to the items list
      setItemInput(''); // Clear the input field
    }
  };

  const startRanking = () => {
    navigate('/rank', { state: { items, rankingName, question } }); // Navigate to the rank page with the items, ranking name, and question
  };

  return (
    <div>
      <h1>Item Ranker</h1>
      <div>
        <input
          type="text"
          placeholder="Ranking Name"
          value={rankingName}
          onChange={(e) => setRankingName(e.target.value)} // Update the ranking name state
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Comparison Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)} // Update the question state
        />
      </div>
      <div>
        <input
        type="text"
        placeholder="Add Item"
        value={itemInput}
        onChange={(e) => setItemInput(e.target.value)} // Update the item input state
        onKeyPress={(e) => {
            if (e.key === 'Enter') {
            handleAddItem(); // Call handleAddItem when Enter key is pressed
            e.preventDefault(); // Prevent the default form submission behavior
            }
        }}
        />
        <button onClick={handleAddItem}>Add Item</button> {/* Button to add item to the list */}
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li> // Display each item in the list
        ))}
      </ul>
      <button onClick={startRanking} disabled={items.length < 2}> {/* Button to start ranking */}
        Start Ranking
      </button>
    </div>
  );
}

export default Home; // Export the Home component as the default export
