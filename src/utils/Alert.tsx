import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

// Define a type for the alert options
interface AlertConfig {
  title: string;
  icon: SweetAlertIcon;
  containerClass: string;
  popupClass: string;
  titleClass: string;
  contentClass: string;
  confirmButtonClass: string;
}

// Define a map for different alert types
const alertConfigMap: Record<
  "success" | "error" | "warning" | "info",
  AlertConfig
> = {
  success: {
    title: "Success!",
    icon: "success",
    containerClass: "bg-green-100 text-green-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonClass: "bg-green-500 text-white hover:bg-green-600",
  },
  error: {
    title: "Error!",
    icon: "error",
    containerClass: "bg-red-100 text-red-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonClass: "bg-red-500 text-white hover:bg-red-600",
  },
  warning: {
    title: "Warning!",
    icon: "warning",
    containerClass: "bg-yellow-100 text-yellow-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonClass: "bg-yellow-500 text-white hover:bg-yellow-600",
  },
  info: {
    title: "Info",
    icon: "info",
    containerClass: "bg-blue-100 text-blue-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonClass: "bg-blue-500 text-white hover:bg-blue-600",
  },
};

// Create a function to show alerts
export const showAlert = (
  type: "success" | "error" | "warning" | "info",
  message: string
) => {
  const config = alertConfigMap[type];

  const swalOptions: SweetAlertOptions = {
    title: config.title,
    html: `<div class="${config.contentClass}">${message}</div>`,
    icon: config.icon,
    customClass: {
      container: config.containerClass,
      popup: config.popupClass,
      title: config.titleClass,
      confirmButton: config.confirmButtonClass,
    },
  };

  return Swal.fire(swalOptions);
};
