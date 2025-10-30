import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';
// Use global theme utilities instead of AddStone.css
import '../styles/theme.css';

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
      // Validation: no empty type allowed
      const invalidTypeIndex = (formData.stoneTypes || []).findIndex(t => !t.type || t.type.trim() === '');
      if (invalidTypeIndex !== -1) {
        setError(`Please select a type for row ${invalidTypeIndex + 1} before saving.`);
        setSaving(false);
        return;
      }
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
    return <div className="flex-center" style={{minHeight:'50vh'}}><div className="card"><h2 style={{margin:0}}>Loading…</h2></div></div>;
  }

  const investment = (Number(formData.stoneCost||0) + Number(formData.stoneTravelCost||0)).toLocaleString();
  const totalCutting = (Number(formData.cuttingFeet||0) * Number(formData.cuttingCostPerFeet||0)).toLocaleString();
  const totalPolish = (Number(formData.polishFeet||0) * Number(formData.polishCostPerFeet||0)).toLocaleString();

  return (
    <div className="edit-stone-view" style={{maxWidth:'1100px', margin:'1rem auto'}}>
      <div className="flex justify-between items-center" style={{marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem'}}>
        <h1 style={{margin:0, fontSize:'1.4rem'}}>Edit Stone</h1>
        <div className="flex gap-2">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)} aria-label="Go Back">← Back</button>
          <button type="submit" form="editStoneForm" className="btn" disabled={saving || (formData.stoneTypes || []).some(t => !t.type || t.type.trim() === '')}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
      {error && (
        <div className="card" style={{borderColor:'var(--color-danger)', background:'var(--color-danger-soft)', color:'var(--color-danger)', marginBottom:'1rem'}} role="alert">{error}</div>
      )}
      <form id="editStoneForm" onSubmit={handleSave} className="grid" style={{gap:'1.25rem'}}>
        {/* Primary Info */}
        <div className="card" style={{display:'grid', gap:'1rem'}}>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem'}}>
            <div className="field floating">
              <input name="stoneName" value={formData.stoneName} onChange={handleChange} required placeholder=" " aria-required="true" />
              <label>Stone Name *</label>
            </div>
            <div className="field floating">
              <input type="date" name="date" value={formData.date} onChange={handleChange} placeholder=" " />
              <label>Date</label>
            </div>
            <div className="field floating">
              <select name="status" value={formData.status} onChange={handleChange} required aria-required="true">
                <option value="" disabled>Select status</option>
                <option value="Fresh Stone">Fresh Stone</option>
                <option value="Cutting">Cutting</option>
                <option value="Polishing">Polishing</option>
                <option value="Unsold">Unsold</option>
                <option value="Sold">Sold</option>
              </select>
              <label>Status *</label>
            </div>
            <div className="field floating">
              <input name="boughtFrom" value={formData.boughtFrom} onChange={handleChange} placeholder=" " />
              <label>Bought From</label>
            </div>
          </div>
        </div>

        {/* Cost & Feet */}
        <div className="card" style={{display:'grid', gap:'1rem'}}>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem'}}><div className="field floating">
              <input type="number" name="stoneTravelCost" value={formData.stoneTravelCost} onChange={handleChange} min="0" placeholder=" " />
              <label>Travel Cost (₹)</label>
            </div>
            <div className="field floating">
              <input type="number" name="stoneCost" value={formData.stoneCost} onChange={handleChange} min="0" placeholder=" " />
              <label>Stone Cost (₹)</label>
            </div>
            <div className="field floating">
              <input type="number" name="estimatedFeet" value={formData.estimatedFeet} onChange={handleChange} min="0" placeholder=" " />
              <label>Estimated Feet</label>
            </div>
            <div className="field floating">
              <input disabled value={`Investment ₹${investment}`} aria-label={`Total Investment ₹${investment}`} />
              <label>Total Investment</label>
            </div>
          </div>
        </div>

        {/* Cutting / Polishing */}
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.25rem'}}>
          <div className="card" style={{display:'grid', gap:'0.75rem'}}>
            <h3 style={{margin:'0 0 0.25rem 0', fontSize:'1rem'}}>Cutting</h3>
            <div className="field floating">
              <input type="number" name="cuttingFeet" value={formData.cuttingFeet} onChange={handleChange} min="0" placeholder=" " />
              <label>Cutting Feet</label>
            </div>
            <div className="field floating">
              <input type="number" name="cuttingCostPerFeet" value={formData.cuttingCostPerFeet} onChange={handleChange} min="0" placeholder=" " />
              <label>Cost / ft (₹)</label>
            </div>
            <div className="field floating">
              <input disabled value={`Total ₹${totalCutting}`} aria-label={`Total Cutting ₹${totalCutting}`} />
              <label>Total Cutting</label>
            </div>
          </div>
          <div className="card" style={{display:'grid', gap:'0.75rem'}}>
            <h3 style={{margin:'0 0 0.25rem 0', fontSize:'1rem'}}>Polishing</h3>
            <div className="field floating">
              <input type="number" name="polishFeet" value={formData.polishFeet} onChange={handleChange} min="0" placeholder=" " />
              <label>Polish Feet</label>
            </div>
            <div className="field floating">
              <input type="number" name="polishCostPerFeet" value={formData.polishCostPerFeet} onChange={handleChange} min="0" placeholder=" " />
              <label>Cost / ft (₹)</label>
            </div>
            <div className="field floating">
              <input disabled value={`Total ₹${totalPolish}`} aria-label={`Total Polish ₹${totalPolish}`} />
              <label>Total Polish</label>
            </div>
          </div>
        </div>

        {/* Sales & Summary */}
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'1.25rem'}}>
          <div className="card" style={{display:'grid', gap:'0.75rem'}}>
            <h3 style={{margin:'0 0 0.25rem 0', fontSize:'1rem'}}>Sales</h3>
            <div className="field floating">
              <input name="markerName" value={formData.markerName} onChange={handleChange} placeholder=" " />
              <label>Marker Name</label>
            </div>
            <div className="field floating">
              <input name="phoneNo" value={formData.phoneNo} onChange={handlePhoneChange} placeholder=" " maxLength={10} />
              <label>Phone (10 digits)</label>
            </div>
          </div>
          <div className="card" style={{display:'grid', gap:'0.75rem'}}>
            <h3 style={{margin:'0 0 0.25rem 0', fontSize:'1rem'}}>Summary</h3>
            <div className="field floating">
              <input type="number" name="finalFeet" value={formData.finalFeet} onChange={handleChange} min="0" placeholder=" " />
              <label>Final Feet</label>
            </div>
            <div className="field floating">
              <input type="number" name="soldAmount" value={formData.soldAmount} onChange={handleChange} min="0" placeholder=" " />
              <label>Sold Amount (₹)</label>
            </div>
          </div>
        </div>

        {/* Stone Types */}
        <div className="card" style={{display:'grid', gap:'0.75rem'}}>
          <h3 style={{margin:'0 0 0.5rem 0', fontSize:'1rem'}}>Stone Types</h3>
          <div className="table-scroll" role="region" aria-label="Stone types scroll area">
            <div className="table-grid" role="table" aria-label="Stone types table">
              <div className="table-head" role="row">
                <div>Type</div>
                <div>Feet</div>
                <div>Estd Price</div>
                <div>Sold Price</div>
                <div></div>
              </div>
              {(formData.stoneTypes || []).map((t,i) => {
                const isInvalid = !t.type || t.type.trim() === '';
                return (
                  <div key={i} className="table-row" role="row" style={isInvalid ? {borderColor:'var(--color-danger)', background:'var(--color-danger-soft)'} : undefined}>
                    <select
                      value={t.type}
                      aria-label={`Type row ${i+1}`}
                      onChange={(e)=>handleTypeChange(i,'type',e.target.value)}
                      className={`select-type${isInvalid ? ' invalid' : ''}`}
                    >
                      <option value="">Select</option>
                      <option value="Under Size">Under Size</option>
                      <option value="Below">Below</option>
                      <option value="Low Commercial">Low Commercial</option>
                      <option value="Commercial">Commercial</option>
                      <option value="High/Good">High/Good</option>
                      <option value="Three Feet">Three Feet</option>
                      <option value="Wrong Cutting">Wrong Cutting</option>
                      <option value="Waste">Waste</option>
                    </select>
                    <input type="number" value={t.feet} min="0" aria-label={`Feet row ${i+1}`} onChange={(e)=>handleTypeChange(i,'feet',e.target.value)} />
                    <input type="number" value={t.estCost} min="0" aria-label={`Estimated cost row ${i+1}`} onChange={(e)=>handleTypeChange(i,'estCost',e.target.value)} />
                    <input type="number" value={t.soldCost} min="0" aria-label={`Sold cost row ${i+1}`} onChange={(e)=>handleTypeChange(i,'soldCost',e.target.value)} />
                    <button type="button" className="btn btn-danger" style={{padding:'0.45rem 0.6rem'}} onClick={()=>removeTypeRow(i)} aria-label={`Remove type row ${i+1}`}>×</button>
                  </div>
                )})}
            </div>
          </div>
          <div>
            <button type="button" className="btn btn-outline" onClick={addTypeRow}>+ Add Row</button>
          </div>
        </div>
      </form>
      <div className="form-actions-sticky show-xs" role="toolbar" aria-label="Mobile edit actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
        <button type="submit" form="editStoneForm" className="btn btn-primary" disabled={saving || (formData.stoneTypes || []).some(t => !t.type || t.type.trim() === '')}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
      {success && <div className="toast" role="status">{success}</div>}
    </div>
  );
}

export default EditStone;


