import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { KTCardBody, KTIcon } from '../../../_metronic/helpers';
import { ConsignSaleApi, ConsignSaleListResponse } from '../../../api';
import { formatBalance } from "../utils/utils";
import { Link } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import axios from "axios";
import { useAuth } from "../../modules/auth";

const ConsignTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [consignorName, setConsignorName] = useState('');
    const [consignorPhone, setConsignorPhone] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState({ term: '', name: '', phone: '' });
    const { currentUser } = useAuth();
    const pageSize = 10;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch({
            term: searchTerm,
            name: consignorName,
            phone: consignorPhone
        }), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, consignorName, consignorPhone]);

    const { data, isLoading, error } = useQuery(
        ['Consign', debouncedSearch, currentPage, pageSize],
        async () => {
            try {
                const consignSaleApi = new ConsignSaleApi();
                const response = await consignSaleApi.apiConsignsalesGet(
                    currentPage, pageSize, currentUser?.shopId, debouncedSearch.term, null!, null!, null!, null!, null!, debouncedSearch.name, debouncedSearch.phone
                );

                if (!response || !response.data) {
                    throw new Error('No data received from the API');
                }

                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        console.error('Error data:', error.response.data);
                        console.error('Error status:', error.response.status);
                        console.error('Error headers:', error.response.headers);
                        throw new Error(`API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                    } else if (error.request) {
                        console.error('Error request:', error.request);
                        throw new Error('No response received from the server');
                    } else {
                        console.error('Error message:', error.message);
                        throw new Error(`Request setup error: ${error.message}`);
                    }
                } else {
                    console.error('Non-Axios error:', error);
                    throw new Error('An unexpected error occurred');
                }
            }
        },
        { refetchOnWindowFocus: false, keepPreviousData: true }
    );

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'consignSaleCode':
                setSearchTerm(value);
                break;
            case 'consignorName':
                setConsignorName(value);
                break;
            case 'consignorPhone':
                setConsignorPhone(value);
                break;
        }
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <Content>
            <div className={`card`}>
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label fw-bold fs-3 mb-1">Consignment List</span>
                        <span className="text-muted mt-1 fw-semibold fs-7">
                            Total Consignments: {data?.totalCount}
                        </span>
                    </h3>
                    <div className="card-toolbar">
                        <div className='d-flex align-items-center'>
                            <input
                                type='text'
                                name='consignSaleCode'
                                className='form-control form-control-solid w-250px me-2'
                                placeholder='Search by Consignment Code'
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                            />
                            <input
                                type='text'
                                name='consignorName'
                                className='form-control form-control-solid w-225px me-2'
                                placeholder='Search by Consignor Name'
                                value={consignorName}
                                onChange={handleSearchInputChange}
                            />
                            <input
                                type='text'
                                name='consignorPhone'
                                className='form-control form-control-solid w-225px me-2'
                                placeholder='Search by Consignor Phone'
                                value={consignorPhone}
                                onChange={handleSearchInputChange}
                            />
                        </div>
                        <a href='#' className='btn btn-sm btn-light-primary'>
                            <KTIcon iconName='plus' className='fs-2'/>
                            New Consignment
                        </a>
                    </div>
                </div>

                <KTCardBody className="py-3">
                    <div className="table-responsive">
                        <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                            <thead>
                            <tr className="fw-bold text-muted">
                                <th className="min-w-150px">Consignment Code</th>
                                <th className="min-w-140px">Type</th>
                                <th className="min-w-120px">Created Date</th>
                                <th className="min-w-120px">Start Date</th>
                                <th className="min-w-120px">End Date</th>
                                <th className="min-w-120px">Status</th>
                                <th className="min-w-120px">Method</th>
                                <th className="min-w-120px">Total Price</th>
                                <th className="min-w-120px">Sold Price</th>
                                <th className="min-w-120px">Member Received</th>
                                <th className="min-w-150px">Consignor</th>
                                <th className="min-w-120px">Phone</th>
                                <th className="min-w-100px text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data!.items?.map((consignSale: ConsignSaleListResponse) => (
                                <tr key={consignSale.consignSaleId}>
                                    <td>
                                        <a href="#" className="text-gray-900 fw-bold text-hover-primary fs-6">
                                            {consignSale.consignSaleCode}
                                        </a>
                                    </td>
                                    <td>{consignSale.type}</td>
                                    <td>{new Date(consignSale.createdDate!).toLocaleDateString()}</td>
                                    <td>{consignSale.startDate ? new Date(consignSale.startDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{consignSale.endDate ? new Date(consignSale.endDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <span className={`badge badge-light-${getStatusColor(consignSale.status)}`}>
                                            {consignSale.status}
                                        </span>
                                    </td>
                                    <td>{consignSale.consignSaleMethod}</td>
                                    <td><strong>{formatBalance(consignSale.totalPrice || 0)} VND</strong></td>
                                    <td>{formatBalance(consignSale.soldPrice || 0)} VND</td>
                                    <td>{formatBalance(consignSale.memberReceivedAmount || 0)} VND</td>
                                    <td>{consignSale.consginor || 'N/A'}</td>
                                    <td>{consignSale.phone || 'N/A'}</td>
                                    <td className="text-end">
                                        <Link
                                            to={`/consignment/${consignSale.consignSaleId}`}
                                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                        >
                                            <KTIcon iconName="pencil" className="fs-3"/>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </KTCardBody>
                <div className='card-footer d-flex justify-content-between align-items-center'>
                    <div>
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, data!.totalCount!)} of {data!.totalCount} entries
                    </div>
                    <div>
                        <button
                            className='btn btn-sm btn-light-primary me-2'
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({length: Math.min(5, data!.totalPages!)}, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`btn btn-sm ${
                                    page === currentPage ? 'btn-primary' : 'btn-light-primary'
                                } me-2`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className='btn btn-sm btn-light-primary'
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === data!.totalPages!}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
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

export default ConsignTable;