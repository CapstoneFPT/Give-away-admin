import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { KTCardBody, KTIcon } from '../../../_metronic/helpers';
import { ConsignSale, ConsignSaleApi } from '../../../api';
import {formatBalance} from "../utils/utils.ts";

const ConsignTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const pageSize = 10;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, error } = useQuery(
        ['Consign', debouncedSearchTerm, currentPage, pageSize],
        async () => {
            const consignSaleApi = new ConsignSaleApi();
            const response = await consignSaleApi.apiConsginsalesGet(
                null!, null!, currentPage, pageSize, null!, null!, searchTerm
            );
            return response.data;
        },
        { refetchOnWindowFocus: false, keepPreviousData: true }
    );



    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <>
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Consignment List</span>
                    <span className='text-muted mt-1 fw-semibold fs-7'>
            Over {data?.data?.totalCount} consignments
          </span>
                </h3>
                <div className='card-toolbar'>
                    <form onSubmit={handleSearch} className='d-flex align-items-center'>
                        <input
                            type='text'
                            className='form-control form-control-solid w-250px me-2'
                            placeholder='Search by Name'
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                        />
                    </form>
                    <a href='#' className='btn btn-sm btn-light-primary'>
                        <KTIcon iconName='plus' className='fs-2' />
                        New Product
                    </a>
                </div>
            </div>
            <KTCardBody className='py-4'>
                <div className='table-responsive'>
                    <table
                        id='kt_table_consignments'
                        className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
                    >
                        <thead>
                        <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                            <th className='min-w-125px'>Consignment Code</th>
                            <th className='min-w-125px'>Type</th>
                            <th className='min-w-125px'>Created Date</th>
                            <th className='min-w-125px'>Status</th>
                            <th className='min-w-125px'>Total Price</th>
                            <th className='text-end min-w-100px'>Actions</th>
                        </tr>
                        </thead>
                        <tbody className='text-gray-600 fw-semibold'>
                        {data?.data!.items?.map((consignSale: ConsignSale) => (
                            <tr key={consignSale.consignSaleId}>
                                <td>{consignSale.consignSaleCode}</td>
                                <td>{consignSale.type}</td>
                                <td>{new Date(consignSale.createdDate!).toLocaleDateString()}</td>
                                <td>
                    <span className={`badge badge-light-${getStatusColor(consignSale.status)}`}>
                      {consignSale.status}
                    </span>
                                </td>
                                <td>{formatBalance(consignSale.totalPrice || 0)} VND</td>
                                <td className='text-end'>
                                    <a
                                        href='#'
                                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    >
                                        <KTIcon iconName='switch' className='fs-3' />
                                    </a>
                                    <a
                                        href='#'
                                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    >
                                        <KTIcon iconName='pencil' className='fs-3' />
                                    </a>
                                    <a
                                        href='#'
                                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                                    >
                                        <KTIcon iconName='trash' className='fs-3' />
                                    </a>
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
                    {Math.min(currentPage * pageSize, data!.data!.totalCount!)} of {data?.data!.totalCount} entries
                </div>
                <div>
                    <button
                        className='btn btn-sm btn-light-primary me-2'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: data!.data!.totalPages! }, (_, i) => i + 1).map((page) => (
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
                        disabled={currentPage === data!.data!.totalPages!}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
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