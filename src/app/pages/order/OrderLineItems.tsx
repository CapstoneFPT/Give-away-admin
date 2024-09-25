import {
  ConfirmPendingOrderRequest,
  FashionItemStatus,
  OrderDetailedResponse,
  OrderLineItemApi,
  OrderLineItemListResponsePaginationResponse,
  PurchaseType,
} from "../../../api";
import { useState } from "react";
import { formatBalance } from "../utils/utils.ts";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { Button } from "react-bootstrap";
import { useMutation } from "react-query";

import { showAlert } from "../../../utils/Alert.tsx";

const OrderLineItems = ({
  items,
  orderDetail,
}: {
  items: OrderLineItemListResponsePaginationResponse;
  orderDetail: OrderDetailedResponse;
}) => {
  const calculateSubtotal = () => {
    return (
      items.items?.reduce(
        (total, item) => total + (item.unitPrice || 0) * (item.quantity || 0),
        0
      ) || 0
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const deliveryApi = new OrderLineItemApi();

  const deliveryMutation = useMutation(
    async ({
      OrderLineItemId,
      itemStatus,
    }: {
      OrderLineItemId: string;
      itemStatus: ConfirmPendingOrderRequest;
    }) => {
      return await deliveryApi.apiOrderlineitemsOrderLineItemIdConfirmPendingOrderPut(
        OrderLineItemId,
        itemStatus
      );
    },
    {
      onSuccess: async () => {
        showAlert("success", "Delivery confirmed!"); // Thông báo thành công
        setTimeout(() => {
          window.location.reload(); // Refresh the page upon success
        }, 2000); // Đợi thông báo hiển thị xong trước khi reload trang
        setIsLoading(false);
      },
      onError: (error) => {
        showAlert("error", "Failed to confirm delivery"); // Thông báo lỗi
        console.error("Failed to confirm delivery", error);
        setIsLoading(false);
      },
    }
  );
  const handleConfirmDelivery = async (orderLineItemId: string) => {
    setIsLoading(true);
    try {
      const request: ConfirmPendingOrderRequest = {
        itemStatus: FashionItemStatus.ReadyForDelivery,
      };
      await deliveryMutation.mutateAsync({
        OrderLineItemId: orderLineItemId,
        itemStatus: request, // Truyền request vào mutation
      });
    } catch (error) {
      console.error("Error during delivery confirmation:", error);
      setIsLoading(false);
    }
  };
  const handleCancelDelivery = async (orderLineItemId: string) => {
    setIsLoading(true);
    try {
      const request: ConfirmPendingOrderRequest = {
        itemStatus: FashionItemStatus.Unavailable,
      };
      await deliveryMutation.mutateAsync({
        OrderLineItemId: orderLineItemId,
        itemStatus: request,
      });
    } catch (error) {
      console.error("Error during delivery cancellation:", error);
      setIsLoading(false);
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
                {items.items?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.itemImage && item.itemImage[0] && (
                          <a href="#" className="symbol symbol-50px">
                            <span
                              className="symbol-label"
                              style={{
                                backgroundImage: `url(${item.itemImage[0]})`,
                              }}
                            ></span>
                          </a>
                        )}
                        <div className="ms-5">
                          <a
                            href="#"
                            className="fw-bold text-gray-600 text-hover-primary"
                          >
                            {item.itemName}
                          </a>
                          <div className="fs-7 text-muted">
                            Brand: {item.itemBrand}, Color: {item.itemColor},
                            Size: {item.itemSize}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">{item.itemCode}</td>
                    <td className="text-end">{item.quantity}</td>
                    <td className="text-end">
                      {formatBalance(item.unitPrice || 0)}
                    </td>
                    <td className="text-end">
                      {formatBalance(
                        (item.unitPrice || 0) * (item.quantity || 0)
                      )}
                    </td>
                    <td className="text-end">{item.itemStatus}</td>
                    <td className="text-end">
                      {orderDetail.purchaseType === PurchaseType.Online &&
                        item.itemStatus ===
                          FashionItemStatus.PendingForOrder && (
                          <div style={{ justifyContent: "center" }}>
                            <Button
                              style={{ width: "100px", marginRight: "10px" }}
                              className="btn btn-warning hover-rotate-end"
                              onClick={() =>
                                handleConfirmDelivery(item.orderLineItemId!)
                              } // Truyền orderLineItemId
                              disabled={isLoading}
                            >
                              Deliver
                            </Button>
                            <Button
                              onClick={() =>
                                handleCancelDelivery(item.orderLineItemId!)
                              }
                              style={{ width: "100px" }}
                              className="btn btn-danger hover-rotate-end"
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KTCardBody>
      </KTCard>
    </>
  );
};

export default OrderLineItems;
