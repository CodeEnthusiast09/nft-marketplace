export interface NFTListing {
  id: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  paymentToken: string;
  buyer?: string;
}

export interface ActiveItem {
  id: string;
  buyer: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  paymentToken: string;
}

export interface NFTCardProps {
  nft: NFTListing;
  isOwnedByUser: boolean;
}
