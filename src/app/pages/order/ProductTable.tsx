import React, { useEffect, useState } from "react";
import { FashionItemApi, FashionItemList } from "../../../api";
import { useAuth } from "../../modules/auth";
import { formatBalance } from "../utils/utils";

const ProductTable = ({
  selectedItems,
  setSelectedItems,
  setTotalCost
}: {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  setTotalCost: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const currentUser = useAuth().currentUser?.shopId; // Get shopId from useAuth
  const [fashionItems, setFashionItems] = useState<FashionItemList[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search input
  const [debouncedSearch, setDebouncedSearch] = useState<string>(""); // State for debounced search term
  const [currentPage, setCurrentPage] = useState<number>(1); // State for current page
  const [pageSize] = useState<number>(10); // Items per page
  const [totalCount, setTotalCount] = useState<number>(0); // Total number of items
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages

  // Function to fetch fashion items with optional search term and pagination
  const fetchFashionItems = async (searchValue?: string, page?: number) => {
    try {
      const fashionItemApi = new FashionItemApi();
      const response = await fashionItemApi.apiFashionitemsGet(
        searchValue!,
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
        page!, // Pass the current page to the API
        pageSize, // Pass the page size to the API
        null!,
        null!,
        currentUser,
        null!,
        null!
      );
      setFashionItems(response.data.items || []); // Set the fetched items to state
      setTotalCount(response.data.totalCount || 0); // Set the total count of items
      setTotalPages(response.data.totalPages || 1); // Set the total number of pages
    } catch (error) {
      console.error("Error fetching fashion items:", error);
    }
  };

  // Debounce effect for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm); // Update debounced search term after delay
      setCurrentPage(1); // Reset to the first page on search
    }, 300); // Set the debounce delay (e.g., 300ms)

    return () => clearTimeout(timer); // Clear the timer on component unmount or when searchTerm changes
  }, [searchTerm]);

  // Fetch items whenever the debounced search term or page changes
  useEffect(() => {
    fetchFashionItems(debouncedSearch, currentPage);
  }, [debouncedSearch, currentPage, currentUser]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle checkbox change
  const handleCheckboxChange = (itemId: string, itemPrice: number) => {
    setSelectedItems((prevSelectedItems) => {
      let updatedSelectedItems;
      let updatedTotalCost = 0;

      if (prevSelectedItems.includes(itemId)) {
        // Remove item if already selected and deduct its price
        updatedSelectedItems = prevSelectedItems.filter((id) => id !== itemId);
        updatedTotalCost = prevSelectedItems.reduce((acc, id) => {
          const item = fashionItems.find((i) => i.itemId === id);
          return acc + (item?.sellingPrice || 0);
        }, 0);
      } else {
        // Add item if not selected and add its price
        updatedSelectedItems = [...prevSelectedItems, itemId];
        updatedTotalCost = updatedSelectedItems.reduce((acc, id) => {
          const item = fashionItems.find((i) => i.itemId === id);
          return acc + (item?.sellingPrice || 0);
        }, 0);
      }

      setTotalCost(updatedTotalCost); // Update total cost state
      return updatedSelectedItems;
    });
  };

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
                        <strong>Price: {formatBalance(item.sellingPrice || 0)} VND</strong>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <span className="w-100 text-muted">No products selected.</span>
            )}
          </div>
          <div className="fw-bold fs-4">
            Subtotal: <span id="kt_ecommerce_edit_order_total_price">
              {formatBalance(selectedItems.reduce((acc, itemId) => {
                const item = fashionItems.find((i) => i.itemId === itemId);
                return acc + (item?.sellingPrice || 0);
              }, 0))}
            </span> VND
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
            value={searchTerm} // Bind the input to the searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on input change
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
              <th className="text-gray-800  fs-5 fw-bold"><strong>Product</strong></th>
              <th className="text-gray-800  fs-5 fw-bold"><strong>Selling Price</strong></th>
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
                      checked={selectedItems.includes(item.itemId!)} // Ensure checkbox reflects the current state
                      onChange={() => handleCheckboxChange(item.itemId!, item.sellingPrice!)}
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
                        <strong>Size: </strong>{item.size}
                      </div>
                      <div className="fw-semibold fs-7">
                        <strong>Color: </strong>{item.color}
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
                    <strong>{formatBalance(item.sellingPrice!) || 0} VND</strong>
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
            {Math.min(currentPage * pageSize, totalCount)} of{" "}
            {totalCount} entries
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
