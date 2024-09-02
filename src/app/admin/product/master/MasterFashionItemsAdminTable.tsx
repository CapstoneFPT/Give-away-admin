/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import {
  FashionItemApi,
  MasterItemApi,
  MasterItemListResponse,
} from "../../../../api";
import { useQuery } from "react-query";
import AddMasterItem from "./AddMasterFashionItem";
import { Link } from "react-router-dom";
type Props = {
  className: string;
};

const MasterFashionItemsAdminTable: React.FC<Props> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const result = useQuery(
    ["FashionItems", debouncedSearchTerm, currentPage, pageSize],
    async () => {
      const fashionItemApi = new MasterItemApi();
      const response = await fashionItemApi.apiMasterItemsGet(
        searchTerm,
        null!,
        currentPage,
        pageSize
      );

      return response.data;
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );
  console.log(result);
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

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleItemCreated = () => {
    handleCloseAddModal();
  };

  if (result.isLoading) return <div>Loading...</div>;
  if (result.error)
    return <div>An error occurred: {(result.error as Error).message}</div>;

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Master Fashion Items List
          </span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Over {result.data?.totalCount} products
          </span>
        </h3>
        <div className="card-toolbar">
          <form onSubmit={handleSearch} className="d-flex align-items-center">
            <input
              type="text"
              className="form-control form-control-solid w-250px me-2"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </form>
          <button
            className="btn btn-sm btn-light-primary"
            onClick={handleShowAddModal}
          >
            <KTIcon iconName="plus" className="fs-2" />
            Add new master item
          </button>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Table container */}
        <div className="table-responsive">
          {/* begin::Table */}
          <table className="table align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-125px rounded-start">Item Code</th>
                <th className="min-w-200px">Product</th>
                <th className="min-w-200px">Description</th>
                <th className="min-w-125px">Stock Count</th>
                <th className="min-w-125px">Item In Stock</th>
                <th className="min-w-150px">Created Date</th>
                <th className="min-w-150px">Brand</th>
                <th className="min-w-200px text-end rounded-end"></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {result.data?.items!.map((product: MasterItemListResponse) => (
                <tr key={product.masterItemId}>
                  <td>
                    <a
                      href="#"
                      className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
                    >
                      {product.itemCode}
                    </a>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50px me-5">
                        <img
                          src={
                            (product.images && product.images.length > 0
                              ? product.images[0]
                              : toAbsoluteUrl(
                                  "media/stock/600x400/img-placeholder.jpg"
                                )) ??
                            toAbsoluteUrl(
                              "media/stock/600x400/img-placeholder.jpg"
                            )
                          }
                          alt={product.name || "N/A"}
                        />
                      </div>
                      <div className="d-flex justify-content-start flex-column">
                        <a
                          href="#"
                          className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
                        >
                          {product.name}
                        </a>
                        <span className="text-muted fw-semibold text-muted d-block fs-7">
                          {product.gender}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.description}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      <strong>{product.stockCount}</strong>
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      <strong>{product.itemInStock}</strong>
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {new Date(product.createdDate!).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.brand}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link
                      to={`/product-admin/product-list/list-fashion/${product.masterItemId}`}
                      className="btn btn-success hover-rotate-end"
                    >
                      Go to fashion item list
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
      {/* begin::Footer */}
      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, result!.data!.totalCount!)} of{" "}
          {result.data?.totalCount} entries
        </div>
        <div>
          <button
            className="btn btn-sm btn-light-primary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from(
            { length: result!.data!.totalPages! },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${
                page === currentPage ? "btn-primary" : "btn-light-primary"
              } me-2`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-sm btn-light-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === result!.data!.totalPages!}
          >
            Next
          </button>
        </div>
      </div>
      <AddMasterItem
        show={showAddModal}
        handleClose={handleCloseAddModal}
        handleSave={handleItemCreated}
      />
      {/* end::Footer */}
    </div>
  );
};

export default MasterFashionItemsAdminTable;
