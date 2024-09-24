import React from "react";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { OrderDetailedResponse, FeedbackApi } from "../../../api";
import ShippingAddress from "./ShippingAddress";
import { useQuery } from "react-query";

const CustomerDetails: React.FC<{
  orderDetail: OrderDetailedResponse | undefined;
}> = ({ orderDetail }) => {
  const { data: feedback } = useQuery(
    ["feedback", orderDetail?.orderId],
    () => {
      if (orderDetail?.orderId) {
        const feedbackApi = new FeedbackApi();
        return feedbackApi.apiFeedbacksGet(null!, null!, orderDetail.orderId);
      }
    },
    { enabled: !!orderDetail?.orderId }
  );

  return (
    <KTCard className="card-flush py-4 flex-row-fluid mw-50">
      <div className="card-header">
        <div className="card-title">
          <h2>Customer Details</h2>
        </div>
      </div>
      <KTCardBody className="pt-0">
        <div className="table-responsive">
          <table className="table align-middle table-row-bordered mb-0 fs-6 gy-5">
            <tbody className="fw-semibold text-gray-600">
              <tr>
                <td className="text-muted w-50">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="profile-circle" className="fs-2 me-2" />
                    Customer
                  </div>
                </td>
                <td className="fw-bold text-end w-50">
                  <div className="d-flex align-items-center justify-content-end">
                    <span>{orderDetail?.customerName}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="sms" className="fs-2 me-2" />
                    Email
                  </div>
                </td>
                <td className="fw-bold text-end">
                  <a
                    href={`mailto:${orderDetail?.email}`}
                    className="text-gray-600 text-hover-primary"
                  >
                    {orderDetail?.email}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="text-muted">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="phone" className="fs-2 me-2" />
                    Phone
                  </div>
                </td>
                <td className="fw-bold text-end">{orderDetail?.phone}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <ShippingAddress orderDetail={orderDetail} />
                </td>
              </tr>
              {feedback && (
                <tr>
                  <td colSpan={2} className="p-0">
                    <table className="table table-row-bordered mb-0">
                      <tbody>
                        <tr>
                          <td className="text-muted">
                            <div className="d-flex align-items-center">
                              <KTIcon
                                iconName="message-text-2"
                                className="fs-2 me-2"
                              />
                              Feedback
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold">
                            <div className="overflow-hidden">
                              <div
                                className="max-h-100px overflow-auto p-3 border border-gray-300 rounded"
                                style={{ wordWrap: "break-word" }}
                              >
                                {feedback.data.items?.[0]?.content}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default CustomerDetails;
