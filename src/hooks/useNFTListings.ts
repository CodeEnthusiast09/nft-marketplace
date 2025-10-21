import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request"; // ✅ fixed import
import { GET_ACTIVE_ITEM, GET_ACTIVE_ITEMS } from "@/services/graphql-queries";
import { formatEther } from "viem";
import { ActiveItem } from "@/interfaces/nft";

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL as string;

interface GetActiveItemsResponse {
  activeItems: ActiveItem[];
}

interface GetActiveItemResponse {
  activeItem: ActiveItem | null;
}

export function useNFTListings() {
  return useQuery<ActiveItem[]>({
    queryKey: ["nft-listings"],
    queryFn: async () => {
      const data = await request<GetActiveItemsResponse>(
        SUBGRAPH_URL,
        GET_ACTIVE_ITEMS,
      );

      // Format the data for display
      return data.activeItems.map((item: ActiveItem) => ({
        ...item,
        price: formatEther(BigInt(item.price)),
      }));
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useNFTListing(nftAddress: string, tokenId: string) {
  const id = `${BigInt(tokenId).toString(16)}${nftAddress.toLowerCase()}`;

  return useQuery<ActiveItem | null>({
    queryKey: ["nft-listing", id],
    queryFn: async () => {
      const data = await request<GetActiveItemResponse>(
        SUBGRAPH_URL,
        GET_ACTIVE_ITEM,
        { id },
      );

      if (!data.activeItem) return null;

      return {
        ...data.activeItem,
        price: formatEther(BigInt(data.activeItem.price)),
      };
    },
    enabled: !!nftAddress && !!tokenId,
  });
}
