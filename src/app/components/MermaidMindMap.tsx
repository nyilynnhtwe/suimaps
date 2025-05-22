import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { Canvg } from 'canvg';
import jsPDF from 'jspdf';

// Font Awesome setup
const addFontAwesome = () => {
  if (!document.getElementById('font-awesome')) {
    const link = document.createElement('link');
    link.id = 'font-awesome';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }
};

export interface MermaidMindMapHandle {
  saveAsPng: () => Promise<void>;
  saveAsPdf: () => Promise<void>;
}

const MermaidMindMap = forwardRef<MermaidMindMapHandle, { code: string }>(({ code }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  const handleSaveAsPng = async () => {
    if (!svgElement) return;

    try {
      // Get SVG dimensions from viewBox
      const viewBox = svgElement.getAttribute('viewBox')?.split(' ') || ['0', '0', '1200', '1000'];
      const width = parseInt(viewBox[2]);
      const height = parseInt(viewBox[3]);

      // Create high-resolution canvas
      const scale = 2; // 2x resolution
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      // Scale context for high resolution
      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const v = await Canvg.from(ctx, svgData);
      await v.render();

      // Create download link
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mindmap.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('PNG export error:', err);
    }
  };
const handleSaveAsPdf = async () => {
  if (!svgElement) return;

  try {
    // Get SVG dimensions from viewBox
    const viewBox = svgElement.getAttribute('viewBox')?.split(/\s+|,/).map(Number) || [0, 0, 1200, 1000];
    const [,, width, height] = viewBox;
    
    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate scaling to fit PDF page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const scale = Math.min(pageWidth / width, pageHeight / height) * 0.95;

    // Create canvas with proper scaling
    const canvas = document.createElement('canvas');
    canvas.width = width * 2; // 2x resolution
    canvas.height = height * 2;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    ctx.scale(2, 2);
    ctx.imageSmoothingEnabled = true;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const v = await Canvg.from(ctx, svgData);
    await v.render();

    // Add image to PDF with proper scaling
    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(
      imgData,
      'PNG',
      (pageWidth - width * scale) / 2, // Center horizontally
      (pageHeight - height * scale) / 2, // Center vertically
      width * scale,
      height * scale
    );

    pdf.save('mindmap.pdf');
  } catch (err) {
    console.error('PDF export error:', err);
    if (err instanceof Error) {
      setError(err.message || 'Failed to save PDF');
    }
  }
};

  useImperativeHandle(ref, () => ({
    saveAsPng: handleSaveAsPng,
    saveAsPdf: handleSaveAsPdf
  }));

  useEffect(() => {
    addFontAwesome();

    mermaid.initialize({
      startOnLoad: false,
      theme: 'forest',
      themeCSS: '.mindmap-node{font-size: 8px;}',
      mindmap: {
        useMaxWidth: false, // Critical for dynamic sizing
      },
      flowchart: {
        useMaxWidth: false,
      }
    });


    const renderDiagram = async () => {
      setError(null);
      if (!containerRef.current || !code.trim()) return;

      try {
        const validSyntax = code
          .replace(/^[\+\-]\s+/gm, '')
          .replace(/(\r\n|\n|\r)/gm, '\n')
          .replace(/^(\s*)(\w+)(\(\("?)/gm, '$1$2$3');

        await mermaid.parse(validSyntax);

        const id = `mermaid-${crypto.randomUUID()}`;
        const { svg } = await mermaid.render(id, validSyntax);

        containerRef.current.innerHTML = svg;
        const svgEl = containerRef.current.querySelector('svg');

        // Update the SVG manipulation code in useEffect:
        // In MermaidMindMap component's useEffect render function
        if (svgEl) {
          // Get the actual SVG dimensions from Mermaid's render
          const bbox = svgEl.getBBox();
          const padding = 20; // Add some padding around content

          // Set viewBox to contain all elements
          svgEl.setAttribute(
            'viewBox',
            `${bbox.x - padding} ${bbox.y - padding} 
     ${bbox.width + padding * 2} ${bbox.height + padding * 2}`
          );

          // Maintain responsive scaling
          svgEl.style.width = '100%';
          svgEl.style.height = '100%';
          setSvgElement(svgEl);
        }
      } catch (err) {
        console.error('Mermaid Error:', err);
        setError(err instanceof Error ? err.message : 'Invalid diagram syntax');
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div className="relative w-full h-full bg-white rounded-lg border">
      {error && (
        <div className="absolute inset-0 p-4 bg-red-50/90 flex items-center justify-center z-10">
          <div className="text-red-600 text-sm text-center">
            <div>⚠️ Invalid Mindmap Syntax</div>
            <div className="mt-2 font-mono text-xs">{error}</div>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="absolute inset-0 p-4 overflow-auto"
        style={{ minWidth: '800px', minHeight: '600px' }} // Base minimum size
      />
    </div>
  );
});

MermaidMindMap.displayName = 'MermaidMindMap';

export default MermaidMindMap;