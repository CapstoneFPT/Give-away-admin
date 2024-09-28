import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { OrderApi } from "../../../api";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { formatBalance } from "../utils/utils";
import { Pagination } from "react-bootstrap";
import { useDebounce } from "../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";

interface OrderTableProps {
  selectedOrder: string;
  setSelectedOrder: (orderId: string) => void;
  shopId: string;
}

const OrderTableForRefund: React.FC<OrderTableProps> = ({
  selectedOrder,
  setSelectedOrder,
  shopId,
}) => {
  const [page, setPage] = useState(1);
  const [searchCode, setSearchCode] = useState("");
  const pageSize = 10;
  const orderApi = new OrderApi();
  const navigate = useNavigate();

  const debouncedSearchCode = useDebounce(searchCode, 300);

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["orders", shopId, page, debouncedSearchCode],
    async () => {
      const response = await orderApi.apiOrdersGet(
        page,
        pageSize,
        shopId,
        null!,
        "Cash",
        "Offline",
        null!,
        null!,
        null!, //email
        null!, //name
        debouncedSearchCode || null!,
        false
      )
      return response
    },
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchCode]);

  useEffect(() => {
    refetch();
  }, [debouncedSearchCode, page, refetch]);

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {(error as Error).message}</div>;

  const totalPages = Math.ceil((orders?.data.totalCount || 0) / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCode(e.target.value);
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/order-detail/${orderId}`);
  };

  return (
    <KTCard>
      <KTCardBody>
        <div className="mb-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order Code"
            value={searchCode}
            onChange={handleSearchChange}
          />
        </div>
        <div className="table-responsive">
          <table className="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th>Select</th>
                <th>Order Code</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Created Date</th>
                <th>Completed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 fw-semibold">
              {orders?.data.items?.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <input
                      type="radio"
                      name="selectedOrder"
                      checked={selectedOrder === order.orderId}
                      onChange={() => setSelectedOrder(order.orderId!)}
                    />
                  </td>
                  <td>{order.orderCode}</td>
                  <td>{order.customerName}</td>
                  <td>{formatBalance(order.totalPrice || 0)} VND</td>
                  <td>{new Date(order.createdDate!).toLocaleString()}</td>
                  <td>{new Date(order.completedDate!).toLocaleString()}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewDetails(order.orderId!)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination className="mt-5 justify-content-center">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={page === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
          />
        </Pagination>
      </KTCardBody>
    </KTCard>
  );
};

export default OrderTableForRefund;
