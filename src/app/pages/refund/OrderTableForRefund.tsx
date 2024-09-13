import React from "react";
import { useQuery } from "react-query";
import { OrderApi } from "../../../api";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { formatBalance } from "../utils/utils";

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
  const orderApi = new OrderApi();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery(["orders", shopId], () =>
    orderApi.apiOrdersGet(1, 1000, shopId, null!, "Cash", "Offline")
  );

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {(error as Error).message}</div>;

  return (
    <KTCard>
      <KTCardBody>
        <div className="table-responsive">
          <table className="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th>Select</th>
                <th>Order Code</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Order Date</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default OrderTableForRefund;
