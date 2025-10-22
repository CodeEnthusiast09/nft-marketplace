"use client";

import { Modal } from "@/components/modal";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Button } from "@/components/button";
import { useMarketplace } from "@/hooks/useMarketplace";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SkeletonWrapper } from "@/components/skeleton/wrapper";
import { listNftValidationSchema } from "@/validations";
import { PAYMENT_TOKEN_OPTIONS } from "@/lib/constants";
import { InferType } from "yup";
import { useNFTListing } from "@/hooks/useNFTListings";
import { formatAddress } from "@/lib/utils";
import { NFTListing } from "@/interfaces/nft";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import { formatUnits } from "viem";

type ListNftFormData = InferType<typeof listNftValidationSchema>;

interface UpdateListingModalProps {
  nft: NFTListing;
}

export const UpdateListingModal = ({ nft }: UpdateListingModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);

  const { data: metadata, isLoading } = useNFTMetadata(
    nft.nftAddress,
    nft.tokenId,
  );

  const {
    updateListing,
    cancelListing,
    isPending,
    isConfirming,
    NATIVE_TOKEN_ADDRESS,
  } = useMarketplace();

  // Fetch current listing data from subgraph
  const { data: currentListing, isLoading: isLoadingListing } = useNFTListing(
    nft.nftAddress,
    nft.tokenId,
  );

  const isETH =
    (currentListing?.paymentToken || nft.paymentToken).toLowerCase() ===
    NATIVE_TOKEN_ADDRESS.toLowerCase();
  const currentToken = isETH ? "ETH" : "USDC";

  // Format current price for display
  const currentPrice = (() => {
    const price = currentListing?.price || nft.price;
    const decimals = isETH ? 18 : 6;
    return formatUnits(BigInt(price), decimals);
  })();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ListNftFormData>({
    resolver: yupResolver(listNftValidationSchema),
    defaultValues: {
      nftAddress: nft.nftAddress,
      tokenId: nft.tokenId,
      price: currentPrice,
      paymentToken: currentToken,
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (currentPrice && currentToken) {
      setValue("price", currentPrice);
      setValue("paymentToken", currentToken);
    }
  }, [currentPrice, currentToken, setValue]);

  const handleUpdateListing = async (data: ListNftFormData) => {
    console.log("🔹 Update clicked with:", data);

    try {
      await updateListing(
        nft.nftAddress,
        nft.tokenId,
        data.price,
        data.paymentToken as "ETH" | "USDC",
      );
      reset();
      setShowModal(false);
    } catch (error) {
      console.error("Update listing error:", error);
    }
  };

  const handleCancelListing = async () => {
    try {
      await cancelListing(nft.nftAddress, nft.tokenId);
      setShowModal(false);
    } catch (error) {
      console.error("Cancel listing error:", error);
    }
  };

  const isProcessing = isPending || isConfirming;

  const imageUrl = metadata?.image || "/placeholder.svg";

  return (
    <Modal
      className="md:p-10"
      buttonIcon={<FiEdit2 className="mr-1" />}
      buttonTitle="Update Listing"
      trigerButtonClass="w-full"
      trigerButtonJustifyContent="justify-center"
      modalTitle="Update listing"
      show={showModal}
      onShowCallbackAction={() => setShowModal(true)}
      onCloseCallbackAction={() => setShowModal(false)}
    >
      <div className="space-y-6">
        {/* NFT Preview */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
          <div className="flex items-center gap-4">
            <SkeletonWrapper isLoading={isLoading}>
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                <Image
                  src={imageError ? "/placeholder.svg" : imageUrl}
                  alt={`NFT #${nft.tokenId}`}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            </SkeletonWrapper>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">
                NFT #{nft.tokenId}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {formatAddress(nft.nftAddress)}
              </p>
              <SkeletonWrapper
                isLoading={isLoadingListing}
                height={20}
                width={100}
                className="mt-1"
              >
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-primary-600">
                    Current: {currentPrice}
                  </span>
                  <span className="text-xs text-primary-600/70 uppercase">
                    {currentToken}
                  </span>
                </div>
              </SkeletonWrapper>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form
          onSubmit={handleSubmit(handleUpdateListing)}
          className="space-y-4"
        >
          {/* {Object.keys(errors).length > 0 && ( */}
          {/*   <pre className="text-red-500 text-xs"> */}
          {/*     {JSON.stringify(errors, null, 2)} */}
          {/*   </pre> */}
          {/* )} */}

          <Input
            label="New Price"
            placeholder="0.1"
            type="text"
            error={errors.price}
            showRequiredAsterik
            disabled={isLoadingListing}
            {...register("price")}
          />

          <Select
            label="Payment Token"
            placeholder="Select payment token"
            options={PAYMENT_TOKEN_OPTIONS}
            error={errors.paymentToken}
            showRequiredAsterik
            labelClassName="text-black/70"
            disabled={isLoadingListing}
            {...register("paymentToken")}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isProcessing || isLoadingListing}
              isLoading={isPending && !isConfirming}
              className="w-full"
            >
              Save New Price
            </Button>

            <Button
              type="button"
              onClick={handleCancelListing}
              variant="danger"
              disabled={isProcessing || isLoadingListing}
              isLoading={isConfirming && isPending}
              className="w-full"
            >
              Cancel Listing
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Quick Tips</p>
              <ul className="space-y-0.5 text-xs">
                <li>• Updating price requires a transaction</li>
                <li>• Canceling removes your listing completely</li>
                <li>• You can relist after canceling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
