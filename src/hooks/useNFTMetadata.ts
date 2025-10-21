// hooks/useNFTMetadata.ts (OPTIONAL - for fetching actual NFT images/names)
import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import { BASIC_NFT_ABI } from "@/lib/contract-abi";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export function useNFTMetadata(nftAddress?: string, tokenId?: string) {
  // First, get the tokenURI from the contract
  const { data: tokenURI } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: BASIC_NFT_ABI,
    functionName: "tokenURI",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!nftAddress && !!tokenId,
    },
  });

  // Then fetch the metadata from the URI
  return useQuery<NFTMetadata>({
    queryKey: ["nft-metadata", nftAddress, tokenId],
    queryFn: async () => {
      if (!tokenURI) throw new Error("No token URI");

      // Handle IPFS URLs
      let url = tokenURI as string;
      if (url.startsWith("ipfs://")) {
        url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch metadata");

      const metadata: NFTMetadata = await response.json();

      // Handle IPFS image URLs
      if (metadata.image?.startsWith("ipfs://")) {
        metadata.image = metadata.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/",
        );
      }

      return metadata;
    },
    enabled: !!tokenURI,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
}

/**
 * Example usage in NFTCard component:
 *
 * const { data: metadata, isLoading } = useNFTMetadata(nft.nftAddress, nft.tokenId);
 *
 * const imageUrl = metadata?.image || "/placeholder.svg";
 * const nftName = metadata?.name || `NFT #${nft.tokenId}`;
 */
