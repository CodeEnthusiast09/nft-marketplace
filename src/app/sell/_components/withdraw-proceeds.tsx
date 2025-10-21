"use client";

import { Button } from "@/components/button";
import { Select } from "@/components/select";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
import { useNotify } from "@/lib/toast";
import { PAYMENT_TOKEN_OPTIONS } from "@/lib/constants";
import { SkeletonWrapper } from "@/components/skeleton/wrapper";

export const WithdrawProceedsForm = () => {
  const { isConnected } = useAccount();
  const { withdrawProceeds, useMyProceeds, isPending, isConfirming } =
    useMarketplace();
  const { notifyError } = useNotify();

  const [selectedToken, setSelectedToken] = useState<"ETH" | "USDC">("ETH");

  // Fetch proceeds for both tokens
  const {
    data: ethProceeds,
    isLoading: isLoadingEth,
    refetch: refetchEth,
  } = useMyProceeds("ETH");

  const {
    data: usdcProceeds,
    isLoading: isLoadingUsdc,
    refetch: refetchUsdc,
  } = useMyProceeds("USDC");

  const ethProceedsBigInt =
    typeof ethProceeds === "bigint" ? ethProceeds : BigInt(0);
  const usdcProceedsBigInt =
    typeof usdcProceeds === "bigint" ? usdcProceeds : BigInt(0);

  // Auto-refetch after successful withdrawal
  useEffect(() => {
    if (!isPending && !isConfirming) {
      refetchEth();
      refetchUsdc();
    }
  }, [isPending, isConfirming, refetchEth, refetchUsdc]);

  const handleWithdraw = async () => {
    if (!isConnected) {
      notifyError({
        title: "Wallet Not Connected",
        message: "Please connect your wallet to withdraw proceeds.",
      });
      return;
    }

    const proceeds =
      selectedToken === "ETH" ? ethProceedsBigInt : usdcProceedsBigInt;

    if (proceeds === BigInt(0)) {
      notifyError({
        title: "No Proceeds Available",
        message: `You have no ${selectedToken} proceeds to withdraw.`,
      });
      return;
    }

    try {
      await withdrawProceeds(selectedToken);
      // Refetch will happen automatically via useEffect
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  const formatProceeds = (proceeds: bigint | undefined): string => {
    if (!proceeds || proceeds === BigInt(0)) return "0";
    return formatEther(proceeds);
  };

  const ethAmount = formatProceeds(ethProceedsBigInt);
  const usdcAmount = formatProceeds(usdcProceedsBigInt);
  const selectedAmount = selectedToken === "ETH" ? ethAmount : usdcAmount;

  const isLoading = isLoadingEth || isLoadingUsdc;
  const isProcessing = isPending || isConfirming;
  const hasProceeds =
    selectedToken === "ETH"
      ? ethProceeds && ethProceedsBigInt > BigInt(0)
      : usdcProceeds && usdcProceedsBigInt > BigInt(0);

  return (
    <div className="space-y-6 mt-6">
      {/* Token Selection */}
      <Select
        label="Select Token"
        options={PAYMENT_TOKEN_OPTIONS}
        value={selectedToken}
        onChange={(e) => setSelectedToken(e.target.value as "ETH" | "USDC")}
        disabled={isProcessing}
        showRequiredAsterik
        labelClassName="text-black/70"
      />

      {/* Proceeds Display */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Available {selectedToken} Proceeds
          </p>

          <SkeletonWrapper
            isLoading={isLoading}
            height={48}
            className="my-2 rounded w-full"
          >
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary-600">
                {selectedAmount} {selectedToken}
              </p>
              {!hasProceeds && (
                <p className="text-xs text-gray-500">
                  No proceeds available yet
                </p>
              )}
            </div>
          </SkeletonWrapper>
        </div>

        {/* All Proceeds Summary */}
        {!isLoading && (
          <div className="mt-4 pt-4 border-t border-primary-200">
            <p className="text-xs text-gray-500 text-center mb-2">
              All Available Proceeds
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <SkeletonWrapper
                isLoading={isLoadingEth}
                height={24}
                width={80}
                className="rounded"
              >
                <div className="text-center">
                  <p className="font-semibold text-gray-700">{ethAmount} ETH</p>
                </div>
              </SkeletonWrapper>

              <SkeletonWrapper
                isLoading={isLoadingUsdc}
                height={24}
                width={80}
                className="rounded"
              >
                <div className="text-center">
                  <p className="font-semibold text-gray-700">
                    {usdcAmount} USDC
                  </p>
                </div>
              </SkeletonWrapper>
            </div>
          </div>
        )}
      </div>

      {/* Withdraw Button */}
      <Button
        type="button"
        onClick={handleWithdraw}
        variant="primary"
        radius="rounded-xl"
        disabled={!isConnected || !hasProceeds || isProcessing}
        isLoading={isProcessing}
        className="w-full"
      >
        {isProcessing ? "Withdrawing..." : `Withdraw ${selectedToken}`}
      </Button>

      {!isConnected && (
        <p className="text-sm text-amber-600 text-center">
          Please connect your wallet to withdraw proceeds
        </p>
      )}

      {isConnected && !hasProceeds && !isLoading && (
        <p className="text-sm text-gray-500 text-center">
          You don&apos;t have any {selectedToken} proceeds to withdraw yet.
          Proceeds appear here after your NFTs are sold.
        </p>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How Withdrawals Work</p>
            <ul className="space-y-1 text-xs">
              <li>• Proceeds accumulate when your NFTs are sold</li>
              <li>• You can withdraw ETH and USDC separately</li>
              <li>• Funds are sent directly to your connected wallet</li>
              <li>• You can withdraw anytime, no minimum required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
