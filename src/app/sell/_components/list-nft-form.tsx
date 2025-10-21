"use client";

import { Input } from "@/components/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { listNftValidationSchema } from "@/validations";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/button";
import { useMarketplace } from "@/hooks/useMarketplace";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { BASIC_NFT_ABI } from "@/lib/contract-abi";
import { useNotify } from "@/lib/toast";
import { useState } from "react";
import { Select } from "@/components/select";
import { PAYMENT_TOKEN_OPTIONS } from "@/lib/constants";

type ListNftFormData = InferType<typeof listNftValidationSchema>;

const MARKETPLACE_ADDRESS = process.env
  .NEXT_PUBLIC_MARKETPLACE_ADDRESS as `0x${string}`;

export const ListNftForm = () => {
  const { address, isConnected } = useAccount();
  const { listItem, isPending: isListingPending } = useMarketplace();
  const { notifySuccess, notifyError, notifyTxPromise } = useNotify();

  const [isApproving, setIsApproving] = useState(false);

  const { writeContractAsync, data: approvalHash } = useWriteContract();

  const { isLoading: isApprovalConfirming } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ListNftFormData>({
    resolver: yupResolver(listNftValidationSchema),
  });

  const watchedValues = watch();

  const handleApproveNFT = async () => {
    if (!watchedValues.nftAddress || !watchedValues.tokenId) {
      notifyError({
        title: "Missing Information",
        message: "Please enter NFT contract address and token ID first.",
      });
      return;
    }

    try {
      setIsApproving(true);

      const txPromise = writeContractAsync({
        address: watchedValues.nftAddress as `0x${string}`,
        abi: BASIC_NFT_ABI,
        functionName: "approve",
        args: [MARKETPLACE_ADDRESS, BigInt(watchedValues.tokenId)],
      }).then((hash) => ({ hash }));

      await notifyTxPromise(txPromise);

      notifySuccess({
        title: "NFT Approved",
        message: "The marketplace can now transfer your NFT when it sells.",
      });
    } catch (error) {
      console.error("Approval error:", error);
      notifyError({
        title: "Approval Failed",
        message:
          error instanceof Error ? error.message : "Failed to approve NFT.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const onSubmit: SubmitHandler<ListNftFormData> = async (data) => {
    if (!isConnected) {
      notifyError({
        title: "Wallet Not Connected",
        message: "Please connect your wallet to list an NFT.",
      });
      return;
    }

    try {
      await listItem(
        data.nftAddress,
        data.tokenId,
        data.price,
        data.paymentToken as "ETH" | "USDC",
      );

      // Reset form after successful listing
      reset();
    } catch (error) {
      // Error handling is done in the listItem function
      console.error("Listing error:", error);
    }
  };

  const isProcessing = isApproving || isApprovalConfirming || isListingPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
      <Input
        label="NFT Contract Address"
        placeholder="0x..."
        error={errors.nftAddress}
        showRequiredAsterik
        {...register("nftAddress")}
      />

      <Input
        label="Token ID"
        placeholder="1"
        type="text"
        error={errors.tokenId}
        showRequiredAsterik
        {...register("tokenId")}
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Payment Token"
          placeholder="Select payment token"
          options={PAYMENT_TOKEN_OPTIONS}
          error={errors?.paymentToken}
          {...register(`paymentToken`, { required: true })}
          showRequiredAsterik
        />

        <Input
          label="Price"
          placeholder="0.1"
          type="text"
          error={errors.price}
          showRequiredAsterik
          {...register("price")}
        />
      </div>

      <hr className="mt-5" />

      <div className="pt-5 flex gap-4 md:justify-end flex-wrap">
        <Button
          type="button"
          onClick={handleApproveNFT}
          variant="secondary"
          radius="rounded-xl"
          disabled={
            isProcessing || !watchedValues.nftAddress || !watchedValues.tokenId
          }
          isLoading={isApproving || isApprovalConfirming}
          className="h-12 w-full md:w-auto"
        >
          {isApproving || isApprovalConfirming ? "Approving..." : "Approve NFT"}
        </Button>

        <Button
          type="submit"
          variant="primary"
          radius="rounded-xl"
          disabled={isProcessing || !isConnected}
          isLoading={isListingPending}
          className="h-12 w-full md:w-auto"
        >
          {isListingPending ? "Listing..." : "List NFT"}
        </Button>
      </div>

      {!isConnected && (
        <p className="text-sm text-amber-600 text-center mt-2">
          Please connect your wallet to list an NFT
        </p>
      )}
    </form>
  );
};
