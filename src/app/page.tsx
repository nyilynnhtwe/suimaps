// app/page.tsx
"use client";
import { useState, useRef } from "react";
import { FaLightbulb, FaCopy, FaMagic, FaFileDownload, FaInfoCircle, FaMousePointer, FaEdit, FaRegLightbulb } from "react-icons/fa";
import MermaidMindMap, { MermaidMindMapHandle } from "./components/MermaidMindMap";
import { motion, AnimatePresence } from "framer-motion";

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
      if (err instanceof Error) {
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
      if (err instanceof Error) {
        setError(err.message || "Failed to save PDF");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* How To Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-800">
            <FaInfoCircle className="flex-shrink-0" />
            How to Create Your Mindmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <FaMousePointer className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">1. Describe</h3>
                <p className="text-sm text-gray-600">Enter your mindmap concept in the AI input field</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaMagic className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">2. Generate</h3>
                <p className="text-sm text-gray-600">Click AI Generate to create initial structure</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaEdit className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">3. Refine</h3>
                <p className="text-sm text-gray-600">Edit the code directly in the editor panel</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaFileDownload className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">4. Export</h3>
                <p className="text-sm text-gray-600">Download as PNG/PDF or copy the code</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Generation Section - Updated with animations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <motion.input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your mindmap..."
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={isGenerating}
              whileHover={{ scale: 1.01 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateMindmap();
                }
              }}
            />

            <motion.button
              onClick={generateMindmap}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
              whileHover={{ scale: isGenerating ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-red-500"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {/* Editor Section with animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 h-[400px] flex flex-col"
          >
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
          </motion.div>

          <motion.div className="bg-white rounded-xl shadow-lg p-6 h-[1000px] flex flex-col">
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}