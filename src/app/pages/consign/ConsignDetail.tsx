/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance } from "../utils/utils";
import { useConsignSale, useConsignSaleLineItems } from "./consignSaleHooks";
import { Content } from "../../../_metronic/layout/components/content";
import ConsignmentApproval from "./ConsignmentApproval.tsx";
import {ConsignSaleLineItemsListResponse, ConsignSaleLineItemStatus, ConsignSaleStatus, ConsignSaleDetailedResponse} from "../../../api";
import KTInfoItem from "../../../_metronic/helpers/components/KTInfoItem.tsx";

const getConsignSaleStatusColor = (status?: ConsignSaleStatus) => {
  switch (status) {
    case ConsignSaleStatus.Pending:
      return "warning";
    case ConsignSaleStatus.AwaitDelivery:
      return "info";
    case ConsignSaleStatus.Processing:
      return "primary";
    case ConsignSaleStatus.OnSale:
      return "success";
    case ConsignSaleStatus.Completed:
      return "success";
    case ConsignSaleStatus.Rejected:
      return "danger";
    case ConsignSaleStatus.Cancelled:
      return "dark";
    default:
      return "light";
  }
};

const getConsignSaleLineItemStatusColor = (
  status?: ConsignSaleLineItemStatus
) => {
  switch (status) {
    case ConsignSaleLineItemStatus.Pending:
      return "warning";
    case ConsignSaleLineItemStatus.AwaitDelivery:
      return "info";
    case ConsignSaleLineItemStatus.Negotiating:
      return "primary";
    case ConsignSaleLineItemStatus.Received:
      return "success";
    case ConsignSaleLineItemStatus.Returned:
      return "danger";
    case ConsignSaleLineItemStatus.ReadyForConsignSale:
      return "light";
    case ConsignSaleLineItemStatus.OnSale:
      return "success";
    default:
      return "dark";
  }
};

