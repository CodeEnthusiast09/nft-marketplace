"use client";

import { useState } from "react";
import Image from "next/image";
import { formatAddress } from "@/lib/utils";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useCanAffordNFT } from "@/hooks/useTokenBalance";
import { Button } from "@/components/button";
import { UpdateListingModal } from "./update-listing-modal";
import { NFTCardProps } from "@/interfaces/nft";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import { SkeletonWrapper } from "@/components/skeleton/wrapper";
import { formatUnits } from "viem";

export function NFTCard({ nft, isOwnedByUser }: NFTCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { buyItem, approveERC20, isPending, NATIVE_TOKEN_ADDRESS } =
    useMarketplace();

  const isETH =
    nft.paymentToken.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

  // Check if user can afford this NFT
  const {
    canAfford,
    userBalance,
    isLoading: isCheckingBalance,
    shortfall,
  } = useCanAffordNFT(nft.price, nft.paymentToken, isETH);

  // Fetch NFT metadata
  const { data: metadata, isLoading: isLoadingMetadata } = useNFTMetadata(
    nft.nftAddress,
    nft.tokenId,
  );

  const handleBuyClick = async () => {
    try {
      // Step 1: If USDC and not approved, approve first
      if (!isETH && !isApproved) {
        setIsApproving(true);
        await approveERC20(nft.paymentToken, nft.price);
        setIsApproved(true);
        setIsApproving(false);
      }

      // Step 2: Buy the NFT
      await buyItem(nft.nftAddress, nft.tokenId, nft.paymentToken, nft.price);

      // Reset approval state after successful purchase
      setIsApproved(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      setIsApproving(false);
    }
  };

  const tokenDisplay = isETH ? "ETH" : "USDC";

  const imageUrl = metadata?.image || "/placeholder.svg";

  const displayPrice = (() => {
    const decimals = isETH ? 18 : 6;
    return formatUnits(BigInt(nft.price), decimals);
  })();

  // Determine button text based on state
  const getButtonText = () => {
    if (isApproving) return "Approving USDC...";
    if (isPending) return "Processing Purchase...";
    if (!canAfford) return `Insufficient ${tokenDisplay}`;
    if (!isETH && !isApproved) return "Buy Now (Will Approve First)";
    return "Buy Now";
  };

  const isProcessing = isApproving || isPending;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-xl hover:border-primary-500/50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <SkeletonWrapper isLoading={isLoadingMetadata}>
          <Image
            src={imageUrl}
            alt={metadata?.name || `NFT #${nft.tokenId}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        </SkeletonWrapper>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Owner Badge - Top Center */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
          {isOwnedByUser ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg border-2 border-white/30 backdrop-blur-sm">
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              YOUR NFT
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-lg border border-gray-200/50">
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {formatAddress(nft.seller)}
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title and Token ID */}
        <div className="mb-3">
          <SkeletonWrapper isLoading={isLoadingMetadata} width={150}>
            <h3 className="font-semibold text-base text-foreground mb-1 truncate group-hover:text-primary-500 transition-colors">
              {metadata?.name || `NFT #${nft.tokenId}`}
            </h3>
          </SkeletonWrapper>
          <p className="text-xs text-muted-foreground">
            {formatAddress(nft.nftAddress)}
          </p>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-4 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Current Price</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-primary-600">
                {/* {nft.price} */}
                {displayPrice}
              </span>
              <span className="text-sm font-semibold text-primary-600/70 uppercase tracking-wide">
                {tokenDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Balance Warning */}
        {!isOwnedByUser && !canAfford && !isCheckingBalance && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-2">
              <svg
                className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-xs">
                <p className="font-semibold text-amber-800">
                  Insufficient Balance
                </p>
                <p className="text-amber-700">
                  Your balance: {userBalance} {tokenDisplay}
                </p>
                <p className="text-amber-700">
                  You need {shortfall} more {tokenDisplay}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto space-y-2">
          {isOwnedByUser ? (
            <UpdateListingModal nft={nft} />
          ) : (
            <>
              <Button
                variant="primary"
                onClick={handleBuyClick}
                disabled={isProcessing || !canAfford}
                isLoading={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {getButtonText()}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
