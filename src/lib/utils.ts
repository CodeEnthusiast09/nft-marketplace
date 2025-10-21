export const formatAddress = (
  address: `0x${string}` | string,
  startChars: number = 6,
  endChars: number = 4,
): string => {
  if (!address) return "";
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const MOCK_NFTS = [
  {
    nftAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "1",
    price: "0.5",
    seller: "0x1234567890123456789012345678901234567890",
    paymentToken: "0x0000000000000000000000000000000000000000",
    imageUrl: "/abstract-digital-art-nft.png",
    name: "Abstract Dreams #1",
  },
  {
    nftAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "2",
    price: "1.2",
    seller: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    paymentToken: "0x0000000000000000000000000000000000000000",
    imageUrl: "/cyberpunk-neon-art.jpg",
    name: "Neon City #42",
  },
  {
    nftAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "3",
    price: "0.8",
    seller: "0x1234567890123456789012345678901234567890",
    paymentToken: "0x0000000000000000000000000000000000000000",
    imageUrl: "/geometric-pattern-art.jpg",
    name: "Geometric Flow #7",
  },
  {
    nftAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "4",
    price: "2.5",
    seller: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    paymentToken: "0x0000000000000000000000000000000000000000",
    imageUrl: "/space-galaxy-art.png",
    name: "Cosmic Voyage #15",
  },
  {
    nftAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "5",
    price: "0.3",
    seller: "0x1234567890123456789012345678901234567890",
    paymentToken: "0x0000000000000000000000000000000000000000",
    imageUrl: "/minimalist-art-nft.jpg",
    name: "Minimal Essence #23",
  },
  {
    nftAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "6",
    price: "1.8",
    seller: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    paymentToken: "0x0000000000000000000000000000000000000000",
    imageUrl: "/futuristic-digital-art.png",
    name: "Future Vision #88",
  },
];
