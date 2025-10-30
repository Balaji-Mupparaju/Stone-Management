import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
// Legacy component-specific CSS replaced by global theme utilities
import '../styles/theme.css';

function FirstOne() {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmStone, setConfirmStone] = useState(null); // stone object pending delete
  const navigate = useNavigate();

  // Fetch all stones from API on component mount
  useEffect(() => {
    fetchStones();
  }, []);

  // ESC key to close modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && confirmStone) {
        setConfirmStone(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [confirmStone]);

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

  const requestDelete = (id) => {
    const target = stones.find(s => s._id === id);
    setConfirmStone(target || null);
  };

  const cancelDelete = () => setConfirmStone(null);

  const confirmDelete = async () => {
    if (!confirmStone?._id) return;
    try {
      await ApiService.deleteStone(confirmStone._id);
      setStones(prev => prev.filter(stone => stone._id !== confirmStone._id));
    } catch (err) {
      setError('Failed to delete stone');
      console.error('Error deleting stone:', err);
    } finally {
      setConfirmStone(null);
    }
  };

  const openCard = (id) => {
    navigate(`/second/${id}`); // go to Second page
  };
  const editCard = (id) => {
    navigate(`/edit-stone/${id}`);
  };

  return (
    <div className="inventory-view">
      {error && (
        <div className="card" style={{marginTop:'1rem', borderColor:'var(--color-danger)', background:'var(--color-danger-soft)', color:'var(--color-danger)'}}>
          <strong style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <span aria-hidden>⚠️</span> {error}
          </strong>
        </div>
      )}
      {loading ? (
        <div className="flex-center" style={{padding:'4rem 0'}}>
          <div className="text-muted">Loading your stone inventory…</div>
        </div>
      ) : (
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', marginTop:'1rem'}}>
          {stones.length === 0 ? (
            <div className="card soft" style={{gridColumn:'1 / -1', textAlign:'center'}}>
              <h3 className="heading" style={{marginBottom:'0.5rem'}}>No Stones Yet</h3>
              <p className="text-muted" style={{marginBottom:'1rem'}}>Add your first stone to get started!</p>
              <button className="btn btn-add" onClick={addCard}>Add Stone +</button>
            </div>
          ) : (
            stones.map(stone => (
              <div key={stone._id} className="card hoverable" aria-label={stone.stoneName}>
                <div style={{display:'flex', flexDirection:'column', gap:'0.4rem'}}>
                  <h3 style={{margin:0, fontSize:'1.1rem'}}>{stone.stoneName || 'Unnamed Stone'}</h3>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem'}}>
                    <span className="badge primary" title="Status">{stone.status || 'N/A'}</span>
                    {stone.stoneTypes?.length ? (
                      <span className="badge soft" title="Types count">{stone.stoneTypes.length} type(s)</span>
                    ) : null}
                  </div>
                  <div className="text-muted text-xs">Bought From: <strong style={{color:'var(--color-text)'}}>{stone.boughtFrom || 'N/A'}</strong></div>
                  <div className="text-muted text-xs">Estimated Feet: <strong style={{color:'var(--color-text)'}}>{stone.estimatedFeet || 0}</strong></div>
                  <div className="text-muted text-xs">Stone Cost: <strong style={{color:'var(--color-text)'}}>₹{stone.stoneCost?.toLocaleString() || 0}</strong></div>
                </div>
                <div className="divider" />
                <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                  <button className="btn btn-outline" onClick={() => openCard(stone._id)}>View</button>
                  <button className="btn btn-outline" onClick={() => editCard(stone._id)}>Edit</button>
                  <button className="btn btn-danger-soft" onClick={() => requestDelete(stone._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {confirmStone && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="modal-confirm">
            <h4>Delete Stone</h4>
            <p style={{margin:0,fontSize:'0.9rem'}}>Are you sure you want to delete <strong>{confirmStone.stoneName || 'this stone'}</strong>? <br></br>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstOne;
