import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './AddStone.css';

function AddStone() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Stone Details
    stoneName: '',
    status: '',
    boughtFrom: '',
    estimatedFeet: '',
    stoneCost: '',
    stoneTravelCost: '',
    
    // Cutting Details
    cuttingFeet: '',
    cuttingCostPerFeet: '',
    
    // Polishing Details
    polishFeet: '',
    polishCostPerFeet: '',
    
    // Stone Types
    stoneTypes: [{ type: '', feet: '', estCost: '', soldCost: '' }],
    
    // Sold Info
    markerName: '',
    phoneNo: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoneTypeChange = (index, field, value) => {
    const newStoneTypes = [...formData.stoneTypes];
    newStoneTypes[index] = {
      ...newStoneTypes[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      stoneTypes: newStoneTypes
    }));
  };

  const addStoneType = () => {
    setFormData(prev => ({
      ...prev,
      stoneTypes: [...prev.stoneTypes, { type: '', feet: '', estCost: '', soldCost: '' }]
    }));
  };

  const removeStoneType = (index) => {
    setFormData(prev => ({
      ...prev,
      stoneTypes: prev.stoneTypes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit = {
        ...formData,
        estimatedFeet: Number(formData.estimatedFeet) || 0,
        stoneCost: Number(formData.stoneCost) || 0,
        stoneTravelCost: Number(formData.stoneTravelCost) || 0,
        cuttingFeet: Number(formData.cuttingFeet) || 0,
        cuttingCostPerFeet: Number(formData.cuttingCostPerFeet) || 0,
        polishFeet: Number(formData.polishFeet) || 0,
        polishCostPerFeet: Number(formData.polishCostPerFeet) || 0,
        phoneNo: formData.phoneNo ? Number(formData.phoneNo) : undefined,
        stoneTypes: formData.stoneTypes
          .filter(type => type.type.trim() !== '')
          .map(type => ({
            type: type.type,
            feet: Number(type.feet) || 0,
            estCost: Number(type.estCost) || 0,
            soldCost: Number(type.soldCost) || 0
          }))
      };

      await ApiService.addStone(dataToSubmit);
      navigate('/'); // Return to the main page after successful addition
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
            <div className="form-group">
              <label htmlFor="stoneName">Stone Name *</label>
              <input
                type="text"
                id="stoneName"
                name="stoneName"
                value={formData.stoneName}
                onChange={handleInputChange}
                required
                placeholder="Enter stone name"
              />
              <span className="input-icon">💎</span>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
              <span className="input-icon">📊</span>
            </div>

            <div className="form-group">
              <label htmlFor="boughtFrom">Bought From *</label>
              <input
                type="text"
                id="boughtFrom"
                name="boughtFrom"
                value={formData.boughtFrom}
                onChange={handleInputChange}
                required
                placeholder="Enter supplier name"
              />
              <span className="input-icon">🏪</span>
            </div>

            <div className="form-group">
              <label htmlFor="estimatedFeet">Estimated Feet *</label>
              <input
                type="number"
                id="estimatedFeet"
                name="estimatedFeet"
                value={formData.estimatedFeet}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Enter estimated feet"
              />
              <span className="input-icon">📏</span>
            </div>

            <div className="form-group">
              <label htmlFor="stoneCost">Stone Cost (₹) *</label>
              <input
                type="number"
                id="stoneCost"
                name="stoneCost"
                value={formData.stoneCost}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Enter stone cost"
              />
              <span className="input-icon">💰</span>
            </div>

            <div className="form-group">
              <label htmlFor="stoneTravelCost">Stone Travel Cost (₹)</label>
              <input
                type="number"
                id="stoneTravelCost"
                name="stoneTravelCost"
                value={formData.stoneTravelCost}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter travel cost"
              />
              <span className="input-icon">🚛</span>
            </div>

            <div className="form-group">
              <label htmlFor="cuttingFeet">Cutting Feet</label>
              <input
                type="number"
                id="cuttingFeet"
                name="cuttingFeet"
                value={formData.cuttingFeet}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter cutting feet"
              />
              <span className="input-icon">✂️</span>
            </div>

            <div className="form-group">
              <label htmlFor="cuttingCostPerFeet">Cutting Cost per Feet (₹)</label>
              <input
                type="number"
                id="cuttingCostPerFeet"
                name="cuttingCostPerFeet"
                value={formData.cuttingCostPerFeet}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter cutting cost per feet"
              />
              <span className="input-icon">💴</span>
            </div>

            <div className="form-group">
              <label htmlFor="polishFeet">Polish Feet</label>
              <input
                type="number"
                id="polishFeet"
                name="polishFeet"
                value={formData.polishFeet}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter polish feet"
              />
              <span className="input-icon">✨</span>
            </div>

            <div className="form-group">
              <label htmlFor="polishCostPerFeet">Polish Cost per Feet (₹)</label>
              <input
                type="number"
                id="polishCostPerFeet"
                name="polishCostPerFeet"
                value={formData.polishCostPerFeet}
                onChange={handleInputChange}
                min="0"
                placeholder="Enter polish cost per feet"
              />
              <span className="input-icon">💴</span>
            </div>

            <div className="form-group">
              <label htmlFor="markerName">Marker Name</label>
              <input
                type="text"
                id="markerName"
                name="markerName"
                value={formData.markerName}
                onChange={handleInputChange}
                placeholder="Enter marker name"
              />
              <span className="input-icon">👤</span>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNo">Phone Number</label>
              <input
                type="tel"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
              <span className="input-icon">📱</span>
            </div>

            <div className="form-group">
              <label>Stone Types</label>
              <div className="stone-types-section">
                {formData.stoneTypes.map((stoneType, index) => (
                  <div key={index} className="stone-type-input">
                    <div className="stone-type-fields">
                      <input
                        type="text"
                        value={stoneType.type}
                        onChange={(e) => handleStoneTypeChange(index, 'type', e.target.value)}
                        placeholder="Enter stone type"
                      />
                      <input
                        type="number"
                        value={stoneType.feet}
                        onChange={(e) => handleStoneTypeChange(index, 'feet', e.target.value)}
                        placeholder="Feet"
                      />
                      <input
                        type="number"
                        value={stoneType.estCost}
                        onChange={(e) => handleStoneTypeChange(index, 'estCost', e.target.value)}
                        placeholder="Est. Cost"
                      />
                      <input
                        type="number"
                        value={stoneType.soldCost}
                        onChange={(e) => handleStoneTypeChange(index, 'soldCost', e.target.value)}
                        placeholder="Sold Cost"
                      />
                    </div>
                    {formData.stoneTypes.length > 1 && (
                      <button
                        type="button"
                        className="remove-type-button"
                        onClick={() => removeStoneType(index)}
                        title="Remove this type"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-type-button"
                  onClick={addStoneType}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Another Type
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to List
            </button>
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
        </form>
      </div>
    </div>
  );
}

export default AddStone;