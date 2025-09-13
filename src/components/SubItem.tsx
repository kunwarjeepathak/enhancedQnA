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
  const [modalOpen, setModalOpen] = useState(false);

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
            {item.imageUrl && (
                <div className="qa-image-wrapper">
                   <img 
                     src={process.env.PUBLIC_URL + '/assets/' + item.imageUrl?.replace('/assets/', '')}
                     alt="QA related" 
                     className="qa-image" 
                     style={{ cursor: 'pointer' }} 
                     onClick={() => setModalOpen(true)} 
                   />
                   {modalOpen && (
                     <ImageModal
                       src={process.env.PUBLIC_URL + '/assets/' + item.imageUrl?.replace('/assets/', '')}
                       alt="QA related"
                       onClose={() => setModalOpen(false)}
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
