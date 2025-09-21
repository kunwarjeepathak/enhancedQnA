// src/components/SubItem.tsx

import React, { useState } from 'react';
import ImageModal from './ImageModal';
import MarkdownRenderer from './MarkdownRenderer';
import type { SubItemData } from '../data/qa-data';

interface SubItemProps {
  item: SubItemData;
}

export default function SubItem({ item }: SubItemProps) {
  const [open, setOpen] = useState(false);
  const [modalOpenIdx, setModalOpenIdx] = useState<number | null>(null);

  return (
    <>
      <button
        className={`sub-header${item.important ? ' important' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
      >
        <span>
          {item.important && <span style={{ marginRight: '0.5rem' }}>⭐</span>}
          {item.question}
        </span>
        <span className={`toggle-icon${open ? ' open' : ''}`}>▶</span>
      </button>

      <div className={`sub-answer${open ? ' open' : ''}`}>
        {open && (
          <>
            {item.imageUrls && item.imageUrls.length > 0 && (
                <div className="qa-image-wrapper">
                  {item.imageUrls.map((img, idx) => (
                    <img
                      key={img}
                      src={process.env.PUBLIC_URL + '/assets/' + img.replace('/assets/', '')}
                      alt={`QA related ${idx + 1}`}
                      className="qa-image"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModalOpenIdx(idx)}
                    />
                  ))}
                  {modalOpenIdx !== null && (
                    <ImageModal
                      src={process.env.PUBLIC_URL + '/assets/' + item.imageUrls[modalOpenIdx].replace('/assets/', '')}
                      alt={`QA related ${modalOpenIdx + 1}`}
                      onClose={() => setModalOpenIdx(null)}
                    />
                  )}
                </div>
            )}
            <MarkdownRenderer content={item.answerMd} />
          </>
        )}
      </div>
    </>
  );
}
