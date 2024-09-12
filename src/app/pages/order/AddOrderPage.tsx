/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import ProductTable from "./ProductTable";
import { formatBalance, phoneRegex } from "../utils/utils";
import { CreateOrderRequest, OrderApi, ShopApi } from "../../../api/api";
import { useAuth } from "../../modules/auth";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

interface OrderFormValues {
  buyerName: string;
  phoneNumber: string;
  selectedItems: string[];
}

const validationSchema = Yup.object().shape({
  recipientName: Yup.string().required("Buyer's name is required"),
  phone: Yup.string()
    .matches(
      phoneRegex,
      "Invalid phone number format. Please enter a valid phone number."
    )
    .required("Phone number is required"),
  itemIds: Yup.array().min(1, "At least one item must be selected"),
});

const AddOrderPage = () => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const shopApi = new ShopApi();
  const orderApi = new OrderApi();
  const currentUser = useAuth().currentUser?.shopId;

  const initialValues: CreateOrderRequest = {
    recipientName: "",
    phone: "",
    itemIds: [],
  };

  const handleSubmit = async (
    values: CreateOrderRequest,
    { setSubmitting, resetForm }: FormikHelpers<CreateOrderRequest>
  ) => {
    try {
      const orderData: CreateOrderRequest = {
        recipientName: values.recipientName,
        phone: values.phone,
        itemIds: values.itemIds,
      };

      await shopApi.apiShopsShopIdOrdersPost(currentUser!, orderData);
      toast.success("Order created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Content>
      <h1>Create Order</h1>
      <div
        id="kt_app_content_container"
        className="app-container container-xxl"
      >
        <Formik<CreateOrderRequest>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form
              placeholder={"Order Details"}
              id="kt_ecommerce_edit_order_form"
              className="form d-flex flex-column flex-lg-row"
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
                      <div className="fv-row">
                        <label className="required form-label">
                          Buyer's Name
                        </label>
                        <Field
                          type="text"
                          name="recipientName"
                          className="form-control mb-2"
                          placeholder="Enter buyer's name"
                        />
                        <ErrorMessage
                          name="recipientName"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="fv-row">
                        <label className="required form-label">
                          Phone Number
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          className="form-control mb-2"
                          placeholder="Enter phone number"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="fw-bold fs-4">
                        Subtotal: {formatBalance(totalCost)} VND
                      </div>
                      <div className="fw-bold fs-4">
                        Total: {formatBalance(totalCost)} VND
                      </div>

                      <div className="mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
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
                        selectedItems={values.itemIds ?? []}
                        setSelectedItems={(items) =>
                          setFieldValue("itemIds", items)
                        }
                        setTotalCost={setTotalCost}
                      />
                      <ErrorMessage
                        name="itemIds"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Content>
  );
};

export default AddOrderPage;
