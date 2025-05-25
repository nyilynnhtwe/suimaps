// app/view/[nftId]/page.tsx
"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useParams } from "next/navigation";
import MermaidMindMap, { MermaidMindMapHandle } from "@/app/components/MermaidMindMap";
import { Footer } from "@/app/components/Footer";
import Link from "next/link";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { useRef } from "react";

function generateStaticParams() { }

export default function NFTViewPage() {
  const { nftId } = useParams();
  const account = useCurrentAccount();
  const mindMapRef = useRef<MermaidMindMapHandle>(null);

  const { data, isLoading, error } = useSuiClientQuery("getObject", {
    id: nftId as string,
    options: {
      showContent: true,
      showDisplay: true,
      showOwner: true,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nftData = (data?.data?.content as any)?.fields;
  const displayData = data?.data?.display?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ownerAddress = (data?.data?.owner as any)?.AddressOwner;
  const isOwner = account?.address === ownerAddress;

  const handleSavePdf = async () => {
    try {
      await mindMapRef.current?.saveAsPdf();
    } catch (err) {
      console.error("Failed to save PDF:", err);
    }
  };

  const handleShareTwitter = () => {
    const nftUrl = `${window.location.origin}/nft/${nftId}`;
    const tweetText = encodeURIComponent(
      `Check out this AI-generated mindmap NFT on SuiMaps 🧠\n"${displayData?.name || "Amazing Mindmap"}"\n\n${nftUrl}\n\n#SuiMaps #SuiBlockchain #Web3`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/nfts" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <FaArrowLeft className="w-5 h-5" />
            Back to Collection
          </Link>

          <div className="flex items-center gap-4">
            {isOwner && (<span className="text-sm text-green-600">Owner: You</span>)}
            <button
              onClick={handleShareTwitter}
              className="bg-[#48CAE4] hover:bg-[#00B4D8] text-[#023E8A] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share
            </button>
            <button
              onClick={handleSavePdf}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
            >
              <FaFilePdf className="w-4 h-4" />
              Save PDF
            </button>
          </div>

        </div>
      </header>

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        {isLoading && (
          <div className="text-center p-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 rounded-full"></div>
            <p className="mt-2">Loading NFT...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-red-500">Error loading NFT: {(error as Error).message}</p>
          </div>
        )}

        {nftData && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{displayData?.name || "Unnamed Mindmap"}</h1>
              <p className="text-gray-600 mt-2">
                {displayData?.description || "No description available"}
              </p>
            </div>

            <div className="border rounded-xl shadow-lg p-4">
              <div className="h-[600px]">
                <MermaidMindMap
                  ref={mindMapRef}
                  code={nftData.code}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">NFT Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Object ID</dt>
                  <dd className="font-mono text-sm break-all">{nftId}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}