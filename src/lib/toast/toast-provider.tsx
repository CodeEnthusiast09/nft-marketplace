import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: "",
        duration: 8000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },

        // Default options for specific types
        success: {
          duration: 8000,
        },
        error: {
          duration: 10000,
        },
      }}
    />
  );
};
