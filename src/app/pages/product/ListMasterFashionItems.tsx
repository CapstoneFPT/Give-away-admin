/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { KTIcon } from "../../../_metronic/helpers";
import { FashionItemApi, MasterItemApi } from "../../../api";
import { useParams, Link } from "react-router-dom";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { showAlert } from "../../../utils/Alert";

type Props = {
  className: string;
};

const ListMasterFashionItems: React.FC<Props> = ({ className }) => {
  const { masterItemId } = useParams<{ masterItemId: string }>();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const pageSize = 10;
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean } | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      const fashionItemApi = new FashionItemApi();
      const response = await fashionItemApi.apiFashionitemsGet(
        debouncedSearchTerm, // itemCode
        null!, // memberId
        null!, // gender
        null!, // color
        null!, // size
        null!, // condition
        null!, // minPrice
        null!, // maxPrice
        null!, // status
        null!, // type
        sortBy?.id || null!, // sortBy
        sortBy?.desc || false, // sortDescending
        page, // pageNumber
        pageSize, // pageSize
        null!, // name
        null!, // categoryId
        null!, // shopId
        masterItemId, // masterItemId
        null! // masterItemCode
      );
      return response.data;
    },
    [debouncedSearchTerm, masterItemId, sortBy]
  );

  const { data, isLoading, error } = useQuery(
    ["FashionItems", debouncedSearchTerm, masterItemId, currentPage],
    () => fetchData(currentPage, pageSize),
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const masterItemQuery = useQuery(
    ["MasterFashionItemsDetail", masterItemId],
    async () => {
      const masterItemApi = new MasterItemApi();
      const response = await masterItemApi.apiMasterItemsMasterItemIdGet(
        masterItemId ?? ""
      );
      return response.data;
    },
    { refetchOnWindowFocus: false }
  );

  const postMutation = useMutation(
    (id: string) =>
      new FashionItemApi().apiFashionitemsItemidCheckAvailabilityPut(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "FashionItems",
          debouncedSearchTerm,
          masterItemId,
          currentPage,
        ]);
        showAlert("success", "Product posted successfully");
      },
    }
  );

  const takenMutation = useMutation(
    (id: string) =>
      new FashionItemApi().apiFashionitemsItemidCheckAvailabilityPut(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "FashionItems",
          debouncedSearchTerm,
          masterItemId,
          currentPage,
        ]);
        showAlert("success", "Product taken down successfully");
      },
    }
  );

  const handlePost = (id: string) => {
    postMutation.mutate(id);
  };

  const handleTaken = (id: string) => {
    takenMutation.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "OnDelivery":
        return "danger";
      case "Available":
        return "success";
      case "PendingForConsignSale":
        return "warning";
      case "PendingForAuction":
        return "warning";
      case "Unavailable":
        return "dark";
      default:
        return "primary";
    }
  };
  const getTypeColor = (type?: string) => {
    switch (type) {
      case "ConsignedForSale":
        return "info";
      case "ConsignedForAuction":
        return "warning";
      default:
        return "primary";
    }
  };
  const handleSort = (columnId: string) => {
    setSortBy((prevSort) => {
      if (prevSort && prevSort.id === columnId) {
        return { id: columnId, desc: !prevSort.desc };
      }
      return { id: columnId, desc: false };
    });
  };

  const columns = [
    {
      Header: "Product Code",
      accessor: "itemCode",
      onClick: () => handleSort("itemCode"),
    },
    {
      Header: "Product",
      accessor: "name",
      Cell: ({ row }: { row: any }) => (
        <div className="d-flex align-items-center">
          <div className="symbol symbol-50px me-5">
            <img
              src={row.original.image || "default-image-url"}
              alt={row.original.name}
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
      accessor: "note",
      Cell: ({ value }: { value: string }) => (
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          {value || "N/A"}
        </span>
      ),
    },
    {
      Header: "Selling Price",
      accessor: "sellingPrice",
      Cell: ({ value }: { value: number }) => (
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          {value ? value.toLocaleString() : "N/A"} VND
        </span>
      ),
    },
    {
      Header: "Condition",
      accessor: "condition",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: { value: string }) => (
        <span className={`badge badge-light-${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }: { value: string }) => (
        <span className={`badge badge-light-${getTypeColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      Header: "Detail",
      accessor: "itemId",
      Cell: ({ value, row }: { value: string; row: any }) => (
        <Link
          to={`/product/product-list/list-fashion/${row.original.masterItemId}/${value}`}
          className="btn btn-sm btn-light btn-active-light-primary"
        >
          View Detail
        </Link>
      ),
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ row }: { row: any }) =>
        row.original.status === "Available" ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleTaken(row.original.itemId)}
          >
            Take Down
          </button>
        ) : row.original.status === "Unavailable" ? (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handlePost(row.original.itemId)}
          >
            Post
          </button>
        ) : null,
    },
  ];

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <div className="row g-5 g-xl-8">
            <div className="col-xl-6">
              <h3 className="fs-2 fw-bold mb-5">Master Product Details</h3>
              {masterItemQuery.isLoading ? (
                <div>Loading master product details...</div>
              ) : masterItemQuery.error ? (
                <div>Error loading master product details</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                    <tbody>
                      <tr>
                        <th>Master Product Code</th>
                        <td>{masterItemQuery.data?.masterItemCode}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{masterItemQuery.data?.name}</td>
                      </tr>
                      <tr>
                        <th>Brand</th>
                        <td>{masterItemQuery.data?.brand}</td>
                      </tr>
                      <tr>
                        <th>Category</th>
                        <td>{masterItemQuery.data?.categoryName}</td>
                      </tr>
                      <tr>
                        <th>Description</th>
                        <td>{masterItemQuery.data?.description}</td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td>{masterItemQuery.data?.gender}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="col-xl-6">
              <div className="row g-5 g-xl-8 mt-5">
                <div className="col-xl-12">
                  <KTCard>
                    <KTCardBody>
                      <h3 className="fs-2 fw-bold mb-5">Master Image</h3>
                      <div className="d-flex flex-wrap gap-3">
                        {masterItemQuery.data?.images?.map((image, index) => (
                          <img
                            key={index}
                            src={image.imageUrl ?? ""}
                            alt={`Product ${index + 1}`}
                            style={{
                              width: "150px",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        ))}
                      </div>
                    </KTCardBody>
                  </KTCard>
                </div>
              </div>
            </div>
          </div>
        </KTCardBody>
      </KTCard>

      <div className={`card ${className}`}>
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Individual Products
            </span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Over {data?.totalCount || 0} products
            </span>
          </h3>
          <div className="card-toolbar">
            <div className="d-flex align-items-center position-relative">
              <KTIcon
                iconName="magnifier"
                className="fs-1 position-absolute ms-4"
              />
              <input
                type="text"
                className="form-control form-control-solid w-250px ps-12"
                placeholder="Search by Product Code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <KTTable
          columns={columns}
          data={data?.items || []}
          totalCount={data?.totalCount || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
          loading={isLoading}
        />
      </div>
    </Content>
  );
};

export default ListMasterFashionItems;
