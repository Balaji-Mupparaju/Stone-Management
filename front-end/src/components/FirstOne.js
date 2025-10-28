import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './FirstOne.css';

function FirstOne() {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all stones from API on component mount
  useEffect(() => {
    fetchStones();
  }, []);

  const fetchStones = async () => {
    try {
      setLoading(true);
      setError(null);
      const stonesData = await ApiService.getAllStones();
      if (Array.isArray(stonesData)) {
        setStones(stonesData);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch stones. Please check if the backend server is running.');
      console.error('Error fetching stones:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCard = () => {
    navigate('/add-stone');
  };

  const deleteCard = async (id) => {
    try {
      await ApiService.deleteStone(id);
      setStones(stones.filter(stone => stone._id !== id));
    } catch (err) {
      setError('Failed to delete stone');
      console.error('Error deleting stone:', err);
    }
  };

  const openCard = (id) => {
    navigate(`/second/${id}`); // go to Second page
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="controls-container">
          <button className="control-button add-button" onClick={addCard}>
            <span>＋</span> Add Stone
          </button>
          <button className="control-button refresh-button" onClick={fetchStones}>
            ↻ Refresh
          </button>
        </div>
      </header>

      <div className="content-container">
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-message">
            Loading your stone inventory...
          </div>
        ) : (
          <div className="stones-container">
            {stones.length === 0 ? (
              <div className="no-stones-message">
                No stones found in inventory. Add your first stone to get started!
              </div>
            ) : (
              stones.map((stone) => (
                <div key={stone._id} className="stone-card">
                  <div className="stone-content">
                    <h3 className="stone-title">
                      {stone.stoneName || 'Unnamed Stone'}
                    </h3>
                    <div className="stone-info">
                      <span>Status</span>
                      <span className="stone-type-badge">{stone.status || 'N/A'}</span>
                    </div>
                    <div className="stone-info">
                      <span>Bought From</span>
                      <strong>{stone.boughtFrom || 'N/A'}</strong>
                    </div>
                    <div className="stone-info">
                      <span>Estimated Feet</span>
                      <strong>{stone.estimatedFeet || 0}</strong>
                    </div>
                    <div className="stone-info">
                      <span>Stone Cost</span>
                      <strong>₹{stone.stoneCost?.toLocaleString() || 0}</strong>
                    </div>
                    {stone.stoneTypes && stone.stoneTypes.length > 0 && (
                      <div className="stone-info">
                        <span>Types</span>
                        <span className="stone-type-badge">
                          {stone.stoneTypes.length} type(s)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="card-buttons">
                    <button 
                      className="card-button open-button"
                      onClick={() => openCard(stone._id)}
                    >
                      View Details
                    </button>
                    <button 
                      className="card-button delete-button"
                      onClick={() => deleteCard(stone._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FirstOne;
