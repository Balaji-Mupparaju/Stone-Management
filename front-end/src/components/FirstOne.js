import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FirstOne() {
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  const addCard = () => {
    const newCard = { id: count, text: `🪨 Stone: ${count}` };
    setCards([...cards, newCard]);
    setCount(count + 1);
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const openCard = (id) => {
    navigate(`/second/${id}`); // go to Second page
  };

  return (
    <div>
      <button onClick={addCard} style={{ marginTop: "75px", padding: "10px 20px" }}>
        ADD STONE +
      </button>

      <div
        style={{
          marginTop: "40px",
          marginLeft: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "70px",
              width: "calc(33.33% - 20px)",
              background: "#f9f9f9",
              boxSizing: "border-box",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>{card.text}</div>
            <button style={{ marginTop: "10px" }} onClick={() => openCard(card.id)}>
              Open
            </button>
            <button style={{ marginTop: "10px" }} onClick={() => deleteCard(card.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FirstOne;
