import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { AuctionApi, AuctionStatus, AuctionListResponse } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { Link } from "react-router-dom";

type Props = {
  className: string;
};

const AuctionAdminList: React.FC<Props> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | null>(null);
  const [expired, setExpired] = useState<boolean>(false);
  const pageSize = 12;

  const fetchAuctions = useCallback(
    async (page: number) => {
      const auctionApi = new AuctionApi();
      const response = await auctionApi.apiAuctionsGet(
        searchTerm,
        expired,
        statusFilter ? [statusFilter] : undefined,
        page,
        pageSize
      );
      return response.data;
    },
    [searchTerm, expired, statusFilter]
  );

  const { data, isLoading, error } = useQuery(
    ["Auctions", currentPage, searchTerm, statusFilter, expired],
    () => fetchAuctions(currentPage),
    { keepPreviousData: true }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value ? (e.target.value as AuctionStatus) : null);
    setCurrentPage(1);
  };

  const handleExpiredFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setExpired(e.target.value === "" ? false : e.target.value === "true");
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
                value={statusFilter ?? ""}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                {Object.values(AuctionStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                className="form-select form-select-solid"
                value={expired === undefined ? "" : expired.toString()}
                onChange={handleExpiredFilterChange}
              >
                <option value="">All</option>
                <option value="true">Expired</option>
                <option value="false">Not Expired</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              An error occurred: {(error as Error).message}
            </div>
          ) : (
            <>
              <div className="row g-4">
                {data?.items?.map((auction: AuctionListResponse) => (
                  <div
                    key={auction.auctionId}
                    className="col-sm-6 col-md-4 col-lg-3"
                  >
                    <div className="card h-100 shadow-sm">
                      <img
                        src={auction.imageUrl ?? ""}
                        className="card-img-top"
                        alt={auction.title ?? ""}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title text-truncate">
                          {auction.title}
                        </h5>
                        <p className="card-text small">
                          Start:{" "}
                          {new Date(auction.startDate ?? "").toLocaleString()}
                        </p>
                        <p className="card-text small">
                          End:{" "}
                          {new Date(auction.endDate ?? "").toLocaleString()}
                        </p>
                        <p className="card-text">
                          Deposit: ${auction.depositFee?.toFixed(2)}
                        </p>
                        <span
                          className={`badge badge-light-${getStatusColor(
                            auction.status
                          )} mb-2`}
                        >
                          {auction.status}
                        </span>
                        <Link
                          to={`/auction-admin/${auction.auctionId}`}
                          className="btn btn-sm btn-primary mt-auto"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
          )}
        </KTCardBody>
      </KTCard>
    </Content>
  );
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

export default AuctionAdminList;
