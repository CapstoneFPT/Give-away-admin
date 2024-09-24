import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { TransactionApi, TransactionType } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { formatBalance } from "../../pages/utils/utils";
import { useAuth } from "../../modules/auth";
const TransactionManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const shopId = currentUser?.shopId;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    TransactionType | ""
  >(null!);

  const transactionApi = new TransactionApi();
  console.log(shopId);
  const { data, isLoading, error } = useQuery(
    ["transactions", currentPage, pageSize, shopId, transactionTypeFilter],
    () =>
      transactionApi.apiTransactionsGet(
        currentPage,
        pageSize,
        shopId,
        transactionTypeFilter || null!
      ),
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

  const transactions = useMemo(() => {
    return data?.data?.data?.items || [];
  }, [data]);

  const totalCount = data?.data?.data?.totalCount || 0;
  const totalPages = data?.data?.data?.totalPages || 1;

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
              data={transactions}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              loading={isLoading}
              totalCount={totalCount}
              totalPages={totalPages}
            />
          )}
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default TransactionManagement;
