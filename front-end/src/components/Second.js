import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './Second.css';

function Second() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stone, setStone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    if (id) fetchStoneDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrap center">
        <div className="card card--center">
          <h1>🪨 Stone Details</h1>
          <p className="muted">Loading stone details...</p>
          <button className="btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrap center">
        <div className="card card--center">
          <h1>🪨 Stone Details</h1>
          <p className="error-text">{error}</p>
          <button className="btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  if (!stone) {
    return (
      <div className="page-wrap center">
        <div className="card card--center">
          <h1>🪨 Stone Details</h1>
          <p className="muted">Stone not found</p>
          <button className="btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>🪨 Stone Details</h1>
        <div className="header-actions">
          <button className="btn btn--ghost" onClick={() => navigate('/')}>Back to list</button>
        </div>
      </div>

      <div className="details-card">
        <div className="details-main">
          <h2 className="stone-title">{stone.stoneName || 'Unnamed Stone'}</h2>
          <div className="meta-row">
            <span className={`badge ${stone.status ? 'badge--active' : ''}`}>{stone.status || 'N/A'}</span>
            <span className="muted">Bought From: {stone.boughtFrom || 'N/A'}</span>
            <span className="muted">Est. Feet: {stone.estimatedFeet || 0}</span>
            <span className="muted">Cost: ₹{stone.stoneCost || 0}</span>
            <span className="muted">Travel Cost: ₹{stone.stoneTravelCost || 0}</span>
          </div>

          <div className="grid-2">
            <div className="panel">
              <h3>Cutting</h3>
              <p><strong>Cutting Feet:</strong> {stone.cuttingFeet || 0}</p>
              <p><strong>Cost / ft:</strong> ₹{stone.cuttingCostPerFeet || 0}</p>
              <p><strong>Total Cutting:</strong> ₹{stone.totalCuttingCost || 0}</p>
            </div>

            <div className="panel">
              <h3>Polishing</h3>
              <p><strong>Polish Feet:</strong> {stone.polishFeet || 0}</p>
              <p><strong>Cost / ft:</strong> ₹{stone.polishCostPerFeet || 0}</p>
              <p><strong>Total Polish:</strong> ₹{stone.totalPolishCost || 0}</p>
            </div>
          </div>

          {/* Types shown under Cutting and Polishing */}
          {stone.stoneTypes && stone.stoneTypes.length > 0 && (
            <div className="panel types-panel" style={{ marginTop: '1.25rem' }}>
              <h3>Types</h3>
              <div className="types-grid">
                {stone.stoneTypes.map((t, i) => (
                  <div key={i} className="type-card">
                    <div className="type-name">{t.type}</div>
                    <div className="type-meta-row">
                      <span className="type-meta">{t.feet} ft</span>
                      <span className="type-meta">Estd: ₹{t.estCost}</span>
                      <span className="type-meta">Sold: ₹{t.soldCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="details-aside">
          <div className="panel sales-panel">
            <h4>Sales</h4>
            <p><strong>Marker:</strong> {stone.markerName || 'N/A'}</p>
            <p><strong>Phone:</strong> {stone.phoneNo || 'N/A'}</p>
          </div>

          <div className="panel">
            <h4>Summary</h4>
            <p><strong>Total Feet:</strong> {stone.finalFeet || 0}</p>
            <p><strong>Total Investment:</strong> ₹{stone.totalInvestment || 0}</p>
            <p><strong>Total Sold Price:</strong> ₹{stone.soldAmount || 0}</p>
          </div>
        </aside>
      </div>  
    </div>
  );
}

export default Second;
