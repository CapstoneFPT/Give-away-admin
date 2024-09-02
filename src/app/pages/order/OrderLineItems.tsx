import {OrderDetailedResponse, OrderLineItemListResponse} from "../../../api";
import {formatBalance} from "../utils/utils.ts";
import {KTCard, KTCardBody} from "../../../_metronic/helpers";

const OrderLineItems = ({items, orderDetail}: { items: OrderLineItemListResponse[], orderDetail: OrderDetailedResponse }) =>
{
    const calculateSubtotal = () => {
        return items?.reduce((total, item) => total + (item.unitPrice || 0) * (item.quantity || 0), 0) || 0;
    };

    const subtotal = calculateSubtotal();
    const shippingRate = orderDetail.shippingFee || 0; // You might want to get this from the order details
    const grandTotal = subtotal + shippingRate;

    return (
        <KTCard className="card-flush py-4 flex-row-fluid overflow-hidden">
            <div className="card-header">
                <div className="card-title">
                    <h2>Order {orderDetail?.orderCode}</h2>
                </div>
            </div>
            <KTCardBody className="pt-0">
                <div className="table-responsive">
                    <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                        <thead>
                        <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                            <th className="min-w-175px">Product</th>
                            <th className="min-w-100px text-end">Item Code</th>
                            <th className="min-w-70px text-end">Qty</th>
                            <th className="min-w-100px text-end">Unit Price</th>
                            <th className="min-w-100px text-end">Total</th>
                        </tr>
                        </thead>
                        <tbody className="fw-semibold text-gray-600">
                        {
                            items?.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {item.itemImage && item.itemImage[0] && (
                                            <a href="#" className="symbol symbol-50px">
                                                <span className="symbol-label" style={{backgroundImage: `url(${item.itemImage[0]})`}}></span>
                                            </a>
                                        )}
                                        <div className="ms-5">
                                            <a href="#" className="fw-bold text-gray-600 text-hover-primary">{item.itemName}</a>
                                            <div className="fs-7 text-muted">
                                                Brand: {item.itemBrand}, Color: {item.itemColor}, Size: {item.itemSize}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-end">{item.itemCode}</td>
                                <td className="text-end">{item.quantity}</td>
                                <td className="text-end">{formatBalance(item.unitPrice || 0)}</td>
                                <td className="text-end">{formatBalance((item.unitPrice || 0) * (item.quantity || 0))}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={4} className="text-end">Subtotal</td>
                            <td className="text-end">{formatBalance(subtotal)}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="text-end">Shipping Rate</td>
                            <td className="text-end">{formatBalance(shippingRate)}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="fs-3 text-dark fw-bolder text-end">Grand Total</td>
                            <td className="text-dark fs-3 fw-boldest text-end">{formatBalance(grandTotal)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </KTCardBody>
        </KTCard>
    );
}
export default OrderLineItems