/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from "react";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { OrderDetailedResponse, OrderStatus, OrderApi } from "../../../api";
import { formatBalance, paymentMethod, purchaseType } from "../utils/utils";
import { useAuth } from "../../modules/auth";
import { useMutation } from "react-query";

const OrderDetails: React.FC<{
  orderDetail: OrderDetailedResponse | undefined;
}> = ({ orderDetail }) => {
  const { currentUser } = useAuth();

  console.log("orderDetail", orderDetail);
  const generateInvoiceMutation = useMutation(
    async () => {
      if (!orderDetail?.orderId) {
        throw new Error("Order ID is missing");
      }
      const orderApi = new OrderApi();
      return await orderApi.apiOrdersOrderIdInvoiceGet(
        orderDetail.orderId,
        currentUser != undefined ? currentUser.shopId : "",
        { responseType: "arraybuffer" }
      );
    },
    {
      onSuccess: (response) => {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        window.URL.revokeObjectURL(url);
      },
      onError: (error) => {
        console.error("Error generating invoice:", error);
      },
    }
  );

  const handleGenerateInvoice = () => {
    generateInvoiceMutation.mutate();
  };

  return (
    <KTCard className="card-flush py-4 flex-row-fluid">
      <div className="card-header">
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
                      orderDetail != undefined ? orderDetail.status ?? "Pending" : "Pending"
                    )}`}
                  >
                    {orderDetail != undefined ? orderDetail.status ?? "Pending" : "Pending"}
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
                  <strong>{orderDetail != undefined ? orderDetail.auctionTitle ?? "N/A" : "N/A"}</strong>
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
                  <span>{orderDetail != undefined ? orderDetail.quantity ?? "N/A" : "N/A"}</span>
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
                  {orderDetail != undefined ? orderDetail.createdDate
                    ? new Date(orderDetail.createdDate).toLocaleString()
                    : "N/A" : 
                    "N/A"}
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
                  {orderDetail != undefined ? orderDetail.paymentDate
                    ? new Date(orderDetail.paymentDate!).toLocaleString()
                    : "N/A" : 
                    "N/A"}
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
                  {orderDetail != undefined ? orderDetail.completedDate
                    ? new Date(orderDetail.completedDate!).toLocaleString()
                    : "N/A" : 
                    "N/A"}
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
                      orderDetail != undefined ? orderDetail.paymentMethod ?? "Cash" : "Cash"
                    )}`}
                  >
                    {orderDetail != undefined ? orderDetail.paymentMethod ?? "N/A" : "N/A"}
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
                      ? formatBalance(orderDetail.subtotal) + " VND"
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
                      ? formatBalance(orderDetail.shippingFee) + " VND"
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
                      ? formatBalance(orderDetail.discount) + " VND"
                      : "N/A"}
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
                      ? formatBalance(orderDetail.totalPrice) + " VND"
                      : "N/A"}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <button
            className="btn btn-primary"
            onClick={handleGenerateInvoice}
            disabled={
              !orderDetail?.orderId ||
              generateInvoiceMutation.isLoading ||
              orderDetail.status !== "Completed"
            }
          >
            {generateInvoiceMutation.isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Generating Invoice...
              </>
            ) : (
              "Generate Invoice"
            )}
          </button>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

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

export default OrderDetails;
