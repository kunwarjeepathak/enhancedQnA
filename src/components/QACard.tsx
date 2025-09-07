import React, { useState } from 'react';
import { QACardData } from '../data/qa-data';
import SubItem from './SubItem';

interface QACardProps {
  card: QACardData;
}

export default function QACard({ card }: QACardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`qa-card${card.important ? ' important' : ''}`} data-cat={card.category}>
      <button className="q-header" onClick={() => setOpen(prev => !prev)}>
        <span>{card.title}</span>
        <span className={`toggle-icon${open ? ' open' : ''}`}>▸</span>
        {card.important && <span className="important-badge">Important</span>}
        
      </button>
      {open && (
        <div className="answer">
          <ul className="sub-list">
            {card.subItems.map(si => (
              <SubItem key={si.question} item={si} />
            ))}
          </ul>
        </div>
      )}
      {card.imageUrl && (
  <img src="/assets/Architecture_diagram.png" alt="Test" />
)}
    </div>
  );
}