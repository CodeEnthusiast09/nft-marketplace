"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { NFTCard } from "./_components/nft-card";
import { SearchBox } from "@/components/search-box";
import { useNFTListings } from "@/hooks/useNFTListings";
import { Skeleton } from "@/components/skeleton";

export default function Home() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: nftListings, isLoading, error } = useNFTListings();

  const filteredNFTs = nftListings?.filter(
    (nft) =>
      nft.tokenId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.nftAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.seller.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="px-4 py-6">
      <div className="lg:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover NFTs</h1>
          <p className="text-sm md:text-base">
            Browse and collect unique digital assets on the blockchain
          </p>
        </div>

        <SearchBox
          value={searchQuery}
          onChange={(value) => setSearchQuery(String(value))}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl bg-card border border-border"
            >
              <Skeleton height={300} />
              <div className="p-4 space-y-3">
                <Skeleton height={24} width="60%" />
                <Skeleton height={16} width="40%" />
                <Skeleton height={60} />
                <Skeleton height={40} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load NFTs</h3>
          <p className="text-muted-foreground mb-4">
            There was an error fetching the NFT listings. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      )}

      {/* NFT Grid */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs?.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                isOwnedByUser={
                  address?.toLowerCase() === nft.seller.toLowerCase()
                }
              />
            ))}
          </div>

          {filteredNFTs?.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No NFTs found matching your search."
                  : "No NFTs are currently listed on the marketplace."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
