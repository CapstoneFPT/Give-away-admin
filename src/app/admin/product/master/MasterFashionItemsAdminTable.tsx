/* eslint-disable @typescript-eslint/no-explicit-any */
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
import ExportFashionItemsToExcelModal from "./ExportFashionItemsToExcelModal";
type Props = {
  className: string;
};

const MasterFashionItemsAdminTable: React.FC<Props> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const result = useQuery(
    ["MasterFashionItems", debouncedSearchTerm, currentPage, pageSize],
    async () => {
      const fashionItemApi = new MasterItemApi();
      const response = await fashionItemApi.apiMasterItemsGet(
        searchTerm,
        null!,
        null!,
        currentPage,
        pageSize,
        null!,
        null!, // filter theo shop
        null!, // filter theo gender
        null!,
        null!
        // filter Consignmentfalse
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
    result.refetch();
  };

  const handleExport = async (filters: any) => {
    const fashionItemApi = new FashionItemApi();
    const response = await fashionItemApi.apiFashionitemsExportExcelGet(
      filters.itemCode,
      filters.shopId,
      filters.status.length > 0 ? filters.status : undefined,
      filters.type.length > 0 ? filters.type : undefined,
      filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `FashionItemsReport_${new Date().toISOString()}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
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
            className="btn btn-sm btn-light-primary me-2"
            onClick={() => setShowExportModal(true)}
          >
            <KTIcon iconName="file-down" className="fs-2" />
            Export to Excel
          </button>
          <button
            className="btn btn-sm btn-light-primary"
            onClick={handleShowAddModal}
          >
            <KTIcon iconName="plus" className="fs-2" />
            Add new master product
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
                <th className="ps-4 min-w-125px rounded-start">Product Code</th>
                <th className="min-w-200px">Shop address</th>
                <th className="min-w-50px">Image</th>
                <th className="min-w-100px">Name</th>
                <th className="min-w-50px">Gender</th>
                <th className="min-w-50px">Type</th>
                {/* <th className="min-w-200px">Description</th> */}
                <th className="min-w-25px">Stock Count</th>
                <th className="min-w-55px">In Stock</th>
                <th className="min-w-200px">Created Date</th>
                <th className="min-w-10px">Brand</th>
                <th className="min-w-100px">Action</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {result.data?.items!.map((product: MasterItemListResponse) => (
                <tr key={product.masterItemId}>
                  <td>
                    <a href="#" className="text-gray-900 fw-bold mb-1 fs-6">
                      {product.itemCode}
                    </a>
                  </td>
                  <td>{product.shopAddress}</td>

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
                    </div>
                  </td>
                  <td>
                    {" "}
                    <a href="#" className="text-gray-900 fw-bold  mb-1 fs-6">
                      {product.name}
                    </a>
                  </td>
                  <td>
                    {" "}
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.gender}
                    </span>
                  </td>
                  <td>
                    {product.isConsignment ? (
                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                        ConsignedItem
                      </span>
                    ) : (
                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                        ShopItem
                      </span>
                    )}
                  </td>
                  {/* <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.description}
                    </span>
                  </td> */}
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
                      {new Date(product.createdDate!).toLocaleString("en-US", {
                        weekday: "long", // e.g., "Monday"
                        year: "numeric", // e.g., "2024"
                        month: "long", // e.g., "September"
                        day: "numeric", // e.g., "2"
                        hour: "2-digit", // e.g., "03"
                        minute: "2-digit", // e.g., "37"
                        second: "2-digit", // e.g., "40"
                      })}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.brand}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link
                      to={`/product-admin/${product.masterItemId}`}
                      className="btn btn-success hover-rotate-end"
                    >
                      Fashion item list
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
      <ExportFashionItemsToExcelModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default MasterFashionItemsAdminTable;
