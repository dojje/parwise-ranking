import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import React, { useState, useEffect } from 'react';

function Home() {
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items'));
    const savedRankingName = localStorage.getItem('rankingName');
    const savedQuestion = localStorage.getItem('question');

    if (savedItems) setItems(savedItems);
    if (savedRankingName) setRankingName(savedRankingName);
    if (savedQuestion) setQuestion(savedQuestion);
  }, []);

  const [items, setItems] = useState(() => {
    // Set initial state from local storage or an empty array
    const savedItems = JSON.parse(localStorage.getItem('items'));
    return savedItems || [];
  });

  const [itemInput, setItemInput] = useState('');
  const [rankingName, setRankingName] = useState(() => {
    // Set initial state from local storage or an empty string
    return localStorage.getItem('rankingName') || '';
  });
  const [question, setQuestion] = useState(() => {
    // Set initial state from local storage or an empty string
    return localStorage.getItem('question') || '';
  });
  const navigate = useNavigate();


  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('rankingName', rankingName);
    localStorage.setItem('question', question);
  }, [items, rankingName, question]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items'));
    const savedRankingName = localStorage.getItem('rankingName');
    const savedQuestion = localStorage.getItem('question');

    if (savedItems) setItems(savedItems);
    if (savedRankingName) setRankingName(savedRankingName);
    if (savedQuestion) setQuestion(savedQuestion);
  }, []);

  // Function to add a new item to the items list
  const handleAddItem = () => {
    if (itemInput.trim()) { // If the input is not empty
      setItems([...items, itemInput.trim()]); // Add the new item to the items list
      setItemInput(''); // Clear the input field
    }
  };


  // Function to remove an item from the items list by its index
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index)); // Remove the item at the specified index
  };

  // Function to navigate to the ranking page with the entered data
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
          onKeyPress={(e) => { // Event handler for key press
            if (e.key === 'Enter') { // If the Enter key is pressed
              handleAddItem(); // Call handleAddItem to add the item
              e.preventDefault(); // Prevent the default form submission behavior
            }
          }}
        />
        <button onClick={handleAddItem}>Add Item</button> {/* Button to add item to the list */}
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item} 
            <button onClick={() => handleRemoveItem(index)}>Remove</button> {/* Button to remove the item */}
          </li>
        ))}
      </ul>
      <button onClick={startRanking} disabled={items.length < 2}> {/* Button to start ranking */}
        Start Ranking
      </button>
    </div>
  );
}

export default Home; // Export the Home component as the default export
