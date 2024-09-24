export const formatBalance = (balance: number) => {
  return new Intl.NumberFormat("vn-VN").format(balance);
};
export const formatNumberWithDots = (number: string): string => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseFormattedNumber = (formattedNumber: string): number => {
  return parseInt(formattedNumber.replace(/\./g, ""), 10);
};
export function formatDate(
  dateValue: string | number | null | undefined
): string {
  if (!dateValue) return "N/A";
  const date = new Date(
    typeof dateValue === "number" ? dateValue * 1000 : dateValue
  );
  return date.getTime() > 0 ? date.toLocaleString() : "N/A";
}
export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export const VNLocale = "vi-VN";

export const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;

export const paymentMethod = (method: string) => {
  switch (method) {
    case "Point":
      return "warning";
    case "QRCode":
      return "info";
    case "COD":
      return "primary";
    default:
      return "secondary";
  }
};
export const purchaseType = (type: string) => {
  switch (type) {
    case "Online":
      return "primary";
    default:
      return "warning";
  }
};
