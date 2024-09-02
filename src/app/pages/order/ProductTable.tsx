import React from 'react';

const ProductTable = () => {
    return (
        <div className="card-body pt-0">
            <div className="d-flex flex-column gap-10">
                <div>
                    <label className="form-label">Add products to this order</label>
                    <div
                        className="row row-cols-1 row-cols-xl-3 row-cols-md-2 border border-dashed rounded pt-3 pb-1 px-2 mb-5 mh-300px overflow-scroll"
                        id="kt_ecommerce_edit_order_selected_products"
                    >
            <span className="w-100 text-muted">
              Select one or more products from the list below by ticking the checkbox.
            </span>
                    </div>
                    <div className="fw-bold fs-4">
                        Total Cost: $<span id="kt_ecommerce_edit_order_total_price">0.00</span>
                    </div>
                </div>

                <div className="separator"></div>

                <div className="d-flex align-items-center position-relative mb-n7">
                    <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
                        <span className="path1"></span>
                        <span className="path2"></span>
                    </i>
                    <input
                        type="text"
                        data-kt-ecommerce-edit-order-filter="search"
                        className="form-control form-control-solid w-100 w-lg-50 ps-12"
                        placeholder="Search Products"
                    />
                </div>

                <table
                    className="table align-middle table-row-dashed fs-6 gy-5"
                    id="kt_ecommerce_edit_order_product_table"
                >
                    <thead>
                    <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                        <th className="w-25px pe-2"></th>
                        <th className="min-w-200px">Product</th>
                        <th className="min-w-100px text-end pe-5">Qty Remaining</th>
                    </tr>
                    </thead>
                    <tbody className="fw-semibold text-gray-600">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <tr key={index}>
                            <td>
                                <div className="form-check form-check-sm form-check-custom form-check-solid">
                                    <input className="form-check-input" type="checkbox" value="1" />
                                </div>
                            </td>
                            <td>
                                <div
                                    className="d-flex align-items-center"
                                    data-kt-ecommerce-edit-order-filter="product"
                                    data-kt-ecommerce-edit-order-id={`product_${index}`}
                                >
                                    <a href="apps/ecommerce/catalog/edit-product.html" className="symbol symbol-50px">
                      <span
                          className="symbol-label"
                          style={{backgroundImage: `url(assets/media//stock/ecommerce/${index}.png)`}}
                      ></span>
                                    </a>
                                    <div className="ms-5">
                                        <a
                                            href="apps/ecommerce/catalog/edit-product.html"
                                            className="text-gray-800 text-hover-primary fs-5 fw-bold"
                                        >
                                            Product {index}
                                        </a>
                                        <div className="fw-semibold fs-7">
                                            Price: $<span data-kt-ecommerce-edit-order-filter="price">{100 + index * 10}.00</span>
                                        </div>
                                        <div className="text-muted fs-7">SKU: 0{1000 + index}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-end pe-5" data-order={30 - index * 5}>
                                <span className="fw-bold ms-3">{30 - index * 5}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;