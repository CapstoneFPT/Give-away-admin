import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import {
  ConsignSaleApi,
  ConsignSaleDetailedResponse,
  ConsignSaleLineItemsListResponse,
  ConsignSaleStatus,
} from "../../../api";

import { RejectConsignmentModal } from "./RejectConsignmentModal.tsx";

interface ConsignmentApprovalProps {
  consignSale: ConsignSaleDetailedResponse;
  initialStatus: ConsignSaleStatus;
  lineItems: ConsignSaleLineItemsListResponse[];
  onActionStart: () => void;
  onActionComplete: () => void;
}

const consignSaleApi = new ConsignSaleApi();

export const ConsignmentApproval: React.FC<ConsignmentApprovalProps> = ({
  consignSale,
  initialStatus,
  lineItems,
  onActionStart,
  onActionComplete,
}) => {
  const [comment, setComment] = useState<string>("");
  const [status, setStatus] = useState<ConsignSaleStatus>(initialStatus);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const updateConsignSale = useMutation(
    async ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: ConsignSaleStatus;
      comment?: string;
    }) => {
      onActionStart();
      return await consignSaleApi.apiConsignsalesConsignSaleIdApprovalPut(id, {
        status,
        responseFromShop: comment,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "consignSale",
          consignSale.consignSaleId,
        ]);
        onActionComplete();
      },
      onError: (error) => {
        console.error("Error updating consignment:", error);
        onActionComplete();
      },
    }
  );

  const notifyNegotiation = useMutation(
    async (id: string) => {
      onActionStart();
      return await consignSaleApi.apiConsignsalesConsignSaleIdNegotiatingPut(
        id
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "consignSale",
          consignSale.consignSaleId,
        ]);
        onActionComplete();
      },
      onError: (error) => {
        console.error("Error notifying negotiation:", error);
        onActionComplete();
      },
    }
  );

  const confirmReceived = useMutation(
    async (id: string) => {
      onActionStart();
      return await consignSaleApi.apiConsignsalesConsignSaleIdConfirmReceivedPut(
        id
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "consignSale",
          consignSale.consignSaleId,
        ]);
        onActionComplete();
      },
      onError: (error) => {
        console.error("Error confirming received:", error);
        onActionComplete();
      },
    }
  );

  const canRejectConsign = (initialStatus: ConsignSaleStatus) => {
    const result = initialStatus === "Pending";

    return result;
  };

  const canCancelConsign = (initialStatus: ConsignSaleStatus) => {
    const result = initialStatus === "AwaitDelivery";
    return result;
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    onActionStart();
    try {
      await updateConsignSale.mutateAsync({
        id: consignSale.consignSaleId!,
        status: ConsignSaleStatus.Rejected,
        comment: rejectReason,
      });
      setStatus(ConsignSaleStatus.Rejected);
      setShowRejectModal(false);
      setRejectReason("");
    } finally {
      setShowRejectModal(false);
      onActionComplete();
    }
  };

  const handleModalClose = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  const handleNotifyDelivery = async () => {
    onActionStart();
    try {
      await updateConsignSale.mutateAsync({
        id: consignSale.consignSaleId!,
        status: ConsignSaleStatus.AwaitDelivery,
      });
      setStatus(ConsignSaleStatus.AwaitDelivery);
    } finally {
      onActionComplete();
    }
  };

  const handleConfirmReceived = async () => {
    onActionStart();
    try {
      await confirmReceived.mutateAsync(consignSale.consignSaleId!);
      setStatus(ConsignSaleStatus.Processing);
    } finally {
      onActionComplete();
    }
  };

  const handleNotifyNegotiation = async () => {
    onActionStart();
    try {
      await notifyNegotiation.mutateAsync(consignSale.consignSaleId!);
      setStatus(ConsignSaleStatus.Negotiating);
    } finally {
      onActionComplete();
    }
  };

  return (
    <>
      <KTCard className="mb-5 mb-xl-8">
        <KTCardBody>
          <h3 className="fs-2 fw-bold mb-5">Consignment Approval</h3>
          {consignSale.responseFromShop && (
            <div className="row mb-5">
              <div className="col-12">
                <label htmlFor="approvalComment" className="form-label">
                  Comment
                </label>
                <textarea
                  id="approvalComment"
                  className="form-control"
                  rows={3}
                  value={consignSale.responseFromShop}
                  readOnly={true}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment here..."
                ></textarea>
              </div>
            </div>
          )}
          <div className="row mb-5">
            <div className="col-12">
              {status === ConsignSaleStatus.Pending &&
                canRejectConsign(status) && (
                  <button
                    className="btn btn-danger me-3 mb-3"
                    onClick={handleReject}
                  >
                    {updateConsignSale.isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <KTIcon iconName="cross" className="fs-2 me-2" />
                    )}
                    Reject
                  </button>
                )}
              {status !== ConsignSaleStatus.Pending &&
                canCancelConsign(status) && (
                  <button
                    className="btn btn-danger me-3 mb-3"
                    onClick={handleReject}
                  >
                    {updateConsignSale.isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <KTIcon iconName="cross" className="fs-2 me-2" />
                    )}
                    Cancel
                  </button>
                )}
              {status === ConsignSaleStatus.Pending && (
                <button
                  className="btn btn-warning me-3 mb-3"
                  onClick={handleNotifyDelivery}
                >
                  {updateConsignSale.isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <KTIcon iconName="notification" className="fs-2 me-2" />
                  )}
                  Notify Delivery
                </button>
              )}
              {status === ConsignSaleStatus.AwaitDelivery && (
                <button
                  className="btn btn-info me-3 mb-3"
                  onClick={handleConfirmReceived}
                >
                  {confirmReceived.isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <KTIcon iconName="check-circle" className="fs-2 me-2" />
                  )}
                  Confirm Received
                </button>
              )}
              {status === ConsignSaleStatus.Processing &&
                !lineItems.some((item) => !item.dealPrice) &&
                lineItems.some(
                  (item) => item.status === ConsignSaleStatus.Negotiating
                ) && (
                  <button
                    className="btn btn-primary me-3 mb-3"
                    onClick={handleNotifyNegotiation}
                  >
                    {notifyNegotiation.isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <KTIcon iconName="messages" className="fs-2 me-2" />
                    )}
                    Notify Negotiation
                  </button>
                )}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className={`alert alert-${getStatusColor(status)}`}>
                Current Status: <strong>{status}</strong>
              </div>
            </div>
          </div>
        </KTCardBody>
      </KTCard>

      <RejectConsignmentModal
        isOpen={showRejectModal}
        onClose={handleModalClose}
        onConfirm={handleConfirmReject}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isLoading={updateConsignSale.isLoading}
      />

      {showRejectModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

const getStatusColor = (status: ConsignSaleStatus) => {
  switch (status) {
    case ConsignSaleStatus.Pending:
      return "warning";
    case ConsignSaleStatus.Rejected:
      return "danger";
    case ConsignSaleStatus.AwaitDelivery:
      return "primary";
    case ConsignSaleStatus.Processing:
      return "info";
    case ConsignSaleStatus.OnSale:
      return "success";
    case ConsignSaleStatus.Completed:
      return "success";
    case ConsignSaleStatus.Cancelled:
      return "dark";
    default:
      return "primary";
  }
};

export default ConsignmentApproval;
