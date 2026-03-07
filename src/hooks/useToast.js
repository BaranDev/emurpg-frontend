import { useState, useCallback } from "react";

/**
 * Hook to manage toast notifications.
 * returns {Object} { toast, showToast, hideToast }
 */
export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info", // success, error, warning, info
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
