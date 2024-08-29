import React, { useEffect, useState } from "react";
import { KTCardBody, KTIcon } from "../../../../src/_metronic/helpers";
import { OrderApi, OrderResponse } from "../../../api";
import { dateTimeOptions, formatBalance, VNLocale } from "../utils/utils";
import { Link } from "react-router-dom";

type Props = {
  className: string;
};

const OrderList: React.FC<Props> = ({ className }) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10; // Items per page

  const fetchOrders = async (page: number, search: string) => {
    try {
      const orderApi = new OrderApi();
      const response = await orderApi.apiOrdersGet();

      setOrders(response.data.data?.items || []);
      console.log(response)

      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm);
  }, [currentPage, searchTerm]);


  const handleDetail = (order: OrderResponse) => {

    
  }

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Recent Orders</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Total Orders: {totalCount}
          </span>
        </h3>
        <div className="card-toolbar">
          {/* Additional toolbar buttons can be added here */}
        </div>
      </div>

      <KTCardBody className="card-body py-3">

        <div className="table-responsive">
          <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr className="fw-bold text-muted">
                <th className="w-25px">
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1"
                      data-kt-check="true"
                      data-kt-check-target=".widget-13-check"
                    />
                  </div>
                </th>
                <th className="min-w-150px">Order Id</th>
                <th className="min-w-140px">Customer Name</th>
                <th className="min-w-120px">Date</th>
                <th className="min-w-120px">Payment Method</th>
                <th className="min-w-120px">Total</th>
                <th className="min-w-120px">Status</th>
                <th className="min-w-100px text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input widget-13-check"
                        type="checkbox"
                        value="1"
                      />
                    </div>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary fs-6"
                    >
                      {order.orderCode}
                    </a>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                    >
                      {order.customerName}
                    </a>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                    >
                      {new Date(order.createdDate!).toLocaleString(VNLocale,dateTimeOptions)}
                    </a>
                  </td>
                  <td>
                    <span className="text-gray-900 fw-bold text-hover-primary fs-6">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="text-gray-900 fw-bold text-hover-primary fs-6">
                    <strong>{formatBalance(order.totalPrice!)} VND </strong>
                  </td>
                  <td>
                    <span
                      className={`badge badge-light-${getStatusBadge(
                        order.status!
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-end">
                  <Link to={`/order-detail/${order.orderId}`} className="btn btn-success hover-rotate-end">
                      <KTIcon iconName="pencil" className="fs-3" />
                      Detail
                    </Link>
                    
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </div>
  );
};

const getStatusBadge = (status: string) => {
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

export default OrderList;
