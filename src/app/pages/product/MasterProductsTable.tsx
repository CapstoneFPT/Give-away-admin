import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import {
  MasterItemApi,
  MasterItemListResponse,
  GenderType,
} from "../../../api";
import { Link } from "react-router-dom";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { Column } from "react-table";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth";

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
  const pageSize = 10;

  const fetchData = useCallback(
    async (page: number, pageSize: number, sortBy: any) => {
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
    () => fetchData(currentPage, pageSize, []),
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns: Column<MasterItemListResponse>[] = [
    {
      Header: "Item Code",
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
            <span className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
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
      Cell: ({ value }) => (value ? "Consigned Item" : "Shop Item"),
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
                placeholder="Search by Item Code"
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
          data={data?.data || []}
          totalCount={data?.totalCount || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          loading={isLoading}
          totalPages={data?.totalPages || 0}
        />
      </div>
    </Content>
  );
};

export default MasterProductsTable;
