// src/components/Mermaid.tsx

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'antiscript',
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const id = 'mermaid-' + Math.random().toString(36).substr(2);

    // Use Promise-based render API
    mermaid
      .render(id, chart)
      .then((result: { svg: string; bindFunctions?: (element: HTMLElement) => void }) => {
        // Insert the generated SVG
        containerRef.current!.innerHTML = result.svg;

        // Attach event handlers if any (e.g., for clickable links)
        if (result.bindFunctions) {
          result.bindFunctions(containerRef.current!);
        }
      })
      .catch((err) => {
        console.error('Mermaid render failed:', err);
      });
  }, [chart]);

  return <div ref={containerRef} />;
};

export default Mermaid;