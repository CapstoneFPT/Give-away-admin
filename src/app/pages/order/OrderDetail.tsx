import React, { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import {
  OrderApi,
  OrderDetailedResponse,
  OrderLineItemListResponse
} from '../../../api';
import { KTCard, KTCardBody } from '../../../_metronic/helpers';
import { Card, Col, Row } from 'react-bootstrap';
import {  formatBalance } from '../utils/utils';
import {useAuth} from "../../modules/auth";

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetail, setOrderDetail] = useState<OrderDetailedResponse | null>(null);
  const [orderLineItem, setOrderLineItem] = useState<OrderLineItemListResponse[] | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderApi = new OrderApi();
        const orderLineItemResponse = await orderApi.apiOrdersOrderIdOrderlineitemsGet(orderId!,null!,null!,currentUser?.shopId);
        const orderDetailedResponse= await orderApi.apiOrdersOrderIdGet(orderId!);
        console.log(orderDetailedResponse);
        setOrderLineItem(orderLineItemResponse.data.items || []);
        setOrderDetail(orderDetailedResponse.data || null);
        console.log(orderLineItemResponse);
      } catch (error) {
        console.error('Failed to fetch order details', error);
      }
    };


    fetchData()

  }, [orderId]);

  if (!orderLineItem) {
    return <div>Loading...</div>;
  }

  // Extract the order information from the first object in the array

  return (
    <KTCard>
      <h1>Order Detail</h1>
        <Card className="mb-5 table-row-bordered table-row-gray-100 gs-0 gy-3">
          <Card.Body>
            <Row>
              <Col><strong>Order Code:</strong> {orderDetail ? orderDetail.orderCode : 'N/A'}</Col>
              <Col><strong>Customer Name:</strong> </Col>
            </Row>
            <Row>
              {/*<Col><strong>Created Date:</strong> {new Date(orderDetail!.c).toLocaleString(VNLocale,dateTimeOptions)}</Col>*/}
              <Col><strong>Payment Method:</strong> {orderDetail!.paymentDate}</Col>
            </Row>
            <Row>
              <Col><strong>Total:</strong> {formatBalance(orderDetail?.totalPrice || 0)} VND</Col>
              <Col><strong>Status:</strong>{orderDetail?.status} </Col>
            </Row>
          </Card.Body>
        </Card>

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
                <th className="min-w-150px">Item</th>
                <th className="min-w-120px">Quantity</th>
                <th className="min-w-120px">Price</th>
                <th className="min-w-120px">Total</th>
                <th className="min-w-100px text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderLineItem.map((item, index) => (
                <tr key={index}>
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
                    <span className="text-gray-900 fw-bold text-hover-primary fs-6">
                      {item.itemName}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-900 fw-bold text-hover-primary fs-6">
                      {item.quantity}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-900 fw-bold text-hover-primary fs-6">
                      {formatBalance(item.unitPrice!)} VND
                    </span>
                  </td>
                  <td className="text-end">
                    {/* <Link to={`/item-detail/${item.itemId}`} className="btn btn-success hover-rotate-end">
                      <KTIcon iconName="pencil" className="fs-3" />
                      Detail
                    </Link> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default OrderDetail;
