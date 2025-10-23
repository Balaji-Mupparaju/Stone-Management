import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

function Second() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stone, setStone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchStoneDetails();
    }
  }, [id]);

  const fetchStoneDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const stoneData = await ApiService.getStoneById(id);
      setStone(stoneData);
    } catch (err) {
      setError('Failed to fetch stone details');
      console.error('Error fetching stone details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>🪨 Stone Details</h1>
        <p>Loading stone details...</p>
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>🪨 Stone Details</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  if (!stone) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>🪨 Stone Details</h1>
        <p>Stone not found</p>
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🪨 Stone Details</h1>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px' }}>Back</button>
      </div>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '10px', 
        padding: '30px', 
        backgroundColor: '#f9f9f9',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>{stone.stoneName || 'Unnamed Stone'}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <h3>Basic Information</h3>
            <p><strong>Status:</strong> {stone.status || 'N/A'}</p>
            <p><strong>Bought From:</strong> {stone.boughtFrom || 'N/A'}</p>
            <p><strong>Estimated Feet:</strong> {stone.estimatedFeet || 0}</p>
            <p><strong>Stone Cost:</strong> ₹{stone.stoneCost || 0}</p>
            <p><strong>Travel Cost:</strong> ₹{stone.stoneTravelCost || 0}</p>
          </div>

          <div>
            <h3>Cutting Details</h3>
            <p><strong>Cutting Feet:</strong> {stone.cuttingFeet || 0}</p>
            <p><strong>Cost per Feet:</strong> ₹{stone.cuttingCostPerFeet || 0}</p>
            <p><strong>Total Cutting Cost:</strong> ₹{stone.totalCuttingCost || 0}</p>
          </div>

          <div>
            <h3>Polishing Details</h3>
            <p><strong>Polish Feet:</strong> {stone.polishFeet || 0}</p>
            <p><strong>Cost per Feet:</strong> ₹{stone.polishCostPerFeet || 0}</p>
            <p><strong>Total Polish Cost:</strong> ₹{stone.totalPolishCost || 0}</p>
          </div>

          <div>
            <h3>Sales Information</h3>
            <p><strong>Marker Name:</strong> {stone.markerName || 'N/A'}</p>
            <p><strong>Phone No:</strong> {stone.phoneNo || 'N/A'}</p>
          </div>
        </div>

        {stone.stoneTypes && stone.stoneTypes.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Stone Types</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {stone.stoneTypes.map((type, index) => (
                <div key={index} style={{ 
                  border: '1px solid #ccc', 
                  padding: '15px', 
                  borderRadius: '5px',
                  backgroundColor: 'white'
                }}>
                  <p><strong>Type:</strong> {type.type}</p>
                  <p><strong>Feet:</strong> {type.feet}</p>
                  <p><strong>Est. Cost:</strong> ₹{type.estCost}</p>
                  <p><strong>Sold Cost:</strong> ₹{type.soldCost}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <h3>Summary</h3>
          <p><strong>Total Investment:</strong> ₹{stone.totalInvestment || 0}</p>
          <p><strong>Total Cutting Cost:</strong> ₹{stone.totalCuttingCost || 0}</p>
          <p><strong>Total Polish Cost:</strong> ₹{stone.totalPolishCost || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default Second;
