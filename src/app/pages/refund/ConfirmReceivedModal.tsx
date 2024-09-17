import { useState } from "react";
import KTModal from "../../../_metronic/helpers/components/KTModal";

export interface ConfirmReceivedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (refundPercentage: number, description: string) => void;
  isLoading: boolean;
}

export const ConfirmReceivedModal: React.FC<ConfirmReceivedModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [refundPercentage, setRefundPercentage] = useState<number>(100);
  const [description, setDescription] = useState<string>("");

  const handleConfirm = () => {
    onConfirm(refundPercentage, description);
  };

  return (
    <KTModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Received Product"
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={
              isLoading ||
              refundPercentage <= 0 ||
              refundPercentage > 100 ||
              !description.trim()
            }
          >
            {isLoading ? (
              <span className="indicator-progress" style={{ display: "block" }}>
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            ) : (
              "Confirm"
            )}
          </button>
        </>
      }
    >
      <div className="mb-3">
        <label htmlFor="refundPercentage" className="form-label">
          Refund Percentage
        </label>
        <input
          type="number"
          className="form-control"
          id="refundPercentage"
          value={refundPercentage}
          onChange={(e) => setRefundPercentage(Number(e.target.value))}
          min="1"
          max="100"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Response
        </label>
        <textarea
          className="form-control"
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your response..."
        ></textarea>
      </div>
    </KTModal>
  );
};
