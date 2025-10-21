"use client";

import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { NFT_MARKETPLACE_ABI } from "@/lib/contract-abi";
import { useNotify } from "@/lib/toast";
import { NATIVE_TOKEN_ADDRESS } from "@/lib/constants";

// Replace with your deployed marketplace contract address
const MARKETPLACE_ADDRESS = process.env
  .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export function useMarketplace() {
  const { notifySuccess, notifyError, notifyTxPromise } = useNotify();
  const { address } = useAccount();

  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // ============= READ FUNCTIONS =============

  // Get listing information for a specific NFT
  const useListing = (nftAddress?: string, tokenId?: string) => {
    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "getListing",
      args:
        nftAddress && tokenId
          ? [nftAddress as `0x${string}`, BigInt(tokenId)]
          : undefined,
      query: {
        enabled: !!nftAddress && !!tokenId,
      },
    });
  };

  // Get listing price converted to a specific token
  const useListingPriceInToken = (
    nftAddress?: string,
    tokenId?: string,
    targetToken?: string,
  ) => {
    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "getListingPriceInToken",
      args:
        nftAddress && tokenId && targetToken
          ? [
              nftAddress as `0x${string}`,
              BigInt(tokenId),
              targetToken as `0x${string}`,
            ]
          : undefined,
      query: {
        enabled: !!nftAddress && !!tokenId && !!targetToken,
      },
    });
  };

  // Get proceeds for a seller in a specific token
  const useProceeds = (sellerAddress?: string, token?: "ETH" | "USDC") => {
    const tokenAddress =
      token === "ETH"
        ? NATIVE_TOKEN_ADDRESS
        : token === "USDC"
          ? USDC_ADDRESS
          : undefined;

    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "getProceeds",
      args:
        sellerAddress && tokenAddress
          ? [sellerAddress as `0x${string}`, tokenAddress as `0x${string}`]
          : undefined,
      query: {
        enabled: !!sellerAddress && !!tokenAddress,
      },
    });
  };

  // Get proceeds for the connected user
  const useMyProceeds = (token: "ETH" | "USDC") => {
    return useProceeds(address, token);
  };

  // Check if a token is supported
  const useIsTokenSupported = (tokenAddress?: string) => {
    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "isTokenSupportedPublic",
      args: tokenAddress ? [tokenAddress as `0x${string}`] : undefined,
      query: {
        enabled: !!tokenAddress,
      },
    });
  };

  // Get token information
  const useTokenInfo = (tokenAddress?: string) => {
    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "getTokenInfo",
      args: tokenAddress ? [tokenAddress as `0x${string}`] : undefined,
      query: {
        enabled: !!tokenAddress,
      },
    });
  };

  // Get marketplace owner
  const useMarketplaceOwner = () => {
    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "getOwner",
    });
  };

  // Get native token address constant
  const useNativeToken = () => {
    return useReadContract({
      address: MARKETPLACE_ADDRESS,
      abi: NFT_MARKETPLACE_ABI,
      functionName: "NATIVE_TOKEN",
    });
  };

  // ============= WRITE FUNCTIONS =============

  const listItem = async (
    nftAddress: string,
    tokenId: string,
    price: string,
    paymentToken: "ETH" | "USDC",
  ) => {
    try {
      const tokenAddress =
        paymentToken === "ETH" ? NATIVE_TOKEN_ADDRESS : USDC_ADDRESS;
      const priceInWei = parseEther(price);

      const txPromise = writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: NFT_MARKETPLACE_ABI,
        functionName: "listItem",
        args: [
          nftAddress as `0x${string}`,
          BigInt(tokenId),
          priceInWei,
          tokenAddress,
        ],
      }).then((hash) => ({ hash }));

      await notifyTxPromise(txPromise);

      notifySuccess({
        title: "NFT Listed",
        message: "Your NFT has been successfully listed on the marketplace.",
      });
    } catch (error) {
      console.error("List item error:", error);
      notifyError({
        title: "Error Listing NFT",
        message: error instanceof Error ? error.message : "Failed to list NFT.",
      });
      throw error;
    }
  };

  const buyItem = async (
    nftAddress: string,
    tokenId: string,
    paymentToken: string,
    price: string,
  ) => {
    try {
      const value =
        paymentToken === NATIVE_TOKEN_ADDRESS ? parseEther(price) : BigInt(0);

      const txPromise = writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: NFT_MARKETPLACE_ABI,
        functionName: "buyItem",
        args: [
          nftAddress as `0x${string}`,
          BigInt(tokenId),
          paymentToken as `0x${string}`,
        ],
        value,
        gas: BigInt(3_000_000),
      }).then((hash) => ({ hash }));

      await notifyTxPromise(txPromise);

      notifySuccess({
        title: "Purchase Successful",
        message: "You have successfully purchased the NFT!",
      });
    } catch (error) {
      console.error("Buy item error:", error);
      notifyError({
        title: "Purchase Failed",
        message: error instanceof Error ? error.message : "Failed to buy NFT.",
      });
      throw error;
    }
  };

  const updateListing = async (
    nftAddress: string,
    tokenId: string,
    newPrice: string,
    newPaymentToken: "ETH" | "USDC",
  ) => {
    try {
      const tokenAddress =
        newPaymentToken === "ETH" ? NATIVE_TOKEN_ADDRESS : USDC_ADDRESS;
      const priceInWei = parseEther(newPrice);

      const txPromise = writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: NFT_MARKETPLACE_ABI,
        functionName: "updateListing",
        args: [
          nftAddress as `0x${string}`,
          BigInt(tokenId),
          priceInWei,
          tokenAddress,
        ],
      }).then((hash) => ({ hash }));

      await notifyTxPromise(txPromise);

      notifySuccess({
        title: "Listing Updated",
        message: "Your NFT listing has been updated successfully.",
      });
    } catch (error) {
      console.error("Update listing error:", error);
      notifyError({
        title: "Update Failed",
        message:
          error instanceof Error ? error.message : "Failed to update listing.",
      });
      throw error;
    }
  };

  const cancelListing = async (nftAddress: string, tokenId: string) => {
    try {
      const txPromise = writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: NFT_MARKETPLACE_ABI,
        functionName: "cancelListing",
        args: [nftAddress as `0x${string}`, BigInt(tokenId)],
      }).then((hash) => ({ hash }));

      await notifyTxPromise(txPromise);

      notifySuccess({
        title: "Listing Cancelled",
        message: "Your NFT listing has been cancelled.",
      });
    } catch (error) {
      console.error("Cancel listing error:", error);
      notifyError({
        title: "Cancellation Failed",
        message:
          error instanceof Error ? error.message : "Failed to cancel listing.",
      });
      throw error;
    }
  };

  const withdrawProceeds = async (token: "ETH" | "USDC") => {
    try {
      const tokenAddress =
        token === "ETH" ? NATIVE_TOKEN_ADDRESS : USDC_ADDRESS;

      const txPromise = writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: NFT_MARKETPLACE_ABI,
        functionName: "withdrawProceeds",
        args: [tokenAddress],
      }).then((hash) => ({ hash }));

      await notifyTxPromise(txPromise);

      notifySuccess({
        title: "Withdrawal Successful",
        message: "Your proceeds have been withdrawn to your wallet.",
      });
    } catch (error) {
      console.error("Withdraw proceeds error:", error);
      notifyError({
        title: "Withdrawal Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to withdraw proceeds.",
      });
      throw error;
    }
  };

  return {
    // Write functions
    listItem,
    buyItem,
    updateListing,
    cancelListing,
    withdrawProceeds,
    isPending,
    isConfirming,
    isSuccess,

    // Read functions
    useListing,
    useListingPriceInToken,
    useProceeds,
    useMyProceeds,
    useIsTokenSupported,
    useTokenInfo,
    useMarketplaceOwner,
    useNativeToken,

    // Constants
    NATIVE_TOKEN_ADDRESS,
    USDC_ADDRESS,
  };
}
