import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './AddStone.css';

function AddStone() {
  const navigate = useNavigate();
  const initialFormState = {
    stoneName: '',
    status: '',
    boughtFrom: '',
    estimatedFeet: '',
    stoneCost: '',
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
        status: String(formData.status).trim(),
        boughtFrom: String(formData.boughtFrom).trim(),
        estimatedFeet: Number(formData.estimatedFeet) || 0,
        stoneCost: Number(formData.stoneCost) || 0,
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
    <div className="add-stone-container">
      <div className="add-stone-card">
        <h2>Add New Stone</h2>
        <div className="card-subtitle">Quickly add a stone with minimal details</div>
        <button
          type="button"
          className="back-top-button"
          onClick={() => navigate('/')}
          title="Back to list"
          aria-label="Back to stone list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className={`form-group floating ${formData.stoneName ? 'has-value' : ''}`}>
              <input
                type="text"
                id="stoneName"
                name="stoneName"
                value={formData.stoneName}
                onChange={handleInputChange}
                required
                placeholder=" "
              />
              <label className="floating-label" htmlFor="stoneName">Stone Name *</label>
              <span className="input-icon" aria-hidden="true"> 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>

            <div className={`form-group select-group status-group ${formData.status ? 'has-value' : ''}`}>
              <div className="status-segment" role="radiogroup" aria-label="Stone status">
                {['Fresh Stone', 'Cutting', 'Polishing', 'Unsold', 'Sold'].map((s) => (
                  <label
                    key={s}
                    className={`segment ${formData.status === s ? 'active' : ''}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFormData(prev => ({ ...prev, status: s }));
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={formData.status === s}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="segment-label">{s}</span>
                  </label>
                ))}
              </div>
              <label className={`floating-label select-label`} htmlFor="status">Status *</label>
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>

            <div className={`form-group floating ${formData.boughtFrom ? 'has-value' : ''}`}>
              <input
                type="text"
                id="boughtFrom"
                name="boughtFrom"
                value={formData.boughtFrom}
                onChange={handleInputChange}
                required
                placeholder=" "
              />
              <label className="floating-label" htmlFor="boughtFrom">Bought From *</label>
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3l-4 4-4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>

            <div className={`form-group floating ${formData.estimatedFeet ? 'has-value' : ''}`}>
              <input
                type="number"
                id="estimatedFeet"
                name="estimatedFeet"
                value={formData.estimatedFeet}
                onChange={handleInputChange}
                required
                min="0"
                placeholder=" "
              />
              <label className="floating-label" htmlFor="estimatedFeet">Estimated Feet *</label>
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>

            <div className={`form-group floating ${formData.stoneCost ? 'has-value' : ''}`}>
              <input
                type="number"
                id="stoneCost"
                name="stoneCost"
                value={formData.stoneCost}
                onChange={handleInputChange}
                required
                min="0"
                placeholder=" "
              />
              <label className="floating-label" htmlFor="stoneCost">Stone Cost (₹) *</label>
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1v22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 5H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
              title="Clear the form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              Cancel
            </button>

            {/* Back to List moved to top-right */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  Adding Stone...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Stone
                </>
              )}
            </button>
          </div>
          {success && (
            <div className="snackbar" role="status">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddStone;