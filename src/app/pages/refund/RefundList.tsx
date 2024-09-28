import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import {
  RefundApi,
  RefundResponse,
  RefundStatus,
  ShopApi,
  ShopDetailResponse,
} from "../../../api";
import { formatBalance } from "../utils/utils";
import { Link } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { Column } from "react-table";

const RefundList: React.FC = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState<RefundStatus | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [shops, setShops] = useState<ShopDetailResponse[]>([]);
  const { currentUser } = useAuth();
  const pageSize = 10;

  useEffect(() => {
    const shopApi = new ShopApi();
    if (currentUser?.role === "Admin") {
      shopApi.apiShopsGet().then((response) => {
        setShops(response.data.data!);
      });
    }
  }, [currentUser?.role]);

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const refundApi = new RefundApi();
        const response = await refundApi.apiRefundsGet(
          page,
          pageSize,
          currentUser?.role === "Admin" ? selectedShopId : currentUser?.shopId,
          statusFilter ? [statusFilter] : undefined,
          undefined,
          undefined,
          customerName,
          customerPhone,
          undefined,
          orderCode,
          itemCode,
          itemName
        );

        if (!response || !response.data) {
          throw new Error("No data received from the API");
        }

        return {
          data: response.data.items || [],
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    [
      currentUser?.role,
      currentUser?.shopId,
      selectedShopId,
      statusFilter,
      customerName,
      customerPhone,
      orderCode,
      itemCode,
      itemName,
    ]
  );

  const { data, isLoading, error } = useQuery(
    [
      "Refunds",
      customerName,
      customerPhone,
      statusFilter,
      orderCode,
      itemCode,
      itemName,
      currentPage,
      selectedShopId,
    ],
    async () => {
      const response = await fetchData(currentPage, pageSize)
      return response
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns: Column<RefundResponse>[] = [
    {
      Header: "Order Code",
      accessor: "orderCode",
    },
    {
      Header: "Product Code",
      accessor: "itemCode",
    },
    {
      Header: "Product Name",
      accessor: "itemName",
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
    {
      Header: "Unit Price",
      accessor: "unitPrice",
      Cell: ({ value }) => formatBalance(value || 0) + " VND",
    },
    {
      Header: "Customer Name",
      accessor: "customerName",
    },
    {
      Header: "Customer Phone",
      accessor: "customerPhone",
    },
    {
      Header: "Refund Percentage",
      accessor: "refundPercentage",
      Cell: ({ value }) => (value ? `${value}%` : "N/A"),
    },
    {
      Header: "Status",
      accessor: "refundStatus",
      Cell: ({ value }) => (
        <span className={`badge badge-light-${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Link
          to={`/refund/${row.original.refundId}`}
          className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
        >
          <KTIcon iconName="eye" className="fs-3" />
        </Link>
      ),
    },
  ];

  const getStatusColor = (status?: RefundStatus) => {
    switch (status) {
      case RefundStatus.Pending:
        return "warning";
      case RefundStatus.Approved:
        return "success";
      case RefundStatus.Rejected:
        return "danger";
      case RefundStatus.Completed:
        return "success";
      case RefundStatus.Cancelled:
        return "danger";
      default:
        return "dark";
    }
  };

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <KTCard>
        <KTCardBody>
          <div className="mb-5">
            <h3 className="card-title align-items-start flex-column mb-4">
              <span className="card-label fw-bold fs-3 mb-1">Refund List</span>
            </h3>
            <div className="d-flex flex-wrap gap-3">
              {currentUser?.role === "Admin" && (
                <div className="flex-grow-1">
                  <select
                    className="form-select form-select-solid"
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                  >
                    <option value="">All Shops</option>
                    {shops.map((shop) => (
                      <option key={shop.shopId} value={shop.shopId}>
                        {shop.address}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Search by Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Search by Customer Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <select
                  className="form-select form-select-solid"
                  value={statusFilter || ""}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as RefundStatus)
                  }
                >
                  <option value="">All Statuses</option>
                  {Object.values(RefundStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-3 mt-3">
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Search by Order Code"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Search by Product Code"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Search by Product Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <KTTable
            columns={columns}
            data={data != undefined ? data.data != undefined ? data.data || [] : [] : []}
            totalCount={data != undefined ? data.totalCount != undefined ? data.totalCount || 0 : 0 : 0}
            currentPage={currentPage}
            totalPages={data != undefined ? data.totalPages != undefined ? data.totalPages || 0 : 0 : 0}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            loading={isLoading}
          />
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default RefundList;
