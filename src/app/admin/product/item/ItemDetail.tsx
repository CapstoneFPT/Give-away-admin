import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { FashionItemApi, FashionItemDetailResponse } from "../../../../api";
import { Content } from "../../../../_metronic/layout/components/content";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
import { formatBalance } from "../../../pages/utils/utils";
import KTInfoItem from "../../../../_metronic/helpers/components/KTInfoItem";

import "react-toastify/dist/ReactToastify.css";
import { showAlert } from "../../../../utils/Alert";

const ProductDetail: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const fashionItemApi = new FashionItemApi();
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<
    FashionItemDetailResponse | undefined,
    Error
  >(["FashionItemDetail", itemId], async () => {
    const response = await fashionItemApi.apiFashionitemsItemIdGet(itemId!);
    return response.data.data;
  });

  const mutation = useMutation(
    async () => {
      await fashionItemApi.apiFashionitemsItemidCheckAvailabilityPut(itemId!);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["FashionItemDetail", itemId]);
        showAlert(
          "success",
          `Item ${
            data?.status === "Available" ? "taken down" : "posted"
          } successfully`
        );
      },
      onError: (error) => {
        console.error("Error changing item status:", error);
        showAlert("error", `${error}`);
      },
    }
  );

  const handleStatusChange = () => {
    mutation.mutate();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <>
      <Content>
        <KTCard>
          <KTCardBody>
            <div className="row g-5 g-xl-8">
              {/* Left side - Image */}
              <div className="col-xl-7">
                <div className="d-flex">
                  <div
                    className="d-flex flex-column me-3"
                    style={{ width: "100px" }}
                  >
                    {data.images &&
                      data.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${data.name || "Product"} ${index + 1}`}
                          className={`img-thumbnail mb-3 cursor-pointer ${
                            selectedImage === image ? "border-primary" : ""
                          }`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                          onClick={() => setSelectedImage(image)}
                        />
                      ))}
                  </div>
                  <div style={{ flex: 1, marginLeft: "90px" }}>
                    <img
                      src={
                        selectedImage ||
                        (data.images && data.images.length > 0
                          ? data.images[0]
                          : "")
                      }
                      alt={`${data.name || "Product"} main`}
                      className="img-fluid rounded cursor-pointer"
                      style={{
                        maxHeight: "700px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Product Information */}
              <div className="col-xl-5">
                <h3 className="card-title align-items-start flex-column mb-5">
                  <span className="card-label fw-bold text-dark">
                    {data.name}
                  </span>
                  <span className="text-muted mt-1 fw-semibold fs-7">
                    {" "}
                    Item Code: {data.itemCode}
                  </span>
                </h3>

                <div className="d-flex flex-wrap mb-5">
                  <KTInfoItem
                    iconName="dollar"
                    title="Price"
                    value={
                      data.sellingPrice
                        ? formatBalance(data.sellingPrice) + " VND"
                        : "N/A"
                    }
                  />
                  <KTInfoItem
                    iconName="category"
                    title="Category"
                    value={data.categoryName || "N/A"}
                  />
                  <KTInfoItem
                    iconName="information"
                    title="Status"
                    value={data.status || "N/A"}
                  />
                  <KTInfoItem
                    iconName="heart"
                    title="Condition"
                    value={data.condition || "N/A"}
                  />
                  <KTInfoItem
                    iconName="tag"
                    title="Type"
                    value={data.type || "N/A"}
                  />
                  <KTInfoItem
                    iconName="user"
                    title="Gender"
                    value={data.gender || "N/A"}
                  />
                  <KTInfoItem
                    iconName="size"
                    title="Size"
                    value={data.size || "N/A"}
                  />
                  <KTInfoItem
                    iconName="size"
                    title="Color"
                    value={data.color || "N/A"}
                  />
                  <KTInfoItem
                    iconName="shop"
                    title="Brand"
                    value={data.brand || "N/A"}
                  />
                  <KTInfoItem
                    iconName="handcart"
                    title="Consignment"
                    value={data.isConsignment ? "Yes" : "No"}
                  />
                  <KTInfoItem
                    iconName="location-pin"
                    title="Shop Address"
                    value={data.shopAddress || "N/A"}
                  />
                </div>

                <div className="mt-5">
                  <button
                    onClick={handleStatusChange}
                    className={`btn ${
                      data.status === "Available" ? "btn-danger" : "btn-success"
                    } btn-sm`}
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading
                      ? "Processing..."
                      : data.status === "Available"
                      ? "Take Down Item"
                      : "Post Item"}
                  </button>
                </div>

                {data.description && (
                  <div className="mb-5 mt-5">
                    <h4 className="fw-bold mb-3">Description</h4>
                    <p>{data.description}</p>
                  </div>
                )}

                {data.note && (
                  <div className="mt-5">
                    <h4 className="fw-bold mb-3">Notes</h4>
                    <p>{data.note}</p>
                  </div>
                )}
              </div>
            </div>
          </KTCardBody>
        </KTCard>
      </Content>
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{data.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={
                    selectedImage ||
                    (data.images && data.images.length > 0
                      ? data.images[0]
                      : "")
                  }
                  alt={`${data.name || "Product"} full`}
                  className="img-fluid"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
