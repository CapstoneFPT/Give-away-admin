import React from "react";
import {KTCard, KTCardBody, KTIcon} from "../../../_metronic/helpers";
import {OrderDetailedResponse, OrderStatus} from "../../../api";
import { Button } from "react-bootstrap";

const OrderDetails: React.FC<{ orderDetail: OrderDetailedResponse | undefined }> = ({ orderDetail }) => (
    <KTCard className="card-flush py-4 flex-row-fluid">
        <div className="card-header">
            <div className="card-title">
                <h2>Order Details ({orderDetail?.orderCode})</h2>
            </div>
        </div>
        <KTCardBody className="pt-0">
            <div className="table-responsive">
                <table className="table align-middle table-row-bordered mb-0 fs-6 gy-5 min-w-300px">
                    <tbody className="fw-semibold text-gray-600">
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='calendar' className='fs-2 me-2' />
                                Date Added
                            </div>
                        </td>
                        <td className="fw-bold text-end">{orderDetail?.createdDate ? new Date(orderDetail.createdDate).toLocaleString() : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='wallet' className='fs-2 me-2' />
                                Payment Method
                            </div>
                        </td>
                        <td className="fw-bold text-end">
                            {orderDetail?.paymentMethod}
                            {/* Add payment method icon if available */}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='wallet' className='fs-2 me-2' />
                                Payment Method
                            </div>
                        </td>
                        <td className="fw-bold text-end">
                        <span className={`badge badge-light-${getStatusBadge(orderDetail?.status!)}`}>
                      {orderDetail?.status}
                    </span>
                            {/* Add payment method icon if available */}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='truck' className='fs-2 me-2' />
                                Shipping Method
                            </div>
                        </td>
                        <td className="fw-bold text-end">{orderDetail?.purchaseType}</td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                           <div>
                            <Button className="btn btn-warning hover-rotate-end">
                                Refund
                            </Button>
                           </div>
                        </td>
                       
                    </tr>
                    </tbody>
                </table>
            </div>
        </KTCardBody>
    </KTCard>
);
const getStatusBadge = (status: OrderStatus) => {

    switch (status) {
        case 'AwaitingPayment':
            return 'warning';
        case 'Completed':
            return 'success';
        case 'Cancelled':
            return 'danger';
        case 'Pending':
            return 'info';
        default:
            return 'secondary';
    }
};

export default OrderDetails;