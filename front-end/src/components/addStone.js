// ...existing code...
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

function AddStone() {
    const [form, setForm] = useState({
        stoneName: '',
        status: '',
        boughtFrom: '',
        estimatedFeet: '',
        stoneCost: '',
        stoneTypes: '' // comma separated
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            // Prepare payload: convert numbers and types array
            const payload = {
                stoneName: form.stoneName.trim(),
                status: form.status.trim(),
                boughtFrom: form.boughtFrom.trim(),
                estimatedFeet: form.estimatedFeet ? Number(form.estimatedFeet) : 0,
                stoneCost: form.stoneCost ? Number(form.stoneCost) : 0,
                stoneTypes: form.stoneTypes
                    ? form.stoneTypes.split(',').map(s => s.trim()).filter(Boolean)
                    : []
            };

            // Call backend via ApiService
            await ApiService.addStone(payload);

            // After success, navigate back to list (or change as needed)
            navigate('/');
        } catch (err) {
            console.error('Error adding stone:', err);
            setError('Failed to add stone. Ensure backend is running and CORS is enabled.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: '80px auto', padding: 20 }}>
            <h2>Add Stone</h2>

            {error && (
                <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 10 }}>
                    <label>Stone Name</label><br />
                    <input
                        name="stoneName"
                        value={form.stoneName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label>Status</label><br />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    >
                        <option value="">Select status</option>
                        <option value="Fresh Stone">Fresh Stone</option>
                        <option value="Cutting">Cutting</option>
                        <option value="Polishing">Polishing</option>
                        <option value="Sold">Sold</option>
                        <option value="UnSold">UnSold</option>
                    </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label>Bought From</label><br />
                    <input
                        name="boughtFrom"
                        value={form.boughtFrom}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                        <label>Estimated Feet</label><br />
                        <input
                            name="estimatedFeet"
                            type="number"
                            step="1"
                            value={form.estimatedFeet}
                            onChange={handleChange}
                            style={{ width: '100%', padding: 8 }}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>Stone Cost (₹)</label><br />
                        <input
                            name="stoneCost"
                            type="number"
                            step="1"
                            value={form.stoneCost}
                            onChange={handleChange}
                            style={{ width: '100%', padding: 8 }}
                        />
                    </div>
                </div>

                {/* <div style={{ marginBottom: 16 }}>
          <label>Stone Types (comma separated)</label><br />
          <input
            name="stoneTypes"
            value={form.stoneTypes}
            onChange={handleChange}
            placeholder="Type1, Type2"
            style={{ width: '100%', padding: 8 }}
          />
        </div> */}

                <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
                        {loading ? 'Adding...' : 'Add Stone'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{ padding: '8px 16px' }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddStone;