import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { Transport } from "viem";
import { createConfig, http } from "wagmi";
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  avalanche,
  avalancheFuji,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  linea,
  lineaTestnet,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
} from "wagmi/chains";
import { defineChain } from "viem";
import linea_logo from "../public/img/linea_logo.png";
import lineaTesnet_logo from "../public/img/lineaTesnet_logo.png";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error(
    "WalletConnect project ID is not defined. Please check your environment variables.",
  );
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        ledgerWallet,
        rabbyWallet,
        phantomWallet,
        argentWallet,
        safeWallet,
      ],
    },
  ],
  { appName: "NFT-Marketplace", projectId: walletConnectProjectId },
);

const hardhat = defineChain({
  id: 31337,
  name: "Hardhat",
  network: "hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
});

// Fix missing icons
const customLinea = { ...linea, iconUrl: linea_logo.src };
const customLineaTestnet = { ...lineaTestnet, iconUrl: lineaTesnet_logo.src };

const transports: Record<number, Transport> = {
  [mainnet.id]: http(),
  [sepolia.id]: http(),
  [arbitrum.id]: http(),
  [arbitrumGoerli.id]: http(),
  [optimism.id]: http(),
  [optimismGoerli.id]: http(),
  [base.id]: http(),
  [baseGoerli.id]: http(),
  [polygon.id]: http(),
  [polygonMumbai.id]: http(),
  [avalanche.id]: http(),
  [avalancheFuji.id]: http(),
  [linea.id]: http(),
  [lineaTestnet.id]: http(),
  [bsc.id]: http(),
  [bscTestnet.id]: http(),
  [hardhat.id]: http(),
};

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    sepolia,
    arbitrum,
    arbitrumGoerli,
    optimism,
    optimismGoerli,
    base,
    baseGoerli,
    polygon,
    polygonMumbai,
    avalanche,
    avalancheFuji,
    customLinea,
    customLineaTestnet,
    bsc,
    bscTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [hardhat] : []),
  ],
  connectors,
  transports,
  ssr: true,
});
