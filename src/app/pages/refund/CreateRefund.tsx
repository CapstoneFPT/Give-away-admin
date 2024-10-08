import React, { useState, useCallback } from "react";
import { useQuery, useMutation } from "react-query";
import {
  OrderApi,
  ShopApi,
  CreateRefundByShopRequest,
  OrderDetailedResponse,
  OrderLineItemListResponse,
} from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";

import { useNavigate } from "react-router-dom";
import OrderTableForRefund from "./OrderTableForRefund";
import { useAuth } from "../../modules/auth";
import { useDropzone } from "react-dropzone";
import { showAlert } from "../../../utils/Alert";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseconfig";

const CreateRefund: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const shopId = currentUser?.shopId;

  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [refundPercentage, setRefundPercentage] = useState<number>(0);

  const orderApi = new OrderApi();
  const shopApi = new ShopApi();

  // Fetch order details for the selected order
  const { data: orderDetails } = useQuery<OrderDetailedResponse>(
    ["orderDetails", selectedOrder],
    async () => {
      const response = await orderApi.apiOrdersOrderIdGet(selectedOrder);
      return response.data;
    },
    { enabled: !!selectedOrder }
  );

  // Fetch order line items for the selected order
  const { data: orderLineItems } = useQuery<OrderLineItemListResponse[]>(
    ["orderLineItems", selectedOrder],
    async () => {
      const response = await orderApi.apiOrdersOrderIdOrderlineitemsGet(
        selectedOrder
      );
      return response.data.items || [];
    },
    { enabled: !!selectedOrder }
  );

  // Extract the items from the response

  const createRefundMutation = useMutation(
    (newRefund: CreateRefundByShopRequest) =>
      shopApi.apiShopsShopIdRefundsPost(shopId!, newRefund),

    {
      onSuccess: () => {
        showAlert("success", "Refund created successfully");
        navigate("/refund/list");
      },
      onError: (error) => {
        console.error("Error creating refund:", error);
        showAlert(
          "error",
          `Error creating refund: ${(error as Error).message}`
        );
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      showAlert("error", "Please select a product to refund");
      return;
    }

    const imageUrls = await uploadImages(images);

    const newRefund: CreateRefundByShopRequest = {
      orderLineItemId: selectedItem,
      description,
      images: imageUrls,
      refundPercentage,
    };

    createRefundMutation.mutate(newRefund);
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(
          storage,
          `refund-images/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
      })
    );
    return uploadedUrls;
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prevImages) => {
      const newImages = [...prevImages, ...acceptedFiles];
      return newImages.slice(0, 3); // Limit to 3 images
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 3,
  });

  const handleItemDetail = (itemDetailId: string) => {
    navigate(`/refund/item-detail/${itemDetailId}`);
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Content>
      <KTCard>
        <KTCardBody>
          <h2 className="mb-6">Create Refund</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="mb-8">
              <label className="form-label fs-6 fw-bold">Select Order</label>
              <OrderTableForRefund
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                shopId={shopId!}
              />
            </div>

            {selectedOrder && orderDetails && (
              <div className="mb-8 p-6 bg-light-primary rounded">
                <h4 className="mb-4">Order Details</h4>
                <div className="d-flex flex-column">
                  <span className="fw-bold mb-2">
                    Order Code: {orderDetails.orderCode}
                  </span>
                  <span className="fw-bold">
                    Customer Name: {orderDetails.customerName}
                  </span>
                </div>
              </div>
            )}

            {selectedOrder && orderLineItems && (
              <div className="mb-8">
                <h4 className="mb-4">Order Line Products</h4>
                <div className="table-responsive">
                  <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                      <tr className="fw-bold text-muted bg-light">
                        <th className="min-w-100px">Product Name</th>
                        <th className="min-w-50px">Quantity</th>
                        <th className="min-w-50px">Unit Price</th>
                        <th className="min-w-50px">Status</th>

                        {orderLineItems.some(
                          (item: OrderLineItemListResponse) =>
                            item.itemStatus !== "Returned"
                        ) && <th className="min-w-50px">Action</th>}
                        <th className="min-w-50px">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderLineItems.map((item: OrderLineItemListResponse) => (
                        <tr key={item.orderLineItemId}>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice}</td>
                          <td>{item.itemStatus}</td>
                          {item.itemStatus !== "Returned" && (
                            <td>
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  selectedItem === item.orderLineItemId
                                    ? "btn-primary"
                                    : "btn-light-primary"
                                }`}
                                onClick={() =>
                                  handleItemSelect(item.orderLineItemId || "")
                                }
                              >
                                {selectedItem === item.orderLineItemId
                                  ? "Selected"
                                  : "Select"}
                              </button>
                            </td>
                          )}
                          <td>
                            <button
                              className="btn btn-light-primary"
                              onClick={() =>
                                handleItemDetail(item.itemId || "")
                              }
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedItem && (
              <div className="mb-8 p-6 bg-light-info rounded">
                <h4 className="mb-4">Refund Details</h4>
                <div className="mb-5">
                  <label className="form-label fs-6 fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-5">
                  <label className="form-label fs-6 fw-bold">
                    Images (Max 3)
                  </label>
                  {images.length < 3 && (
                    <div {...getRootProps()} className="dropzone">
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the files here ...</p>
                      ) : (
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files (Max 3)
                        </p>
                      )}
                    </div>
                  )}
                  <div className="mt-3">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="d-inline-block m-2 position-relative"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          className="img-thumbnail"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          alt={file.name}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                        >
                          X
                        </button>
                        <p>{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="form-label fs-6 fw-bold">
                    Refund Percentage
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={refundPercentage}
                    onChange={(e) =>
                      setRefundPercentage(Number(e.target.value))
                    }
                    min="0"
                    max="100"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createRefundMutation.isLoading || images.length === 0
                  }
                >
                  {createRefundMutation.isLoading
                    ? "Creating..."
                    : "Create Refund"}
                </button>
              </div>
            )}
          </form>
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default CreateRefund;
