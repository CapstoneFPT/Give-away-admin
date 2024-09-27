import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { AuctionApi, AuctionStatus, AuctionListResponse } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { Link } from "react-router-dom";
import { formatBalance } from "../utils/utils";
import { Tabs, Tab } from "react-bootstrap";

type Props = {
  className: string;
};

const AuctionList: React.FC<Props> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | "All">(
    "All"
  );
  const [activeTab, setActiveTab] = useState<"Expired" | "Not Expired">(
    "Not Expired"
  );
  const pageSize = 8;

  const fetchAuctions = useCallback(async () => {
    const auctionApi = new AuctionApi();
    const response = await auctionApi.apiAuctionsGet(
      searchTerm,
      activeTab === "Expired",
      statusFilter !== "All" ? [statusFilter as AuctionStatus] : undefined,
      currentPage,
      pageSize
    );
    return response.data;
  }, [searchTerm, activeTab, statusFilter, currentPage, pageSize]);

  const { data, isLoading, error } = useQuery(
    ["Auctions", currentPage, searchTerm, activeTab, statusFilter],
    async () => {
      const response = await fetchAuctions();
      return response;
    },
    { keepPreviousData: true }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as AuctionStatus | "All");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Content>
      <KTCard className={className}>
        <KTCardBody>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
            <h3 className="card-title mb-3 mb-md-0">
              <span className="card-label fw-bold fs-3 mb-1">
                Auctions List
              </span>
              <span className="text-muted mt-1 fw-semibold fs-7 d-block">
                Total: {data?.totalCount} auctions
              </span>
            </h3>
            <div className="d-flex flex-column flex-md-row gap-3">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Search auctions"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <select
                className="form-select form-select-solid"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="All">All Statuses</option>
                {Object.values(AuctionStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k as "Expired" | "Not Expired");
              setCurrentPage(1);
            }}
            className="mb-4 nav-tabs-custom "
          >
            <Tab
              eventKey="Not Expired"
              title="Not Expired"
              tabClassName="flex-fill text-center"
            >
              {renderAuctionList()}
            </Tab>
            <Tab
              eventKey="Expired"
              title="Expired"
              tabClassName="flex-fill text-center"
            >
              {renderAuctionList()}
            </Tab>
          </Tabs>
        </KTCardBody>
      </KTCard>
    </Content>
  );

  function renderAuctionList() {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger">
          An error occurred: {(error as Error).message}
        </div>
      );
    }

    return (
      <>
        <div className="row g-4">
          {data != undefined ? data.items != undefined ? data.items.map((auction: AuctionListResponse) => (
            <div key={auction.auctionId} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={auction.imageUrl ?? ""}
                  className="card-img-top"
                  alt={auction.title ?? ""}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">
                    <strong>{auction.title}</strong>
                  </h5>
                  <p className="card-text">
                    <strong>Date:</strong>{" "}
                    {new Date(auction.startDate ?? "").toLocaleDateString()}
                  </p>
                  <p className="card-text small">
                    <strong>Start:</strong>{" "}
                    {new Date(auction.startDate ?? "").toLocaleTimeString()}
                  </p>
                  <p className="card-text small">
                    <strong>End:</strong>{" "}
                    {new Date(auction.endDate ?? "").toLocaleTimeString()}
                  </p>
                  <p className="card-text">
                    <strong>Deposit Fee:</strong>{" "}
                    {formatBalance(auction.depositFee || 0)} VND
                  </p>
                  <p className="card-text">
                    <strong>Initial Price:</strong>{" "}
                    {formatBalance(auction.initialPrice || 0)} VND
                  </p>
                  {auction.status === AuctionStatus.Finished && (
                    <p className="card-text">
                      <strong>Successful Bid Amount:</strong>{" "}
                      {auction.sucessfulBidAmount
                        ? formatBalance(auction.sucessfulBidAmount)
                        : "No one bidding"}
                    </p>
                  )}
                  <div className="d-flex justify-content-center align-items-center mb-5">
                    <span
                      className={`badge badge-light-${getStatusColor(
                        auction.status
                      )}`}
                    >
                      <strong>{auction.status}</strong>
                    </span>
                  </div>

                  <Link
                    to={`/auction/${auction.auctionId}`}
                    className="btn btn-sm btn-primary mt-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )) : "No auction available" : "No auction available" }
        </div>

        <div className="d-flex justify-content-between align-items-center mt-5">
          <span className="text-muted">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, data?.totalCount || 0)} of{" "}
            {data?.totalCount} entries
          </span>
          <div>
            <button
              className="btn btn-sm btn-light-primary me-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <KTIcon iconName="arrow-left" className="fs-2" /> Previous
            </button>
            <button
              className="btn btn-sm btn-light-primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data?.hasNext}
            >
              Next <KTIcon iconName="arrow-right" className="fs-2" />
            </button>
          </div>
        </div>
      </>
    );
  }
};

const getStatusColor = (status: AuctionStatus | undefined) => {
  switch (status) {
    case AuctionStatus.Pending:
      return "warning";
    case AuctionStatus.Approved:
      return "success";
    case AuctionStatus.Rejected:
      return "danger";
    case AuctionStatus.OnGoing:
      return "info";
    case AuctionStatus.Finished:
      return "primary";
    default:
      return "secondary";
  }
};

export default AuctionList;
