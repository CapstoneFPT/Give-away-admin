import React from 'react';
import KTModal from "../../../_metronic/helpers/components/KTModal";

interface RejectConsignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    rejectReason: string;
    setRejectReason: (reason: string) => void;
    isLoading: boolean;
}

export const RejectConsignmentModal: React.FC<RejectConsignmentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    rejectReason,
    setRejectReason,
    isLoading
}) => {
    return (
        <KTModal
            isOpen={isOpen}
            onClose={onClose}
            title="Reject Consignment"
            footer={
                <>
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={!rejectReason.trim() || isLoading}
                    >
                        {isLoading ? (
                            <span className="indicator-progress" style={{display: "block"}}>
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        ) : 'Confirm Rejection'}
                    </button>
                </>
            }
        >
            <div className="mb-3">
                <label htmlFor="rejectReason" className="form-label">Reason for Rejection:</label>
                <textarea
                    className="form-control"
                    id="rejectReason"
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this consignment..."
                ></textarea>
            </div>
        </KTModal>
    );
};