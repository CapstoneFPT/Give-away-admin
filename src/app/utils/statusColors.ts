import { ConsignSaleLineItemStatus } from "../../api";

export const getConsignLineItemStatusColor = (
  status: ConsignSaleLineItemStatus
): string => {
  switch (status) {
    case ConsignSaleLineItemStatus.Received:
      return "primary";
    case ConsignSaleLineItemStatus.ReadyForConsignSale:
      return "success";
    case ConsignSaleLineItemStatus.Negotiating:
      return "warning";
    case ConsignSaleLineItemStatus.Rejected:
      return "danger";
    case ConsignSaleLineItemStatus.AwaitDelivery:
      return "info";
    default:
      return "secondary";
  }
};

export const getConsignSaleStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "primary";
    case "ReadyToSale":
      return "success";
    case "Completed":
      return "info";
    case "Cancelled":
      return "danger";
    default:
      return "secondary";
  }
};
