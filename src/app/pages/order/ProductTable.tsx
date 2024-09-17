/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FashionItemApi, FashionItemList } from "../../../api";
import { useAuth } from "../../modules/auth";
import { formatBalance } from "../utils/utils";
import { useQuery } from "react-query";

const ProductTable = ({
  selectedItems,
  setSelectedItems,
  setTotalCost,
}: {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  setTotalCost?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const fetchFashionItems = async ({ queryKey }: any) => {
    const [searchValue, page] = queryKey;
    const fashionItemApi = new FashionItemApi();
    const response = await fashionItemApi.apiFashionitemsGet(
      searchValue,
      null!,
      null!,
      null!,
      null!,
      null!,
      null!,
      null!,
      ["Available"],
      ["ConsignedForSale", "ItemBase"],
      null!,
      null!,
      page,
      pageSize,
      null!,
      null!,
      currentUser?.shopId,
      null!,
      null!
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["fashionItems", searchTerm, currentPage],
    queryFn: fetchFashionItems,
    keepPreviousData: true,
  });

  const fashionItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (itemId: string, itemPrice: number) => {
    setSelectedItems((prevSelectedItems) => {
      let updatedSelectedItems;
      let updatedTotalCost = 0;

      if (prevSelectedItems.includes(itemId)) {
        updatedSelectedItems = prevSelectedItems.filter((id) => id !== itemId);
      } else {
        updatedSelectedItems = [...prevSelectedItems, itemId];
      }

      updatedTotalCost = updatedSelectedItems.reduce((acc, id) => {
        const item = fashionItems.find((i) => i.itemId === id);
        return acc + (item?.sellingPrice || 0);
      }, 0);

      if (setTotalCost) {
        setTotalCost(updatedTotalCost);
      }
      return updatedSelectedItems;
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="card-body pt-0">
      <div className="d-flex flex-column gap-10">
        {/* Search and Product Selection */}
        <div>
          <label className="form-label">Add products to this order</label>
          <div
            className="row row-cols-1 row-cols-xl-3 row-cols-md-2 border border-dashed rounded pt-3 pb-1 px-2 mb-5 mh-400px overflow-scroll"
            id="kt_ecommerce_edit_order_selected_products"
          >
            {selectedItems.length > 0 ? (
              fashionItems
                .filter((item) => selectedItems.includes(item.itemId!))
                .map((item: FashionItemList) => (
                  <div key={item.itemId} className="col">
                    <div className="ms-5">
                      <img
                        style={{ width: "100px", height: "100px" }}
                        src={item.image!}
                        alt={item.name!}
                        className="rounded"
                      />
                      <div className="text-gray-500 text-hover-primary fs-5 fw-bold">
                        <div className="text-gray-700 text-hover-primary fs-6 fw-bold">
                          <strong>{item.itemCode}</strong>
                        </div>
                        <div className="text-gray-700 text-hover-primary fs-6 fw-bold">
                          <strong> {item.name}</strong>
                        </div>
                      </div>
                      <div className="text-gray-700 text-hover-primary fs-6 fw-bold">
                        <strong>
                          Price: {formatBalance(item.sellingPrice || 0)} VND
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <span className="w-100 text-muted">No products selected.</span>
            )}
          </div>
          <div className="fw-bold fs-4">
            Subtotal:{" "}
            <span id="kt_ecommerce_edit_order_total_price">
              {formatBalance(
                selectedItems.reduce((acc, itemId) => {
                  const item = fashionItems.find((i) => i.itemId === itemId);
                  return acc + (item?.sellingPrice || 0);
                }, 0)
              )}
            </span>{" "}
            VND
          </div>
        </div>

        <div className="separator"></div>

        {/* Search Bar */}
        <div className="d-flex align-items-center position-relative mb-n7">
          <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <input
            type="text"
            data-kt-ecommerce-edit-order-filter="search"
            className="form-control form-control-solid w-100 w-lg-50 ps-12"
            placeholder="Search Products by Item Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Table */}
        <table
          className="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_ecommerce_edit_order_product_table"
        >
          <thead>
            <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th className="w-25px pe-2"></th>
              <th className="text-gray-800  fs-5 fw-bold">
                <strong>Product</strong>
              </th>
              <th className="text-gray-800  fs-5 fw-bold">
                <strong>Selling Price</strong>
              </th>
            </tr>
          </thead>
          <tbody className="fw-semibold text-gray-600">
            {fashionItems.map((item: FashionItemList, index) => (
              <tr key={item.itemId}>
                <td>
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={item.itemId}
                      checked={selectedItems.includes(item.itemId!)}
                      onChange={() =>
                        handleCheckboxChange(item.itemId!, item.sellingPrice!)
                      }
                    />
                  </div>
                </td>
                <td>
                  <div
                    className="d-flex align-items-center"
                    data-kt-ecommerce-edit-order-filter="product"
                    data-kt-ecommerce-edit-order-id={`product_${index}`}
                  >
                    <div className="symbol symbol-50px">
                      <img
                        style={{ width: "100px", height: "100px" }}
                        src={item.image!}
                        alt={item.name!}
                      />
                      <div className="fw-semibold fs-7">
                        <strong>{item.itemCode}</strong>
                      </div>
                      {item.name}
                    </div>
                    <div className="ms-5">
                      <div className="fw-semibold fs-7">
                        <strong>Size: </strong>
                        {item.size}
                      </div>
                      <div className="fw-semibold fs-7">
                        <strong>Color: </strong>
                        {item.color}
                      </div>
                      <div className="fw-semibold fs-7">
                        <strong>Condition: </strong> {item.condition}
                      </div>
                      <div className="fw-semibold fs-7">
                        <strong>Brand: </strong> {item.brand}
                      </div>
                      <div className="fw-semibold fs-7">
                        <strong>Gender: </strong> {item.gender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-end pe-5" data-order={item.sellingPrice}>
                  <span className="fw-bold ms-3">
                    <strong>
                      {formatBalance(item.sellingPrice!) || 0} VND
                    </strong>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            entries
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
              { length: Math.min(5, totalPages) },
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
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
