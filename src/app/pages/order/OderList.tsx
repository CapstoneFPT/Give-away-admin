import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {KTCardBody, KTIcon} from '../../../_metronic/helpers';
import {OrderApi, OrderListResponse, OrderStatus} from '../../../api';
import {dateTimeOptions, formatBalance, VNLocale} from '../utils/utils';
import {Link} from 'react-router-dom';
import {useAuth} from '../../modules/auth';
import {Content} from "../../../_metronic/layout/components/content";

type Props = {
    className: string;
};

const OrderList: React.FC<Props> = ({className}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const {currentUser} = useAuth();

    const fetchOrders = async (page: number, search: string) => {
        const orderApi = new OrderApi();
        const response = await orderApi.apiOrdersGet(
            page,
            pageSize,
            currentUser?.shopId,
            null!,
            null!,
            search
        );
        return response.data;
    };

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery(
        ['orders', currentPage, searchTerm],
        () => fetchOrders(currentPage, searchTerm),
        {
            keepPreviousData: true,
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;

    const orders = data?.items || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

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
                        <input
                            type="text"
                            className="form-control form-control-solid w-250px"
                            placeholder="Search Order Code"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <KTCardBody className="py-3">
                    <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-150px">Order Code</th>
                                <th className="min-w-140px">Customer Name</th>
                                <th className="min-w-140px">Recipient Name</th>
                                <th className="min-w-140px">Phone</th>
                                <th className="min-w-120px">Date</th>
                                <th className="min-w-120px">Total</th>
                                <th className="min-w-120px">Status</th>
                                <th className="min-w-120px">Payment Method</th>
                                <th className="min-w-120px">Shipping Address</th>
                                <th className="min-w-100px text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order: OrderListResponse) => (
                                <tr key={order.orderId}>
                                    <td>{order.orderCode}</td>
                                    <td>{order.customerName || 'N/A'}</td>
                                    <td>{order.recipientName || 'N/A'}</td>
                                    <th>{order.contactNumber || 'N/A'}</th>
                                    <td>{new Date(order.createdDate!).toLocaleString(VNLocale, dateTimeOptions)}</td>
                                    <td>{formatBalance(order.totalPrice!)} VND</td>
                                    <td>
                    <span className={`badge badge-light-${getStatusBadge(order.status!)}`}>
                      {order.status}
                    </span>
                                    </td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.address || 'N/A'}</td>
                                    <td className="text-end">
                                        <Link to={`/order-detail/${order.orderId}`}
                                              className="btn btn-sm btn-light btn-active-light-primary">
                                            <KTIcon iconName="pencil" className="fs-5"/>
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