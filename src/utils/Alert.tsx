import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

// Define a type for the alert options
interface AlertConfig {
  title: string;
  iconColor: string;
  icon: SweetAlertIcon;
  containerClass: string;
  popupClass: string;
  titleClass: string;
  contentClass: string;
  confirmButtonColor: string;
  timerProgressBar: boolean;
}

// Define a map for different alert types
// Define a map for different alert types
const alertConfigMap: Record<
  "success" | "error" | "warning" | "info",
  AlertConfig
> = {
  success: {
    title: "Success!",
    iconColor: "green",
    icon: "success",
    containerClass: "bg-green-100 text-green-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonColor: "green",
    timerProgressBar: true,
  },
  error: {
    title: "Error!",
    iconColor: "red",
    icon: "error",
    containerClass: "bg-red-100 text-red-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonColor: "red",
    timerProgressBar: true,
  },
  warning: {
    title: "Warning!",
    iconColor: "#CCCC00",
    icon: "warning",
    containerClass: "bg-yellow-100 text-yellow-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonColor: "#CCCC00",
    timerProgressBar: true,
  },
  info: {
    title: "Info",
    iconColor: "#1E90FF",
    icon: "info",
    containerClass: "bg-blue-100 text-blue-800",
    popupClass: "bg-white p-6 rounded-lg shadow-lg",
    titleClass: "text-xl font-semibold",
    contentClass: "text-lg mt-2",
    confirmButtonColor: "#1E90FF",
    timerProgressBar: true,
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
    iconColor: config.iconColor,
    icon: config.icon,
    confirmButtonColor: config.confirmButtonColor,
    timerProgressBar: config.timerProgressBar,
    timer: 2000,
  };

  return Swal.fire(swalOptions);
};
