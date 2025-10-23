import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

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
      setStones(stonesData);
    } catch (err) {
      setError('Failed to fetch stones. Please check if the backend server is running.');
      console.error('Error fetching stones:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCard = () => {
    // This will be replaced with actual API call to add stone
    console.log('Add stone functionality - to be implemented');
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: "75px" }}>
        <button onClick={addCard} style={{ padding: "10px 20px" }}>
          ADD STONE +
        </button>
        <button onClick={fetchStones} style={{ padding: "10px 20px", marginLeft: "10px" }}>
          REFRESH
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '20px', 
          padding: '10px', 
          border: '1px solid red', 
          borderRadius: '5px',
          backgroundColor: '#ffe6e6'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          fontSize: '18px' 
        }}>
          Loading stones...
        </div>
      ) : (
        <div
          style={{
            marginTop: "40px",
            marginLeft: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px"
          }}
        >
          {stones.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              width: '100%', 
              padding: '40px',
              color: '#666'
            }}>
              No stones found. Add a new stone to get started!
            </div>
          ) : (
            stones.map((stone) => (
              <div
                key={stone._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  width: "calc(33.33% - 20px)",
                  background: "#f9f9f9",
                  boxSizing: "border-box",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "200px"
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                    {stone.stoneName || 'Unnamed Stone'}
                  </h3>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Status:</strong> {stone.status || 'N/A'}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Bought From:</strong> {stone.boughtFrom || 'N/A'}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Estimated Feet:</strong> {stone.estimatedFeet || 0}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Stone Cost:</strong> ₹{stone.stoneCost || 0}
                  </p>
                  {stone.stoneTypes && stone.stoneTypes.length > 0 && (
                    <p style={{ margin: "5px 0", fontSize: "14px" }}>
                      <strong>Types:</strong> {stone.stoneTypes.length} type(s)
                    </p>
                  )}
                </div>
                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button 
                    style={{ 
                      padding: "8px 16px", 
                      backgroundColor: "#007bff", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "4px",
                      cursor: "pointer"
                    }} 
                    onClick={() => openCard(stone._id)}
                  >
                    Open
                  </button>
                  <button 
                    style={{ 
                      padding: "8px 16px", 
                      backgroundColor: "#dc3545", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "4px",
                      cursor: "pointer"
                    }} 
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
  );
}

export default FirstOne;
