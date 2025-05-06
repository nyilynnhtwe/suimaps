'use client';

import { useEffect, useRef, useState } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

interface MarkmapViewerProps {
  markdown: string;
}

export default function MarkmapViewer({ markdown }: MarkmapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [markmap, setMarkmap] = useState<Markmap>();
  const transformer = new Transformer();

  useEffect(() => {
    const { root } = transformer.transform(markdown);
    if (svgRef.current) {
      const newMarkmap = Markmap.create(svgRef.current, { autoFit: false }, root);
      setMarkmap(newMarkmap);
    }
  }, [markdown,transformer]);

  const handleExportPdf = async () => {
    if (!svgRef.current || !markmap) return;

    try {
      // Create a deep clone with styles
      const clonedSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // Copy critical attributes
      clonedSvg.setAttribute('width', svgRef.current.getAttribute('width') || '100%');
      clonedSvg.setAttribute('height', svgRef.current.getAttribute('height') || '800px');
      clonedSvg.setAttribute('viewBox', svgRef.current.getAttribute('viewBox') || '');

      // Inline styles from computed styles
      Array.from(clonedSvg.querySelectorAll('*')).forEach(element => {
        const computedStyle = getComputedStyle(element);
        (element as HTMLElement).style.cssText = computedStyle.cssText;
      });

      // Create PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });

      // Add SVG to PDF
      await doc.svg(clonedSvg, {
        x: 0,
        y: 0,
        width: doc.internal.pageSize.getWidth(),
        height: doc.internal.pageSize.getHeight(),
        loadExternalStyleSheets: true,
      });

      doc.save('markmap.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="bg-blue-100 p-2 border-2 border-blue-200 rounded-lg shadow-lg">
      <button 
        onClick={handleExportPdf}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Export to PDF
      </button>
      <svg ref={svgRef} style={{ width: '100%', height: '800px' }} />
    </div>
  );
}