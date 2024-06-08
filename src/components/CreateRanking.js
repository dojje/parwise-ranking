// src/components/CreateRanking.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateRanking() {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [items, setItems] = useState(['']);
  const navigate = useNavigate();

  const handleNameChange = (e) => setName(e.target.value);
  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleItemChange = (index, e) => {
    const newItems = items.slice();
    newItems[index] = e.target.value;
    setItems(newItems);
  };

  const handleAddItem = () => setItems([...items, '']);
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/create-ranking', { name, question, items });
      navigate(`/rank/${response.data.id}`);
    } catch (error) {
      console.error('Error creating ranking:', error);
    }
  };

  return (
    <div className="create-ranking">
      <h1>Create a Ranking</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ranking Name:</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label>Ranking Question:</label>
          <input type="text" value={question} onChange={handleQuestionChange} required />
        </div>
        <div>
          <label>Items:</label>
          {items.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveItem(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>Add Item</button>
        </div>
        <button type="submit">Create Ranking</button>
      </form>
    </div>
  );
}

export default CreateRanking;
