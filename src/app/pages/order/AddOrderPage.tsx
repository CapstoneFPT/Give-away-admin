import React, { useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import ProductTable from "./ProductTable";
import { formatBalance } from "../utils/utils";
import { CreateOrderRequest, OrderApi, ShopApi } from "../../../api/api";
import { useAuth } from "../../modules/auth";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

const AddOrderPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [buyerName, setBuyerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const shopId = currentUser?.shopId;

  const createOrderMutation = useMutation({
    mutationFn: (orderData: CreateOrderRequest) => {
      const shopApi = new ShopApi();
      return shopApi.apiShopsShopIdOrdersPost(shopId!, orderData);
    },
    onSuccess: () => {
      toast.success("Order created successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["fashionItems"] });
    },
    onError: (error: any) => {
      console.error("Error creating order:", error);
      toast.error("Failed to create order.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData: CreateOrderRequest = {
      recipientName: buyerName,
      phone: phoneNumber,
      itemIds: selectedItems,
    };
    createOrderMutation.mutate(orderData);
  };

  const subtotal = totalCost;
  const total = subtotal;

  return (
    <Content>
      <h1>Create Order</h1>
      <div id="kt_app_content_container" className="app-container container-xxl">
        <form
          id="kt_ecommerce_edit_order_form"
          className="form d-flex flex-column flex-lg-row"
          data-kt-redirect="apps/ecommerce/sales/listing.html"
          onSubmit={handleSubmit}
        >
          <div className="w-100 flex-lg-row-auto w-lg-300px mb-7 me-7 me-lg-10">
            <div className="card card-flush py-4">
              <div className="card-header">
                <div className="card-title">
                  <h2>Order Details</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="d-flex flex-column gap-10">
                  {/* Buyer's Details */}
                  <div className="fv-row">
                    <label className="required form-label">Buyer's Name</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter buyer's name"
                      name="buyer_name"
                      id="kt_ecommerce_edit_order_buyer_name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                    <div className="text-muted fs-7">
                      Enter the name of the buyer.
                    </div>
                  </div>
                  <div className="fv-row">
                    <label className="required form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter phone number"
                      name="phone_number"
                      id="kt_ecommerce_edit_order_phone_number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                    <div className="text-muted fs-7">
                      Enter the phone number of the buyer.
                    </div>
                  </div>

                  <div className="fw-bold fs-4">
                    Subtotal: {formatBalance(subtotal)} VND
                  </div>
                  <div className="fw-bold fs-4">
                    Total: {formatBalance(total)} VND
                  </div>

                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={createOrderMutation.isLoading}
                    >
                      {createOrderMutation.isLoading ? "Checking out..." : "Checkout"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-lg-row-fluid gap-7 gap-lg-10">
            <div className="card card-flush py-4">
              <div className="card-header">
                <div className="card-title">
                  <h2>Select Products</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="d-flex flex-column gap-10">
                  <ProductTable
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    setTotalCost={setTotalCost}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Content>
  );
};

export default AddOrderPage;