import React from 'react';
import { formatBalance } from "../utils/utils";
import KTModal from "../../../_metronic/helpers/components/KTModal.tsx";
import {ConsignSaleLineItemDetailedResponse} from "../../../api";

interface PriceDifferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ConsignSaleLineItemDetailedResponse;
    dealPrice: string;
    priceChangeExplanation: string;
    setPriceChangeExplanation: (value: string) => void;
    handlePriceDifferenceSubmit: () => void;
    negotiatePriceMutation: any;
}

export const PriceDifferenceModal: React.FC<PriceDifferenceModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              data,
                                                                              dealPrice,
                                                                              priceChangeExplanation,
                                                                              setPriceChangeExplanation,
                                                                              handlePriceDifferenceSubmit,
                                                                              negotiatePriceMutation
                                                                          }) => {
    return (
        <KTModal
            isOpen={isOpen}
            onClose={onClose}
            title="Price Difference Explanation"
            footer={
                <>
                    <button type="button" className="btn btn-light" onClick={onClose}>
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handlePriceDifferenceSubmit}
                        disabled={!priceChangeExplanation.trim() || negotiatePriceMutation.isLoading}
                    >
                        {negotiatePriceMutation.isLoading ? (
                            <span className="indicator-progress" style={{display: "block"}}>
                                Please wait...
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        ) : 'Submit'}
                    </button>
                </>
            }
        >
            <div className="mb-3">
                <p><strong>Expected Price:</strong> {formatBalance(data?.expectedPrice || 0)}</p>
                <p><strong>Submitted Deal Price:</strong> {formatBalance(parseFloat(dealPrice))}</p>
            </div>
            <div className="mb-3">
                <label htmlFor="priceChangeExplanation" className="form-label">Explanation for Price Difference:</label>
                <textarea
                    className="form-control"
                    id="priceChangeExplanation"
                    rows={3}
                    value={priceChangeExplanation}
                    onChange={(e) => setPriceChangeExplanation(e.target.value)}
                    placeholder="Please explain the reason for the price difference..."
                ></textarea>
            </div>
        </KTModal>
    );
};