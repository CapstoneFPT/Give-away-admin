/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { TransactionApi, TransactionType } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { formatBalance } from "../../pages/utils/utils";
import { useAuth } from "../../modules/auth";
import ExportTransactionToExcelModal from "./ExportTransactionToExcelModal";

const TransactionManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const shopId = currentUser?.shopId;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    TransactionType | ""
  >(null!);
  const [showExportModal, setShowExportModal] = useState(false);

  const transactionApi = new TransactionApi();
  console.log(shopId);
  const { data, isLoading, error } = useQuery(
    ["transactions", currentPage, pageSize, shopId, transactionTypeFilter],
    async () => {
      const response = await transactionApi.apiTransactionsGet(
        currentPage,
        pageSize,
        shopId,
        transactionTypeFilter || null!
      );
      return response.data.data;
    },
    {
      keepPreviousData: true,
    }
  );
  console.log(data);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleTransactionTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTransactionTypeFilter(event.target.value as TransactionType);
    setCurrentPage(1);
  };
  const columns = useMemo(
    () => [
      {
        Header: "Transaction Code",
        accessor: "transactionCode",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }: { value: number }) => formatBalance(value) + " VND",
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
      {
        Header: "Type",
        accessor: "transactionType",
      },
      {
        Header: "Created Date",
        accessor: "createdDate",
        Cell: ({ value }: { value: string }) =>
          new Date(value).toLocaleString(),
      },
      {
        Header: "Order Code",
        accessor: "productCode",
      },
      {
        Header: "Customer Name",
        accessor: "customerName",
      },
      {
        Header: "Customer Phone",
        accessor: "customerPhone",
      },
    ],
    []
  );

  const totalCount = data != undefined ? data.totalCount : 0;
  const totalPages = data != undefined ? data.totalPages : 1;

  const handleExport = async (filters: any) => {
    try {
      const response = await transactionApi.apiTransactionsExportExcelGet(
        filters.startDate,
        filters.endDate,
        filters.types.length > 0 ? filters.types : undefined,
        filters.paymentMethods.length > 0 ? filters.paymentMethods : undefined,
        shopId || filters.shopId,
        filters.minAmount ? Number(filters.minAmount) : undefined,
        filters.maxAmount ? Number(filters.maxAmount) : undefined,
        filters.senderName,
        filters.receiverName,
        filters.transactionCode,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `TransactionReport_${new Date().toISOString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <KTCard>
        <KTCardBody>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="card-title">Transaction Management</h3>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-solid me-2"
                style={{ width: "300px" }}
                placeholder="Search transactions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select form-select-solid me-2"
                style={{ width: "200px" }}
                value={transactionTypeFilter}
                onChange={handleTransactionTypeChange}
              >
                <option value="">All Types</option>
                {Object.values(TransactionType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                onClick={() => setShowExportModal(true)}
              >
                Export to Excel
              </button>
            </div>
          </div>

          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <KTTable
              columns={columns}
              data={data?.items || []}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              loading={isLoading}
              totalCount={totalCount != undefined ? totalCount : 0}
              totalPages={totalPages != undefined ? totalPages : 1}
            />
          )}
        </KTCardBody>
      </KTCard>

      <ExportTransactionToExcelModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </Content>
  );
};

export default TransactionManagement;
