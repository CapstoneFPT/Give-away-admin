import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InquiryApi, InquiryStatus } from "../../../api";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { Button, Collapse } from "react-bootstrap";
import { formatDate } from "../utils/utils";
import { showAlert } from "../../../utils/Alert";

const InquiriesTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(["inquiries", page], () => {
    const inquiryApi = new InquiryApi();
    return inquiryApi.apiInquiriesGet(page, pageSize);
  });
  console.log(data);
  const markAsDoneMutation = useMutation(
    (inquiryId: string) => {
      const inquiryApi = new InquiryApi();
      return inquiryApi.apiInquiriesInquiryIdPut(inquiryId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["inquiries"]);
        showAlert("success", "Inquiry marked as done");
      },
      onError: (error) => {
        console.error("Error marking inquiry as done:", error);
        showAlert("error", "Failed to mark inquiry as done");
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  const toggleInquiry = (inquiryId: string) => {
    setExpandedInquiry(expandedInquiry === inquiryId ? null : inquiryId);
  };

  return (
    <KTCard>
      <KTCardBody>
        <div className="table-responsive">
          <h1
            className="mb-4 text-center"
            style={{ fontSize: "60px", fontWeight: "bold" }}
          >
            Inquiries
          </h1>
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted">
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created Date</th>
                <th>Status</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data != undefined ? data.data != undefined ? data.data.items != undefined ? data.data.items.map((inquiry) => (
                <React.Fragment key={inquiry.inquiryId}>
                  <tr
                    onClick={() => toggleInquiry(inquiry.inquiryId ?? "")}
                    style={{ cursor: "pointer" }}
                    className={
                      expandedInquiry === inquiry.inquiryId
                        ? "table-active"
                        : ""
                    }
                  >
                    <td>{inquiry.fullname}</td>
                    <td>{inquiry.email}</td>
                    <td>{inquiry.phone}</td>
                    <td>{formatDate(inquiry.createdDate)}</td>
                    <td>{inquiry.status}</td>
                    <td style={{ height: "50px", position: "relative" }}>
                      {inquiry.status !== InquiryStatus.Completed && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsDoneMutation.mutate(inquiry.inquiryId ?? "");
                          }}
                          disabled={markAsDoneMutation.isLoading}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Mark as Done
                        </Button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="p-0">
                      <Collapse in={expandedInquiry === inquiry.inquiryId}>
                        <div className="p-3 bg-light">
                          <strong>Message:</strong> {inquiry.message}
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              )) : "No inquiry available" : "No inquiry available" : "No inquiry available"}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>
            Page {page} of {data?.data.totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data?.data.hasNext}
          >
            Next
          </Button>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default InquiriesTable;
