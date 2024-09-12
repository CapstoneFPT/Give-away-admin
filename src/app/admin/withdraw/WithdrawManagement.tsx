import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import {
  WithdrawApi,
  WithdrawStatus,
  GetWithdrawsResponse,
} from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { formatBalance } from "../../pages/utils/utils";
import { toast } from "react-toastify";

type WithdrawColumnCellProps = {
  value: string | number;
  row: { original: GetWithdrawsResponse };
};

type WithdrawColumn = {
  Header: string;
  accessor: keyof GetWithdrawsResponse;
  Cell?: (props: WithdrawColumnCellProps) => React.ReactNode;
};

const WithdrawManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WithdrawStatus>(
    WithdrawStatus.Completed
  );

  const withdrawApi = useMemo(() => new WithdrawApi(), []);

  const queryClient = useQueryClient();

  const confirmWithdrawMutation = useMutation(
    (withdrawId: string) =>
      withdrawApi.apiWithdrawsWithdrawIdCompleteRequestPut(withdrawId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["withdraws"]);
        toast.success("Withdraw confirmed successfully");
      },
      onError: (error) => {
        toast.error(`Failed to confirm withdraw: ${error}`);
      },
    }
  );

  const handleConfirmWithdraw = useCallback(
    (withdrawId: string) => {
      confirmWithdrawMutation.mutate(withdrawId);
    },
    [confirmWithdrawMutation]
  );

  const fetchWithdraws = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const response = await withdrawApi.apiWithdrawsGet(
          page,
          pageSize,
          statusFilter || undefined,
          searchTerm
        );
        return {
          data: response.data.items || [],
          pageCount: response.data.totalPages || 0,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
        };
      } catch (error) {
        console.error("Error fetching withdraws:", error);
        throw error;
      }
    },
    [withdrawApi, searchTerm, statusFilter]
  );

  const { data, isLoading, error } = useQuery(
    ["withdraws", currentPage, pageSize, searchTerm, statusFilter],
    () => fetchWithdraws(currentPage, pageSize),
    { keepPreviousData: true }
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns = useMemo<WithdrawColumn[]>(() => {
    const baseColumns: WithdrawColumn[] = [
      {
        Header: "Withdraw Code",
        accessor: "withdrawCode",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }: WithdrawColumnCellProps) =>
          formatBalance(value as number) + " VND",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Created Date",
        accessor: "createdDate",
        Cell: ({ value }: WithdrawColumnCellProps) =>
          new Date(value as string).toLocaleString(),
      },
    ];

    if (statusFilter === WithdrawStatus.Processing) {
      baseColumns.push({
        Header: "Actions",
        accessor: "withdrawId",
        Cell: ({ row }: WithdrawColumnCellProps) => (
          <button
            className="btn btn-sm btn-light-primary"
            onClick={() => handleConfirmWithdraw(row.original.withdrawId || "")}
            disabled={confirmWithdrawMutation.isLoading}
          >
            Confirm
          </button>
        ),
      });
    }

    return baseColumns;
  }, [statusFilter, confirmWithdrawMutation.isLoading, handleConfirmWithdraw]);

  const withdraws = useMemo(() => {
    return data?.data || [];
  }, [data]);

  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <KTCard>
        <KTCardBody>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="card-title">Withdraw Management</h3>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-solid me-2"
                style={{ width: "300px" }}
                placeholder="Search withdraws with withdraw code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select form-select-solid me-2"
                style={{ width: "200px" }}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as WithdrawStatus)
                }
              >
                <option value={WithdrawStatus.Processing}>Processing</option>
                <option value={WithdrawStatus.Completed}>Completed</option>
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
              data={withdraws}
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

export default WithdrawManagement;
