/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import {
  MasterItemApi,
  MasterItemListResponse,
  GenderType,
  FashionItemApi,
} from "../../../api";
import { Link } from "react-router-dom";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { Column } from "react-table";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth";
import ExportFashionItemsToExcelModal from "../../admin/product/master/ExportFashionItemsToExcelModal";

type Props = {
  className: string;
};

const MasterProductsTable: React.FC<Props> = ({ className }) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchItemCode, setSearchItemCode] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [genderType, setGenderType] = useState<GenderType | "">("");
  const [isConsignment, setIsConsignment] = useState<boolean | null>(null);
  const [isLeftInStock, setIsLeftInStock] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [showExportModal, setShowExportModal] = useState(false);
  const fetchData = useCallback(
    async (page: number, pageSize: number, sortBy: string[]) => {
      const masterItemApi = new MasterItemApi();
      const response = await masterItemApi.apiMasterItemsGet(
        searchTerm,
        searchItemCode,
        brand,
        page,
        pageSize,
        categoryId,
        currentUser?.shopId,
        genderType as GenderType,
        isConsignment ?? undefined,
        isLeftInStock ?? undefined
      );
      return {
        data: response.data.items || [],
        pageCount: response.data.totalPages || 0,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    },
    [
      searchTerm,
      searchItemCode,
      brand,
      categoryId,
      currentUser?.shopId,
      genderType,
      isConsignment,
      isLeftInStock,
    ]
  );

  const { data, isLoading, error } = useQuery(
    [
      "MasterItems",
      searchTerm,
      searchItemCode,
      brand,
      categoryId,
      currentUser?.shopId,
      genderType,
      isConsignment,
      isLeftInStock,
      currentPage,
    ],
    async () => {
      const response = await fetchData(currentPage, pageSize, [])
      return response
    },
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleExport = async (filters: any) => {
    const fashionItemApi = new FashionItemApi();
    const response = await fashionItemApi.apiFashionitemsExportExcelGet(
      filters.startDate,
      filters.endDate,
      filters.itemCode,
      currentUser?.shopId,
      filters.status.length > 0 ? filters.status : undefined,
      filters.type.length > 0 ? filters.type : undefined,
      filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FashionItemsReport_${new Date().toISOString()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const columns: Column<MasterItemListResponse>[] = [
    {
      Header: "Product Code",
      accessor: "itemCode",
    },
    {
      Header: "Product Name",
      accessor: "name",
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="symbol symbol-50px me-5">
            <img
              src={
                row.original.images?.[0] ||
                toAbsoluteUrl("media/stock/600x400/img-placeholder.jpg")
              }
              alt={row.original.name || "N/A"}
            />
          </div>
          <div className="d-flex justify-content-start flex-column">
            <span className="text-gray-900 fw-bold mb-1 fs-6">
              {row.original.name}
            </span>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
              {row.original.gender}
            </span>
          </div>
        </div>
      ),
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Stock Count",
      accessor: "stockCount",
    },
    {
      Header: "In Stock",
      accessor: "itemInStock",
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      Cell: ({ value }) => new Date(value!).toLocaleDateString(),
    },
    // {
    //   Header: "Brand",
    //   accessor: "brand",
    // },
    // {
    //   Header: "Category",
    //   accessor: "categoryName",
    // },
    {
      Header: "Type",
      accessor: "isConsignment",
      Cell: ({ value }) => (value ? "Consigned Product" : "Shop Product"),
    },
    {
      Header: "Shop Address",
      accessor: "shopAddress",
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <Link
          to={`/product/product-list/list-fashion/${row.original.masterItemId}`}
          className="btn btn-success hover-rotate-end"
        >
          <KTIcon iconName="pencil" className="fs-3" />
          Go to list fashion
        </Link>
      ),
    },
  ];

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <div className={`card ${className}`}>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Master Products
            </span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Over {data?.totalCount || 0} products
            </span>
          </h3>
          <div className="card-toolbar">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm btn-light-primary me-2"
                onClick={() => setShowExportModal(true)}
              >
                Export to Excel
              </button>
              <select
                className="form-select form-select-solid w-250px me-2"
                onChange={(e) => setGenderType(e.target.value as GenderType)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                className="form-control form-control-solid w-250px me-2"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                className="form-control form-control-solid w-250px me-2"
                placeholder="Search by Product Code"
                value={searchItemCode}
                onChange={(e) => setSearchItemCode(e.target.value)}
              />
              {/* <input
                type="text"
                className="form-control form-control-solid w-250px me-2"
                placeholder="Search by Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              /> */}
            </div>
          </div>
        </div>

        <KTTable
          columns={columns}
          data={data != undefined ? data.data || [] : []}
          totalCount={data != undefined ? data.totalCount || 0 : 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          loading={isLoading}
          totalPages={data != undefined ? data.totalPages || 0 : 0}
        />
      </div>
      <ExportFashionItemsToExcelModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </Content>
  );
};

export default MasterProductsTable;
