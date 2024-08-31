/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { ConsignSale, ConsignSaleApi } from "../../../api";
import { formatBalance } from "../utils/utils";
import { Link } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";

const ConsignTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery(
    ["Consign", debouncedSearchTerm, currentPage, pageSize],
    async () => {
      const consignSaleApi = new ConsignSaleApi();
      const response = await consignSaleApi.apiConsignsalesGet(
        currentPage,
        pageSize,
        null!,
        searchTerm,
        null!,
        null!,
        null!,
        null!,
        null!,
        null!,
        null!
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
    <Content>
      <div className={`card`}>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Consignment List
            </span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Total Consignments: {data?.totalCount}
            </span>
          </h3>
          <div className="card-toolbar">
            <form onSubmit={handleSearch} className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-solid w-250px me-2"
                placeholder="Search by Consignment Code"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </form>
            <a href="#" className="btn btn-sm btn-light-primary">
              <KTIcon iconName="plus" className="fs-2" />
              New Consignment
            </a>
          </div>
        </div>

        <KTCardBody className="py-3">
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
                  <th className="min-w-150px">Consignment Code</th>
                  <th className="min-w-140px">Type</th>
                  <th className="min-w-120px">Created Date</th>
                  <th className="min-w-120px">Status</th>
                  <th className="min-w-120px">Total Price</th>
                  <th className="min-w-100px text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data!.items?.map((consignSale: ConsignSale) => (
                  <tr key={consignSale.consignSaleId}>
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
                      <a
                        href="#"
                        className="text-gray-900 fw-bold text-hover-primary fs-6"
                      >
                        {consignSale.consignSaleCode}
                      </a>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                      >
                        {consignSale.type}
                      </a>
                    </td>
                    <td>
                      <a
                        href="#"
                        className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                      >
                        {new Date(consignSale.createdDate!).toLocaleString()}
                      </a>
                    </td>
                    <td>
                      <span
                        className={`badge badge-light-${getStatusColor(
                          consignSale.status
                        )}`}
                      >
                        {consignSale.status}
                      </span>
                    </td>
                    <td className="text-gray-900 fw-bold text-hover-primary fs-6">
                      <strong>
                        {formatBalance(consignSale.totalPrice || 0)} VND
                      </strong>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/consignment/${consignSale.consignSaleId}`}
                        className="btn btn-success hover-rotate-end"
                      >
                        <KTIcon iconName="pencil" className="fs-3" />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KTCardBody>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, data!.totalCount!)} of{" "}
            {data!.totalCount} entries
          </div>
          <div>
            <button
              className="btn btn-sm btn-light-primary me-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: data!.totalPages! }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    page === currentPage ? "btn-primary" : "btn-light-primary"
                  } me-2`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="btn btn-sm btn-light-primary"
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
    case "Active":
      return "success";
    case "Pending":
      return "warning";
    case "Completed":
      return "info";
    default:
      return "primary";
  }
};

export default ConsignTable;
