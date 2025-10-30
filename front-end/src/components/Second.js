import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
// Use global theme utilities instead of component stylesheet
import '../styles/theme.css';

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
      <div className="flex-center" style={{minHeight:'60vh'}}>
        <div className="card" style={{maxWidth:'640px'}}>
          <h1 style={{marginBottom:'0.5rem'}}>🪨 Stone Details</h1>
          <p className="text-muted" style={{marginBottom:'1rem'}}>Loading stone details...</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center" style={{minHeight:'60vh'}}>
        <div className="card" style={{maxWidth:'640px'}}>
          <h1 style={{marginBottom:'0.5rem'}}>🪨 Stone Details</h1>
          <p style={{color:'var(--color-danger)', marginBottom:'1rem'}}>{error}</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  if (!stone) {
    return (
      <div className="flex-center" style={{minHeight:'60vh'}}>
        <div className="card" style={{maxWidth:'640px'}}>
          <h1 style={{marginBottom:'0.5rem'}}>🪨 Stone Details</h1>
          <p className="text-muted" style={{marginBottom:'1rem'}}>Stone not found</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-view">
      <div className="flex justify-between items-center" style={{marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem'}}>
        <h1 style={{margin:'0', fontSize:'1.4rem'}}>🪨 Stone Details</h1>
        <div className="flex gap-2" style={{flexWrap:'wrap'}}>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back to list</button>
          <button className="btn" onClick={() => navigate(`/edit-stone/${id}`)}>Edit</button>
        </div>
      </div>
  <div className="details-two-col">
        <div className="card">
          <h2 style={{margin:'0 0 0.75rem 0'}}>{stone.stoneName || 'Unnamed Stone'}</h2>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem', marginBottom:'0.9rem'}}>
            <span className="badge primary">{stone.status || 'N/A'}</span>
            <span className="badge soft" style={{display:'inline-flex'}} title="Bought From">{stone.boughtFrom || 'N/A'}</span>
            <span className="badge" title="Purchase Date">{stone.date ? new Date(stone.date).toLocaleDateString() : 'No Date'}</span>
            <span className="badge" title="Estimated Feet">Est: {stone.estimatedFeet || 0} ft</span>
            <span className="badge" title="Cost">Cost ₹{stone.stoneCost || 0}</span>
            <span className="badge" title="Travel">Travel ₹{stone.stoneTravelCost || 0}</span>
          </div>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem'}}>
            <div className="card soft" style={{padding:'0.9rem'}}>
              <h3 style={{margin:'0 0 0.5rem 0', fontSize:'1rem'}}>Cutting</h3>
              <p className="text-xs">Feet: <strong>{stone.cuttingFeet || 0}</strong></p>
              <p className="text-xs">Cost / ft: <strong>₹{stone.cuttingCostPerFeet || 0}</strong></p>
              <p className="text-xs">Total: <strong>₹{stone.totalCuttingCost || 0}</strong></p>
            </div>
            <div className="card soft" style={{padding:'0.9rem'}}>
              <h3 style={{margin:'0 0 0.5rem 0', fontSize:'1rem'}}>Polishing</h3>
              <p className="text-xs">Feet: <strong>{stone.polishFeet || 0}</strong></p>
              <p className="text-xs">Cost / ft: <strong>₹{stone.polishCostPerFeet || 0}</strong></p>
              <p className="text-xs">Total: <strong>₹{stone.totalPolishCost || 0}</strong></p>
            </div>
          </div>
          {stone.stoneTypes?.length > 0 && (
            <div className="card soft" style={{marginTop:'1rem', padding:'0.9rem'}}>
              <h3 style={{margin:'0 0 0.5rem 0', fontSize:'1rem'}}>Types</h3>
              <div className="types-grid">
                {stone.stoneTypes.map((t,i) => (
                  <div key={i} className="card" style={{padding:'0.55rem 0.6rem', boxShadow:'var(--shadow-xs)'}}>
                    <div style={{fontWeight:600, fontSize:'0.8rem'}}>{t.type}</div>
                    <div className="text-xs text-muted" style={{display:'flex',flexWrap:'wrap', gap:'0.35rem'}}>
                      <span>{t.feet} ft</span>
                      <span>Estd ₹{t.estCost}</span>
                      <span>Sold ₹{t.soldCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="grid" style={{gap:'1rem'}}>
          <div className="card" style={{padding:'1rem'}}>
            <h4 style={{margin:'0 0 0.5rem 0'}}>Sales</h4>
            <p className="text-info-lg">Marker: <strong>{stone.markerName || 'N/A'}</strong></p>
            <p className="text-info-lg">Phone: <strong>{stone.phoneNo || 'N/A'}</strong></p>
          </div>
          <div className="card" style={{padding:'1rem'}}>
            <h4 style={{margin:'0 0 0.5rem 0'}}>Summary</h4>
            <p className="text-info-lg">Total Feet: <strong>{stone.finalFeet || 0}</strong></p>
            <p className="text-info-lg">Total Investment: <strong>₹{stone.totalInvestment || 0}</strong></p>
            <p className="text-info-lg">Total Sold Price: <strong>₹{stone.soldAmount || 0}</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Second;
