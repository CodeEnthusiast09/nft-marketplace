import { type ReactNode } from "react";
import { toast as hotToast, type Toast } from "react-hot-toast";
import { ToastContent, type ToastAction } from "./toast-content";

export interface NotifyOptions {
  title?: string;
  message: ReactNode;
  duration?: number;
  action?: ToastAction;
  icon?: ReactNode;
  onDismiss?: () => void;
}

export interface PromiseMessages {
  loading: string;
  success: string | ((data?: any) => string);
  error: string | ((error?: any) => string);
}

export interface NotifyPromiseOptions {
  title?: string;
  messages: PromiseMessages;
  duration?: number;
  successAction?: ToastAction;
  errorAction?: ToastAction;
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

class ToastService {
  private defaultDuration = 8000;

  success(options: NotifyOptions) {
    const {
      title,
      message,
      duration = this.defaultDuration,
      action,
      icon,
      onDismiss,
    } = options;

    return hotToast.custom(
      (t: Toast) => (
        <ToastContent
          toastId={t.id}
          type="success"
          title={title}
          message={message}
          action={action}
          icon={icon}
          onDismiss={onDismiss}
        />
      ),
      { duration },
    );
  }

  error(options: NotifyOptions) {
    const {
      title,
      message,
      duration = this.defaultDuration,
      action,
      icon,
      onDismiss,
    } = options;

    return hotToast.custom(
      (t: Toast) => (
        <ToastContent
          toastId={t.id}
          type="error"
          title={title}
          message={message}
          action={action}
          icon={icon}
          onDismiss={onDismiss}
        />
      ),
      { duration },
    );
  }

  loading(options: NotifyOptions) {
    const { title, message, action, icon, onDismiss } = options;

    return hotToast.custom(
      (t: Toast) => (
        <ToastContent
          toastId={t.id}
          type="loading"
          title={title}
          message={message}
          action={action}
          icon={icon}
          onDismiss={onDismiss}
        />
      ),
      { duration: Infinity },
    );
  }

  promise<T>(promise: Promise<T>, options: NotifyPromiseOptions): Promise<T> {
    const {
      title,
      messages,
      duration = this.defaultDuration,
      successAction,
      errorAction,
      onSuccess,
      onError,
    } = options;

    let toastId: string;

    // Show loading toast
    toastId = this.loading({
      title: title || "Processing",
      message: messages.loading,
    });

    return promise
      .then((data) => {
        hotToast.remove(toastId);

        const successMessage =
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success;

        this.success({
          title: title || "Success",
          message: successMessage,
          duration,
          action: successAction,
        });

        onSuccess?.(data);
        return data;
      })
      .catch((error) => {
        hotToast.remove(toastId);

        const errorMessage =
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error;

        this.error({
          title: title || "Error",
          message: errorMessage,
          duration,
          action: errorAction,
        });

        onError?.(error);
        throw error;
      });
  }

  dismiss(toastId?: string) {
    hotToast.remove(toastId);
  }

  dismissAll() {
    hotToast.remove();
  }
}

export const toast = new ToastService();
