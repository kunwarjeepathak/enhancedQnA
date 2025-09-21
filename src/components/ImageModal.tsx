import React, { useEffect, useRef } from 'react';

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);

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
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt || 'Preview'}
          className={isMaximized ? "modal-image maximized" : "modal-image"}
          role="img"
        />
        <button
          className="modal-maximize"
          onClick={() => setIsMaximized(m => !m)}
          aria-label={isMaximized ? "Minimize image" : "Maximize image"}
          style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 10001 }}
        >
          {isMaximized ? '🗗' : '🗖'}
        </button>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close image preview"
          ref={closeBtnRef}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
