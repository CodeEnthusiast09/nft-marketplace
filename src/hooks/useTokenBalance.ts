import { useReadContract, useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Hook to get ETH balance
 */
export function useETHBalance() {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useBalance({
    address: address,
  });

  // wagmi returns raw bigint `value` now — format it yourself
  const balance = (data?.value as bigint) ?? BigInt(0);
  const formatted = balance ? formatUnits(balance, 18) : "0"; // ETH = 18 decimals
  const symbol = data?.symbol ?? "ETH";

  return {
    balance,
    formatted,
    symbol,
    isLoading,
    refetch,
  };
}

/**
 * Hook to get ERC20 token balance
 */
export function useERC20Balance(tokenAddress?: string) {
  const { address } = useAccount();

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!tokenAddress && !!address,
    },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: {
      enabled: !!tokenAddress,
    },
  });

  const formatted =
    balance && decimals
      ? formatUnits(balance as bigint, decimals as number)
      : "0";

  return {
    balance: (balance as bigint) || BigInt(0),
    formatted,
    decimals: decimals as number,
    isLoading: isLoadingBalance,
    refetch,
  };
}

/**
 * Hook to check if user has enough balance to buy an NFT
 * @param priceInWei - Price in Wei (raw blockchain value)
 * @param paymentToken - Token address
 * @param isETH - Whether payment is in ETH
 */
export function useCanAffordNFT(
  priceInWei: string,
  paymentToken: string,
  isETH: boolean,
) {
  const { balance: ethBalanceData, isLoading: ethLoading } = useETHBalance();
  const {
    balance: tokenBalance,
    decimals,
    isLoading: tokenLoading,
  } = useERC20Balance(!isETH ? paymentToken : undefined);

  const userBalance = isETH ? ethBalanceData || BigInt(0) : tokenBalance;
  const priceAsBigInt = BigInt(priceInWei);
  const canAfford = userBalance >= priceAsBigInt;
  const isLoading = isETH ? ethLoading : tokenLoading;

  // Format for display
  const tokenDecimals = isETH ? 18 : decimals || 6;
  const userBalanceFormatted = formatUnits(userBalance, tokenDecimals);
  const shortfall = canAfford
    ? "0"
    : formatUnits(priceAsBigInt - userBalance, tokenDecimals);

  return {
    canAfford,
    userBalance: userBalanceFormatted,
    isLoading,
    shortfall,
  };
}
