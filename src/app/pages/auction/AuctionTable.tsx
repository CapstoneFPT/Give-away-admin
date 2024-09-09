import React, { useEffect, useState, useCallback } from "react";
import { FashionItemApi, FashionItemList } from "../../../api";
import { useAuth } from "../../modules/auth";
import { formatBalance } from "../utils/utils";

type ProductTableSingleProps = {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
};

const ProductTableSingle: React.FC<ProductTableSingleProps> = ({
  selectedItem,
  setSelectedItem,
}) => {
  const currentUser = useAuth().currentUser?.shopId;
  const [fashionItems, setFashionItems] = useState<FashionItemList[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchFashionItems = useCallback(
    async (searchValue?: string, page?: number) => {
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
          ["ConsignedForAuction"],
          null!,
          null!,
          page!,
          pageSize,
          null!,
          null!,
          currentUser,
          null!,
          null!
        );
        setFashionItems(response.data.items || []);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching fashion items:", error);
      }
    },
    [currentUser, pageSize]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchFashionItems(debouncedSearch, currentPage);
  }, [debouncedSearch, currentPage, fetchFashionItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRadioChange = (itemId: string) => {
    setSelectedItem(itemId);
  };

  return (
    <div className="card-body pt-0">
      <div className="d-flex flex-column gap-10">
        {/* Selected Item Display */}
        <div>
          <label className="form-label">Selected Item for Auction</label>
          <div className="border border-dashed rounded pt-3 pb-1 px-2 mb-5">
            {selectedItem ? (
              fashionItems
                .filter((item) => item.itemId === selectedItem)
                .map((item: FashionItemList) => (
                  <div
                    key={item.itemId}
                    className="d-flex align-items-center mb-2"
                  >
                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={item.image!}
                      alt={item.name!}
                      className="rounded me-3"
                    />
                    <div>
                      <div className="fs-5 fw-bold">{item.name}</div>
                      <div className="fs-6">
                        Item Code: <strong>{item.itemCode}</strong>
                      </div>
                      <div className="fs-6">
                        Price:{" "}
                        <strong>
                          {formatBalance(item.sellingPrice || 0)} VND
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <span className="text-muted">No item selected for auction.</span>
            )}
          </div>
        </div>

        <div className="separator"></div>

        {/* Search Bar */}
        <div className="d-flex align-items-center position-relative mb-5">
          <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <input
            type="text"
            className="form-control form-control-solid w-100 ps-12"
            placeholder="Search Products by Item Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Table */}
        <table className="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
              <th className="w-25px pe-2"></th>
              <th className="min-w-200px">Product</th>
              <th className="text-end">Initial price</th>
            </tr>
          </thead>
          <tbody className="fw-semibold text-gray-600">
            {fashionItems.map((item: FashionItemList) => (
              <tr key={item.itemId}>
                <td>
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="auctionItem"
                      value={item.itemId}
                      checked={selectedItem === item.itemId}
                      onChange={() => handleRadioChange(item.itemId!)}
                    />
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="symbol symbol-50px me-5">
                      <img src={item.image!} alt={item.name!} />
                    </div>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{item.name}</span>
                      <span className="fs-7">Code: {item.itemCode}</span>
                      <span className="fs-7">
                        Size: {item.size}, Color: {item.color}
                      </span>
                      <span className="fs-7">
                        Brand: {item.brand}, Condition: {item.condition}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-end">
                  <span className="fw-bold">
                    {formatBalance(item.sellingPrice!) || 0} VND
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center flex-wrap">
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

export default ProductTableSingle;
