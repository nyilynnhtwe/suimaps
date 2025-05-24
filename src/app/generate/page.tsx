"use client";
import { useState, useRef } from "react";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Flex } from "@radix-ui/themes";
import { FaMagic, FaInfoCircle, FaEdit, FaShare, FaCommentDots, FaRobot, FaPaintBrush, FaCoins, FaHome, FaCube, FaDollarSign } from "react-icons/fa";
import { MermaidMindMapHandle } from "../components/MermaidMindMap";
import MermaidMindMap from "../components/MermaidMindMap";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@mysten/sui/transactions";
import { Footer } from "../components/Footer";
import toast from "react-hot-toast";
import Link from "next/link";

const DEFAULT_CODE = `mindmap
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
  const [isMinting, setIsMinting] = useState(false);
  const [metadata, setMetadata] = useState({
    name: "My Mindmap",
    description: "A mindmap created with SuiMaps"
  });
  const account = useCurrentAccount();
  const client = useSuiClient();

  const { data: suiBalance } = useSuiClientQuery("getBalance", {
    owner: account?.address || "",
    coinType: "0x2::sui::SUI",
  });

  // Format balance for display
  const formattedBalance = suiBalance?.totalBalance
    ? (Number(suiBalance.totalBalance) / 1e9).toFixed(2)
    : '---';


  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
        },
      }),
  });

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



  const handleSavePdf = async () => {
    try {
      await mindMapRef.current?.saveAsPdf();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to save PDF");
      }
    }
  };

  const handleMintNFT = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Minting logic
      setIsMinting(true);
      const toastId = toast.loading("Minting NFT...");

      const tx = new Transaction();
      tx.moveCall({
        target: '0x4ab58320d7c46cfbd912e0875295a5395739e2dc951353f67b8fd49a96cfe7a3::SuiMapsNFT::mint_to_sender',

        arguments: [
          // using vector and option methods
          tx.pure.string(metadata.name),
          tx.pure.string(metadata.description),
          tx.pure.string(code),
        ],
      });
      if (account) {
        signAndExecuteTransaction(
          {
            transaction: tx,
            chain: 'sui:testnet',
            account: account,
          },
          {
            onSuccess: (result) => {
              console.log(result);
              toast.success(
                <p>
                  NFT Minted Successfully!
                </p>,
                { id: toastId }
              );
              setIsMinting(false);
            },
            onError: (error) => {
              console.error(error);
              toast.error("Minting failed. Please try again.", { id: toastId });
            },
          },
        );
      }
    } catch (err) {
      console.error(err);
      setError("Minting failed");
      toast.error("An unexpected error occurred");

    }
  };

  return (
    <>
      {/* <ConnectButton /> */}
      <Container className="mt-5">
        {/* Updated Navigation Bar */}
        <Flex justify="between" className="mb-4 px-4">
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaHome className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/nfts"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaCube className="w-4 h-4" />
              View NFTs
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <FaDollarSign className="flex-shrink-0" />
              <span className="font-medium">{formattedBalance} SUI</span>
            </div>
            <ConnectButton />
          </div>
        </Flex>
        <Container className="pt-2 px-4 bg-gray-50 min-h-[500px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* How To Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-purple-50 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <FaInfoCircle className="flex-shrink-0" />
                Create & Monetize Your Mindmaps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex items-start gap-3">
                  <FaCommentDots className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">1. Concept</h3>
                    <p className="text-sm text-gray-600">Describe your idea in plain English</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaRobot className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">2. Generate</h3>
                    <p className="text-sm text-gray-600">AI transforms your idea into structured nodes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPaintBrush className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">3. Customize</h3>
                    <p className="text-sm text-gray-600">Edit layout and connections visually</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCoins className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">4. Mint NFT</h3>
                    <p className="text-sm text-gray-600">Permanent on-chain storage as Sui NFT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaShare className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">5. Share</h3>
                    <p className="text-sm text-gray-600">Trade or display in Sui ecosystem</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Mindmap Name</label>
                  <input
                    value={metadata.name}
                    onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mindmap name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Description</label>
                  <input
                    value={metadata.description}
                    onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </motion.div>

            {/* AI Generation Section */}
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
            {/* Editor & Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code Editor */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 h-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2 text-blue-600">
                    <FaEdit className="w-5 h-5" />
                    Mermaid Code Editor
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[500px] p-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  spellCheck="false"
                />
              </motion.div>

              {/* Preview Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 h-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2 text-blue-600">
                    <FaMagic className="w-5 h-5" />
                    Live Preview
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePdf}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      PDF
                    </button>
                    <button
                      onClick={handleMintNFT}
                      disabled={isMinting}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isMinting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Minting...
                        </>
                      ) : (
                        <>
                          <FaCoins className="w-5 h-5" />
                          Mint as NFT
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative h-[500px] border rounded-lg overflow-hidden">
                  <MermaidMindMap ref={mindMapRef} code={code} />
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
        <Footer />
      </Container>
    </>
  );
}