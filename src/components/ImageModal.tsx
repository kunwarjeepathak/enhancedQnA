import React, { useEffect, useRef } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

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
    setZoom(1);
  }, [src]);

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
        style={{overflow: 'auto', pointerEvents: 'auto'}}
      >
  <button onClick={() => alert('Test button works!')} style={{position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10003}}>Test Button</button>
        <div className="modal-controls-bar" style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10002, display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          <button
            className="modal-zoom-fab"
            onClick={() => {
              setZoom(z => {
                const newZoom = Math.min(z + 0.2, 5);
                return newZoom;
              });
            }}
            aria-label="Zoom in"
            style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '2.8rem', height: '2.8rem', background: '#fff', boxShadow: '0 2px 8px rgba(60,80,180,0.12)', border: '1px solid #cbd5e1', fontSize: '1.5rem', color: '#2563eb', cursor: 'pointer'}}
          >
            <ZoomInIcon fontSize="inherit" />
            <span style={{fontWeight: 'bold', marginLeft: '0.2rem'}}></span>
          </button>
          <button
            className="modal-maximize"
            onClick={() => setIsMaximized(m => !m)}
            aria-label={isMaximized ? "Minimize image" : "Maximize image"}
            style={{display: 'inline-block'}}
          >
            {isMaximized ? '🗗' : '🗖'}
          </button>
        </div>
        <img
          src={src}
          alt={alt || 'Preview'}
          className={isMaximized ? "modal-image maximized" : "modal-image"}
          role="img"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s', cursor: zoom > 1 ? 'grab' : 'default' }}
        />
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
