import React from "react";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { OrderDetailedResponse, OrderStatus } from "../../../api";

import {
  formatBalance,
  paymentMethod,
  purchaseType,
} from "../../pages/utils/utils";

const OrderAdminDetails: React.FC<{
  orderAdminDetail: OrderDetailedResponse | undefined;
}> = ({ orderAdminDetail }) => (
  <KTCard className="card-flush py-4 flex-row-fluid">
    <div className="card-header">
      <div className="card-title">
        <h2>Order Details ({orderAdminDetail?.orderCode})</h2>
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
                    orderAdminDetail!.status!
                  )}`}
                >
                  {orderAdminDetail?.status}
                </span>
              </td>
            </tr>
            {orderAdminDetail?.auctionTitle && (
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="truck" className="fs-2 me-2" />
                    Auction Title
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <strong>{orderAdminDetail!.auctionTitle}</strong>
                </td>
              </tr>
            )}

            <tr>
              <td className="text-muted">
                <div className="d-flex align-items-center">
                  <KTIcon iconName="truck" className="fs-2 me-2" />
                  Quanity
                </div>
              </td>
              <td className="fw-bold text-end">
                <span>{orderAdminDetail!.quantity} </span>
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
                {orderAdminDetail?.createdDate
                  ? new Date(orderAdminDetail.createdDate).toLocaleString()
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
                {orderAdminDetail?.paymentDate
                  ? new Date(orderAdminDetail.paymentDate!).toLocaleString()
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
                {orderAdminDetail?.completedDate
                  ? new Date(orderAdminDetail.completedDate!).toLocaleString()
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
                    orderAdminDetail!.paymentMethod!
                  )}`}
                >
                  {orderAdminDetail?.paymentMethod}
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
                    orderAdminDetail!.purchaseType!
                  )}`}
                >
                  {orderAdminDetail?.purchaseType}
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
                  {formatBalance(orderAdminDetail!.subtotal!)} VND
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
                  {formatBalance(orderAdminDetail!.shippingFee!)} VND
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
                  -{formatBalance(orderAdminDetail!.discount!)} VND
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
                  {formatBalance(orderAdminDetail!.totalPrice!)} VND
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </KTCardBody>
  </KTCard>
);
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

export default OrderAdminDetails;
