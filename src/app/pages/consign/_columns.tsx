import React from "react";
import { Column } from "react-table";
import { ConsignSaleListResponse, ConsignSaleStatus } from "../../../api";
import { formatBalance } from "../utils/utils";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../_metronic/helpers";

const getStatusColor = (status?: ConsignSaleStatus) => {
  switch (status) {
    case "OnSale":
      return "success";
    case "Pending":
      return "warning";
    case "Completed":
      return "info";
    default:
      return "primary";
  }
};

export const consignSaleColumns: Column<ConsignSaleListResponse>[] = [
  {
    Header: "Consignment Code",
    accessor: "consignSaleCode",
  },
  {
    Header: "Created Date",
    accessor: "createdDate",
    Cell: ({ value }: { value: string | undefined }) =>
      value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    Header: "Consignor",
    accessor: "consginor",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }: { value: ConsignSaleStatus | undefined }) => (
      <span className={`badge badge-light-${getStatusColor(value)}`}>
        {value}
      </span>
    ),
  },
  {
    Header: "Method",
    accessor: "consignSaleMethod",
  },
  {
    Header: "Total Price",
    accessor: "totalPrice",
    Cell: ({ value }: { value: number | undefined }) => (
      <strong>{formatBalance(value || 0)} VND</strong>
    ),
  },
  {
    Header: "Sold Price",
    accessor: "soldPrice",
    Cell: ({ value }: { value: number | undefined }) =>
      `${formatBalance(value || 0)} VND`,
  },
  {
    Header: "Actions",
    accessor: "consignSaleId",
    Cell: ({ value }: { value: string | undefined | null }) => (
      <Link
        to={`/consignment/${value}`}
        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
      >
        <KTIcon iconName="pencil" className="fs-3" />
      </Link>
    ),
  },
];

export const consignAuctionColumns: Column<ConsignSaleListResponse>[] = [
  {
    Header: "Auction Code",
    accessor: "consignSaleCode",
  },
  {
    Header: "Created Date",
    accessor: "createdDate",
    Cell: ({ value }: { value: string | undefined }) =>
      value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    Header: "Method",
    accessor: "consignSaleMethod",
  },
  {
    Header: "Consignor",
    accessor: "consginor",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }: { value: ConsignSaleStatus | undefined }) => (
      <span className={`badge badge-light-${getStatusColor(value)}`}>
        {value}
      </span>
    ),
  },
  // {
  //   Header: "Initial Price",
  //   accessor: "initialPrice",
  //   Cell: ({ value }: { value: number | undefined }) => (
  //     <strong>{formatBalance(value || 0)} VND</strong>
  //   ),
  // },

  {
    Header: "Actions",
    accessor: "consignSaleId",
    Cell: ({ value }: { value: string | undefined | null }) => (
      <Link
        to={`/consignment/${value}`}
        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
      >
        <KTIcon iconName="pencil" className="fs-3" />
      </Link>
    ),
  },
];
export const customerSaleColumns: Column<ConsignSaleListResponse>[] = [
  {
    Header: "Customer Sale Code",
    accessor: "consignSaleCode",
  },
  {
    Header: "Created Date",
    accessor: "createdDate",
    Cell: ({ value }: { value: string | undefined }) =>
      value ? new Date(value).toLocaleString() : "N/A",
  },
  {
    Header: "Consignor",
    accessor: "consginor",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }: { value: ConsignSaleStatus | undefined }) => (
      <span className={`badge badge-light-${getStatusColor(value)}`}>
        {value}
      </span>
    ),
  },
  {
    Header: "Actions",
    accessor: "consignSaleId",
    Cell: ({ value }: { value: string | undefined | null }) => (
      <Link
        to={`/consignment/${value}`}
        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
      >
        <KTIcon iconName="pencil" className="fs-3" />
      </Link>
    ),
  },
];
