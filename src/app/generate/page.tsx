"use client";
import { useState, useRef, useEffect } from "react";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Container, Flex } from "@radix-ui/themes";
import { FaMagic, FaInfoCircle, FaEdit, FaBrain, FaShare, FaCommentDots, FaRobot, FaPaintBrush, FaCoins } from "react-icons/fa";
import { MermaidMindMapHandle } from "../components/MermaidMindMap";
import MermaidMindMap from "../components/MermaidMindMap";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@mysten/sui/transactions";

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
  const account = useCurrentAccount();
  const client = useSuiClient();
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
    if (!account) return alert("Connect wallet first");

    try {
      const tx = new Transaction();
      const codeBytes = new TextEncoder().encode(code);

      tx.moveCall({
        target: "0xYOUR_PACKAGE_ID::main::mint",
        arguments: [
          tx.pure(codeBytes),
          tx.pure.string(prompt),
          tx.pure.string(Date.now().toString())
        ]
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
              console.log('object changes', result.objectChanges);
            },
          },
        );
      }
      alert("Mindmap NFT Minted Successfully!");
    } catch (err) {
      console.error(err);
      setError("Minting failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userAddress = account?.address;
      console.log(userAddress);

      try {
        const data = await client.getObject({
          // owner: userAddress || '',
          id: "0x5179f5761ed65859647d432db161e7fd937178210eddfad6ca476341e1783e72",
          options: {
            showType: true,
            showOwner: true,
            showDisplay: true,
          }
        });
        console.log(data);
      } catch (error) {
        console.error('Error fetching owned objects:', error);
      }
    };

    if (account?.address) {
      fetchData();
    }
  }, [account,client]);

  return (
    <>
      {/* <ConnectButton /> */}
      <Container className="mt-5">
        {/* Add Connect Button Row */}
        <Flex justify="end" className="mb-4 px-4">
          <ConnectButton />
        </Flex>
        <Container className="pt-2 px-4 bg-gray-50 min-h-[500px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* How To Section */}
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
                      className="px-3 py-1.5 text-sm bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                    >
                      Mint NFT
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
        <footer className="border-t bg-white mt-8 py-4">
          <Container className="px-4">
            <Flex justify="center" direction="column" align="center" gap="2">
              <div className="flex items-center gap-2">
                <FaBrain className="text-lg text-purple-600" />
                <span className="font-bold text-lg">SuiMaps</span>
              </div>
              <p className="text-sm text-gray-500">
                Visual Thinking on Sui Blockchain
              </p>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} SuiMaps. All rights reserved.
              </p>
            </Flex>
          </Container>
        </footer>
      </Container>
    </>
  );
}