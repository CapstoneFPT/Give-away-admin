import React from "react";
import { Button } from "react-bootstrap";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { OrderDetailedResponse, OrderLineItem, OrderLineItemListResponse, OrderStatus, PurchaseType, ShopApi } from "../../../api";
import { useAuth } from "../../modules/auth";
import { useMutation } from "react-query";

const ShippingAddress: React.FC<{ orderDetail: OrderDetailedResponse | undefined, orderLineItems: OrderLineItemListResponse[] | undefined }> = ({ orderDetail, orderLineItems }) => {
    const { currentUser } = useAuth();
    const deliveryApi = new ShopApi();

    const deliveryMutation = useMutation(
        async ({ shopId, orderId,  }: { shopId: string; orderId: string }) => {
            return await deliveryApi.apiShopsShopIdOrdersOrderIdConfirmDeliveriedPut(shopId,orderId );
        },
        {
            onSuccess: async () => {
                // Invalidate and refetch any necessary queries here if needed
                // await queryClient.invalidateQueries(['consignSale', consignSale.consignSaleId]);
                window.location.reload();  // Refresh the page upon success
            },
            onError: (error) => {
                // Handle error here if needed
                console.error("Failed to confirm delivery", error);
            }
        }
    );

    const handleConfirmDelivery = async () => {
        if (!orderDetail || !currentUser) return;

        try {
            await deliveryMutation.mutateAsync({
                shopId: currentUser.shopId!,
                orderId: orderDetail.orderId!,
                
            });
        } catch (error) {
            console.error("Error during delivery confirmation:", error);
        }
    };

    return (
        <KTCard className="card-flush py-4 flex-row-fluid position-relative">
            <div className="position-absolute top-0 end-0 bottom-0 opacity-10 d-flex align-items-center me-5">
                <KTIcon iconName='delivery' className='fs-2' />
            </div>
            <div className="card-header">
                <div className="card-title">
                    <h2>Shipping Address</h2>
                </div>
            </div>
            <KTCardBody className="pt-0">
                {orderDetail && orderDetail.address}
                <div>
                    {
                        orderDetail && orderDetail.purchaseType === PurchaseType.Online &&
                        orderDetail.status === OrderStatus.OnDelivery && orderLineItems && orderLineItems.some((item) => item.itemStatus === 'OnDelivery')  &&
                    <Button 
                        style={{ marginTop: "10px" }} 
                        className="btn btn-success hover-rotate-end"
                        onClick={handleConfirmDelivery}
                    >
                        <KTIcon iconName="pencil" className="fs-3" />
                        Confirm Deliveried
                    </Button>
}
                </div>
            </KTCardBody>
        </KTCard>
    );
};

export default ShippingAddress;
