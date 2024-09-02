import React from 'react';
import { Content } from "../../../_metronic/layout/components/content";
import ProductTable from "./ProductTable.tsx";
import AddressForm from "./AddressForm.tsx";

const AddOrderPage = () => {
    return (
        <Content>
            <div id="kt_app_content_container" className="app-container container-xxl">
                <form
                    id="kt_ecommerce_edit_order_form"
                    className="form d-flex flex-column flex-lg-row"
                    data-kt-redirect="apps/ecommerce/sales/listing.html"
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
                                        <label className="form-label">Order ID</label>
                                        <div className="fw-bold fs-3">#13409</div>
                                    </div>

                                    <div className="fv-row">
                                        <label className="required form-label">Payment Method</label>
                                        <select
                                            className="form-select mb-2"
                                            data-control="select2"
                                            data-hide-search="true"
                                            data-placeholder="Select an option"
                                            name="payment_method"
                                            id="kt_ecommerce_edit_order_payment"
                                        >
                                            <option></option>
                                            <option value="cod">Cash on Delivery</option>
                                            <option value="visa">Credit Card (Visa)</option>
                                            <option value="mastercard">Credit Card (Mastercard)</option>
                                            <option value="paypal">Paypal</option>
                                        </select>
                                        <div className="text-muted fs-7">Set the date of the order to process.</div>
                                    </div>

                                    <div className="fv-row">
                                        <label className="required form-label">Shipping Method</label>
                                        <select
                                            className="form-select mb-2"
                                            data-control="select2"
                                            data-hide-search="true"
                                            data-placeholder="Select an option"
                                            name="shipping_method"
                                            id="kt_ecommerce_edit_order_shipping"
                                        >
                                            <option></option>
                                            <option value="none">N/A - Virtual Product</option>
                                            <option value="standard">Standard Rate</option>
                                            <option value="express">Express Rate</option>
                                            <option value="speed">Speed Overnight Rate</option>
                                        </select>
                                        <div className="text-muted fs-7">Set the date of the order to process.</div>
                                    </div>

                                    <div className="fv-row">
                                        <label className="required form-label">Order Date</label>
                                        <input
                                            id="kt_ecommerce_edit_order_date"
                                            name="order_date"
                                            placeholder="Select a date"
                                            className="form-control mb-2"
                                            value=""
                                        />
                                        <div className="text-muted fs-7">Set the date of the order to process.</div>
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
                                    <ProductTable/>
                                </div>
                            </div>
                        </div>

                        <div className="card card-flush py-4">
                            <div className="card-header">
                                <div className="card-title">
                                    <h2>Delivery Details</h2>
                                </div>
                            </div>

                            <div className="card-body pt-0">
                               <AddressForm/>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <a
                                href="apps/ecommerce/catalog/products.html"
                                id="kt_ecommerce_edit_order_cancel"
                                className="btn btn-light me-5"
                            >
                                Cancel
                            </a>

                            <button
                                type="submit"
                                id="kt_ecommerce_edit_order_submit"
                                className="btn btn-primary"
                            >
                                <span className="indicator-label">Save Changes</span>
                                <span className="indicator-progress">
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Content>
    );
};

export default AddOrderPage;