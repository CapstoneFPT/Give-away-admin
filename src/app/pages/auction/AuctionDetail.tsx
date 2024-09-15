import React, { useState } from "react";
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
} from "react-bootstrap";

import { formatBalance } from "../utils/utils";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { AuctionStatus } from "../../../api";

const AuctionDetail: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const auctionApi = new AuctionApi();

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
  console.log(auctionData);
  const { data: bidsData, isLoading: isLoadingBids } = useQuery({
    queryKey: ["bids", auctionId, currentPage, pageSize],
    queryFn: () =>
      auctionApi.apiAuctionsIdBidsGet(auctionId!, currentPage, pageSize),
  });

  const { data: itemData, isLoading: isLoadingItem } = useQuery({
    queryKey: ["auctionItem", auctionId],
    queryFn: () => auctionApi.apiAuctionsIdAuctionItemGet(auctionId!),
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoadingAuction || isLoadingBids || isLoadingItem) {
    return <Spinner animation="border" />;
  }

  const auction = auctionData?.data;
  const bids = bidsData?.data.items || [];
  const item = itemData?.data;

  const bidColumns = [
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
                {item?.images?.map((image: string, index: number) => (
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
                ))}
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
              <KTTable
                columns={bidColumns}
                data={bids}
                totalCount={bidsData?.data.totalCount || 0}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                loading={isLoadingBids}
                totalPages={bidsData?.data.totalPages || 1}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionDetail;
