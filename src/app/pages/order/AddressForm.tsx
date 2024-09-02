import React from 'react';

const AddressForms = () => {
    return (
        <>
            <div className="d-flex flex-column gap-5 gap-md-7">
                <div className="fs-3 fw-bold mb-n2">Billing Address</div>
                <div className="d-flex flex-column flex-md-row gap-5">
                    <div className="fv-row flex-row-fluid">
                        <label className="required form-label">Address Line 1</label>
                        <input
                            className="form-control"
                            name="billing_order_address_1"
                            placeholder="Address Line 1"
                            value=""
                        />
                    </div>
                    <div className="flex-row-fluid">
                        <label className="form-label">Address Line 2</label>
                        <input
                            className="form-control"
                            name="billing_order_address_2"
                            placeholder="Address Line 2"
                        />
                    </div>
                </div>
                <div className="d-flex flex-column flex-md-row gap-5">
                    <div className="flex-row-fluid">
                        <label className="form-label">City</label>
                        <input
                            className="form-control"
                            name="billing_order_city"
                            placeholder=""
                            value=""
                        />
                    </div>
                    <div className="fv-row flex-row-fluid">
                        <label className="required form-label">Postcode</label>
                        <input
                            className="form-control"
                            name="billing_order_postcode"
                            placeholder=""
                            value=""
                        />
                    </div>
                    <div className="fv-row flex-row-fluid">
                        <label className="required form-label">State</label>
                        <input
                            className="form-control"
                            name="billing_order_state"
                            placeholder=""
                            value=""
                        />
                    </div>
                </div>
                <div className="fv-row">
                    <label className="required form-label">Country</label>
                    <select
                        className="form-select"
                        data-placeholder="Select an option"
                        id="kt_ecommerce_edit_order_billing_country"
                        name="billing_order_country"
                    >
                        <option></option>
                        <option value="AF">Afghanistan</option>
                        <option value="AX">Aland Islands</option>
                        {/* Add more country options here */}
                    </select>
                </div>
            </div>

            <div className="form-check form-check-custom form-check-solid">
                <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="same_as_billing"
                    defaultChecked
                />
                <label className="form-check-label" htmlFor="same_as_billing">
                    Shipping address is the same as billing address
                </label>
            </div>

            <div
                className="d-none d-flex flex-column gap-5 gap-md-7"
                id="kt_ecommerce_edit_order_shipping_form"
            >
                <div className="fs-3 fw-bold mb-n2">Shipping Address</div>
                {/* Shipping address form fields (similar structure to billing address) */}
            </div>
        </>
    );
};

export default AddressForms;