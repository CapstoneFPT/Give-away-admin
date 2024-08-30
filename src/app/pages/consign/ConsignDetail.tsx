import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance } from "../utils/utils";
import { useConsignSale, useConsignSaleLineItems } from './consignSaleHooks';
import { Content } from "../../../_metronic/layout/components/content";
import {getMockConsignLineItems} from "./consignLineItemGenerator.ts";

export const ConsignDetail: React.FC = () => {
    const { consignSaleId } = useParams<{ consignSaleId: string }>();
    const { data: consignSaleResponse, isLoading: isLoadingSale, error: saleError } = useConsignSale(consignSaleId!);
    // const { data: lineItemsResponse, isLoading: isLoadingItems, error: itemsError } = useConsignSaleLineItems(consignSaleId!);
    const [comment, setComment] = useState<string>('');

    const lineItemsResponse = getMockConsignLineItems();

    // if (isLoadingSale || isLoadingItems) {
    //     return <div>Loading...</div>;
    // }
    //
    // if (saleError || itemsError) {
    //     return <div>Error: {(saleError as Error)?.message || (itemsError as Error)?.message}</div>;
    // }

    if (!consignSaleResponse) {
        return <div>No consignment data found.</div>;
    }

    const handleApprove = () => {
        // Implement approval logic here
        console.log('Approved with comment:', comment);
    };

    const handleReject = () => {
        // Implement rejection logic here
        console.log('Rejected with comment:', comment);
    };


    return (
        <Content>
            <KTCard className="mb-5 mb-xl-8">
                <KTCardBody>
                    <div className='row g-5 g-xl-8'>
                        <div className='col-xl-6'>
                            <h3 className='fs-2 fw-bold mb-5'>Consignment Details</h3>
                            <div className='d-flex flex-wrap'>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='calendar' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Date Added</div>
                                    </div>
                                    <div
                                        className='fs-7 text-gray-600 mt-2'>{new Date(consignSaleResponse.createdDate!).toLocaleString()}</div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='tag' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Consignment Code</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'>{consignSaleResponse.consignSaleCode}</div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='information' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Type</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'>{consignSaleResponse.type}</div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='status' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Status</div>
                                    </div>
                                    <div className='fs-7 mt-2'>
                                        <span
                                            className={`badge badge-light-${getStatusColor(consignSaleResponse.status)}`}>
                                            {consignSaleResponse.status}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='calendar-add' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>Start Date</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'>
                                        {consignSaleResponse.startDate
                                            ? new Date(consignSaleResponse.startDate).toLocaleString()
                                            : 'N/A'}
                                    </div>
                                </div>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTIcon iconName='calendar-tick' className='fs-3 text-primary me-2'/>
                                        <div className='fs-6 text-gray-800 fw-bold'>End Date</div>
                                    </div>
                                    <div className='fs-7 text-gray-600 mt-2'>
                                        {consignSaleResponse.endDate
                                            ? new Date(consignSaleResponse.endDate).toLocaleString()
                                            : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-6'>
                            <h3 className='fs-2 fw-bold mb-5'>Consigner Information</h3>
                            <div className='d-flex flex-column'>
                                <div className='d-flex align-items-center mb-5'>
                                    <KTIcon iconName='profile-circle' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Name</div>
                                        <div className='fs-7 text-gray-600'>{consignSaleResponse.consginer}</div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mb-5'>
                                    <KTIcon iconName='phone' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Phone</div>
                                        <div className='fs-7 text-gray-600'>{consignSaleResponse.phone}</div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mb-5'>
                                    <KTIcon iconName='geolocation' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Address</div>
                                        <div className='fs-7 text-gray-600'>{consignSaleResponse.address}</div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <KTIcon iconName='sms' className='fs-3 text-primary me-2'/>
                                    <div className='d-flex flex-column'>
                                        <div className='fw-bold'>Email</div>
                                        <div className='fs-7 text-gray-600'>{consignSaleResponse.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </KTCardBody>
            </KTCard>

            <KTCard className="mb-5 mb-xl-8">
                <KTCardBody>
                    <h3 className='fs-2 fw-bold mb-5'>Consignment Approval</h3>
                    <div className='row mb-5'>
                        <div className='col-12'>
                            <label htmlFor="approvalComment" className="form-label">Comment</label>
                            <textarea
                                id="approvalComment"
                                className="form-control"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Enter your comment here..."
                            ></textarea>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <button
                                className='btn btn-success me-3'
                                onClick={handleApprove}
                            >
                                <KTIcon iconName='check' className='fs-2 me-2'/>
                                Approve
                            </button>
                            <button
                                className='btn btn-danger'
                                onClick={handleReject}
                            >
                                <KTIcon iconName='cross' className='fs-2 me-2'/>
                                Reject
                            </button>
                        </div>
                    </div>
                </KTCardBody>
            </KTCard>

            <KTCard className="mb-5 mb-xl-8">
                <KTCardBody>
                    <h3 className='fs-2 fw-bold mb-5'>Financial Details</h3>
                    <div className='d-flex flex-wrap'>
                        <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                                <KTIcon iconName='dollar' className='fs-3 text-primary me-2'/>
                                <div className='fs-6 text-gray-800 fw-bold'>Total Price</div>
                            </div>
                            <div className='fs-2 fw-bold mt-2'>{formatBalance(consignSaleResponse.totalPrice || 0)}</div>
                        </div>
                        <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                                <KTIcon iconName='dollar' className='fs-3 text-primary me-2'/>
                                <div className='fs-6 text-gray-800 fw-bold'>Sold Price</div>
                            </div>
                            <div className='fs-2 fw-bold mt-2'>{formatBalance(consignSaleResponse.soldPrice || 0)}</div>
                        </div>
                        <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                            <div className='d-flex align-items-center'>
                                <KTIcon iconName='dollar' className='fs-3 text-primary me-2'/>
                                <div className='fs-6 text-gray-800 fw-bold'>Member Received</div>
                            </div>
                            <div className='fs-2 fw-bold mt-2'>{formatBalance(consignSaleResponse.memberReceivedAmount || 0)}</div>
                        </div>
                    </div>
                </KTCardBody>
            </KTCard>

            <KTCard>
                <KTCardBody>
                    <h3 className='fs-2 fw-bold mb-5'>Consignment Line Items</h3>
                    <div className='table-responsive'>
                        <table className='table align-middle table-row-dashed fs-6 gy-5 mb-0'>
                            <thead>
                            <tr className='text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0'>
                                <th>Product</th>
                                <th>Brand</th>
                                <th>Color</th>
                                <th>Size</th>
                                <th>Gender</th>
                                <th>Condition</th>
                                <th>Deal Price</th>
                                <th>Confirmed Price</th>
                                <th>Note</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody className='fw-semibold text-gray-600'>
                            {lineItemsResponse && lineItemsResponse.map((item) => (
                                <tr key={item.consignSaleLineItemId}>
                                    <td>{item.productName || 'N/A'}</td>
                                    <td>{item.brand || 'N/A'}</td>
                                    <td>{item.color || 'N/A'}</td>
                                    <td>{item.size || 'N/A'}</td>
                                    <td>{item.gender || 'N/A'}</td>
                                    <td>{item.condition || 'N/A'}</td>
                                    <td>{formatBalance(item.dealPrice || 0)}</td>
                                    <td>{item.confirmedPrice ? formatBalance(item.confirmedPrice) : 'N/A'}</td>
                                    <td>{item.note || 'N/A'}</td>
                                    <td className='text-end'>
                                        <Link
                                            to={`/consignment/${consignSaleResponse.consignSaleId}/line-item/${item.consignSaleLineItemId}`}
                                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                        >
                                            <KTIcon iconName='eye' className='fs-3'/>
                                        </Link>
                                        <Link
                                            to={`/create-item/${consignSaleResponse.consignSaleId}/line-item/${item.consignSaleLineItemId}`}
                                            className='btn btn-icon btn-bg-light btn-active-color-success btn-sm'
                                        >
                                            <KTIcon iconName='plus' className='fs-3'/>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </KTCardBody>
            </KTCard>
        </Content>
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

export default ConsignDetail;