/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance, formatDate } from "../utils/utils";
import { useConsignSale, useConsignSaleLineItems } from "./consignSaleHooks";
import { Content } from "../../../_metronic/layout/components/content";
import ConsignmentApproval from "./ConsignmentApproval.tsx";
import {
  ConsignSaleLineItemsListResponse,
  ConsignSaleLineItemStatus,
  ConsignSaleStatus,
} from "../../../api";
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
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const {
    data: consignSaleResponse,
    isLoading: isLoadingSale,
    error: saleError,
    refetch: refetchConsignSale,
  } = useConsignSale(consignSaleId!);
  const {
    data: lineItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchLineItems,
  } = useConsignSaleLineItems(consignSaleId!);

  const handleActionStart = () => {
    setIsActionInProgress(true);
  };

  const handleActionComplete = async () => {
    await Promise.all([refetchConsignSale(), refetchLineItems()]);
    setIsActionInProgress(false);
  };

  if (isLoadingSale || isLoadingItems) {
    return (
      <Content>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Content>
    );
  }

  if (saleError || itemsError) {
    return (
      <Content>
        <div className="alert alert-danger">
          Error loading data. Please try again later.
        </div>
      </Content>
    );
  }

  if (!consignSaleResponse) {
    return (
      <Content>
        <div className="alert alert-warning">No consignment data found.</div>
      </Content>
    );
  }

  return (
    <Content>
      {isActionInProgress && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
        </div>
      )}
      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <div className="row g-5 g-xl-8">
            <div className="col-xl-6">
              <h3 className="fs-2 fw-bold mb-5">Consignment Details</h3>
              <div className="d-flex flex-wrap">
                <KTInfoItem
                  iconName="calendar"
                  title="Date Added"
                  value={formatDate(consignSaleResponse.createdDate)}
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
                      className={`badge badge-${getConsignSaleStatusColor(
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
                  value={formatDate(consignSaleResponse.startDate)}
                />
                <KTInfoItem
                  iconName="calendar-tick"
                  title="End Date"
                  value={formatDate(consignSaleResponse.endDate)}
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
        onActionStart={handleActionStart}
        onActionComplete={handleActionComplete}
      />

      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <h3 className="fs-2 fw-bold mb-5">Financial Details</h3>
          <div className="d-flex flex-wrap">
            <KTInfoItem
              iconName="dollar"
              title="Sold Price"
              value={
                consignSaleResponse.soldPrice
                  ? formatBalance(consignSaleResponse.soldPrice) + " VND"
                  : "N/A"
              }
            />
            <KTInfoItem
              iconName="dollar"
              title="Member Received"
              value={
                consignSaleResponse.memberReceivedAmount
                  ? formatBalance(consignSaleResponse.memberReceivedAmount) +
                    " VND"
                  : "N/A"
              }
            />
            <KTInfoItem
              iconName="dollar"
              title="Total Price"
              value={
                consignSaleResponse.totalPrice
                  ? formatBalance(consignSaleResponse.totalPrice) + " VND"
                  : "N/A"
              }
            />
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
                  lineItemsResponse.map(
                    (item: ConsignSaleLineItemsListResponse) => (
                      <tr key={item.consignSaleLineItemId}>
                        <td>
                          <span
                            className={`badge badge-${getConsignSaleLineItemStatusColor(
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
                          {item.dealPrice
                            ? formatBalance(item.dealPrice) + " VND"
                            : "N/A"}
                        </td>
                        <td>
                          {item.expectedPrice
                            ? formatBalance(item.expectedPrice) + " VND"
                            : "N/A"}
                        </td>
                        <td>
                          {item.confirmedPrice
                            ? formatBalance(item.confirmedPrice) + " VND"
                            : "N/A"}
                        </td>
                        <td>{item.note || "N/A"}</td>
                        <td>{formatDate(item.createdDate)}</td>
                        <td className="text-end">
                          <Link
                            to={`/consignment/${consignSaleId}/line-item/${item.consignSaleLineItemId}`}
                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          >
                            <KTIcon iconName="eye" className="fs-3" />
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default ConsignDetail;
