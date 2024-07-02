// src/components/CreateRanking.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../CreateRanking.css"

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
    <div className="base">
      <div className='logo'>
        <h1>Create Ranking</h1>
         <img src={process.env.PUBLIC_URL + '/logo192.png'} alt='parwise ranking logo'></img>
      </div>
        <div className='label'>
          <label>Ranking Name</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>
        <div className='label'>
          <label>Ranking Question</label>
          <input type="text" value={question} onChange={handleQuestionChange} required />
        </div>
        <div className='items'>
          <label>Items:</label>
          {items.map((item, index) => (
              <>
                <div className='itemadder'>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                    {index === items.length -1 ? 
                    <button type="button" onClick={() => handleAddItem(index)}>
                      Add Item
                    </button> 
                    :
                    <button type="button" onClick={() => handleRemoveItem(index)}>
                      Remove
                    </button> 
                    }
                </div>
              </>
          ))}
        </div>
        <button type="submit" onClick={handleSubmit}>Create Ranking</button>
    </div>
  );
}

export default CreateRanking;
