import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";
import { GET_ACTIVE_ITEM, GET_ACTIVE_ITEMS } from "@/services/graphql-queries";
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

      // Keep price as raw value (Wei) - format only in UI
      return data.activeItems;
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

      // Keep price as raw value (Wei) - format only in UI
      return data.activeItem;
    },
    enabled: !!nftAddress && !!tokenId,
  });
}
