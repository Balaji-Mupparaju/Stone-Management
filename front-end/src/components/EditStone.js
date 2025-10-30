import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';
import './AddStone.css';

function EditStone() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    stoneName: '',
    status: '',
    date: '',
    boughtFrom: '',
    estimatedFeet: '',
    finalFeet: '',
    stoneCost: '',
    soldAmount: '',
    stoneTravelCost: '',
    cuttingFeet: '',
    cuttingCostPerFeet: '',
    polishFeet: '',
    polishCostPerFeet: '',
    markerName: '',
    phoneNo: '',
    mainType: '',
    stoneTypes: [],
    extras: [],
  });

  const [showExtras, setShowExtras] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getStoneById(id);
        setFormData({
          stoneName: data.stoneName || '',
          status: data.status || '',
          date: (data.date ? String(data.date).slice(0,10) : new Date().toISOString().slice(0,10)),
          boughtFrom: data.boughtFrom || '',
          estimatedFeet: data.estimatedFeet ?? '',
          finalFeet: data.finalFeet ?? '',
          stoneCost: data.stoneCost ?? '',
          soldAmount: data.soldAmount ?? '',
          stoneTravelCost: data.stoneTravelCost ?? '',
          cuttingFeet: data.cuttingFeet ?? '',
          cuttingCostPerFeet: data.cuttingCostPerFeet ?? '',
          polishFeet: data.polishFeet ?? '',
          polishCostPerFeet: data.polishCostPerFeet ?? '',
          markerName: data.markerName || '',
          phoneNo: data.phoneNo ?? '',
          mainType: data.mainType || '',
          stoneTypes: Array.isArray(data.stoneTypes) ? data.stoneTypes.map(t => ({
            type: t.type || '',
            feet: t.feet ?? 0,
            estCost: t.estCost ?? 0,
            soldCost: t.soldCost ?? 0,
          })) : [],
          extras: Array.isArray(data.extras)
            ? data.extras.map(x => ({ amount: x.amount ?? 0, reason: x.reason || '' }))
            : ((data.extraAmountSpent || data.extraAmountReason)
                ? [{ amount: data.extraAmountSpent ?? 0, reason: data.extraAmountReason || '' }]
                : []),
        });
        setShowExtras(Array.isArray(data.extras) ? data.extras.length > 0 : false);
      } catch (e) {
        setError('Failed to load stone');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Keep finalFeet and soldAmount in sync with types
  useEffect(() => {
    const sumFeet = (formData.stoneTypes || []).reduce((sum, t) => sum + (Number(t.feet) || 0), 0);
    const sumSold = (formData.stoneTypes || []).reduce((sum, t) => sum + (Number(t.soldCost) || 0), 0);
    setFormData(prev => {
      const next = { ...prev };
      const currentFinal = Number(prev.finalFeet) || 0;
      if (currentFinal !== sumFeet) next.finalFeet = sumFeet;
      if ((Number(prev.soldAmount) || 0) !== sumSold) next.soldAmount = sumSold;
      return next;
    });
  }, [formData.stoneTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phoneNo: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const totalInvestment = (Number(formData.stoneCost || 0) + Number(formData.stoneTravelCost || 0)) || 0;
      const totalCuttingCost = (Number(formData.cuttingFeet || 0) * Number(formData.cuttingCostPerFeet || 0)) || 0;
      const totalPolishCost = (Number(formData.polishFeet || 0) * Number(formData.polishCostPerFeet || 0)) || 0;
      const typesFeetSum = (formData.stoneTypes || []).reduce((sum, t) => sum + (Number(t.feet) || 0), 0);
      const typesSoldSum = (formData.stoneTypes || []).reduce((sum, t) => sum + (Number(t.soldCost) || 0), 0);
      const finalFeetComputed = typesFeetSum;

      await ApiService.updateStone(id, {
        stoneName: String(formData.stoneName).trim(),
        status: String(formData.status).trim(),
        date: formData.date ? new Date(formData.date) : null,
        boughtFrom: String(formData.boughtFrom || '').trim(),
        estimatedFeet: Number(formData.estimatedFeet) || 0,
        stoneCost: Number(formData.stoneCost) || 0,
        stoneTravelCost: Number(formData.stoneTravelCost) || 0,
        cuttingFeet: Number(formData.cuttingFeet) || 0,
        cuttingCostPerFeet: Number(formData.cuttingCostPerFeet) || 0,
        polishFeet: Number(formData.polishFeet) || 0,
        polishCostPerFeet: Number(formData.polishCostPerFeet) || 0,
        totalInvestment,
        totalCuttingCost,
        totalPolishCost,
        finalFeet: finalFeetComputed,
        totalSoldAmount: typesSoldSum,
        soldAmount: typesSoldSum,
        extras: (formData.extras || []).map(x => ({ amount: Number(x.amount) || 0, reason: String(x.reason || '').trim() })),
        extraAmountSpent: (formData.extras || []).reduce((s, x) => s + (Number(x.amount) || 0), 0),
        markerName: String(formData.markerName).trim(),
        phoneNo: formData.phoneNo && formData.phoneNo.length === 10 ? Number(formData.phoneNo) : 0,
        mainType: String(formData.mainType || '').trim(),
        stoneTypes: (formData.stoneTypes || []).map(t => ({
          type: String(t.type || '').trim(),
          feet: Number(t.feet) || 0,
          estCost: Number(t.estCost) || 0,
          soldCost: Number(t.soldCost) || 0,
        })),
      });
      setSuccess('Saved changes');
      setTimeout(() => navigate(`/second/${id}`), 800);
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addTypeRow = () => {
    setFormData(prev => ({
      ...prev,
      stoneTypes: [...(prev.stoneTypes || []), { type: '', feet: 0, estCost: 0, soldCost: 0 }]
    }));
  };

  const removeTypeRow = (index) => {
    setFormData(prev => ({
      ...prev,
      stoneTypes: prev.stoneTypes.filter((_, i) => i !== index)
    }));
  };

  const handleTypeChange = (index, field, value) => {
    setFormData(prev => {
      const next = [...prev.stoneTypes];
      next[index] = { ...next[index], [field]: field === 'type' ? value : value };
      return { ...prev, stoneTypes: next };
    });
  };

  if (loading) {
    return (
      <div className="add-stone-container">
        <div className="add-stone-card"><h2>Loading…</h2></div>
      </div>
    );
  }

  return (
    <div className="add-stone-container">
      <div className="add-stone-card">
        <h2>Edit Stone</h2>
        <div className="card-subtitle">Update stone core and cost details</div>
        <button
          type="button"
          className="back-top-button"
          onClick={() => navigate(-1)}
          title="Back"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSave}>
          {/* Header row: left Title + Date, right Status */}
          <div className="edit-header-grid">
            <div>
              <div className={`form-group floating ${formData.stoneName ? 'has-value' : ''}`}>
                <input type="text" name="stoneName" value={formData.stoneName} onChange={handleChange} required placeholder=" " />
                <label className="floating-label">Stone Name *</label>
              </div>
              <div className={`form-group floating ${formData.date ? 'has-value' : ''}`}>
                <input type="date" name="date" value={formData.date} onChange={handleChange} placeholder=" " />
                <label className="floating-label">Date</label>
              </div>
            </div>
            <div className={`form-group select-group ${formData.status ? 'has-value' : ''}`}>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="" disabled>Select status</option>
                <option value="Fresh Stone">Fresh Stone</option>
                <option value="Cutting">Cutting</option>
                <option value="Polishing">Polishing</option>
                <option value="Unsold">Unsold</option>
                <option value="Sold">Sold</option>
              </select>
              <label className={`floating-label select-label`}>Status *</label>
            </div>
          </div>

          <div className="edit-fields-card">
            <div className="edit-two-col">
              <div>
                <div className={`form-group floating ${formData.boughtFrom ? 'has-value' : ''}`}>
                  <input type="text" name="boughtFrom" value={formData.boughtFrom} onChange={handleChange} placeholder=" " />
                  <label className="floating-label">Bought From</label>
                </div>
                <div className={`form-group floating ${formData.stoneCost ? 'has-value' : ''}`}>
                  <input type="number" name="stoneCost" value={formData.stoneCost} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Stone Cost (₹)</label>
                </div>
                <div className={`form-group floating ${formData.stoneTravelCost ? 'has-value' : ''}`}>
                  <input type="number" name="stoneTravelCost" value={formData.stoneTravelCost} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Stone Travel Cost (₹)</label>
                </div>
              </div>
              <div>
                <div className={`form-group floating ${formData.estimatedFeet ? 'has-value' : ''}`}>
                  <input type="number" name="estimatedFeet" value={formData.estimatedFeet} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Estimated Feet</label>
                </div>
                <div className="form-group">
                  <input disabled value={`Total Investment: ₹${(Number(formData.stoneCost||0) + Number(formData.stoneTravelCost||0)).toLocaleString()}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Cutting Card */}
          <div className="edit-fields-card">
            <div className="edit-two-col">
              <div>
                <div className={`form-group floating ${formData.cuttingFeet ? 'has-value' : ''}`}>
                  <input type="number" name="cuttingFeet" value={formData.cuttingFeet} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Cutting Feet</label>
                </div>
                <div className={`form-group floating ${formData.cuttingCostPerFeet ? 'has-value' : ''}`}>
                  <input type="number" name="cuttingCostPerFeet" value={formData.cuttingCostPerFeet} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Cutting Cost / ft (₹)</label>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <input disabled value={`Total Cutting: ₹${(Number(formData.cuttingFeet||0) * Number(formData.cuttingCostPerFeet||0)).toLocaleString()}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Polishing Card */}
          <div className="edit-fields-card">
            <div className="edit-two-col">
              <div>
                <div className={`form-group floating ${formData.polishFeet ? 'has-value' : ''}`}>
                  <input type="number" name="polishFeet" value={formData.polishFeet} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Polishing Feet</label>
                </div>
                <div className={`form-group floating ${formData.polishCostPerFeet ? 'has-value' : ''}`}>
                  <input type="number" name="polishCostPerFeet" value={formData.polishCostPerFeet} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Polishing Cost / ft (₹)</label>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <input disabled value={`Total Polishing: ₹${(Number(formData.polishFeet||0) * Number(formData.polishCostPerFeet||0)).toLocaleString()}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Final Details Card */}
          <div className="edit-fields-card">
            <div className="edit-two-col">
              <div>
                <div className={`form-group floating ${formData.markerName ? 'has-value' : ''}`}>
                  <input type="text" name="markerName" value={formData.markerName} onChange={handleChange} placeholder=" " />
                  <label className="floating-label">Marker Name</label>
                </div>
                <div className={`form-group floating ${formData.phoneNo ? 'has-value' : ''}`}>
                  <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handlePhoneChange} placeholder=" " maxLength="10" />
                  <label className="floating-label">Phone Number (10 digits)</label>
                </div>
              </div>
              <div>
                <div className={`form-group floating ${formData.finalFeet ? 'has-value' : ''}`}>
                  <input type="number" name="finalFeet" value={formData.finalFeet} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Final Feet</label>
                </div>
                <div className={`form-group floating ${formData.soldAmount ? 'has-value' : ''}`}>
                  <input type="number" name="soldAmount" value={formData.soldAmount} onChange={handleChange} min="0" placeholder=" " />
                  <label className="floating-label">Sold Amount (₹)</label>
                </div>
              </div>
            </div>
          </div>

          

          {/* Stone Types Table */}
          <div className="edit-fields-card">
            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Stone Types</h3>
            <div className="stone-types-table">
              <div className="stone-types-header">
                <div className="st-col-type">Type</div>
                <div className="st-col-feet">Feet</div>
                <div className="st-col-estd">Estd Price</div>
                <div className="st-col-sold">Sold Price</div>
                <div className="st-col-action"></div>
              </div>
              {(formData.stoneTypes || []).map((t, i) => (
                <div key={i} className="stone-types-row">
                  <div className="st-col-type">
                    <select
                      value={t.type}
                      onChange={(e) => handleTypeChange(i, 'type', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="under size">under size</option>
                      <option value="below">below</option>
                      <option value="low commercial">low commercial</option>
                      <option value="commercial">commercial</option>
                      <option value="high/good">high/good</option>
                      <option value="three feet">three feet</option>
                      <option value="wrong cutting">wrong cutting</option>
                      <option value="waste">waste</option>
                    </select>
                  </div>
                  <div className="st-col-feet">
                    <input
                      type="number"
                      value={t.feet}
                      onChange={(e) => handleTypeChange(i, 'feet', e.target.value)}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="st-col-estd">
                    <input
                      type="number"
                      value={t.estCost}
                      onChange={(e) => handleTypeChange(i, 'estCost', e.target.value)}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="st-col-sold">
                    <input
                      type="number"
                      value={t.soldCost}
                      onChange={(e) => handleTypeChange(i, 'soldCost', e.target.value)}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="st-col-action">
                    <button type="button" className="remove-type-button" onClick={() => removeTypeRow(i)} title="Remove">✕</button>
                  </div>
                </div>
              ))}
              <div className="stone-types-add">
                <button type="button" className="add-type-button" onClick={addTypeRow}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Row
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="submit-button" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
          {success && <div className="snackbar" role="status">{success}</div>}
        </form>

        
      </div>
    </div>
  );
}

export default EditStone;


