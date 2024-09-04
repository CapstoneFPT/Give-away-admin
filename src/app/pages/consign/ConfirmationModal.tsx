import React from 'react';
import KTModal from "../../../_metronic/helpers/components/KTModal.tsx";
import { formatBalance } from "../utils/utils";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    dealPrice: string;
    isLoading: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    dealPrice,
    isLoading
}) => {
    return (
        <KTModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Deal Price"
            footer={
                <>
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="indicator-progress" style={{display: "block"}}>
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        ) : 'Confirm'}
                    </button>
                </>
            }
        >
            <p>Are you sure you want to set the deal price to {formatBalance(parseFloat(dealPrice))} VND?</p>
            <p>This action will mark the item as ready for consignment.</p>
        </KTModal>
    );
};