import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  RefundApi,
  RefundResponse,
  RefundStatus,
  ApprovalRefundRequest,
  ConfirmReceivedRequest,
} from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { formatBalance, formatDate } from "../utils/utils";
import KTInfoItem from "../../../_metronic/helpers/components/KTInfoItem";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KTModal from "../../../_metronic/helpers/components/KTModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import { ConfirmReceivedModal } from "./ConfirmReceivedModal";
import { RejectModal } from "./RejectModal";

interface ImageGalleryProps {
  images: string[];
  onImageSelect: (image: string) => void;
  onImageClick: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImageSelect,
  onImageClick,
}) => {
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    onImageSelect(image);
    onImageClick(image);
  };

  return (
    <div
      className="d-flex flex-nowrap overflow-auto"
      style={{ maxHeight: "300px" }}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          className={`img-thumbnail m-2 cursor-pointer ${selectedImage === image ? "border-primary" : ""
            }`}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            flexShrink: 0,
          }}
          onClick={() => handleImageClick(image)}
        />
      ))}
    </div>
  );
};

const RefundDetail: React.FC = () => {
  const { refundId } = useParams<{ refundId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const refundApi = new RefundApi();
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const queryClient = useQueryClient();
  const [isConfirmReceivedModalOpen, setIsConfirmReceivedModalOpen] = useState(false);
  const [isRefundApproved, setIsRefundApproved] = useState(false);

  const { data, isLoading, error } = useQuery<
    RefundResponse | undefined,
    Error
  >(["RefundDetail", refundId], async () => {
    const response = await refundApi.apiRefundsRefundIdGet(refundId!);
    setIsRefundApproved(response.data.refundStatus === RefundStatus.Approved);
    return response.data;
  });

  const confirmReceivedMutation = useMutation(
    ({ refundPercentage, responseFromShop, status }: ConfirmReceivedRequest) => refundApi.apiRefundsRefundIdConfirmReceivedAndRefundPut(refundId!, {
      refundPercentage,
      responseFromShop,
      status
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["RefundDetail", refundId]);
        toast.success("Item received confirmation successful");
      },
      onError: (error) => {
        toast.error(`Error: ${(error as Error).message}`);
      },
    }
  );

  const approveMutation = useMutation(
    ({ status }: ApprovalRefundRequest) =>
      refundApi.apiRefundsRefundIdApprovalPut(refundId!, {
        status,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["RefundDetail", refundId]);
        toast.success(
          `Refund ${status === RefundStatus.Approved ? "approved" : "rejected"
          } successfully`
        );
      },
      onError: (error) => {
        toast.error(`Error: ${(error as Error).message}`);
      },
    }
  );

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!data) return <div>No data found</div>;

  const getStatusColor = (status: RefundStatus) => {
    switch (status) {
      case RefundStatus.Pending:
        return "warning";
      case RefundStatus.Approved:
        return "success";
      case RefundStatus.Rejected:
        return "danger";
      default:
        return "primary";
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmReceivedModalOpen(true);
  };

  const handleConfirmReceived = (refundPercentage: number, responseFromShop: string) => {
    confirmReceivedMutation.mutate({
      refundPercentage,
      responseFromShop,
      status: RefundStatus.Completed
    });
    setIsConfirmReceivedModalOpen(false);
  };


  const handleApprove = () => {
    approveMutation.mutate({
      status: RefundStatus.Approved,
    });
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    approveMutation.mutate({
      status: RefundStatus.Rejected,
      responseFromShop: rejectReason,
    });
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  return (
    <>
      <Content>
        <KTCard>
          <KTCardBody>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold text-dark">
                  Refund Details
                </span>
              </h3>
              <button
                className="btn btn-sm btn-light-primary"
                onClick={handleBack}
              >
                <KTIcon iconName="arrow-left" className="fs-2 me-2" />
                Back
              </button>
            </div>
            <div className="row g-5 g-xl-8">
              {/* Left side - Images */}
              <div className="col-xl-5">
                <h3 className="card-title align-items-start flex-column mb-5">
                  <span className="card-label fw-bold text-dark">
                    Item Images
                  </span>
                </h3>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <ImageGallery
                    images={data.itemImages || []}
                    onImageSelect={setSelectedImage}
                    onImageClick={handleImageClick}
                  />
                </div>

                <h3 className="card-title align-items-start flex-column mb-5 mt-8">
                  <span className="card-label fw-bold text-dark">
                    Refund Images
                  </span>
                </h3>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
                      <span className="card-label fw-bold text-dark">
                        Refund Details
                      </span>
                    </h3>
                    <div className="d-flex flex-wrap mb-5">
                      <KTInfoItem
                        iconName="dollar"
                        title="Refund Amount"
                        value={
                          data.refundAmount
                            ? formatBalance(data.refundAmount) + " VND"
                            : "N/A"
                        }
                      />
                      <KTInfoItem
                        iconName="percentage"
                        title="Refund Percentage"
                        value={
                          data.refundPercentage
                            ? `${data.refundPercentage}%`
                            : "N/A"
                        }
                      />
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
                    {data.refundStatus === RefundStatus.Pending && currentUser?.role === "Staff" && (
                      <div className="d-flex justify-content-end mt-5">
                        <button
                          className="btn btn-light-success me-3"
                          onClick={handleApprove}
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
                    {data.refundStatus === RefundStatus.Approved && currentUser?.role === "Staff" && (
                      <div className="d-flex justify-content-end mt-5">
                        <button
                          className="btn btn-light-danger"
                          onClick={handleReject}
                          disabled={approveMutation.isLoading}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {isRefundApproved && currentUser?.role === "Staff" && (
                      <div className="d-flex justify-content-end mt-5">
                        <button
                          className="btn btn-light-primary"
                          onClick={handleOpenConfirmModal}
                          disabled={confirmReceivedMutation.isLoading}
                        >
                          {confirmReceivedMutation.isLoading ? (
                            <span
                              className="indicator-progress"
                              style={{ display: "block" }}
                            >
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
                      <span className="card-label fw-bold text-dark">
                        Order Information
                      </span>
                    </h3>
                    <div className="d-flex flex-wrap mb-5">
                      <KTInfoItem
                        iconName="information"
                        title="Status"
                        value={
                          <span
                            className={`badge badge-light-${getStatusColor(
                              data.refundStatus!
                            )}`}
                          >
                            {data.refundStatus}
                          </span>
                        }
                      />
                      <KTInfoItem
                        iconName="calendar"
                        title="Created Date"
                        value={formatDate(data.createdDate!)}
                      />
                      <KTInfoItem
                        iconName="tag"
                        title="Order Code"
                        value={data.orderCode || "N/A"}
                      />
                      <KTInfoItem
                        iconName="code"
                        title="Item Code"
                        value={data.itemCode || "N/A"}
                      />
                      <KTInfoItem
                        iconName="basket"
                        title="Item Name"
                        value={data.itemName || "N/A"}
                      />
                      <KTInfoItem
                        iconName="dollar"
                        title="Unit Price"
                        value={
                          data.unitPrice
                            ? formatBalance(data.unitPrice) + " VND"
                            : "N/A"
                        }
                      />
                      <KTInfoItem
                        iconName="user"
                        title="Customer Name"
                        value={data.customerName || "N/A"}
                      />
                      <KTInfoItem
                        iconName="phone"
                        title="Customer Phone"
                        value={data.customerPhone || "N/A"}
                      />
                      <KTInfoItem
                        iconName="sms"
                        title="Customer Email"
                        value={data.customerEmail || "N/A"}
                      />
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
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedImage}
                  alt="Full Refund Image"
                  className="img-fluid"
                  style={{ width: "100%", height: "auto" }}
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
      <ConfirmReceivedModal
        isOpen={isConfirmReceivedModalOpen}
        onClose={() => setIsConfirmReceivedModalOpen(false)}
        onConfirm={handleConfirmReceived}
        isLoading={confirmReceivedMutation.isLoading}
      />
      <ToastContainer autoClose={2000} position="top-right" />
    </>
  );
};
export default RefundDetail;