export const ConsignDetail: React.FC = () => {
  const { consignSaleId } = useParams<{ consignSaleId: string }>();
  const {
    data: consignSaleResponse,
    isLoading: isLoadingSale,
    error: saleError,
  } = useConsignSale(consignSaleId!);
  const {
    data: lineItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
  } = useConsignSaleLineItems(consignSaleId!);
  const [comment, setComment] = useState<string>("");

  if (!consignSaleResponse) {
    return <div>No consignment data found.</div>;
  }

  return (
    <Content>
      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <div className="row g-5 g-xl-8">
            <div className="col-xl-6">
              <h3 className="fs-2 fw-bold mb-5">Consignment Details</h3>
              <div className="d-flex flex-wrap">
                <KTInfoItem
                  iconName="calendar"
                  title="Date Added"
                  value={new Date(consignSaleResponse.createdDate!).toLocaleString()}
                />
                <KTInfoItem
                  iconName="tag"
                  title="Consignment Code"
                  value={consignSaleResponse.consignSaleCode}
                />
                <KTInfoItem
                  iconName="information"
                  title="Type"
                  value={consignSaleResponse.type}
                />
                <KTInfoItem
                  iconName="status"
                  title="Status"
                  value={
                    <span
                      className={`badge badge-light-${getConsignSaleStatusColor(
                        consignSaleResponse.status
                      )}`}
                    >
                      {consignSaleResponse.status}
                    </span>
                  }
                />
                <KTInfoItem
                  iconName="basket-ok"
                  title="Consign Sale Method"
                  value={consignSaleResponse.consignSaleMethod}
                />
                <KTInfoItem
                  iconName="calendar-add"
                  title="Start Date"
                  value={consignSaleResponse.startDate
                    ? new Date(consignSaleResponse.startDate).toLocaleString()
                    : "N/A"}
                />
                <KTInfoItem
                  iconName="calendar-tick"
                  title="End Date"
                  value={consignSaleResponse.endDate
                    ? new Date(consignSaleResponse.endDate).toLocaleString()
                    : "N/A"}
                />
              </div>
            </div>
            <div className="col-xl-6">
              <h3 className="fs-2 fw-bold mb-5">Consigner Information</h3>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-5">
                  <KTIcon
                    iconName="profile-circle"
                    className="fs-3 text-primary me-2"
                  />
                  <div className="d-flex flex-column">
                    <div className="fw-bold">Name</div>
                    <div className="fs-7 text-gray-600">
                      {consignSaleResponse.consginer}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-5">
                  <KTIcon iconName="phone" className="fs-3 text-primary me-2" />
                  <div className="d-flex flex-column">
                    <div className="fw-bold">Phone</div>
                    <div className="fs-7 text-gray-600">
                      {consignSaleResponse.phone}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-5">
                  <KTIcon
                    iconName="geolocation"
                    className="fs-3 text-primary me-2"
                  />
                  <div className="d-flex flex-column">
                    <div className="fw-bold">Address</div>
                    <div className="fs-7 text-gray-600">
                      {consignSaleResponse.address}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <KTIcon iconName="sms" className="fs-3 text-primary me-2" />
                  <div className="d-flex flex-column">
                    <div className="fw-bold">Email</div>
                    <div className="fs-7 text-gray-600">
                      {consignSaleResponse.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </KTCardBody>
      </KTCard>
      <ConsignmentApproval
        consignSale={consignSaleResponse}
        initialStatus={consignSaleResponse.status || "Pending"}
        lineItems={lineItemsResponse || []}
      />

      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <h3 className="fs-2 fw-bold mb-5">Financial Details</h3>
          <div className="d-flex flex-wrap">
            <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
              <div className="d-flex align-items-center">
                <KTIcon iconName="dollar" className="fs-3 text-primary me-2" />
                <div className="fs-6 text-gray-800 fw-bold">Total Price</div>
              </div>
              <div className="fs-2 fw-bold mt-2">
                {formatBalance(consignSaleResponse.totalPrice || 0)}
              </div>
            </div>
            <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
              <div className="d-flex align-items-center">
                <KTIcon iconName="dollar" className="fs-3 text-primary me-2" />
                <div className="fs-6 text-gray-800 fw-bold">Sold Price</div>
              </div>
              <div className="fs-2 fw-bold mt-2">
                {formatBalance(consignSaleResponse.soldPrice || 0)}
              </div>
            </div>
            <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
              <div className="d-flex align-items-center">
                <KTIcon iconName="dollar" className="fs-3 text-primary me-2" />
                <div className="fs-6 text-gray-800 fw-bold">
                  Member Received
                </div>
              </div>
              <div className="fs-2 fw-bold mt-2">
                {formatBalance(consignSaleResponse.memberReceivedAmount || 0)}
              </div>
            </div>
          </div>
        </KTCardBody>
      </KTCard>

      <KTCard>
        <KTCardBody>
          <h3 className="fs-2 fw-bold mb-5">Consignment Line Items</h3>
          <div className="table-responsive">
            <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
              <thead>
                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th>Status</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Gender</th>
                  <th>Condition</th>
                  <th>Deal Price</th>
                  <th>Expected Price</th>
                  <th>Confirmed Price</th>
                  <th>Note</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {lineItemsResponse &&
                  lineItemsResponse.map((item : ConsignSaleLineItemsListResponse) => (
                    <tr key={item.consignSaleLineItemId}>
                      <td>
                        <span
                          className={`badge badge-light-${getConsignSaleLineItemStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </td>
                      <td>{item.productName || "N/A"}</td>
                      <td>{item.brand || "N/A"}</td>
                      <td>{item.color || "N/A"}</td>
                      <td>{item.size || "N/A"}</td>
                      <td>{item.gender || "N/A"}</td>
                      <td>{item.condition || "N/A"}</td>
                      <td>
                        {item.dealPrice ? formatBalance(item.dealPrice) : "N/A"}
                      </td>
                      <td>{formatBalance(item.expectedPrice || 0)}</td>
                      <td>
                        {item.confirmedPrice
                          ? formatBalance(item.confirmedPrice)
                          : "N/A"}
                      </td>
                      <td>{item.note || "N/A"}</td>
                      <td>{new Date(item.createdDate!).toLocaleString()}</td>
                      <td className="text-end">
                        <Link
                          to={`/consignment/${consignSaleId}/line-item/${item.consignSaleLineItemId}`}
                          className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                        >
                          <KTIcon iconName="eye" className="fs-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default ConsignDetail;
