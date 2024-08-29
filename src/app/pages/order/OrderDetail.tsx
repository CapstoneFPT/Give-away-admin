import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OrderApi, OrderDetailsResponse } from '../../../api';
import { KTCard, KTCardBody, KTIcon } from '../../../_metronic/helpers';
import { Card, Col, Row } from 'react-bootstrap';
import { dateTimeOptions, formatBalance, VNLocale } from '../utils/utils';

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetailsResponse[] | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderApi = new OrderApi();
        const response = await orderApi.apiOrdersOrderIdOrderdetailsGet(orderId!);
        setOrder(response.data.data?.items || []);
        console.log(response);
      } catch (error) {
        console.error('Failed to fetch order details', error);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  // Extract the order information from the first object in the array
  const orderInfo = order[0];

  return (
    <KTCard>
      <h1>Order Detail</h1>
      {orderInfo && (
        <Card className="mb-5 table-row-bordered table-row-gray-100 gs-0 gy-3">
          <Card.Body>
            <Row>
              <Col><strong>Order ID:</strong> {orderInfo.orderCode}</Col>
              <Col><strong>Customer Name:</strong> </Col>
            </Row>
            <Row>
              <Col><strong>Date:</strong> {new Date(orderInfo.createdDate!).toLocaleString(VNLocale,dateTimeOptions)}</Col>
              <Col><strong>Payment Method:</strong> {orderInfo.paymentDate}</Col>
            </Row>
            <Row>
              <Col><strong>Total:</strong> {formatBalance(orderInfo.unitPrice!)} VND</Col>
              <Col><strong>Status:</strong> </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

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
              {order.map((item, index) => (
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
                  <td>
                    <span className="text-gray-900 fw-bold text-hover-primary fs-6">
                      {/* {item.quantity * item.unitPrice} VND */}
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
