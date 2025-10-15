export const formatAddress = (
  address: `0x${string}` | string,
  startChars: number = 6,
  endChars: number = 4,
): string => {
  if (!address) return "";
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};
