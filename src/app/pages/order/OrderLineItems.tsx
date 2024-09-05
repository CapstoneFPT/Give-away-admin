import { ConfirmPendingOrderRequest, FashionItemStatus, OrderDetailedResponse, OrderLineItemApi, OrderLineItemListResponse, PurchaseType } from "../../../api";
import { formatBalance } from "../utils/utils.ts";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { Button } from "react-bootstrap";
import { useMutation } from "react-query";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderLineItems = ({ items, orderDetail }: { items: OrderLineItemListResponse[], orderDetail: OrderDetailedResponse }) => {
    const calculateSubtotal = () => {
        return items?.reduce((total, item) => total + (item.unitPrice || 0) * (item.quantity || 0), 0) || 0;
    };

 

    const deliveryApi = new OrderLineItemApi();

    const deliveryMutation = useMutation(
        async ({ OrderLineItemId, itemStatus }: { OrderLineItemId: string, itemStatus: ConfirmPendingOrderRequest }) => {
            
            return await deliveryApi.apiOrderlineitemsOrderLineItemIdConfirmPendingOrderPut(
                OrderLineItemId,
                itemStatus
                
            );
        },
        {
            onSuccess: async () => {
                toast.success("Delivery confirmed!", { autoClose: 2000 });  // Thông báo thành công
                setTimeout(() => {
                    window.location.reload();  // Refresh the page upon success
                }, 2000);  // Đợi thông báo hiển thị xong trước khi reload trang
            },
            onError: (error) => {
                toast.error("Failed to confirm delivery", { autoClose: 2000 });  // Thông báo lỗi
                console.error("Failed to confirm delivery", error);
            }
        }
    );
    const handleConfirmDelivery = async (orderLineItemId: string) => {
        try {
            const request: ConfirmPendingOrderRequest = {
                itemStatus: FashionItemStatus.OnDelivery 
            };
            await deliveryMutation.mutateAsync({
                OrderLineItemId: orderLineItemId,
                itemStatus: request  // Truyền request vào mutation
            });
        } catch (error) {
            console.error("Error during delivery confirmation:", error);
        }
    };


    return (
        <>
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
                                    <th className="min-w-100px text-end">Status</th>
                                    <th className="min-w-100px text-end">Action</th>
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
                                                            <span className="symbol-label" style={{ backgroundImage: `url(${item.itemImage[0]})` }}></span>
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
                                            <td className="text-end">{item.itemStatus}</td>
                                            <td className="text-end">
                                                {
                                                    orderDetail.purchaseType === PurchaseType.Online &&
                                                    item.itemStatus === FashionItemStatus.PendingForOrder &&
                                                    <div style={{ justifyContent: 'center', }}>
                                                        <Button
                                                        style={{ width: '100px', marginRight: '10px' }}
                                                        className="btn btn-warning hover-rotate-end"
                                                        onClick={() => handleConfirmDelivery(item.orderLineItemId!)}  // Truyền orderLineItemId
                                                    >
                                                        Delivery
                                                    </Button>
                                                    <Button style={{ width: '100px' }} className="btn btn-danger hover-rotate-end">Cancel</Button>
                                                </div>
}
                                            </td>
                                        </tr>
                                    ))}
                              
                            </tbody>
                        </table>
                    </div>
                </KTCardBody>
            </KTCard>
            <ToastContainer /> {/* Hiển thị Toast */}
        </>
    );
}

export default OrderLineItems;
