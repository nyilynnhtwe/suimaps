// app/page.tsx
"use client";
import { useState } from "react";
import MindmapViewer from "./components/MindMapView";
import { Loader2, Edit3, Lightbulb, Github, Twitter } from "lucide-react";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [markdown, setMarkdown] = useState("");
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
    } catch (error) {
      setError("Failed to generate mindmap. Please try again." + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section with Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              A Kyan Pay | အကြံပေး
            </h1>
            <br />
            <p className="text-gray-600 text-sm md:text-base">
              Transform your learning goals into structured mindmaps
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/nyilynnhtwe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://x.com/lynnthelight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Main Content (responsive adjustments) */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full md:flex-1 px-4 py-2 md:py-3 border flex-1 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your learning goal..."
              onKeyDown={(e) => e.key === 'Enter' && generateMarkdown()}
            />
            <button
              onClick={generateMarkdown}
              disabled={isLoading}
              className="w-full md:w-auto px-4 py-2 md:px-6 md:py-3 bg-gradient px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              className="w-full h-48 md:h-64 px-4 py-3 border w-full h-64 px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
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
            <li>Start with specific learning objectives (e.g., &quot;Master React Hooks in 3 days&quot;)</li>
            <li>Use natural language (e.g., &quot;Complete guide to Next.js authentication&quot;)</li>
            <li>Edit the markdown directly to customize your mindmap</li>
          </ul>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200 mt-8">
          <p>
            © {new Date().getFullYear()} A Kyan Pay. All rights reserved. | 
            Made with <span className="text-red-500">❤️</span> in Yangon
          </p>
        </div>
      </div>
    </div>
  );
}