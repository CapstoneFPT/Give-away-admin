import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { AuctionApi, FashionItemStatus } from "../../../api";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";

import { formatBalance } from "../utils/utils";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { AuctionStatus } from "../../../api";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const AuctionDetail: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [depositCurrentPage, setDepositCurrentPage] = useState(1);
  const [bidSearchTermName, setBidSearchTermName] = useState("");
  const [bidSearchTermPhone, setBidSearchTermPhone] = useState("");
  const [depositSearchTerm, setDepositSearchTerm] = useState("");
  const pageSize = 10;
  const depositPageSize = 10;
  const auctionApi = new AuctionApi();

  const debouncedBidSearchTermName = useDebounce(bidSearchTermName, 300);
  const debouncedBidSearchTermPhone = useDebounce(bidSearchTermPhone, 300);
  const debouncedDepositSearchTerm = useDebounce(depositSearchTerm, 300);

  const getAuctionStatus = (status: string) => {
    switch (status) {
      case AuctionStatus.Approved:
        return "purple";
      case AuctionStatus.Finished:
        return "green";
      case AuctionStatus.OnGoing:
        return "blue";
      case AuctionStatus.Pending:
        return "orange";
      case AuctionStatus.Rejected:
        return "red";
      default:
        return "secondary";
    }
  };

  const { data: auctionData, isLoading: isLoadingAuction } = useQuery({
    queryKey: ["auction", auctionId],
    queryFn: () => auctionApi.apiAuctionsIdGet(auctionId!),
  });

  const { data: bidsData, isLoading: isLoadingBids } = useQuery({
    queryKey: [
      "bids",
      auctionId,
      currentPage,
      pageSize,
      debouncedBidSearchTermName,
      debouncedBidSearchTermPhone,
    ],
    queryFn: () =>
      auctionApi.apiAuctionsIdBidsGet(
        auctionId!,
        currentPage,
        pageSize,
        null!,
        debouncedBidSearchTermName,
        debouncedBidSearchTermPhone
      ),
  });
  console.log(bidsData);
  const { data: itemData, isLoading: isLoadingItem } = useQuery({
    queryKey: ["auctionItem", auctionId],
    queryFn: () => auctionApi.apiAuctionsIdAuctionItemGet(auctionId!),
  });

  const { data: depositData, isLoading: isLoadingDeposits } = useQuery({
    queryKey: [
      "deposits",
      auctionId,
      depositCurrentPage,
      depositPageSize,
      debouncedDepositSearchTerm,
    ],
    queryFn: () =>
      auctionApi.apiAuctionsAuctionIdDepositsGet(
        auctionId!,
        depositCurrentPage,
        depositPageSize,
        debouncedDepositSearchTerm
      ),
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDepositPageChange = (newPage: number) => {
    setDepositCurrentPage(newPage);
  };

  const handleBidSearchName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBidSearchTermName(e.target.value);
    },
    []
  );

  const handleBidSearchPhone = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBidSearchTermPhone(e.target.value);
    },
    []
  );

  const handleDepositSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDepositSearchTerm(e.target.value);
    },
    []
  );

  // Reset pages when search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedBidSearchTermName, debouncedBidSearchTermPhone]);

  useEffect(() => {
    setDepositCurrentPage(1);
  }, [debouncedDepositSearchTerm]);

  if (isLoadingAuction || isLoadingItem) {
    return <Spinner animation="border" />;
  }

  const auction = auctionData?.data;
  const bids = bidsData?.data.items || [];
  const item = itemData?.data;
  const deposits = depositData?.data.items || [];

  const bidColumns = [
    {
      Header: "Bidder Name",
      accessor: "memberName",
    },
    {
      Header: "Bidder Phone",
      accessor: "phone",
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ value }: { value: number }) => `${formatBalance(value)} VND`,
    },
    {
      Header: "Date",
      accessor: "createdDate",
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleString(),
    },
  ];

  const depositColumns = [
    {
      Header: "Deposit Code",
      accessor: "depositCode",
    },
    {
      Header: "User Name",
      accessor: "customerName",
    },
    {
      Header: "User Phone",
      accessor: "customerPhone",
    },

    {
      Header: "Deposit Amount",
      accessor: "amount",
      Cell: ({ value }: { value: number }) => `${formatBalance(value)} VND`,
    },
    {
      Header: "Deposit Date",
      accessor: "depositDate",
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleString(),
    },
  ];

  const getStatusColor = (status: FashionItemStatus | undefined) => {
    switch (status) {
      case FashionItemStatus.Available:
        return "success";
      case FashionItemStatus.Unavailable:
        return "danger";
      case FashionItemStatus.OnDelivery:
        return "warning";
      case FashionItemStatus.ReadyForDelivery:
        return "info";
      case FashionItemStatus.Sold:
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <Container fluid>
      <Button
        variant="dark"
        onClick={() => window.history.back()}
        className="mb-3"
      >
        Back
      </Button>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Auction Details</Card.Title>
              <dl className="row">
                <dt className="col-sm-4">Title</dt>
                <dd className="col-sm-8">{auction?.title}</dd>
                <dt className="col-sm-4">Start Date</dt>
                <dd className="col-sm-8">
                  {new Date(auction?.startDate || "").toLocaleString()}
                </dd>
                <dt className="col-sm-4">End Date</dt>
                <dd className="col-sm-8">
                  {new Date(auction?.endDate || "").toLocaleString()}
                </dd>
                <dt className="col-sm-4">Status</dt>
                <dd className="col-sm-8">
                  <Badge bg={getAuctionStatus(auction?.status || "")}>
                    {auction?.status}
                  </Badge>
                </dd>
                <dt className="col-sm-4">Deposit Fee</dt>
                <dd className="col-sm-8">
                  {formatBalance(auction?.depositFee || 0)} VND
                </dd>
                <dt className="col-sm-4">Step Increment (VND)</dt>
                <dd className="col-sm-8">
                  {formatBalance(auction?.stepIncrement || 0)} VND
                </dd>
                <dt className="col-sm-4">Auction Code</dt>
                <dd className="col-sm-8">{auction?.auctionCode}</dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Product Details</Card.Title>
              <div className="mb-3">
                {item != undefined ? item.images != undefined ? item.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                )) : "No image available" : "No image available"}
              </div>
              <dl className="row">
                <dt className="col-sm-4">Product Code</dt>
                <dd className="col-sm-8">{item?.itemCode}</dd>
                <dt className="col-sm-4">Initial Price</dt>
                <dd className="col-sm-8">
                  {formatBalance(item?.initialPrice || 0)} VND
                </dd>
                <dt className="col-sm-4">Product Name</dt>
                <dd className="col-sm-8">{item?.name}</dd>
                <dt className="col-sm-4">Status</dt>
                <dd className="col-sm-8">
                  <Badge bg={getStatusColor(item?.status)}>
                    {item?.status}
                  </Badge>
                </dd>
                <dt className="col-sm-4">Condition</dt>
                <dd className="col-sm-8">{item?.condition}</dd>
                <dt className="col-sm-4">Brand</dt>
                <dd className="col-sm-8">{item?.brand}</dd>
                <dt className="col-sm-4">Color</dt>
                <dd className="col-sm-8">{item?.color}</dd>
                <dt className="col-sm-4">Size</dt>
                <dd className="col-sm-8">{item?.size}</dd>
                <dt className="col-sm-4">Gender</dt>
                <dd className="col-sm-8">{item?.gender}</dd>
                <dt className="col-sm-4">Description</dt>
                <dd className="col-sm-8">{item?.description}</dd>
                <dt className="col-sm-4">Note</dt>
                <dd className="col-sm-8">{item?.note}</dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Bid History</Card.Title>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by phone number"
                  value={bidSearchTermPhone}
                  onChange={handleBidSearchPhone}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={bidSearchTermName}
                  onChange={handleBidSearchName}
                />
              </Form.Group>
              <KTTable
                columns={bidColumns}
                data={bids}
                totalCount={bidsData?.data.totalCount || 0}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                loading={
                  isLoadingBids ||
                  bidSearchTermName !== debouncedBidSearchTermName ||
                  bidSearchTermPhone !== debouncedBidSearchTermPhone
                }
                totalPages={bidsData?.data.totalPages || 1}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Deposit List</Card.Title>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by deposit code"
                  value={depositSearchTerm}
                  onChange={handleDepositSearch}
                />
              </Form.Group>
              <KTTable
                columns={depositColumns}
                data={deposits}
                totalCount={depositData?.data.totalCount || 0}
                currentPage={depositCurrentPage}
                pageSize={depositPageSize}
                onPageChange={handleDepositPageChange}
                loading={
                  isLoadingDeposits ||
                  depositSearchTerm !== debouncedDepositSearchTerm
                }
                totalPages={depositData?.data.totalPages || 1}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionDetail;
