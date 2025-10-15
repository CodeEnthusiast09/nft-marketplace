import { type ReactNode } from "react";
import { toast as hotToast } from "react-hot-toast";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface BaseToastProps {
  toastId: string;
  title?: string;
  message: ReactNode;
  action?: ToastAction;
  onDismiss?: () => void;
}

interface ToastContentProps extends BaseToastProps {
  type: "success" | "error" | "loading";
  icon?: ReactNode;
}

export const ToastContent = ({
  toastId,
  type,
  title,
  message,
  action,
  icon,
  onDismiss,
}: ToastContentProps) => {
  const handleDismiss = () => {
    hotToast.remove(toastId);
    onDismiss?.();
  };

  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case "success":
        return (
          <HiCheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0" />
        );
      case "error":
        return <HiXCircle className="h-6 w-6 text-red-400 flex-shrink-0" />;
      case "loading":
        return (
          <div className="h-6 w-6 flex-shrink-0">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent" />
          </div>
        );
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-l-emerald-400";
      case "error":
        return "border-l-red-400";
      case "loading":
        return "border-l-blue-400";
      default:
        return "border-l-gray-600";
    }
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg
        bg-gradient-to-r from-slate-900 to-slate-800
        border border-slate-700 ${getBorderColor()}
        border-l-4
        shadow-xl shadow-black/20
        backdrop-blur-sm
        max-w-md w-full
        transform transition-all duration-300
        hover:scale-[1.02]
        `}
    >
      {/* Icon */}
      <div className="mt-0.5">{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-white mb-1 truncate">
            {title}
          </h4>
        )}
        <div className="text-sm text-slate-300 break-words">{message}</div>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="
              mt-2 px-3 py-1.5 rounded-md
              bg-blue-500/20 hover:bg-blue-500/30
              text-blue-400 hover:text-blue-300
              text-xs font-medium
              transition-colors duration-200
              border border-blue-500/30
            "
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="
          flex-shrink-0 p-1 rounded-md
          text-slate-400 hover:text-white
          hover:bg-slate-700/50
          transition-colors duration-200
        "
        aria-label="Close notification"
      >
        <HiXMark className="h-5 w-5" />
      </button>
    </div>
  );
};
