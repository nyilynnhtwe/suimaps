"use client";
import { ConnectButton } from "@mysten/dapp-kit";
import { FaBrain, FaShapes } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { SiBlockchaindotcom, SiGooglegemini } from "react-icons/si";
import { Footer } from "./components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaBrain className="text-2xl text-purple-600" />
            <span className="text-xl font-bold">SuiMaps</span>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-white p-3 rounded-full shadow-lg flex items-center gap-2">
              <SiGooglegemini className="text-2xl text-green-500" />
              <FaShapes className="text-2xl text-purple-500" />
              <SiBlockchaindotcom className="text-2xl text-blue-500" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
            Visual Thinking Revolution<br />on Sui Blockchain
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform ideas into structured knowledge maps with AI,<br />then preserve them permanently as Sui Network NFTs
          </p>
          <Link
            href="/generate"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Creating
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">SuiMaps Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: SiGooglegemini,
              title: "AI Concept Mapping",
              text: "Gemini-powered analysis structures your raw ideas",
              badge: "Natural Language Processing"
            },
            {
              icon: FaShapes,
              title: "Smart Visualization",
              text: "Auto-layout engine creates professional diagrams",
              badge: "Neural Networks"
            },
            {
              icon: SiBlockchaindotcom,
              title: "Sui Provenance",
              text: "Immutable creation records on Sui Blockchain",
              badge: "Web3 Infrastructure"
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg relative"
            >
              <div className="absolute top-4 right-4 text-xs bg-gray-100 px-2 py-1 rounded-full">
                {feature.badge}
              </div>
              <feature.icon className="text-3xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Creation Flow</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-8">
            {[
              {
                title: "AI Processing",
                text: "Natural language analysis extracts key concepts",
                icon: <SiGooglegemini className="text-lg" />
              },
              {
                title: "Visualization",
                text: "Automated layout engine organizes nodes",
                icon: <FaShapes className="text-lg" />
              },
              {
                title: "Sui Minting",
                text: "Create verifiable NFT with on-chain metadata",
                icon: <SiBlockchaindotcom className="text-lg" />
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-start gap-4 bg-white p-4 rounded-lg"
              >
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Preview Section */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="aspect-video bg-gray-50 rounded-lg flex flex-col items-center justify-center p-4">
                <div className="animate-pulse flex flex-col gap-2 w-full">
                  <div className="h-4 bg-green-100 rounded w-3/4"></div>
                  <div className="h-4 bg-green-100 rounded w-1/2 ml-4"></div>
                  <div className="h-4 bg-green-100 rounded w-2/3 ml-8"></div>
                  <div className="mt-4 flex items-center gap-2 text-green-500">
                    <SiBlockchaindotcom />
                    <span className="text-sm">Minting to Sui...</span>
                  </div>
                </div>
                <div className="mt-4 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                  Sui NFT Preview
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;