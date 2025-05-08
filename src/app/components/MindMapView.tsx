// components/MindMapView.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

interface MarkmapViewerProps {
  markdown: string;
}

export default function MarkmapViewer({ markdown }: MarkmapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [markmap, setMarkmap] = useState<Markmap>();
  const transformer = new Transformer();

  useEffect(() => {
    const handleResize = () => {
      if (markmap) markmap.fit();
    };

    const { root } = transformer.transform(markdown);
    if (svgRef.current) {
      const newMarkmap = Markmap.create(svgRef.current, { autoFit: true }, root);
      setMarkmap(newMarkmap);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      markmap?.destroy();
    };
  }, [markdown]);

  return (
    <div className="bg-blue-100 p-2 border-2 border-blue-200 rounded-lg shadow-lg">
      <svg 
        ref={svgRef} 
        className="w-full h-[400px] md:h-[600px] lg:h-[800px]" 
      />
    </div>
  );
}