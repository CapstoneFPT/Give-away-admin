import {KTCardBody, KTIcon} from "../../../_metronic/helpers";
import React, {useEffect, useState} from "react";
import {ConsignSale, ConsignSaleApi} from "../../../api";
import {useQuery} from "react-query";


const ConsignTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const pageSize = 10; // Items per page

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const result = useQuery(
        ['Consign', debouncedSearchTerm, currentPage, pageSize],
        async () => {
            const consignSaleApi = new ConsignSaleApi()
            const response = await consignSaleApi.apiConsginsalesGet(
                null!, null!, currentPage, pageSize, null!, null!, searchTerm
            );
            return response.data;
        },
        {refetchOnWindowFocus: false, keepPreviousData: true}
    );

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (result.isLoading) return <div>Loading...</div>;
    if (result.error) return <div>An error occurred: {(result.error as Error).message}</div>;

    return (
        <>
            <div className='card-header border-0 pt-5'>
                <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Consignment List</span>
                    <span
                        className='text-muted mt-1 fw-semibold fs-7'>Over {result.data?.data?.totalCount} consignments</span>
                </h3>
                <div className='card-toolbar'>
                    <form onSubmit={handleSearch} className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control form-control-solid w-250px me-2"
                            placeholder="Search by Name"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                        />
                    </form>
                    <a href='#' className='btn btn-sm btn-light-primary'>
                        <KTIcon iconName='plus' className='fs-2'/>
                        New Product
                    </a>
                </div>
            </div>
            <KTCardBody className={'py-4'}>
                <div className='table-responsive'>
                    <table
                        id='kt_table_consignments'
                        className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
                    >
                        <thead>
                        <tr className='fw-bold text-muted bg-light'>
                            <th className='ps-4 min-w-125px rounded-start'>Consignment Code</th>
                            <th className='min-w-200px'>Consignment</th>
                            <th className='min-w-200px'>Description</th>
                            <th className='min-w-125px'>Stock Count</th>
                            <th className='min-w-150px'>Created Date</th>
                            <th className='min-w-150px'>Brand</th>
                            <th className='min-w-200px text-end rounded-end'></th>
                        </tr>
                        </thead>
                        <tbody>
                        {result.data?.data?.items!.map((consignSale: ConsignSale) => (
                            <tr key={consignSale.consignSaleCode}>
                                <td>
                                    <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                                        {consignSale.consignSaleCode}
                                    </a>
                                </td>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <div className='symbol symbol-50px me-5'>
                                            {/*<img*/}
                                            {/*    src={consignSale.images![0] || toAbsoluteUrl('media/stock/600x400/img-placeholder.jpg')}*/}
                                            {/*    alt={consignSale.name || 'N/A'}*/}
                                            {/*/>*/}
                                        </div>
                                        <div className='d-flex justify-content-start flex-column'>
                                            {/*<a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>*/}
                                            {/*    {consignSale.name}*/}
                                            {/*</a>*/}
                                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                          {/*{consignSale.gender}*/}
                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      {/*{consignSale.description}*/}
                    </span>
                                </td>
                                <td>
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      {/*<strong>{consignSale.stockCount}</strong>*/}
                    </span>
                                </td>
                                <td>
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      {new Date(consignSale.createdDate!).toLocaleDateString()}
                    </span>
                                </td>
                                <td>
                                    {/*<span*/}
                                    {/*    className='text-muted fw-semibold text-muted d-block fs-7'>{consignSale.brand}</span>*/}
                                </td>
                                <td className='text-end'>
                                    <a href='#'
                                       className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                                        <KTIcon iconName='switch' className='fs-3'/>
                                    </a>
                                    <a href='#'
                                       className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                                        <KTIcon iconName='pencil' className='fs-3'/>
                                    </a>
                                    <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                                        <KTIcon iconName='trash' className='fs-3'/>
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
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, result!.data!.data!.totalCount!)} of {result.data?.data!.totalCount} entries
                </div>
                <div>
                    <button
                        className='btn btn-sm btn-light-primary me-2'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({length: result!.data!.data!.totalPages!}, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-light-primary'} me-2`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className='btn btn-sm btn-light-primary'
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === result!.data!.data!.totalPages!}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConsignTable