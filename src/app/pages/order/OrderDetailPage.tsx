import React from 'react';
import {useParams} from 'react-router-dom';
import {OrderApi, OrderDetailedResponse, OrderLineItemListResponse} from '../../../api';
import {useAuth} from "../../modules/auth";
import {Content} from '../../../_metronic/layout/components/content';
import OrderLineItems from "./OrderLineItems.tsx";
import {useQuery} from "react-query";
import OrderDetails from "./OrderDetails.tsx";
import CustomerDetails from "./CustomerDetails.tsx";
import ShippingAddress from "./ShippingAddress.tsx";

const OrderDetailPage: React.FC = () => {
   const {orderId} = useParams<{ orderId: string }>();
    const {currentUser} = useAuth();

    const {data: orderDetail, isLoading: isOrderDetailLoading,error : orderDetailError} = useQuery<OrderDetailedResponse, Error>(
        ['orderDetail', orderId],
        async () => {
            const orderApi = new OrderApi();
            const response = await orderApi
                .apiOrdersOrderIdGet(orderId!)
            return response.data;
            console.log(response.data)
        }
    );

    const {data: orderLineItems, isLoading: isOrderLineItemsLoading, error : orderLineItemsError} = useQuery<OrderLineItemListResponse[]>(
        ['orderLineItems', orderId],
        async () => {
            const orderApi = new OrderApi()
            const response = await orderApi.apiOrdersOrderIdOrderlineitemsGet(orderId!, null!, null!, currentUser?.shopId)
            return response.data.items || [];
        },

    );

    if (isOrderDetailLoading || isOrderLineItemsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Content>
            <div className="d-flex flex-column gap-7 gap-lg-10">
                <div className="d-flex flex-wrap flex-stack gap-5 gap-lg-10">
                    <h1 className="fw-bold my-2">Order {orderDetail?.orderCode}</h1>
                </div>

                <div className="d-flex flex-column flex-xl-row gap-7 gap-lg-10">
                    <OrderDetails orderDetail={orderDetail} />
                    <CustomerDetails orderDetail={orderDetail} />
                </div>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="kt_ecommerce_sales_order_summary" role="tab-panel">
                        <div className="d-flex flex-column gap-7 gap-lg-10">
                            <div className="d-flex flex-column flex-xl-row gap-7 gap-lg-10">
                                <ShippingAddress orderDetail={orderDetail} />
                            </div>
                            <OrderLineItems items={orderLineItems || []} orderDetail={orderDetail || {}} />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="kt_ecommerce_sales_order_history" role="tab-panel">
                        <div className="d-flex flex-column gap-7 gap-lg-10">
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
};

export default OrderDetailPage;