import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import {
  OrderApi,
  OrderStatus,
  PaymentMethod,
  PurchaseType,
} from "../../../api";

import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";

import orderListAdminColumns from "./OrderListAdminColumns";

type Props = {
  className: string;
};

const OrderAdminList: React.FC<Props> = ({ className }) => {
  const [searchTerms, setSearchTerms] = useState({
    orderCode: "",
    recipientName: "",
    phone: "",
    email: "",
    customerName: "",
  });
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | ""
  >("");
  const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<
    PurchaseType | ""
  >("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = useCallback(
    async (page: number, pageSize: number) => {
      const orderApi = new OrderApi();
      const response = await orderApi.apiOrdersGet(
        page,
        pageSize,
        null!,
        statusFilter || undefined,
        paymentMethodFilter || undefined,
        purchaseTypeFilter || undefined,
        searchTerms.phone,
        searchTerms.recipientName,
        searchTerms.email,
        searchTerms.customerName,
        searchTerms.orderCode
      );
      return {
        data: response.data.items || [],
        pageCount: response.data.totalPages || 0,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    },
    [searchTerms, paymentMethodFilter, purchaseTypeFilter, statusFilter]
  );

  const { data, isLoading, error } = useQuery(
    [
      "orders",
      searchTerms,
      paymentMethodFilter,
      purchaseTypeFilter,
      statusFilter,
      currentPage,
    ],
    () => fetchOrders(currentPage, pageSize),
    { keepPreviousData: true }
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchTerms((prev) => ({ ...prev, [name]: value }));
  };

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <Content>
      <KTCard className={className}>
        <KTCardBody>
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                Recent Orders
              </span>
            </h3>
          </div>
          <div className="d-flex flex-column flex-md-row gap-4 mb-5">
            <div className="d-flex flex-column flex-grow-1 gap-2">
              <div className="d-flex gap-2">
                <input
                  type="text"
                  name="orderCode"
                  className="form-control form-control-solid"
                  placeholder="Search Order Code"
                  value={searchTerms.orderCode}
                  onChange={handleSearchChange}
                />
                <input
                  type="text"
                  name="recipientName"
                  className="form-control form-control-solid"
                  placeholder="Search Recipient Name"
                  value={searchTerms.recipientName}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  name="phone"
                  className="form-control form-control-solid"
                  placeholder="Search Phone"
                  value={searchTerms.phone}
                  onChange={handleSearchChange}
                />
                <input
                  type="text"
                  name="email"
                  className="form-control form-control-solid"
                  placeholder="Search Email"
                  value={searchTerms.email}
                  onChange={handleSearchChange}
                />
              </div>
              <input
                type="text"
                name="customerName"
                className="form-control form-control-solid"
                placeholder="Search Customer Name"
                value={searchTerms.customerName}
                onChange={handleSearchChange}
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <select
                className="form-select form-select-solid"
                value={paymentMethodFilter}
                onChange={(e) =>
                  setPaymentMethodFilter(e.target.value as PaymentMethod)
                }
              >
                <option value="">All Payment Methods</option>
                {Object.values(PaymentMethod).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              <select
                className="form-select form-select-solid"
                value={purchaseTypeFilter}
                onChange={(e) =>
                  setPurchaseTypeFilter(e.target.value as PurchaseType)
                }
              >
                <option value="">All Purchase Types</option>
                {Object.values(PurchaseType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                className="form-select form-select-solid"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
              >
                <option value="">All Statuses</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <KTTable
            columns={orderListAdminColumns}
            data={data?.data || []}
            totalCount={data?.totalCount || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            loading={isLoading}
            totalPages={data?.totalPages || 0}
          />
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default OrderAdminList;
