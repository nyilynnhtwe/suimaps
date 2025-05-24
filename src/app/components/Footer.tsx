// components/Footer.tsx
"use client";

import Link from "next/link";
import { FaBrain } from "react-icons/fa";

export function Footer() {
  return (
    < footer className = "border-t bg-white mt-20" >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <FaBrain className="text-xl text-purple-600" />
            <span className="text-xl font-bold">SuiMaps</span>
          </div>
          <p className="text-gray-600 max-w-xl">
            Revolutionizing visual thinking through AI-powered mind mapping
            and blockchain preservation on the Sui Network
          </p>
          <div className="flex gap-4 text-gray-500">
            <Link href="#" className="hover:text-purple-600">Terms</Link>
            <Link href="#" className="hover:text-purple-600">Privacy</Link>
            <Link href="#" className="hover:text-purple-600">Docs</Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            © {new Date().getFullYear()} SuiMaps. All rights reserved.
          </p>
        </div>
      </div>
      </footer >
  );
}