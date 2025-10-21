export const PAYMENT_TOKEN_OPTIONS = [
  { label: "ETH (Native Token)", value: "ETH" },
  { label: "USDC (Stablecoin)", value: "USDC" },
];

export const NATIVE_TOKEN_ADDRESS =
  "0x0000000000000000000000000000000000000000";
export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

// Helper function to check if NFT is available for purchase
export function isNFTAvailable(buyerAddress: string): boolean {
  return buyerAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
}

// Helper function to check if NFT is cancelled
export function isNFTCancelled(buyerAddress: string): boolean {
  return buyerAddress.toLowerCase() === DEAD_ADDRESS.toLowerCase();
}

// Helper function to check if NFT is sold
export function isNFTSold(buyerAddress: string): boolean {
  return (
    !isNFTAvailable(buyerAddress) &&
    !isNFTCancelled(buyerAddress) &&
    buyerAddress !== ""
  );
}
