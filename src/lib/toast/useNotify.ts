import { useCallback } from "react";
import { toast } from "./toast.utils";
import type { NotifyOptions, NotifyPromiseOptions } from "./toast.utils";
import {
  notifyTransactionPending,
  notifyTransactionSuccess,
  notifyTransactionError,
  notifyTransactionPromise,
  notifyWalletConnected,
  notifyWalletDisconnected,
  notifyWalletError,
  notifyNetworkSwitch,
  notifyNetworkSwitchError,
} from "./web3-toast.utils";

interface UseNotifyReturn {
  notifySuccess: (options: NotifyOptions) => string;
  notifyError: (options: NotifyOptions) => string;
  notifyLoading: (options: NotifyOptions) => string;
  notifyPromise: <T>(
    promise: Promise<T>,
    options: NotifyPromiseOptions,
  ) => Promise<T>;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;

  // Web3 specific
  notifyTxPending: (txHash: string, chainId?: number) => string;
  notifyTxSuccess: (txHash: string, chainId?: number) => string;
  notifyTxError: (error: any) => string;
  notifyTxPromise: <T extends { hash: string }>(
    promise: Promise<T>,
    chainId?: number,
  ) => Promise<T>;
  notifyWalletConnected: (address: string) => string;
  notifyWalletDisconnected: () => string;
  notifyWalletError: (error: any) => string;
  notifyNetworkSwitch: (networkName: string) => string;
  notifyNetworkSwitchError: (error: any) => string;
}

/**
 * Custom hook for toast notifications
 * Provides a clean API for showing toasts throughout your application
 */
export const useNotify = (): UseNotifyReturn => {
  const notifySuccess = useCallback((options: NotifyOptions) => {
    return toast.success(options);
  }, []);

  const notifyError = useCallback((options: NotifyOptions) => {
    return toast.error(options);
  }, []);

  const notifyLoading = useCallback((options: NotifyOptions) => {
    return toast.loading(options);
  }, []);

  const notifyPromise = useCallback(
    <T>(promise: Promise<T>, options: NotifyPromiseOptions) => {
      return toast.promise(promise, options);
    },
    [],
  );

  const dismiss = useCallback((toastId?: string) => {
    toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismissAll();
  }, []);

  // Web3 specific notifications
  const notifyTxPending = useCallback((txHash: string, chainId?: number) => {
    return notifyTransactionPending(txHash, { chainId });
  }, []);

  const notifyTxSuccess = useCallback((txHash: string, chainId?: number) => {
    return notifyTransactionSuccess(txHash, { chainId });
  }, []);

  const notifyTxError = useCallback((error: any) => {
    return notifyTransactionError(error);
  }, []);

  const notifyTxPromise = useCallback(
    <T extends { hash: string }>(promise: Promise<T>, chainId?: number) => {
      return notifyTransactionPromise(promise, { chainId });
    },
    [],
  );

  return {
    notifySuccess,
    notifyError,
    notifyLoading,
    notifyPromise,
    dismiss,
    dismissAll,
    notifyTxPending,
    notifyTxSuccess,
    notifyTxError,
    notifyTxPromise,
    notifyWalletConnected,
    notifyWalletDisconnected,
    notifyWalletError,
    notifyNetworkSwitch,
    notifyNetworkSwitchError,
  };
};
