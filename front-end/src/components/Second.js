import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Second() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>🪨 Stone Details</h1>
      <p>Card ID: {id}</p>
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
}

export default Second;
