import { toast } from "./toast.utils";
import type { ToastAction } from "./toast-content";

interface TransactionToastOptions {
  title?: string;
  chainId?: number;
  duration?: number;
}

interface TransactionData {
  hash: string;
}

/**
 * Get block explorer URL based on chain ID
 */
export const getBlockExplorerUrl = (
  chainId: number,
  txHash: string,
): string => {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io/tx/",
    11155111: "https://sepolia.etherscan.io/tx/",
    137: "https://polygonscan.com/tx/",
    80001: "https://mumbai.polygonscan.com/tx/",
    56: "https://bscscan.com/tx/",
    97: "https://testnet.bscscan.com/tx/",
    42161: "https://arbiscan.io/tx/",
    421613: "https://goerli.arbiscan.io/tx/",
    10: "https://optimistic.etherscan.io/tx/",
    420: "https://goerli-optimism.etherscan.io/tx/",
    43114: "https://snowtrace.io/tx/",
    43113: "https://testnet.snowtrace.io/tx/",
    8453: "https://basescan.org/tx/",
    84531: "https://goerli.basescan.org/tx/",
    59144: "https://lineascan.build/tx/",
    59140: "https://goerli.lineascan.build/tx/",
    31337: "#", // Hardhat local - no explorer
  };

  return `${explorers[chainId] || explorers[1]}${txHash}`;
};

/**
 * Show transaction pending toast
 */
export const notifyTransactionPending = (
  txHash: string,
  options?: TransactionToastOptions,
) => {
  const {
    title = "Transaction Pending",
    chainId = 11155111,
    duration = 10000,
  } = options || {};

  const explorerUrl = getBlockExplorerUrl(chainId, txHash);

  const action: ToastAction = {
    label: "View on Explorer",
    onClick: () => {
      if (explorerUrl !== "#") {
        window.open(explorerUrl, "_blank", "noopener,noreferrer");
      }
    },
  };

  return toast.loading({
    title,
    message: (
      <div>
        <p>Waiting for confirmation...</p>
        <p className="text-xs text-slate-400 mt-1 font-mono truncate">
          {txHash}
        </p>
      </div>
    ),
    action: chainId !== 31337 ? action : undefined,
  });
};

/**
 * Show transaction success toast
 */
export const notifyTransactionSuccess = (
  txHash: string,
  options?: TransactionToastOptions,
) => {
  const {
    title = "Transaction Successful",
    chainId = 11155111,
    duration = 8000,
  } = options || {};

  const explorerUrl = getBlockExplorerUrl(chainId, txHash);

  const action: ToastAction = {
    label: "View on Explorer",
    onClick: () => {
      if (explorerUrl !== "#") {
        window.open(explorerUrl, "_blank", "noopener,noreferrer");
      }
    },
  };

  return toast.success({
    title,
    message: (
      <div>
        <p>Your transaction has been confirmed</p>
        <p className="text-xs text-slate-400 mt-1 font-mono truncate">
          {txHash}
        </p>
      </div>
    ),
    duration,
    action: chainId !== 31337 ? action : undefined,
  });
};

/**
 * Show transaction error toast
 */
export const notifyTransactionError = (
  error: any,
  options?: TransactionToastOptions,
) => {
  const { title = "Transaction Failed", duration = 10000 } = options || {};

  const errorMessage =
    error?.message || error?.reason || "Unknown error occurred";

  return toast.error({
    title,
    message: (
      <div>
        <p className="mb-1">Transaction failed to execute</p>
        <p className="text-xs text-slate-400">{errorMessage}</p>
      </div>
    ),
    duration,
  });
};

/**
 * Handle transaction promise with toasts
 */
export const notifyTransactionPromise = <T extends TransactionData>(
  promise: Promise<T>,
  options?: TransactionToastOptions,
): Promise<T> => {
  const { title, chainId = 11155111, duration } = options || {};

  return toast.promise(promise, {
    title,
    messages: {
      loading: "Waiting for transaction confirmation...",
      success: (data: T) => {
        const explorerUrl = getBlockExplorerUrl(chainId, data.hash);
        return (
          <div>
            <p>Transaction confirmed!</p>
            <p className="text-xs text-slate-400 mt-1 font-mono truncate">
              {data.hash}
            </p>
          </div>
        ) as any;
      },
      error: (error: any) => {
        const errorMessage =
          error?.message || error?.reason || "Transaction failed";
        return (
          <div>
            <p>Transaction failed</p>
            <p className="text-xs text-slate-400 mt-1">{errorMessage}</p>
          </div>
        ) as any;
      },
    },
    duration,
    successAction:
      chainId !== 31337
        ? {
            label: "View on Explorer",
            onClick: () => {
              promise.then((data) => {
                const explorerUrl = getBlockExplorerUrl(chainId, data.hash);
                window.open(explorerUrl, "_blank", "noopener,noreferrer");
              });
            },
          }
        : undefined,
  });
};

/**
 * Wallet connection toasts
 */
export const notifyWalletConnected = (address: string) => {
  return toast.success({
    title: "Wallet Connected",
    message: (
      <div>
        <p>Successfully connected to your wallet</p>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    ),
  });
};

export const notifyWalletDisconnected = () => {
  return toast.success({
    title: "Wallet Disconnected",
    message: "Your wallet has been disconnected",
  });
};

export const notifyWalletError = (error: any) => {
  const errorMessage = error?.message || "Failed to connect wallet";

  return toast.error({
    title: "Connection Error",
    message: errorMessage,
  });
};

/**
 * Network switch toasts
 */
export const notifyNetworkSwitch = (networkName: string) => {
  return toast.success({
    title: "Network Switched",
    message: `Successfully switched to ${networkName}`,
  });
};

export const notifyNetworkSwitchError = (error: any) => {
  const errorMessage = error?.message || "Failed to switch network";

  return toast.error({
    title: "Network Switch Failed",
    message: errorMessage,
  });
};
