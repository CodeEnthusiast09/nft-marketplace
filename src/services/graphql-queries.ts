import { gql } from "graphql-request";

export const GET_ACTIVE_ITEMS = gql`
  query GetActiveItems {
    activeItems(
      where: { buyer: "0x0000000000000000000000000000000000000000" }
      orderBy: id
      orderDirection: desc
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
      paymentToken
    }
  }
`;

export const GET_ACTIVE_ITEM = gql`
  query GetActiveItem($id: ID!) {
    activeItem(id: $id) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
      paymentToken
    }
  }
`;
