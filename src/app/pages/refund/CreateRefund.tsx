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
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderTableForRefund from "./OrderTableForRefund";
import { useAuth } from "../../modules/auth";
import { useDropzone } from "react-dropzone";
import { showAlert } from "../../../utils/Alert";
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
  const { data: orderLineItems } = useQuery<OrderLineItemListResponse>(
    ["orderLineItems", selectedOrder],
    async () => {
      const response = await orderApi.apiOrdersOrderIdOrderlineitemsGet(
        selectedOrder
      );
      return response.data as OrderLineItemListResponse;
    },
    { enabled: !!selectedOrder }
  );

  const createRefundMutation = useMutation(
    (newRefund: CreateRefundByShopRequest) =>
      shopApi.apiShopsShopIdRefundsPost(shopId!, newRefund),
    {
      onSuccess: () => {
        showAlert("success", "Refund created successfully");
        navigate("/refund/list");
      },
      onError: (error) => {
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
      toast.error("Please select an item to refund");
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
    // Implement image upload logic here
    // This should return an array of image URLs
    console.log("Uploading images:", files);
    // For now, we'll return placeholder URLs
    return files.map((file) => URL.createObjectURL(file));
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
  });

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
                <h4 className="mb-4">Order Line Items</h4>
                <div className="table-responsive">
                  <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                    <thead>
                      <tr className="fw-bold text-muted bg-light">
                        <th className="min-w-150px">Item Name</th>
                        <th className="min-w-100px">Quantity</th>
                        <th className="min-w-100px">Unit Price</th>
                        <th className="min-w-100px text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* @ts-expect-error idk */}
                      {orderLineItems.items.map(
                        (item: OrderLineItemListResponse) => (
                          <tr key={item.orderLineItemId}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice}</td>
                            <td className="text-end">
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
                          </tr>
                        )
                      )}
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
                  <label className="form-label fs-6 fw-bold">Images</label>
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                  <div className="mt-3">
                    {images.map((file) => (
                      <div key={file.name} className="d-inline-block m-2">
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
                  disabled={createRefundMutation.isLoading}
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
