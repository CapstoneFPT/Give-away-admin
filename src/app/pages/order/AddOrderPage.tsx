import React, { useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import ProductTable from "./ProductTable";
import { formatBalance } from "../utils/utils";
import { CreateOrderRequest, OrderApi, ShopApi } from "../../../api/api";
import { useAuth } from "../../modules/auth";
import { toast } from "react-toastify";

const AddOrderPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [buyerName, setBuyerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Manage form submission state

  const subtotal = totalCost;
  const total = subtotal;
  const shopApi = new ShopApi();
  const orderApi = new OrderApi();
  const currentUser = useAuth().currentUser?.shopId; // Get shopId from useAuth

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set submitting state to true

    try {
      // Prepare order data
      const orderData: CreateOrderRequest = {
        recipientName: buyerName,
        phone: phoneNumber,
        itemIds: selectedItems,
      };

      // Send API request to create order
      const createOrderResponse = await shopApi.apiShopsShopIdOrdersPost(currentUser!, orderData);

      // Handle success (e.g., show a success message, redirect, etc.)
      alert("Order created successfully!");
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error creating order:", error);
      toast("Failed to create order.");
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };


  return (
    <Content>
      <h1>Create Order</h1>
      <div id="kt_app_content_container" className="app-container container-xxl">
        <form
          id="kt_ecommerce_edit_order_form"
          className="form d-flex flex-column flex-lg-row"
          data-kt-redirect="apps/ecommerce/sales/listing.html"
          onSubmit={handleSubmit} // Attach the submit handler
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
                  {/* Buyer’s Details */}
                  <div className="fv-row">
                    <label className="required form-label">Buyer's Name</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter buyer's name"
                      name="buyer_name"
                      id="kt_ecommerce_edit_order_buyer_name"
                      value={buyerName} // Bind the input to the buyerName state
                      onChange={(e) => setBuyerName(e.target.value)} // Update state on input change
                      required // Make the field required
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
                      value={phoneNumber} // Bind the input to the phoneNumber state
                      onChange={(e) => setPhoneNumber(e.target.value)} // Update state on input change
                      required // Make the field required
                    />
                    <div className="text-muted fs-7">
                      Enter the phone number of the buyer.
                    </div>
                  </div>

                  {/* Display Calculated Values */}
                  <div className="fw-bold fs-4">
                    Subtotal: {formatBalance(subtotal)} VND
                  </div>
                  <div className="fw-bold fs-4">
                    Total: {formatBalance(total)} VND
                  </div>

                  {/* Submit Button */}
                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting} // Disable button while submitting
                    >
                      {isSubmitting ? "Checking out..." : "Checkout"}
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
