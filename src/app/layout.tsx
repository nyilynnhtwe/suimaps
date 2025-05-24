"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { networkConfig } from "./utils/networkConfig";

const queryClient = new QueryClient();


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "A Kyan Pay",
//   description: "Transform your learning goals into structured mindmaps",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
            <WalletProvider autoConnect>
              {children}
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
        <Analytics />
      </body>
    </html>
  );
}