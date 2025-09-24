import React, { useEffect, useRef } from 'react';

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);

  useEffect(() => {
    if (src && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={e => {
        // Only close if the overlay itself is clicked, not if mouse moves or drags
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-content scrollable"
        onClick={e => e.stopPropagation()}
        style={{overflow: 'auto'}}
      >
        <img
          src={src}
          alt={alt || 'Preview'}
          className={isMaximized ? "modal-image maximized" : "modal-image"}
          role="img"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s', cursor: zoom > 1 ? 'grab' : 'default' }}
        />
        <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 10001, display: 'flex', gap: '0.5rem' }}>
          <button
            className="modal-zoom"
            onClick={() => setZoom(z => Math.min(z + 0.2, 5))}
            aria-label="Zoom in"
          >
            ➕
          </button>
          <button
            className="modal-zoom"
            onClick={() => setZoom(z => Math.max(z - 0.2, 1))}
            aria-label="Zoom out"
            disabled={zoom <= 1}
          >
            ➖
          </button>
          <button
            className="modal-maximize"
            onClick={() => setIsMaximized(m => !m)}
            aria-label={isMaximized ? "Minimize image" : "Maximize image"}
          >
            {isMaximized ? '🗗' : '🗖'}
          </button>
        </div>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close image preview"
          ref={closeBtnRef}
          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10001 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
