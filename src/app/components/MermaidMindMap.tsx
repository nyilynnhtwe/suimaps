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
      // Get SVG dimensions
      const viewBox = svgElement.getAttribute('viewBox')?.split(' ') || ['0', '0', '1200', '1000'];
      const width = parseInt(viewBox[2]);
      const height = parseInt(viewBox[3]);

      // Create canvas with proper aspect ratio
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x resolution
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const v = await Canvg.from(ctx, svgData);
      await v.render();

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [width * 0.35, height * 0.35] // Convert pixels to mm (approx)
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save('mindmap.pdf');
    } catch (err) {
      console.error('PDF export error:', err);
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
      mindmap: {
        padding: 50,
        useMaxWidth: true,
      },
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

        if (svgEl) {
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
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
      />
    </div>
  );
});

MermaidMindMap.displayName = 'MermaidMindMap';

export default MermaidMindMap;