import React from "react";
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "green";
    case "Cancelled":
      return "red";
    case "Pending":
      return "#FFA700"; // yellow
    case "OnDelivery":
      return "#567de8"; // blue
    case "AwaitingPayment":
      return "#e27bb1";
    default:
      return "text.secondary";
  }
};
const TransactionManagement = () => {
  return <div>TransactionManagement</div>;
};

export default TransactionManagement;
