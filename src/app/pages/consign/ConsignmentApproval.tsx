import React, { useState, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { ConsignSaleApi, ConsignSaleDetailedResponse, ConsignSaleStatus, ConsignSaleLineItemsListResponse } from "../../../api";

interface ConsignmentApprovalProps {
    consignSale: ConsignSaleDetailedResponse;
    initialStatus: ConsignSaleStatus;
    lineItems: ConsignSaleLineItemsListResponse[];
}

const consignSaleApi = new ConsignSaleApi();

export const ConsignmentApproval: React.FC<ConsignmentApprovalProps> = ({ consignSale, initialStatus, lineItems }) => {
    const [comment, setComment] = useState<string>('');
    const [status, setStatus] = useState<ConsignSaleStatus>(initialStatus);
    const queryClient = useQueryClient();

    useEffect(() => {
        setStatus(initialStatus);
    }, [initialStatus]);

    const canListItems = () => {
        return lineItems.some(item => item.isApproved === true) &&
            !lineItems.some(item => item.isApproved === null || item.isApproved === undefined);
    }

    const updateConsignSale = useMutation(
        async ({ id, status, comment }: { id: string; status: ConsignSaleStatus; comment?: string }) => {
            return await consignSaleApi.apiConsignsalesConsignSaleIdApprovalPut(id, {
                status,
                responseFromShop: comment
            });
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['consignSale', consignSale.consignSaleId]);
            }
        }
    );

    const confirmReceived = useMutation(
        async (id: string) => {
            return await consignSaleApi.apiConsignsalesConsignSaleIdConfirmReceivedPut(id);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['consignSale', consignSale.consignSaleId]);
            }
        }
    );

    const listItems = useMutation(
        async (id: string) => {
            return await consignSaleApi.apiConsignsalesConsignSaleIdPostItemsToSellPut(id);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(['consignSale', consignSale.consignSaleId]);
            }
        }
    );

    const handleReject = async () => {
        await updateConsignSale.mutateAsync({ id: consignSale.consignSaleId!, status: ConsignSaleStatus.Rejected, comment });
        setStatus(ConsignSaleStatus.Rejected);
    };

    const handleNotifyDelivery = async () => {
        await updateConsignSale.mutateAsync({ id: consignSale.consignSaleId!, status: ConsignSaleStatus.AwaitDelivery });
        setStatus(ConsignSaleStatus.AwaitDelivery);
    };

    const handleConfirmReceived = async () => {
        await confirmReceived.mutateAsync(consignSale.consignSaleId!);
        setStatus(ConsignSaleStatus.Processing);
    };

    const handleApprove = async () => {
        await listItems.mutateAsync(consignSale.consignSaleId!);
        setStatus(ConsignSaleStatus.OnSale);
    };

    return (
        <KTCard className="mb-5 mb-xl-8">
            <KTCardBody>
                <h3 className='fs-2 fw-bold mb-5'>Consignment Approval</h3>
                <div className='row mb-5'>
                    <div className='col-12'>
                        <label htmlFor="approvalComment" className="form-label">Comment</label>
                        <textarea
                            id="approvalComment"
                            className="form-control"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your comment here..."
                        ></textarea>
                    </div>
                </div>
                <div className='row mb-5'>
                    <div className='col-12'>
                        <button
                            className='btn btn-danger me-3 mb-3'
                            onClick={handleReject}
                            disabled={updateConsignSale.isLoading || !(status in [ConsignSaleStatus.Pending, ConsignSaleStatus.AwaitDelivery, ConsignSaleStatus.Processing])}
                        >
                            {updateConsignSale.isLoading && status === ConsignSaleStatus.Rejected ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                                <KTIcon iconName='cross' className='fs-2 me-2'/>
                            )}
                            Reject
                        </button>
                        <button
                            className='btn btn-warning me-3 mb-3'
                            onClick={handleNotifyDelivery}
                            disabled={updateConsignSale.isLoading || status !== ConsignSaleStatus.Pending}
                        >
                            {updateConsignSale.isLoading && status === ConsignSaleStatus.AwaitDelivery ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                                <KTIcon iconName='notification' className='fs-2 me-2'/>
                            )}
                            Notify Delivery
                        </button>
                        <button
                            className='btn btn-info me-3 mb-3'
                            onClick={handleConfirmReceived}
                            disabled={confirmReceived.isLoading || status !== ConsignSaleStatus.AwaitDelivery}
                        >
                            {confirmReceived.isLoading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                                <KTIcon iconName='check-circle' className='fs-2 me-2'/>
                            )}
                            Confirm Received
                        </button>
                        <button
                            className='btn btn-success mb-3'
                            onClick={handleApprove}
                            disabled={listItems.isLoading || status !== ConsignSaleStatus.Processing || !canListItems}
                        >
                            {listItems.isLoading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                                <KTIcon iconName='check' className='fs-2 me-2'/>
                            )}
                            List Items
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <div className={`alert alert-${getStatusColor(status)}`}>
                            Current Status: <strong>{status}</strong>
                        </div>
                    </div>
                </div>
            </KTCardBody>
        </KTCard>
    );
};

const getStatusColor = (status: ConsignSaleStatus) => {
    switch (status) {
        case ConsignSaleStatus.Pending:
            return 'warning';
        case ConsignSaleStatus.Rejected:
            return 'danger';
        case ConsignSaleStatus.AwaitDelivery:
            return 'primary';
        case ConsignSaleStatus.Processing:
            return 'info';
        case ConsignSaleStatus.OnSale:
            return 'success';
        case ConsignSaleStatus.Completed:
            return 'success';
        case ConsignSaleStatus.Cancelled:
            return 'dark';
        default:
            return 'primary';
    }
};

export default ConsignmentApproval;