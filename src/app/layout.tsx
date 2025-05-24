import "./globals.css";
import * as React from "react";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import ClientProviders from "./provider/ClientProvider";
import { Toaster } from "react-hot-toast";

// layout.tsx (NO "use client" here)

export const metadata = {
  title: "SuiMaps - Decentralized Geospatial Platform",
  icons: {
    icon: '/icon_map.png',
  },
  description: "Explore and contribute to decentralized mapping powered by the Sui Blockchain",
  keywords: ["SuiMaps", "DeFi Maps", "Blockchain Mapping", "Sui Blockchain", "Decentralized GIS"],
  authors: [{ name: "SuiMaps Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "SuiMaps - Decentralized Geospatial Platform",
    description: "Explore and contribute to decentralized mapping powered by the Sui Blockchain",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "SuiMaps",
    images: [
      {
        url: '/og-banner.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SuiMaps - Decentralized Geospatial Platform",
    description: "Explore and contribute to decentralized mapping powered by the Sui Blockchain",
    images: ['/twitter-og.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap children with a separate ClientProvider */}
        <ClientProviders>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1F2937',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
