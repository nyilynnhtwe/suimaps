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

  const calculateTextWidth = (text: string, fontSize: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 0;
    context.font = `${fontSize} Arial`;
    return context.measureText(text).width;
  };

  const convertForeignObjects = (svg: SVGSVGElement) => {
    const foreignObjects = Array.from(svg.querySelectorAll('foreignObject'));
    let verticalOffset = 0;

    foreignObjects.forEach(foreignObject => {
      const div = foreignObject.querySelector('div');
      if (!div) return;

      // Calculate position
      const x : string = foreignObject.getAttribute('x') || '0';
      const y : string = foreignObject.getAttribute('y') || '0' + verticalOffset;
      const styles = getComputedStyle(div);

      // Create text group
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('transform', `translate(${x},${y})`);

      // Handle tables
      const tables = div.querySelectorAll('table');
      tables.forEach(table => {
        const tableGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        let rowHeight = 0;

        Array.from(table.rows).forEach((row, rowIndex) => {
          let maxCellHeight = 0;
          Array.from(row.cells).forEach((cell, cellIndex) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', `${cellIndex * 150}`);
            text.setAttribute('y', `${rowIndex * 25}`);
            text.setAttribute('font-size', '12px');
            text.setAttribute('fill', '#000');
            text.textContent = cell.textContent?.trim() || '';
            
            const textWidth = calculateTextWidth(text.textContent, '12px');
            if (textWidth > 140) {
              text.setAttribute('transform', `scale(0.8)`);
            }
            
            tableGroup.appendChild(text);
            maxCellHeight = Math.max(maxCellHeight, 20);
          });
          rowHeight += maxCellHeight + 5;
        });

        verticalOffset += rowHeight;
        group.appendChild(tableGroup);
      });

      // Handle code blocks
      const codeBlocks = div.querySelectorAll('code');
      codeBlocks.forEach(code => {
        const codeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('font-size', '12px');
        text.setAttribute('fill', '#555');
        text.setAttribute('font-family', 'monospace');
        text.textContent = code.textContent?.trim() || '';
        
        const textWidth = calculateTextWidth(text.textContent, '12px');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('fill', '#f0f0f0');
        rect.setAttribute('width', `${textWidth + 10}`);
        rect.setAttribute('height', '20');
        rect.setAttribute('rx', '4');
        
        codeGroup.appendChild(rect);
        codeGroup.appendChild(text);
        codeGroup.setAttribute('transform', `translate(0,${verticalOffset})`);
        
        verticalOffset += 25;
        group.appendChild(codeGroup);
      });

      // Handle regular text
      if (!tables.length && !codeBlocks.length) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('font-size', styles.fontSize);
        text.setAttribute('fill', styles.color);
        text.textContent = div.textContent?.trim() || '';
        
        const textWidth = calculateTextWidth(text.textContent, styles.fontSize);
        if (textWidth > 200) {
          text.setAttribute('transform', `translate(0,${verticalOffset}) scale(0.8)`);
          verticalOffset += 30;
        } else {
          text.setAttribute('transform', `translate(0,${verticalOffset})`);
          verticalOffset += 20;
        }
        
        group.appendChild(text);
      }

      foreignObject.parentNode?.replaceChild(group, foreignObject);
    });
  };

  const handleExportPdf = async () => {
    if (!svgRef.current) return;

    try {
      const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
      convertForeignObjects(clone);

      // Set PDF dimensions
      const viewBox = clone.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 1200, 1000];
      const pdfWidth = 1200;
      const pdfHeight = (viewBox[3] / viewBox[2]) * pdfWidth;

      // Create PDF
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });

      // Temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.opacity = '0';
      container.appendChild(clone);
      document.body.appendChild(container);

      // Convert to PDF
      await pdf.svg(clone, {
        x: 0,
        y: 0,
        width: pdfWidth,
        height: pdfHeight,
        loadExternalStyleSheets: true,
      });

      // Cleanup and save
      document.body.removeChild(container);
      pdf.save('club_resources.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  // Keep the rest of the component unchanged
  useEffect(() => {
    const handleResize = () => markmap?.fit();
    
    const { root } = transformer.transform(markdown);
    if (svgRef.current) {
      const newMarkmap = Markmap.create(svgRef.current, { 
        autoFit: true,
        duration: 0
      }, root);
      setMarkmap(newMarkmap);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      markmap?.destroy();
    };
  }, [markdown]);

  return (
    <div className="relative">
      <div className="bg-blue-100 p-2 border-2 border-blue-200 rounded-lg shadow-lg">
        <svg 
          ref={svgRef} 
          className="w-full h-[400px] md:h-[600px] lg:h-[800px]"
          style={{ font: '14px Arial, sans-serif' }}
        />
      </div>
      
      <button 
        onClick={handleExportPdf}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Download as PDF
      </button>
    </div>
  );
}