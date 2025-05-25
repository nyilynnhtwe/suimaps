"use client";

import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Footer } from "../components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function NftChecker() {
    const account = useCurrentAccount();

    const { data, isLoading, error, refetch } = useSuiClientQuery("getOwnedObjects", {
        owner: account?.address || "",
        options: {
            showType: true,
            showDisplay: true,
            showContent: true,
        },
        filter: {
            MatchAny: [
                { StructType: `${process.env.NEXT_PUBLIC_TEST_NET_PACKAGE_ID}::SuiMapsNFT::SuiMapsNFT` },
            ]
        }
    }, {
        enabled: !!account?.address,
    });


    if (!account) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Connect Wallet to View NFTs</h2>
                <ConnectButton className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg" />
                <div className="mt-8 flex gap-4">
                    <Link href="/" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
                        ← Back to Home
                    </Link>
                    <Link href="/generate" className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg">
                        Generate New NFT
                    </Link>
                </div>
                <div className="mt-auto w-full">
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <h2 className="text-2xl font-bold">Your SuiMaps NFTs</h2>
                </div>

                <div className="flex gap-4 items-center">
                    <Link
                        href="/generate"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Generate
                    </Link>
                    <ConnectButton
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                {isLoading && (
                    <div className="text-center p-8">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 rounded-full"></div>
                        <p className="mt-2">Loading NFTs...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-red-500">Error: {(error as Error).message}</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data?.data?.map((item) => {
                        const nftData = item.data!;
                        return (
                            <div key={nftData.objectId} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                {item.data?.display?.data?.url ? (
                                    <Image
                                        width={300}
                                        height={300}
                                        src={item.data.display.data.url}
                                        alt={item.data.display.data.name || "NFT"}
                                        className="w-full h-48 object-cover mb-2 rounded"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 mb-2 rounded flex items-center justify-center">
                                        No Image
                                    </div>
                                )}

                                <h3 className="font-semibold truncate">
                                    {item.data?.display?.data?.name || "Unnamed NFT"}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {item.data?.display?.data?.description || "No description"}
                                </p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-500 break-words">
                                        Type: {item.data?.type?.split('::').pop()}
                                    </p>
                                    <p className="text-xs text-gray-500 break-words font-mono">
                                        ID: {item.data?.objectId}
                                    </p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href={`/nft/${nftData.objectId}`}
                                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1.5 rounded-lg text-sm text-center"
                                    >
                                        View Mindmap
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {!isLoading && data?.data?.length === 0 && (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No NFTs found in this wallet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Visit the <Link href="/generate" className="text-blue-500 hover:underline">Generate page</Link> to create your first NFT
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}