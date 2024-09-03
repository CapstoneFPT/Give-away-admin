import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { KTCardBody, KTIcon } from '../../../_metronic/helpers';
import { OrderApi, OrderListResponse, OrderStatus} from '../../../api';
import { dateTimeOptions, formatBalance, VNLocale } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { Content } from "../../../_metronic/layout/components/content";

type Props = {
    className: string;
};

type OrderSearchTerms = {
    orderCode: string;
    recipientName: string;
    phone: string;
    email: string;
    customerName: string;
}

const OrderList: React.FC<Props> = ({ className }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerms, setSearchTerms] = useState<OrderSearchTerms>({
        orderCode: '',
        recipientName: '',
        phone: '',
        email: '',
        customerName: '',
    });
    const pageSize = 10;
    const { currentUser } = useAuth();

    const fetchOrders = async (page: number, search: OrderSearchTerms) => {
        const orderApi = new OrderApi();
        const response = await orderApi.apiOrdersGet(
            page,
            pageSize,
            currentUser?.shopId,
            undefined,
            undefined,
            search.phone,
            search.recipientName,
            search.email,
            search.customerName,
            search.orderCode
        );
        return response.data;
    };

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery(
        ['orders', currentPage, searchTerms],
        () => fetchOrders(currentPage, searchTerms),
        {
            keepPreviousData: true,
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;

    const orders = data?.items || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setSearchTerms(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Content>
            <div className={`card ${className}`}>
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label fw-bold fs-3 mb-1">Recent Orders</span>
                        <span className="text-muted mt-1 fw-semibold fs-7">
                            Total Orders: {totalCount}
                        </span>
                    </h3>
                    <div className="card-toolbar">
                        {Object.entries(searchTerms).map(([key, value]) => (
                            <input
                                key={key}
                                type="text"
                                name={key}
                                className="form-control form-control-solid w-250px me-2"
                                placeholder={`Search ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                value={value}
                                onChange={handleSearchChange}
                            />
                        ))}
                    </div>
                </div>

                <KTCardBody className="py-3">
                    <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-150px">Order ID</th>
                                <th className="min-w-150px">Order Code</th>
                                <th className="min-w-120px">Quantity</th>
                                <th className="min-w-120px">Total Price</th>
                                <th className="min-w-120px">Created Date</th>
                                <th className="min-w-120px">Payment Method</th>
                                <th className="min-w-120px">Payment Date</th>
                                <th className="min-w-120px">Completed Date</th>
                                <th className="min-w-140px">Member ID</th>
                                <th className="min-w-140px">Customer Name</th>
                                <th className="min-w-140px">Recipient Name</th>
                                <th className="min-w-140px">Contact Number</th>
                                <th className="min-w-200px">Address</th>
                                <th className="min-w-140px">Email</th>
                                <th className="min-w-120px">Shipping Fee</th>
                                <th className="min-w-120px">Discount</th>
                                <th className="min-w-120px">Purchase Type</th>
                                <th className="min-w-120px">Status</th>
                                <th className="min-w-200px">Auction Title</th>
                                <th className="min-w-100px text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order: OrderListResponse) => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.orderCode}</td>
                                    <td>{order.quantity}</td>
                                    <td>{formatBalance(order.totalPrice!)} VND</td>
                                    <td>{new Date(order.createdDate!).toLocaleString(VNLocale, dateTimeOptions)}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.paymentDate ? new Date(order.paymentDate).toLocaleString(VNLocale, dateTimeOptions) : 'N/A'}</td>
                                    <td>{order.completedDate ? new Date(order.completedDate).toLocaleString(VNLocale, dateTimeOptions) : 'N/A'}</td>
                                    <td>{order.memberId || 'N/A'}</td>
                                    <td>{order.customerName || 'N/A'}</td>
                                    <td>{order.recipientName || 'N/A'}</td>
                                    <td>{order.contactNumber || 'N/A'}</td>
                                    <td>{order.address || 'N/A'}</td>
                                    <td>{order.email || 'N/A'}</td>
                                    <td>{formatBalance(order.shippingFee!)} VND</td>
                                    <td>{formatBalance(order.discount!)} VND</td>
                                    <td>{order.purchaseType}</td>
                                    <td>
                                            <span className={`badge badge-light-${getStatusBadge(order.status!)}`}>
                                                {order.status}
                                            </span>
                                    </td>
                                    <td>{order.auctionTitle || 'N/A'}</td>
                                    <td className="text-end">
                                        <Link to={`/order-detail/${order.orderId}`} className="btn btn-sm btn-light btn-active-light-primary">
                                            <KTIcon iconName="pencil" className="fs-5" />
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </KTCardBody>

                {/* Pagination */}
                <div className="card-footer d-flex justify-content-between">
                    <button
                        className="btn btn-primary"
                        onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-primary"
                        onClick={() => setCurrentPage((old) => (old < totalPages ? old + 1 : old))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </Content>
    );
};

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

export default OrderList;