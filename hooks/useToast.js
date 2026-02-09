import { toast } from "sonner";

export function useToast() {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      duration: Infinity,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      duration: 3000,
      ...options,
    });
  };

  const dismissToast = (toastId) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showLoading,
    showInfo,
    dismissToast,
  };
}