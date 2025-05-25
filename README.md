# SuiMaps - AI-Powered Mindmap NFTs on Sui Blockchain

[![Sui Blockchain](https://img.shields.io/badge/Built_on-Sui-6FBCF0)](https://sui.io)

Transform your ideas into tradable NFTs with SuiMaps - a decentralized platform for creating, editing, and minting AI-generated mindmaps on the Sui blockchain.


## ✨ Features

- 🧠 **AI-Powered Generation**: Create mindmaps from text prompts using AI
- ✍️ **Manual Editing**: Fine-tune generated mindmaps with built-in editor
- 📄 **PDF Export**: Save high-quality mindmap visualizations
- 🖼️ **NFT Minting**: Convert mindmaps into Sui blockchain NFTs
- 🔍 **NFT Gallery**: View and manage your mindmap NFT collection
- 📢 **Social Sharing**: Share NFTs directly to Twitter
- 🤝 **Collaborative Editing**: Real-time collaboration (coming soon)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- pnpm
- Sui CLI (for contract deployment)
- Sui wallet (Slush)

### Installation
1. Clone repository:
```bash
git clone https://github.com/nyilynnhtwe/suimaps.git
cd suimaps
```
2. Deploy the contract :
``` bash
cd contract 
sui client publish
```

3. Install dependencies:
``` bash
cd ..
npm install
```
4. Set up environment variables :
```bash
cp .env.example .env
# Add your actual credentials
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
NEXT_PUBLIC_TEST_NET_PACKAGE_ID="PACKAGE_ID_ON_SUI_TESTNET" # From contract deployment
```
5. Start development server:
```bash
npm run dev
```