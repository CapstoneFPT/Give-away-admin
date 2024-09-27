import React, { useEffect, useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import {
  DeleteDraftItemRequest,
  FashionItemApi,
  FashionItemList,
  MasterItemApi,
} from "../../../../api";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AddFashionItem from "./AddFashionItem";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
import { showAlert } from "../../../../utils/Alert";
import { useNavigate } from "react-router-dom";
type Props = {
  className: string;
};

const FashionItemsAdminTable: React.FC<Props> = ({ className }) => {
  const { masterItemId } = useParams<{ masterItemId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const pageSize = 6; // Items per page
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const [action, setAction] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/product-admin");
  };
  const handleItemCreated = () => {
    handleCloseModal();
    setCurrentPage(1);
    queryClient.invalidateQueries(["FashionItems"]); // Invalidate query to refetch data
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);
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
  const result = useQuery(
    ["FashionItems", debouncedSearchTerm, currentPage, pageSize],
    async () => {
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
        null!, // sortBy
        false, // sortDescending
        currentPage, // pageNumber
        pageSize, // pageSize
        null!, // name
        null!, // categoryId
        null!, // shopId
        masterItemId, // masterItemId
        null! // masterItemCode
      );
      return response.data;
    },

    { refetchOnWindowFocus: false, keepPreviousData: true }
  );
  console.log(result);
  const MasterResult = useQuery(
    ["MasterFashionItemsDetail", debouncedSearchTerm, currentPage, pageSize],
    async () => {
      const fashionItemApi = new MasterItemApi();
      const response = await fashionItemApi.apiMasterItemsMasterItemIdGet(
        masterItemId ?? ""
      );
      return response.data;
    },

    { refetchOnWindowFocus: false, keepPreviousData: true }
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleSelectItem = (itemId: string) => {
    // Find the item with the matching itemId
    const selectedItem = result.data?.items?.find(
      (item) => item.itemId === itemId
    );

    // Only proceed if the item exists and its status is "Draft"
    if (selectedItem && selectedItem.status === "Draft") {
      setSelectedItems(
        (prev) =>
          prev.includes(itemId)
            ? prev.filter((id) => id !== itemId) // Deselect if already selected
            : [...prev, itemId] // Select if not selected
      );
    }
  };
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(
        result.data?.items
          ?.filter((item) => item.status === "Draft")
          .map((item) => item.itemId!) || []
      );
    } else {
      setSelectedItems([]);
    }
  };
  const handleDeleteSelected = async () => {
    const result = await showAlert(
      "warning",
      `Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`
    );

    if (result.isConfirmed) {
      try {
        const fashionItemApi = new FashionItemApi();
        const deleteRequests: DeleteDraftItemRequest[] = selectedItems.map(
          (itemId) => ({ itemId })
        );

        await fashionItemApi.apiFashionitemsDelete(deleteRequests);

        await showAlert(
          "success",
          `Successfully deleted ${selectedItems.length} item(s)`
        );
        setSelectedItems([]);
        queryClient.invalidateQueries(["FashionItems"]);
      } catch (error) {
        console.error("Error deleting items:", error);
        await showAlert("error", "Failed to delete selected items");
      }
    }
  };
  useEffect(() => {
    // Check if all products have a status other than "Available" or "Unavailable"
    const hasNoActionableProducts = result.data?.items?.every(
      (product) =>
        product.status !== "Available" && product.status !== "Unavailable"
    );

    // If no products are actionable, set action to false
    if (hasNoActionableProducts) {
      setAction(false);
    } else {
      setAction(true);
    }
  }, [result.data?.items]);
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
  const handleStatusChange = async (itemId: string) => {
    try {
      const statusApi = new FashionItemApi();
      const statusResponse =
        await statusApi.apiFashionitemsItemidCheckAvailabilityPut(itemId);

      showAlert("success", `${statusResponse.data.messages}`);
      queryClient.invalidateQueries(["FashionItems"]);
      return statusResponse;
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };
  if (result.isLoading) return <div>Loading...</div>;
  if (result.error)
    return <div>An error occurred: {(result.error as Error).message}</div>;

  const totalItems = result.data?.totalCount || 0;
  const totalPages = result.data?.totalPages || 1;

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <div className="card-toolbar d-flex align-items-center">
          <div className="d-flex align-items-center">
            {/* Back Button */}
            <button
              className="btn btn-sm btn-light-primary d-flex align-items-center me-2"
              onClick={handleRedirect}
            >
              Back
            </button>
          </div>

          {/* Search Input */}
          <form
            onSubmit={handleSearch}
            className="d-flex flex-grow-1 align-items-center mx-2"
          >
            <input
              type="text"
              className="form-control form-control-solid w-250px"
              placeholder="Search by item code"
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
          </form>

          {/* Add New Item Link */}
          {!MasterResult.data?.isConsignment && (
            <a
              href="#"
              className="btn btn-sm btn-light-primary d-flex align-items-center"
              onClick={(e) => {
                e.preventDefault(); // Prevent the default anchor behavior
                handleOpenModal();
              }}
            >
              <KTIcon iconName="plus" className="fs-2 me-2" />
              Add new item
            </a>
          )}
        </div>
      </div>
      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <div className="row g-5 g-xl-8">
            <div className="col-xl-6">
              <h3 className="fs-2 fw-bold mb-5">Master Item Details</h3>
              <div className="d-flex flex-wrap">
                <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="calendar"
                      className="fs-3 text-primary me-2"
                    />
                    <div className="fs-6 text-gray-800 fw-bold">Date Added</div>
                  </div>
                  <div className="fs-7 text-gray-600 mt-2">
                    {MasterResult.data?.createdDate
                      ? new Date(MasterResult.data.createdDate).toLocaleString()
                      : "NA"}
                  </div>
                </div>
                <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="tag" className="fs-3 text-primary me-2" />
                    <div className="fs-6 text-gray-800 fw-bold">
                      Master Item Code
                    </div>
                  </div>
                  <div className="fs-7 text-gray-600 mt-2">
                    {MasterResult.data?.masterItemCode}
                  </div>
                </div>
                <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="information"
                      className="fs-3 text-primary me-2"
                    />
                    <div className="fs-6 text-gray-800 fw-bold">
                      {" "}
                      Stock Count
                    </div>
                  </div>
                  <div className="fs-7 text-gray-600 mt-2">
                    {MasterResult.data?.stockCount}
                  </div>
                </div>
                <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="information"
                      className="fs-3 text-primary me-2"
                    />
                    <div className="fs-6 text-gray-800 fw-bold">Name</div>
                  </div>
                  <div className="fs-7 mt-2">
                    <span>{MasterResult.data?.name}</span>
                  </div>
                </div>
                <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="information"
                      className="fs-3 text-primary me-2"
                    />
                    <div className="fs-6 text-gray-800 fw-bold">Brand</div>
                  </div>
                  <div className="fs-7 text-gray-600 mt-2">
                    {MasterResult.data?.brand}
                  </div>
                </div>
                <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div className="d-flex align-items-center">
                    <KTIcon
                      iconName="user"
                      className="fs-3 text-primary me-2"
                    />
                    <div className="fs-6 text-gray-800 fw-bold">Gender</div>
                  </div>
                  <div className="fs-7 text-gray-600 mt-2">
                    {MasterResult.data?.gender}
                  </div>
                </div>
                {MasterResult.data?.isConsignment ? (
                  // Render ConsignedItem when isConsignment is true
                  <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="information"
                        className="fs-3 text-primary me-2"
                      />
                      <div className="fs-6 text-gray-800 fw-bold">Type </div>
                    </div>
                    <div className="fs-7 text-gray-600 mt-2">
                      Consigned Item
                    </div>
                  </div>
                ) : (
                  // Render ShopItem when isConsignment is false
                  <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="information"
                        className="fs-3 text-primary me-2"
                      />
                      <div className="fs-6 text-gray-800 fw-bold">Type </div>
                    </div>
                    <div className="fs-7 text-gray-600 mt-2">Shop Item</div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-xl-6">
              <div className="row g-5 g-xl-8 mt-5">
                <div className="col-xl-12">
                  <KTCard>
                    <KTCardBody>
                      <h3 className="fs-2 fw-bold mb-5">Master Image</h3>
                      <div className="d-flex flex-wrap gap-3">
                        {MasterResult.data?.images?.map((image, index) => (
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
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Fashion Items List
          </span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Over {totalItems} products
          </span>
        </h3>
      </div>
      <div className="card-body py-2">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="w-30px ps-3 pe-3 text-center">
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        selectedItems.length === result.data?.items?.length
                      }
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="min-w-125px">Item Code</th>
                <th className="min-w-200px">Product</th>
                <th className="min-w-150px">Type</th>
                <th className="min-w-125px">Selling Price</th>
                <th className="min-w-125px">Condition</th>
                <th className="min-w-150px text-center">Status</th>
                <th className="min-w-100px">Detail</th>
                {action && <th className="min-w-100px text-center">Action</th>}
              </tr>
            </thead>
            <tbody>
              {result.data?.items?.map((product: FashionItemList) => (
                <tr key={product.itemId}>
                  {product.status === "Draft" ? (
                    <td className="ps-3 pe-3 text-center">
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedItems.includes(product.itemId!)}
                          onChange={() => handleSelectItem(product.itemId!)}
                        />
                      </div>
                    </td>
                  ) : (
                    <div></div>
                  )}

                  <td>
                    <p className="text-gray-900 fw-bold mb-1 fs-6">
                      {product.itemCode}
                    </p>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50px me-5">
                        <img
                          src={
                            product.image! ||
                            "https://firebasestorage.googleapis.com/v0/b/give-away-a58b2.appspot.com/o/images%2Fhình%20ảnh_2024-09-05_160233840.png?alt=media&token=68885ba5-2f48-49e7-892a-f547d2fe0443"
                          }
                          alt={product.name!}
                        />
                      </div>
                      <div className="d-flex justify-content-start flex-column">
                        <a
                          href="#"
                          className="text-gray-900 fw-bold  mb-1 fs-6"
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
                      {product.type || "N/A"}
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
                    <span
                      className={` text-muted fw-semibold text-muted d-block fs-7 badge badge-light-${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="center">
                    <Link
                      to={`/product-admin/item-details/${product.itemId}`}
                      className="btn btn-success hover-rotate-end"
                    >
                      Detail
                    </Link>
                  </td>
                  {product.status === "Available" ||
                  product.status === "Unavailable" ? (
                    <td className="text-end">
                      <button
                        onClick={() => handleStatusChange(product.itemId || "")}
                        className={`btn w-100 ${
                          product.status === "Available"
                            ? "btn-primary"
                            : "btn-secondary"
                        }`}
                      >
                        {product.status === "Available" ? "Take Down" : "Post"}
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center">
        <div>
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            Delete Selected ({selectedItems.length})
          </button>
        </div>
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
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
