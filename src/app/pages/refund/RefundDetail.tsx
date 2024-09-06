import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { RefundApi, RefundResponse, RefundStatus, ApprovalRefundRequest } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance, formatDate } from "../utils/utils";
import KTInfoItem from "../../../_metronic/helpers/components/KTInfoItem";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KTModal from "../../../_metronic/helpers/components/KTModal";

interface ImageGalleryProps {
  images: string[];
  onImageSelect: (image: string) => void;
  onImageClick: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageSelect, onImageClick }) => {
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onImageSelect(image);
    onImageClick(image);
  };

  return (
    <div className="d-flex flex-nowrap overflow-auto" style={{ maxHeight: '300px' }}>
      {images.map((image, index) => (
        <img 
          key={index} 
          src={image} 
          alt={`Image ${index + 1}`} 
          className={`img-thumbnail m-2 cursor-pointer ${selectedImage === image ? 'border-primary' : ''}`}
          style={{width: '200px', height: '200px', objectFit: 'cover', flexShrink: 0}}
          onClick={() => handleImageClick(image)}
        />
      ))}
    </div>
  );
};

const RefundDetail: React.FC = () => {
  const { refundId } = useParams<{ refundId: string }>();
  const refundApi = new RefundApi();
  const [selectedImage, setSelectedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const queryClient = useQueryClient();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRefundApproved, setIsRefundApproved] = useState(false);

  const { data, isLoading, error } = useQuery<RefundResponse | undefined, Error>(
    ["RefundDetail", refundId],
    async () => {
      const response = await refundApi.apiRefundsRefundIdGet(refundId!);
      setIsRefundApproved(response.data.refundStatus === RefundStatus.Approved);
      return response.data;
    }
  );

  const confirmReceivedMutation = useMutation(
    () => refundApi.apiRefundsRefundIdConfirmReceivedAndRefundPut(refundId!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["RefundDetail", refundId]);
        toast.success("Item received confirmation successful");
      },
      onError: (error) => {
        toast.error(`Error: ${(error as Error).message}`);
      },
    }
  )

  const approveMutation = useMutation(
    ({
      status,
      description,
      refundPercentage
    }: ApprovalRefundRequest) => refundApi.apiRefundsRefundIdApprovalPut(refundId!, { status, description, refundPercentage }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["RefundDetail", refundId]);
        toast.success(`Refund ${status === RefundStatus.Approved ? 'approved' : 'rejected'} successfully`);
      },
      onError: (error) => {
        toast.error(`Error: ${(error as Error).message}`);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!data) return <div>No data found</div>;

  const getStatusColor = (status: RefundStatus) => {
    switch (status) {
      case RefundStatus.Pending:
        return 'warning';
      case RefundStatus.Approved:
        return 'success';
      case RefundStatus.Rejected:
        return 'danger';
      default:
        return 'primary';
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleApproval = () => {
    setIsApprovalModalOpen(true);
  };

  const handleConfirmReceived = () => {
    confirmReceivedMutation.mutate();
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleApprovalConfirm = (refundPercentage: number, description: string) => {
    approveMutation.mutate({
      status: RefundStatus.Approved,
      description,
      refundPercentage
    });
    setIsApprovalModalOpen(false);
  };

  const handleRejectConfirm = () => {
    approveMutation.mutate({
      status: RefundStatus.Rejected,
      description: rejectReason
    });
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  return (
    <>
      <Content>
        <KTCard>
          <KTCardBody>
            <div className="row g-5 g-xl-8">
              {/* Left side - Images */}
              <div className="col-xl-5">
                <h3 className="card-title align-items-start flex-column mb-5">
                  <span className="card-label fw-bold text-dark">Item Images</span>
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <ImageGallery
                    images={data.itemImages || []}
                    onImageSelect={setSelectedImage}
                    onImageClick={handleImageClick}
                  />
                </div>

                <h3 className="card-title align-items-start flex-column mb-5 mt-8">
                  <span className="card-label fw-bold text-dark">Refund Images</span>
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <ImageGallery
                    images={data.imagesForCustomer || []}
                    onImageSelect={setSelectedImage}
                    onImageClick={handleImageClick}
                  />
                </div>
              </div>

              {/* Right side - Refund Information */}
              <div className="col-xl-7">
                <KTCard>
                  <KTCardBody>
                    <h3 className="card-title align-items-start flex-column mb-5">
                      <span className="card-label fw-bold text-dark">Refund Details</span>
                    </h3>
                    <div className="d-flex flex-wrap mb-5">
                      <KTInfoItem iconName="dollar" title="Refund Amount" value={data.refundAmount ? formatBalance(data.refundAmount) + ' VND' : 'N/A'} />
                      <KTInfoItem iconName="percentage" title="Refund Percentage" value={data.refundPercentage ? `${data.refundPercentage}%` : 'N/A'} />
                    </div>
                    {data.description && (
                      <div className="mb-5">
                        <h4 className="fw-bold mb-3">Description</h4>
                        <p>{data.description}</p>
                      </div>
                    )}
                    {data.responseFromShop && (
                      <div className="mb-5">
                        <h4 className="fw-bold mb-3">Shop Response</h4>
                        <p>{data.responseFromShop}</p>
                      </div>
                    )}
                    {data.refundStatus === RefundStatus.Pending && (
                      <div className="d-flex justify-content-end mt-5">
                        <button
                          className="btn btn-light-success me-3"
                          onClick={handleApproval}
                          disabled={approveMutation.isLoading}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-light-danger"
                          onClick={handleReject}
                          disabled={approveMutation.isLoading}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {isRefundApproved && (
                      <div className="d-flex justify-content-end mt-5">
                        <button
                          className="btn btn-light-primary"
                          onClick={handleConfirmReceived}
                          disabled={confirmReceivedMutation.isLoading}
                        >
                          {confirmReceivedMutation.isLoading ? (
                            <span className="indicator-progress" style={{display: "block"}}>
                              Please wait...
                              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                          ) : (
                            <>
                              <KTIcon iconName="check" className="fs-2 me-2" />
                              Confirm Received Item
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </KTCardBody>
                </KTCard>

                <KTCard className="mt-5">
                  <KTCardBody>
                    <h3 className="card-title align-items-start flex-column mb-5">
                      <span className="card-label fw-bold text-dark">Order Information</span>
                    </h3>
                    <div className="d-flex flex-wrap mb-5">
                      <KTInfoItem iconName="information" title="Status" value={
                        <span className={`badge badge-light-${getStatusColor(data.refundStatus!)}`}>
                          {data.refundStatus}
                        </span>
                      } />
                      <KTInfoItem iconName="calendar" title="Created Date" value={formatDate(data.createdDate!)} />
                      <KTInfoItem iconName="tag" title="Order Code" value={data.orderCode || 'N/A'} />
                      <KTInfoItem iconName="code" title="Item Code" value={data.itemCode || 'N/A'} />
                      <KTInfoItem iconName="basket" title="Item Name" value={data.itemName || 'N/A'} />
                      <KTInfoItem iconName="dollar" title="Unit Price" value={data.unitPrice ? formatBalance(data.unitPrice) + ' VND' : 'N/A'} />
                      <KTInfoItem iconName="user" title="Customer Name" value={data.customerName || 'N/A'} />
                      <KTInfoItem iconName="phone" title="Customer Phone" value={data.customerPhone || 'N/A'} />
                      <KTInfoItem iconName="sms" title="Customer Email" value={data.customerEmail || 'N/A'} />
                    </div>
                  </KTCardBody>
                </KTCard>
              </div>
            </div>
          </KTCardBody>
        </KTCard>
      </Content>
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Full Image</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedImage}
                  alt="Full Refund Image"
                  className="img-fluid"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
      />
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApprovalConfirm}
        isLoading={approveMutation.isLoading}
      />
      <ToastContainer autoClose={2000} position="top-right" />
    </>
  );
};

const RejectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
}> = ({ isOpen, onClose, onConfirm, rejectReason, setRejectReason }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reject Refund</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="rejectReason" className="form-label">Reason for Rejection</label>
                <textarea
                  id="rejectReason"
                  className="form-control"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  required
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirm Rejection</button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (refundPercentage: number, description: string) => void;
  isLoading: boolean;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  const [refundPercentage, setRefundPercentage] = useState<number>(100);
  const [description, setDescription] = useState<string>('');

  const handleConfirm = () => {
    onConfirm(refundPercentage, description);
  };

  return (
    <KTModal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Refund"
      footer={
        <>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={isLoading || refundPercentage <= 0 || refundPercentage > 100 || !description.trim()}
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
      <div className="mb-3">
        <label htmlFor="refundPercentage" className="form-label">Refund Percentage</label>
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
        <label htmlFor="description" className="form-label">Response</label>
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

export default RefundDetail;