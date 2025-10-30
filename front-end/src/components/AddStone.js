import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import '../styles/theme.css';

function AddStone() {
  const navigate = useNavigate();
  const initialFormState = {
    stoneName: '',
    boughtFrom: '',
    estimatedFeet: '',
    stoneCost: '',
    stoneTravelCost: '',
    date: new Date().toISOString().slice(0,10),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Stone types and additional fields removed — only core fields kept

  const resetForm = () => {
    setFormData(initialFormState);
    setError(null);
    setLoading(false);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Only submit the core stone details the user requested
      const dataToSubmit = {
        stoneName: String(formData.stoneName).trim(),
        status: 'Fresh Stone',
        date: formData.date ? new Date(formData.date) : new Date(),
        boughtFrom: String(formData.boughtFrom).trim(),
        estimatedFeet: Number(formData.estimatedFeet) || 0,
        stoneCost: Number(formData.stoneCost) || 0,
        stoneTravelCost: Number(formData.stoneTravelCost) || 0,
        totalInvestment: (Number(formData.stoneCost)||0) + (Number(formData.stoneTravelCost)||0),
      };

  await ApiService.addStone(dataToSubmit);
  // show success briefly then navigate
  setSuccess('Stone added successfully');
  setTimeout(() => navigate('/'), 900);
    } catch (err) {
      setError(err.message || 'Failed to add stone. Please try again.');
      console.error('Error adding stone:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-stone-view" style={{maxWidth:'720px', margin:'1rem auto'}}>
      <div className="card" style={{position:'relative', display:'grid', gap:'1rem'}}>
        <h2 style={{margin:0}}>Add New Stone</h2>
        <p className="text-muted" style={{margin:'0 0 0.5rem 0'}}>Quickly add a stone with minimal details.</p>
        <form onSubmit={handleSubmit} className="grid" style={{gap:'1rem'}}>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1rem'}}>
            <div className="field floating">
              <input id="stoneName" name="stoneName" value={formData.stoneName} onChange={handleInputChange} required placeholder=" " aria-required="true" />
              <label htmlFor="stoneName">Stone Name *</label>
            </div>
            <div className="field floating">
              <input type="number" id="estimatedFeet" name="estimatedFeet" value={formData.estimatedFeet} onChange={handleInputChange} required min="0" placeholder=" " aria-required="true" />
              <label htmlFor="estimatedFeet">Estimated Feet *</label>
            </div>
            <div className="field floating">
              <input id="boughtFrom" name="boughtFrom" value={formData.boughtFrom} onChange={handleInputChange} required placeholder=" " aria-required="true" />
              <label htmlFor="boughtFrom">Bought From *</label>
            </div>
            <div className="field floating">
              <input type="number" id="stoneTravelCost" name="stoneTravelCost" value={formData.stoneTravelCost} onChange={handleInputChange} min="0" placeholder=" " aria-required="false" />
              <label htmlFor="stoneTravelCost">Travel Cost (₹)</label>
            </div>
            <div className="field floating">
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} placeholder=" " aria-required="false" />
              <label htmlFor="date">Date</label>
            </div>
            <div className="field floating">
              <input type="number" id="stoneCost" name="stoneCost" value={formData.stoneCost} onChange={handleInputChange} required min="0" placeholder=" " aria-required="true" />
              <label htmlFor="stoneCost">Stone Cost (₹) *</label>
            </div>
            <div className="field floating">
              <input disabled value={`Investment: ₹${((Number(formData.stoneCost)||0)+(Number(formData.stoneTravelCost)||0)).toLocaleString()}`} aria-label="Total Investment" placeholder=" " />
              <label></label>
            </div>
          </div>
          {error && <div className="card soft" style={{borderColor:'var(--color-danger)', color:'var(--color-danger)'}} role="alert">{error}</div>}
          <div className="flex gap-2 hide-xs" style={{justifyContent:'flex-end', marginTop:'0.5rem'}}>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Reset</button>
            <button type="submit" className="btn" disabled={loading}>{loading? 'Adding…':'Save Stone'}</button>
            <button type="button" className="btn btn-ghost" onClick={()=>navigate('/')}>Cancel</button>
          </div>
        </form>
        <div className="form-actions-sticky show-xs" role="toolbar" aria-label="Mobile add stone actions">
          <button type="button" className="btn btn-outline" onClick={resetForm}>Reset</button>
          <button type="submit" form="addStoneForm" className="btn" disabled={loading}>{loading? 'Adding…':'Save Stone'}</button>
          <button type="button" className="btn btn-ghost" onClick={()=>navigate('/')}>Cancel</button>
        </div>
        {success && <div className="toast" role="status">{success}</div>}
      </div>
    </div>
  );
}

export default AddStone;