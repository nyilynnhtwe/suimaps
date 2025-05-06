// app/page.tsx
"use client";
import { useState } from "react";
import MindmapViewer from "./components/MindMapView";
import { Loader2, Edit3, Lightbulb } from "lucide-react";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("Learning React Basics within 7 days");
  const [markdown, setMarkdown] = useState("Wow");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateMarkdown = async () => {
    if (!userPrompt.trim()) {
      setError("Please enter a valid prompt");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const markdownResponse = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: userPrompt }),
        headers: { "Content-Type": "application/json" },
      });

      if (!markdownResponse.ok) throw new Error("Generation failed");

      const markdownData = await markdownResponse.json();
      setMarkdown(markdownData.data);
    } catch (err) {
      setError("Failed to generate mindmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 bg-clip-text">
            AI Mindmap Generator
          </h1>
          <p className="text-gray-600">
            Transform your learning goals into structured mindmaps
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your learning goal..."
              onKeyDown={(e) => e.key === 'Enter' && generateMarkdown()}
            />
            <button
              onClick={generateMarkdown}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb size={18} />
                  Generate Mindmap
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Edit3 size={16} />
              <span className="font-medium">Markdown Editor</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              placeholder="Generated Markdown will appear here..."
            />
          </div>
        </div>

        {/* {markdown && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Interactive Mindmap
            </h2>
            <MindmapViewer markdown={markdown} />
          </div>
        )} */}
        <MindmapViewer markdown={markdown} />

        <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
          <p className="font-medium">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Start with specific learning objectives (e.g., "Master React Hooks in 3 days")</li>
            <li>Use natural language (e.g., "Complete guide to Next.js authentication")</li>
            <li>Edit the markdown directly to customize your mindmap</li>
          </ul>
        </div>
      </div>
    </div>
  );
}