import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { KTCard, KTCardBody, KTIcon } from '../../../_metronic/helpers';
import { OrderApi, OrderListResponse, OrderStatus, PaymentMethod, PurchaseType } from '../../../api';
import { dateTimeOptions, formatBalance, paymentMethod, purchaseType, VNLocale } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth';
import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from '../../../_metronic/helpers/components/KTTable';
import { Column } from 'react-table';
import orderListColumns from './_columns';

type Props = {
    className: string;
};

const OrderList: React.FC<Props> = ({ className }) => {
    const [searchTerms, setSearchTerms] = useState({
        orderCode: '',
        recipientName: '',
        phone: '',
        email: '',
        customerName: '',
    });
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | ''>('');
    const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<PurchaseType | ''>('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
    const pageSize = 10;
    const { currentUser } = useAuth();

    const fetchOrders = useCallback(async (page: number, pageSize: number, sortBy: any) => {
        const orderApi = new OrderApi();
        const response = await orderApi.apiOrdersGet(
            page,
            pageSize,
            currentUser?.shopId,
            statusFilter || undefined,
            paymentMethodFilter || undefined,
            purchaseTypeFilter || undefined,
            searchTerms.phone,
            searchTerms.recipientName,
            searchTerms.email,
            searchTerms.customerName,
            searchTerms.orderCode,
        );
        return {
            data: response.data.items || [],
            pageCount: Math.ceil(response.data.totalCount! / pageSize),
            totalCount: response.data.totalCount!,
        };
    }, [currentUser?.shopId, searchTerms, paymentMethodFilter, purchaseTypeFilter, statusFilter]);

    const { data, isLoading, error } = useQuery(
        ['orders', searchTerms, paymentMethodFilter, purchaseTypeFilter, statusFilter],
        () => fetchOrders(1, pageSize, []),
        { keepPreviousData: true }
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchTerms(prev => ({ ...prev, [name]: value }));
    };

    

    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <Content>
            <KTCard className={className}>
                <KTCardBody>
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold fs-3 mb-1">Recent Orders</span>
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
                            <select
                                className="form-select form-select-solid w-200px me-2"
                                value={paymentMethodFilter}
                                onChange={(e) => setPaymentMethodFilter(e.target.value as PaymentMethod)}
                            >
                                <option value="">All Payment Methods</option>
                                {Object.values(PaymentMethod).map((method) => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                            <select
                                className="form-select form-select-solid w-200px me-2"
                                value={purchaseTypeFilter}
                                onChange={(e) => setPurchaseTypeFilter(e.target.value as PurchaseType)}
                            >
                                <option value="">All Purchase Types</option>
                                {Object.values(PurchaseType).map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <select
                                className="form-select form-select-solid w-200px me-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
                            >
                                <option value="">All Statuses</option>
                                {Object.values(OrderStatus).map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <KTTable
                        columns={orderListColumns}
                        data={data?.data || []}
                        totalCount={data?.totalCount || 0}
                        pageCount={data?.pageCount || 0}
                        fetchData={fetchOrders}
                        loading={isLoading}
                    />
                </KTCardBody>
            </KTCard>
        </Content>
    );
};



export default OrderList;