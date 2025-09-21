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
      {card.imageUrls && card.imageUrls.length > 0 && (
        <div className="qa-image-wrapper">
          {card.imageUrls.map((img, idx) => (
            <img
              key={img}
              src={process.env.PUBLIC_URL + '/assets/' + img.replace('/assets/', '')}
              alt={`QA card ${idx + 1}`}
              className="qa-image"
            />
          ))}
        </div>
      )}
    </div>
  );
}