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
    ["orders", searchTerms, paymentMethodFilter, purchaseTypeFilter, statusFilter, currentPage],
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
            <div className="card-toolbar">
              {Object.entries(searchTerms).map(([key, value]) => (
                <input
                  key={key}
                  type="text"
                  name={key}
                  className="form-control form-control-solid w-250px me-2"
                  placeholder={`Search ${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }`}
                  value={value}
                  onChange={handleSearchChange}
                />
              ))}
              <select
                className="form-select form-select-solid w-200px me-2"
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
                className="form-select form-select-solid w-200px me-2"
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
                className="form-select form-select-solid w-200px me-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
              >
                <option value="">All Statuses</option>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}z
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
