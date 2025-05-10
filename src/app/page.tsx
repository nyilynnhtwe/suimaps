// app/page.tsx
"use client";
import { useState, useRef } from "react";
import { FaLightbulb, FaCopy, FaMagic, FaFileDownload } from "react-icons/fa";
import MermaidMindMap, { MermaidMindMapHandle } from "./components/MermaidMindMap";

const DEFAULT_CODE = `
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid`;

export default function MindmapEditor() {
  const mindMapRef = useRef<MermaidMindMapHandle>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // API Call Handler
  const generateMindmap = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const { data } = await response.json();
      setCode(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to generate mindmap");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  const handleSavePng = async () => {
    try {
      await mindMapRef.current?.saveAsPng();
    } catch (err) {
      if(err instanceof Error) {
        setError(err.message || "Failed to save PNG");
      }
    }
  };

  const handleSavePdf = async () => {
    console.log("Start Saving PDF...");

    try {
      console.log("Saving PDF...");
      await mindMapRef.current?.saveAsPdf();
      console.log("Saved PDF...");
    } catch (err) {
      if(err instanceof Error) {
        setError(err.message || "Failed to save PDF");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* AI Generation Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your mindmap..."
              className="flex-1 p-3 border rounded-lg"
              disabled={isGenerating}
            />
            <button
              onClick={generateMindmap}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <FaMagic className="animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <FaMagic />
                  AI Generate
                </>
              )}
            </button>
          </div>
          {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Editor Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaLightbulb className="text-blue-600" />
                Editor
              </h2>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
              >
                <FaCopy className="w-4 h-4" />
                Copy
              </button>
            </div>

            <div className="relative flex-1">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full h-full p-4 font-mono text-sm border rounded-lg focus:outline-none "border-gray-200" }`}
                spellCheck={false}
              />


            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 h-[1000px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSavePng}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                >
                  <FaFileDownload />
                  PNG
                </button>
                <button
                  onClick={handleSavePdf}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                >
                  <FaFileDownload />
                  PDF
                </button>
              </div>
            </div>
            <div className="flex-1 border rounded-lg overflow-hidden relative">
              <MermaidMindMap ref={mindMapRef} code={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
