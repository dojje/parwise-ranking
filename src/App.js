import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import Home from './Home'; // Import the Home component
import Rank from './Rank'; // Import the Rank component
import './App.css'; // Import the CSS file for styling

function App() {
  return (
    <Router> {/* Set up the Router for handling navigation */}
      <div className="App">
        <Routes> {/* Define the routes for the application */}
          <Route path="/parwise-ranking/" element={<Home />} /> {/* Route for the Home component */}
          <Route path="/parwise-ranking/rank" element={<Rank />} /> {/* Route for the Rank component */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component as the default export
