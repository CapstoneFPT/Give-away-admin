import { Column } from "react-table";
import {
  OrderListResponse,
  OrderStatus,
  PaymentMethod,
  PurchaseType,
} from "../../../api";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../_metronic/helpers";
import {
  dateTimeOptions,
  formatBalance,
  paymentMethod,
  purchaseType,
  VNLocale,
} from "../../pages/utils/utils";

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "AwaitingPayment":
      return "warning";
    case "Completed":
      return "success";
    case "Cancelled":
      return "danger";
    case "Pending":
      return "info";
    default:
      return "secondary";
  }
};
export const orderListAdminColumns: Column<OrderListResponse>[] = [
  {
    Header: "Order Code",
    accessor: "orderCode",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Created Date",
    accessor: "createdDate",
    Cell: ({ value }: { value: string | undefined }) =>
      value ? new Date(value).toLocaleString(VNLocale, dateTimeOptions) : "N/A",
  },
  {
    Header: "Payment Method",
    accessor: "paymentMethod",
    Cell: ({ value }: { value: PaymentMethod | undefined }) =>
      value ? (
        <span className={`badge badge-light-${paymentMethod(value)}`}>
          {value}
        </span>
      ) : (
        "N/A"
      ),
  },
  {
    Header: "Payment Date",
    accessor: "paymentDate",
    Cell: ({ value }: { value: string | null | undefined }) =>
      value ? new Date(value).toLocaleString(VNLocale, dateTimeOptions) : "N/A",
  },
  {
    Header: "Completed Date",
    accessor: "completedDate",
    Cell: ({ value }: { value: string | null | undefined }) =>
      value ? new Date(value).toLocaleString(VNLocale, dateTimeOptions) : "N/A",
  },
  {
    Header: "Customer Name",
    accessor: "customerName",
  },
  {
    Header: "Contact Number",
    accessor: "contactNumber",
  },
  {
    Header: "Purchase Type",
    accessor: "purchaseType",
    Cell: ({ value }: { value: PurchaseType | undefined }) =>
      value ? (
        <span className={`badge badge-light-${purchaseType(value)}`}>
          {value}
        </span>
      ) : (
        "N/A"
      ),
  },
  {
    Header: "Total Price",
    accessor: "totalPrice",
    Cell: ({ value }: { value: number | undefined }) =>
      value ? <strong>{formatBalance(value)} VND</strong> : "N/A",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ value }: { value: OrderStatus | undefined }) =>
      value ? (
        <span className={`badge badge-light-${getStatusBadge(value)}`}>
          {value}
        </span>
      ) : (
        "N/A"
      ),
  },
  {
    Header: "Auction Title",
    accessor: "auctionTitle",
  },
  {
    Header: "Actions",
    accessor: "orderId",
    Cell: ({ value }: { value: string | undefined }) =>
      value ? (
        <Link
          to={`/order-admin/${value}`}
          className="btn btn-sm btn-light btn-active-light-primary"
        >
          <KTIcon iconName="pencil" className="fs-5" />
          Detail
        </Link>
      ) : (
        "N/A"
      ),
  },
];

export default orderListAdminColumns;
