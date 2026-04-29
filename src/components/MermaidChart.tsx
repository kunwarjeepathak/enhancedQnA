// src/components/MermaidChart.tsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidChartProps {
  chart: string;
}

/** Escape HTML for safe <pre> display */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const renderContainer = containerRef.current;
    if (!renderContainer) return;

    // Clear previous render
    renderContainer.innerHTML = '';

    // Normalize source
    let src = String(chart ?? '').replace(/\r/g, '\n').trim();

    // Remove accidental ```mermaid fences
    if (src.startsWith('```')) {
      src = src
        .replace(/^```(?:mermaid)?\s*/i, '')
        .replace(/```$/, '')
        .trim();
    }

    // Initialize Mermaid
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose', // change to 'strict' for more sandboxing
        flowchart: { useMaxWidth: true, htmlLabels: true },
        sequence: { actorMargin: 50, noteMargin: 10 },
      });
    } catch (err) {
      console.error('mermaid.initialize error', err);
    }

    const tryRender = async (input: string) => {
      const id = 'm' + Math.random().toString(36).slice(2);
      try {
        const result = await (mermaid as any).render(id, input);
        renderContainer.innerHTML = result.svg ?? '';

        // Make SVG responsive
        const svgEl = renderContainer.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('width', '100%');
          svgEl.setAttribute('height', 'auto');
          (svgEl as SVGElement).style.maxWidth = '100%';
          (svgEl as SVGElement).style.height = 'auto';
        }
        return true;
      } catch (err: any) {
        console.error('Mermaid render error', err);
        return err;
      }
    };

    (async () => {
      // First attempt
      const first = await tryRender(src);
      if (first === true) return;

      // Try sanitized version (remove trailing semicolons)
      const sanitized = src.replace(/;+\s*$/gm, '').trim();
      if (sanitized !== src) {
        const second = await tryRender(sanitized);
        if (second === true) return;

        // Show sanitized error
        const err = second;
        renderContainer.innerHTML = `
          <div style="border:1px solid #c0392b;padding:8px;background:#fff6f6;color:#a94442">
            <strong>Error rendering diagram.</strong>
            <div style="margin-top:8px"><em>Mermaid error:</em></div>
            <pre style="white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto">
${escapeHtml(String(err?.message || err))}
            </pre>
            <div style="margin-top:8px"><em>Sanitized source used for attempt:</em></div>
            <pre style="white-space:pre-wrap;word-break:break-word;max-height:300px;overflow:auto">
${escapeHtml(sanitized)}
            </pre>
          </div>
        `;
        return;
      }

      // Last resort: show original source + error
      const err = first;
      renderContainer.innerHTML = `
        <div style="border:1px solid #c0392b;padding:8px;background:#fff6f6;color:#a94442">
          <strong>Error rendering diagram.</strong>
          <div style="margin-top:8px"><em>Mermaid error:</em></div>
          <pre style="white-space:pre-wrap;word-break:break-word;max-height:200px;overflow:auto">
${escapeHtml(String(err?.message || err))}
          </pre>
          <div style="margin-top:8px"><em>Original source:</em></div>
          <pre style="white-space:pre-wrap;word-break:break-word;max-height:300px;overflow:auto">
${escapeHtml(src)}
          </pre>
        </div>
      `;
    })();
  }, [chart]);

  return <div ref={containerRef} className="mermaid-container" />;
};

export default MermaidChart;