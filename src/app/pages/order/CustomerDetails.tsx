import React from "react";
import {KTCard, KTCardBody, KTIcon} from "../../../_metronic/helpers";
import {OrderDetailedResponse} from "../../../api";
import ShippingAddress from "./ShippingAddress";

const CustomerDetails: React.FC<{ orderDetail: OrderDetailedResponse | undefined }> = ({ orderDetail }) => (
    <KTCard className="card-flush py-4 flex-row-fluid">
        <div className="card-header">
            <div className="card-title">
                <h2>Customer Details</h2>
            </div>
        </div>
        <KTCardBody className="pt-0">
            <div className="table-responsive">
                <table className="table align-middle table-row-bordered mb-0 fs-6 gy-5 min-w-300px">
                    <tbody className="fw-semibold text-gray-600">
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='profile-circle' className='fs-2 me-2' />
                                Customer
                            </div>
                        </td>
                        <td className="fw-bold text-end">
                            <div className="d-flex align-items-center justify-content-end">
                                {/* Add customer avatar if available */}
                                <span>{orderDetail?.customerName}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='sms' className='fs-2 me-2' />
                                Email
                            </div>
                        </td>
                        <td className="fw-bold text-end">
                            <a href={`mailto:${orderDetail?.email}`} className="text-gray-600 text-hover-primary">
                                {orderDetail?.email}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='phone' className='fs-2 me-2' />
                                Phone
                            </div>
                        </td>
                        <td className="fw-bold text-end">{orderDetail?.phone}</td>
                    </tr>
                    <tr>
                        <td className="text-muted">
                            <div className="d-flex align-items-center">
                                <KTIcon iconName='phone' className='fs-2 me-2' />
                                Recipient Name
                            </div>
                        </td>
                        <td className="fw-bold text-end">{orderDetail?.reciepientName}</td>
                    </tr>
                   <tr>
                   <div className="d-flex flex-column flex-xl-row gap-7 gap-lg-10 mt-10">
                                <ShippingAddress orderDetail={orderDetail} />
                            </div>
                   </tr>
                    </tbody>
                </table>
            </div>
        </KTCardBody>
    </KTCard>
);

export default CustomerDetails;