import { toast } from "sonner";

export const showToast = (type, message) => {
  switch (type) {
    case "success":
      return toast.success(message);
    case "error":
      return toast.error(message);
    case "warning":
      return toast.warning(message);
    case "info":
      return toast.info(message);
    default:
      return toast(message);
  }
};
