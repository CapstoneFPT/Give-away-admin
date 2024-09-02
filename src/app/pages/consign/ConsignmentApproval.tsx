import React, { useState, useEffect } from 'react';
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";

// Mock API functions
const mockRejectConsignment = async (id: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Rejected consignment ${id} with comment: ${comment}`);
    return { success: true };
};

const mockNotifyDelivery = async (id: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Notified delivery for consignment ${id} with comment: ${comment}`);
    return { success: true };
};

const mockConfirmReceived = async (id: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Confirmed received for consignment ${id} with comment: ${comment}`);
    return { success: true };
};

const mockNegotiateConsignment = async (id: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Negotiating consignment ${id} with comment: ${comment}`);
    return { success: true };
};

const mockApproveConsignment = async (id: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Approved consignment ${id} with comment: ${comment}`);
    return { success: true };
};

interface ConsignmentApprovalProps {
    consignSaleId: string;
    initialStatus: string;
}

export const ConsignmentApproval: React.FC<ConsignmentApprovalProps> = ({ consignSaleId, initialStatus }) => {
    const [comment, setComment] = useState<string>('');
    const [status, setStatus] = useState<string>(initialStatus);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setStatus(initialStatus);
    }, [initialStatus]);

    const handleReject = async () => {
        setIsLoading(true);
        try {
            await mockRejectConsignment(consignSaleId, comment);
            setStatus('Rejected');
        } catch (error) {
            console.error('Error rejecting consignment:', error);
        }
        setIsLoading(false);
    };

    const handleNotifyDelivery = async () => {
        setIsLoading(true);
        try {
            await mockNotifyDelivery(consignSaleId, comment);
            setStatus('Delivery Notified');
        } catch (error) {
            console.error('Error notifying delivery:', error);
        }
        setIsLoading(false);
    };

    const handleConfirmReceived = async () => {
        setIsLoading(true);
        try {
            await mockConfirmReceived(consignSaleId, comment);
            setStatus('Received');
        } catch (error) {
            console.error('Error confirming received:', error);
        }
        setIsLoading(false);
    };

    const handleNegotiate = async () => {
        setIsLoading(true);
        try {
            await mockNegotiateConsignment(consignSaleId, comment);
            setStatus('In Negotiation');
        } catch (error) {
            console.error('Error starting negotiation:', error);
        }
        setIsLoading(false);
    };

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            await mockApproveConsignment(consignSaleId, comment);
            setStatus('Approved');
        } catch (error) {
            console.error('Error approving consignment:', error);
        }
        setIsLoading(false);
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
                            disabled={isLoading || !['Pending', 'Delivery Notified', 'Received', 'In Negotiation'].includes(status)}
                        >
                            <KTIcon iconName='cross' className='fs-2 me-2'/>
                            Reject
                        </button>
                        <button
                            className='btn btn-warning me-3 mb-3'
                            onClick={handleNotifyDelivery}
                            disabled={isLoading || status !== 'Pending'}
                        >
                            <KTIcon iconName='notification' className='fs-2 me-2'/>
                            Notify Delivery
                        </button>
                        <button
                            className='btn btn-info me-3 mb-3'
                            onClick={handleConfirmReceived}
                            disabled={isLoading || status !== 'Delivery Notified'}
                        >
                            <KTIcon iconName='check-circle' className='fs-2 me-2'/>
                            Confirm Received
                        </button>
                        <button
                            className='btn btn-primary me-3 mb-3'
                            onClick={handleNegotiate}
                            disabled={isLoading || !['Received', 'In Negotiation'].includes(status)}
                        >
                            <KTIcon iconName='message-text-2' className='fs-2 me-2'/>
                            Negotiate
                        </button>
                        <button
                            className='btn btn-success mb-3'
                            onClick={handleApprove}
                            disabled={isLoading || !['Received', 'In Negotiation'].includes(status)}
                        >
                            <KTIcon iconName='check' className='fs-2 me-2'/>
                            Approve
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending':
            return 'warning';
        case 'Rejected':
            return 'danger';
        case 'Delivery Notified':
            return 'primary';
        case 'Received':
            return 'info';
        case 'In Negotiation':
            return 'light';
        case 'Approved':
            return 'success';
        default:
            return 'primary';
    }
};

export default ConsignmentApproval;