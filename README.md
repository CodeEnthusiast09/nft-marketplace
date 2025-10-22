# NFT Marketplace

A decentralized NFT marketplace built with Next.js, Solidity, The Graph, and Web3 technologies. Buy, sell, and trade NFTs with support for multiple payment tokens (ETH and USDC).

![NFT Marketplace](https://img.shields.io/badge/Next.js-14-black)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue)
![The Graph](https://img.shields.io/badge/The%20Graph-Indexing-purple)

## 🌟 Features

- **List NFTs for Sale** - Set your price in ETH or USDC
- **Buy NFTs** - Purchase listed NFTs with supported tokens
- **Update Listings** - Modify price and payment token anytime
- **Cancel Listings** - Remove your NFT from the marketplace
- **Withdraw Proceeds** - Claim your earnings from sales
- **Real-time Updates** - Powered by The Graph subgraph indexing
- **Multi-token Support** - Accept payments in ETH or USDC
- **Wallet Integration** - Connect with MetaMask, WalletConnect, and more via RainbowKit
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Beautiful wallet connection UI
- **React Query** - Powerful data fetching and caching
- **Viem** - TypeScript Ethereum library
- **React Hook Form** - Form management with Yup validation
- **React Hot Toast** - Toast notifications

### Backend & Blockchain

- **Solidity** - Smart contract development
- **Hardhat** - Ethereum development environment
- **The Graph** - Decentralized indexing protocol
- **GraphQL** - Query language for NFT data
- **Chainlink Price Feeds** - Real-time token price conversion
- **IPFS** - Decentralized storage for NFT metadata

### Testing & Development

- **Sepolia Testnet** - Ethereum test network
- **Graph Studio** - Subgraph deployment and management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **MetaMask** or another Web3 wallet

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/CodeEnthusiast09/nft-marketplace.git
cd nft-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add your API keys inside. The WalletConnect project ID is now required since the v2 update. You can create one easily on the [WalletConnect dashboard](https://dashboard.reown.com):

```env
# The Graph Subgraph URL
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<your-id>/nft-marketplace/v0.0.1

# Smart Contract Addresses (Sepolia Testnet)
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = "Project ID needed for WalletConnect v2 here";
```

**How to get your Subgraph URL:**

1. Go to [The Graph Studio](https://thegraph.com/studio/)
2. Deploy your subgraph (see [Subgraph Setup](https://thegraph.com/docs/en/subgraphs/developing/deploying/using-subgraph-studio/))
3. Copy the "Query URL" from your dashboard

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your marketplace!
