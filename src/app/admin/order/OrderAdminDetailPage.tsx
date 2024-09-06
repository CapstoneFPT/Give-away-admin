import React from "react";
import { useParams } from "react-router-dom";
import {
  OrderApi,
  OrderDetailedResponse,
  OrderLineItemListResponse,
} from "../../../api";

import { Content } from "../../../_metronic/layout/components/content";

import { useQuery } from "react-query";
import OrderAdminDetails from "./OrderAdminDetails.tsx";
import CustomerDetails from "../../pages/order/CustomerDetails.tsx";
import OrderLineAdminItems from "./OrderLineAdminItems.tsx";

const OrderAdminDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: orderAdminDetail, isLoading: isOrderDetailLoading } = useQuery<
    OrderDetailedResponse,
    Error
  >(["orderAdminDetail", orderId], async () => {
    const orderApi = new OrderApi();
    const response = await orderApi.apiOrdersOrderIdGet(orderId!);
    return response.data;
  });

  const { data: orderLineAdminItems, isLoading: isOrderLineItemsLoading } =
    useQuery<OrderLineItemListResponse[]>(
      ["orderLineItems", orderId],
      async () => {
        const orderApi = new OrderApi();
        const response = await orderApi.apiOrdersOrderIdOrderlineitemsGet(
          orderId!,
          null!,
          null!,
          null!
        );
        return response.data.items || [];
      }
    );

  if (isOrderDetailLoading || isOrderLineItemsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Content>
      <div className="d-flex flex-column gap-7 gap-lg-10">
        <div className="d-flex flex-wrap flex-stack gap-5 gap-lg-10">
          <h1 className="fw-bold my-2">Order {orderAdminDetail?.orderCode}</h1>
        </div>

        <div className="d-flex flex-column flex-xl-row gap-7 gap-lg-10">
          <OrderAdminDetails orderAdminDetail={orderAdminDetail} />
          <CustomerDetails orderDetail={orderAdminDetail} />
        </div>

        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="kt_ecommerce_sales_order_summary"
            role="tab-panel"
          >
            <div className="d-flex flex-column gap-7 gap-lg-10">
              <OrderLineAdminItems
                items={orderLineAdminItems || []}
                orderDetail={orderAdminDetail || {}}
              />
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="kt_ecommerce_sales_order_history"
            role="tab-panel"
          >
            <div className="d-flex flex-column gap-7 gap-lg-10"></div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default OrderAdminDetailPage;
