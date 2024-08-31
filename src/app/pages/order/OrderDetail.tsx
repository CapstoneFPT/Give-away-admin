import React, { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import {
  OrderApi,
  OrderDetailedResponse,
  OrderLineItemListResponse
} from '../../../api';
import { KTCard, KTCardBody, KTIcon } from '../../../_metronic/helpers';
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
        <KTCard className="mb-5 mb-xl-8">
                <KTCardBody>
                    <div className='row g-5 g-xl-8'>
                        <div className='col-xl-6'>
                          
                            <div className='d-flex flex-wrap'>
                                
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='tag' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Order Code</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'><strong>{orderDetail ? orderDetail.orderCode : 'N/A'}</strong></div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='tag' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Total Price</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'><strong>{formatBalance(orderDetail?.totalPrice!)} VND</strong></div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='information' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Customer name: </div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'><strong>{orderDetail?.customerName}</strong></div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='status' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Status</div>
                                    </div>
                                    <div className='fs-7 mt-2'>
                                        <span
                                            className={`badge badge-light-${getStatusColor(orderDetail?.status)}`}>
                                            {orderDetail?.status}
                                        </span>
                                    </div>

                                    <div className='fs-7 mt-2'>
                                        <span
                                            className={`badge badge-light-${getStatusColor(orderDetail?.status)}`}>
                                            {orderDetail?.shippingFee}
                                        </span>
                                    </div>
                                    <div className='fs-7 mt-2'>
                                        <span
                                            className={`badge badge-light-${getStatusColor(orderDetail?.status)}`}>
                                            {orderDetail?.purchaseType}
                                        </span>
                                    </div>
                                    <div className='fs-7 mt-2'>
                                        <span
                                            className={`badge badge-light-${getStatusColor(orderDetail?.status)}`}>
                                            {orderDetail?.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='calendar-add' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Payment Date</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'>
                                       <strong> {orderDetail?.paymentDate
                                            ? new Date(orderDetail?.paymentDate!).toLocaleString()
                                            : 'N/A'}</strong>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div className='col-xl-6'>
                            <h3 className='fs-2 fw-bold mb-5'>Reciepient Information</h3>
                            <div className='d-flex flex-column'>
                                <div className='d-flex align-items-center mb-5'>
                                    <KTIcon iconName='profile-circle' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Name</div>
                                        <div className='fs-7 text-gray-600'>{orderDetail?.customerName}</div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mb-5'>
                                    <KTIcon iconName='phone' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Phone</div>
                                        <div className='fs-7 text-gray-600'>{orderDetail?.phone}</div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mb-5'>
                                    <KTIcon iconName='geolocation' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Address</div>
                                        <div className='fs-7 text-gray-600'>{orderDetail?.address}</div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <KTIcon iconName='sms' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Email</div>
                                        <div className='fs-7 text-gray-600'>{orderDetail?.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </KTCardBody>
            </KTCard>

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
const getStatusColor = (status?: string) => {
  switch (status) {
      case 'Active':
          return 'success';
      case 'Pending':
          return 'warning';
      case 'Completed':
          return 'info';
      default:
          return 'primary';
  }
};

export default OrderDetail;
