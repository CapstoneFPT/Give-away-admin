/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from "react";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { OrderDetailedResponse, OrderStatus } from "../../../api";

import { formatBalance, paymentMethod, purchaseType } from "../utils/utils";
import { useNavigate } from "react-router-dom";
const OrderDetails: React.FC<{
  orderDetail: OrderDetailedResponse | undefined;
}> = ({ orderDetail }) => {
  const navigate = useNavigate();
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "AwaitingPayment":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      case "Pending":
        return "info";
      default:
        return "secondary";
    }
  };
  return (
    <KTCard className="card-flush py-4 flex-row-fluid">
      <div className="card-header">
        <div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-title">
          <h2>Order Details ({orderDetail?.orderCode})</h2>
        </div>
      </div>
      <KTCardBody className="pt-0">
        <div className="table-responsive">
          <table className="table align-middle table-row-bordered mb-0 fs-6 gy-5 min-w-300px">
            <tbody className="fw-semibold text-gray-600">
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="wallet" className="fs-2 me-2" />
                    Order Status
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <span
                    className={`badge badge-light-${getStatusBadge(
                      orderDetail?.status!
                    )}`}
                  >
                    {orderDetail?.status}
                  </span>
                </td>
              </tr>

              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Auction Title
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <strong>{orderDetail?.auctionTitle || "N/A"}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Quanity
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <span>{orderDetail?.quantity ?? "N/A"} </span>
                </td>
              </tr>

              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="calendar" className="fs-2 me-2" />
                    Date Added
                  </div>
                </td>
                <td className="fw-bold text-end">
                  {orderDetail?.createdDate
                    ? new Date(orderDetail.createdDate).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="calendar" className="fs-2 me-2" />
                    Payment Date
                  </div>
                </td>
                <td className="fw-bold text-end">
                  {orderDetail?.paymentDate
                    ? new Date(orderDetail.paymentDate!).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="calendar" className="fs-2 me-2" />
                    Completed Date
                  </div>
                </td>
                <td className="fw-bold text-end">
                  {orderDetail?.status === "Completed"
                    ? new Date(orderDetail.completedDate!).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="wallet" className="fs-2 me-2" />
                    Payment Method
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <span
                    className={`badge badge-light-${paymentMethod(
                      orderDetail?.paymentMethod ?? "Cash"
                    )}`}
                  >
                    {orderDetail?.paymentMethod}
                  </span>
                </td>
              </tr>

              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Purchase Type
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <span
                    className={`badge badge-light-${purchaseType(
                      orderDetail?.purchaseType ?? "Cash"
                    )}`}
                  >
                    {orderDetail?.purchaseType}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Sub Total
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <strong>
                    {orderDetail?.subtotal
                      ? formatBalance(orderDetail.subtotal)
                      : "N/A"}
                  </strong>
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Shipping Fee
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <strong>
                    {orderDetail?.shippingFee
                      ? formatBalance(orderDetail.shippingFee)
                      : "N/A"}
                  </strong>
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Discount
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <strong style={{ color: "red" }}>
                    -
                    {orderDetail?.discount
                      ? formatBalance(orderDetail.discount)
                      : "N/A"}
                    VND
                  </strong>
                </td>
              </tr>

              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Total
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <strong>
                    {orderDetail?.totalPrice
                      ? formatBalance(orderDetail.totalPrice)
                      : "N/A"}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  );
}; // Add this closing brace

export default OrderDetails;
