
// Import from Sonner instead of a custom hook
import { toast } from "sonner";

// Re-export the toast function
export { toast };

// This is a compatibility layer for any code that might be using useToast
export const useToast = () => {
  return {
    toast: toast
  };
};
