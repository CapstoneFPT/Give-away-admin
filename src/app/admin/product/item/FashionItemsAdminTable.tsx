import React, { useEffect, useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { FashionItemApi, FashionItemList } from "../../../../api";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AddFashionItem from "./AddFashionItem";
type Props = {
  className: string;
};

const FashionItemsAdminTable: React.FC<Props> = ({ className }) => {
  const { masterItemId } = useParams<{ masterItemId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const pageSize = 10; // Items per page
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const handleItemCreated = () => {
    handleCloseModal();
    setCurrentPage(1);
    queryClient.invalidateQueries(["FashionItems"]); // Invalidate query to refetch data
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const result = useQuery(
    ["FashionItems", debouncedSearchTerm, currentPage, pageSize],
    async () => {
      const fashionItemApi = new FashionItemApi();
      const response = await fashionItemApi.apiFashionitemsGet(
        null!, // itemCode
        null!, // memberId
        null!, // gender
        null!, // color
        null!, // size
        null!, // condition
        null!, // minPrice
        null!, // maxPrice
        null!, // status
        null!, // type
        null!, // sortBy
        false, // sortDescending
        currentPage, // pageNumber
        pageSize, // pageSize
        debouncedSearchTerm, // name
        null!, // categoryId
        null!, // shopId
        masterItemId, // masterItemId
        null! // masterItemCode
      );
      return response.data;
    },

    { refetchOnWindowFocus: false, keepPreviousData: true }
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
  if (result.error)
    return <div>An error occurred: {(result.error as Error).message}</div>;

  const totalItems = result.data?.totalCount || 0;
  const totalPages = result.data?.totalPages || 1;

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Fashion Items List
          </span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Over {totalItems} products
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
          <a
            href="#"
            className="btn btn-sm btn-light-primary"
            onClick={(e) => {
              e.preventDefault(); // Prevent the default anchor behavior
              handleOpenModal();
            }}
          >
            <KTIcon iconName="plus" className="fs-2" />
            Add new item
          </a>
        </div>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-125px rounded-start">Item Code</th>
                <th className="min-w-200px">Product</th>
                <th className="min-w-200px">Description</th>
                <th className="min-w-125px">Selling Price</th>
                <th className="min-w-125px">Condition</th>
                <th className="min-w-150px">Brand</th>
                <th className="min-w-200px text-end rounded-end"></th>
              </tr>
            </thead>
            <tbody>
              {result.data?.items?.map((product: FashionItemList) => (
                <tr key={product.itemId}>
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
                        <img src={product.image!} alt={product.name || "N/A"} />
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
                      {product.note || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.sellingPrice
                        ? product.sellingPrice.toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.condition}
                    </span>
                  </td>
                  <td>
                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                      {product.brand}
                    </span>
                  </td>
                  <td className="text-end">
                    <Link
                      to={`/product-admin/item-details/${product.itemId}`}
                      className="btn btn-success hover-rotate-end"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </div>
        <div>
          <button
            className="btn btn-sm btn-light-primary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <AddFashionItem
        show={isModalVisible}
        handleClose={handleCloseModal}
        handleSave={handleItemCreated}
        handleItemCreated={handleItemCreated}
      />
    </div>
  );
};

export default FashionItemsAdminTable;
