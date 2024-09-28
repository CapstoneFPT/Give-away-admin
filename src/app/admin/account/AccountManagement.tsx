import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { AccountApi, AccountStatus, Roles } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import CreateStaffModal from "./CreateStaffAccount";
import CreateShopModal from "./CreateShopModal";
import { showAlert } from "../../../utils/Alert";

const AccountManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"Member" | "Staff">("Member");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "">(
    AccountStatus.Active
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const [showCreateShopModal, setShowCreateShopModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const fetchAccounts = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const accountApi = new AccountApi();
        const response = await accountApi.apiAccountsGet(
          page,
          pageSize,
          searchTerm,
          undefined, // phone parameter, we're not using it here
          activeTab === "Member" ? Roles.Member : Roles.Staff,
          statusFilter ? [statusFilter as AccountStatus] : undefined
        );

        return {
          data: response.data.items || [],
          pageCount: response.data.totalPages || 0,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
        };
      } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
      }
    },
    [searchTerm, statusFilter, activeTab]
  );

  const { data, isLoading, error, isFetching, refetch } = useQuery(
    ["accounts", searchTerm, statusFilter, currentPage, activeTab],
    async () => {
      const response = await fetchAccounts(currentPage, pageSize);
      return response;
    },
    { keepPreviousData: true }
  );
  console.log(data);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (tab: "Member" | "Staff") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const banUnbanMutation = useMutation(
    (accountId: string) => {
      const accountApi = new AccountApi();
      return accountApi.apiAccountsIdBanPut(accountId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["accounts"]);
        refetch();
        showAlert("success", "Account status updated successfully");
      },
      onError: (error) => {
        showAlert(
          "error",
          "Failed to update account status " + (error as Error).message
        );
      },
    }
  );

  const handleBanUnban = useCallback(
    (accountId: string) => {
      banUnbanMutation.mutate(accountId);
    },
    [banUnbanMutation]
  );

  const handleCreateShop = (staffId: string) => {
    setSelectedStaffId(staffId);
    setShowCreateShopModal(true);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Full Name",
        accessor: "fullname",
      },
      {
        Header: "Role",
        accessor: "role",
      },

      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: { value: AccountStatus }) => (
          <span
            className={`badge badge-light-${
              value === AccountStatus.Active ? "success" : "danger"
            }`}
          >
            {value}
          </span>
        ),
      },
    ];

    if (activeTab === "Staff") {
      return [
        ...baseColumns,
        {
          Header: "Shop Code",
          accessor: "shopCode",

          Cell: ({
            value,
            row,
          }: {
            value: string | null;
            row: { original: { accountId: string } };
          }) => {
            if (value && value !== "N/A") {
              return value;
            }
            return (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleCreateShop(row.original.accountId)}
              >
                Create Shop
              </button>
            );
          },
        },
      ];
    }

    return [
      ...baseColumns,
      {
        Header: "Action",
        accessor: "accountId",
        Cell: ({
          row,
        }: {
          row: { original: { accountId: string; status: AccountStatus } };
        }) => {
          const isActive = row.original.status === AccountStatus.Active;
          const isLoading =
            banUnbanMutation.isLoading &&
            banUnbanMutation.variables === row.original.accountId;

          return (
            <button
              className={`btn btn-sm ${
                isActive ? "btn-light-danger" : "btn-light-success"
              }`}
              onClick={() => handleBanUnban(row.original.accountId)}
              disabled={banUnbanMutation.isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : isActive ? (
                "Ban"
              ) : (
                "Unban"
              )}
            </button>
          );
        },
      },
    ];
  }, [
    activeTab,
    banUnbanMutation.isLoading,
    banUnbanMutation.variables,
    handleBanUnban,
  ]);

  const handleCreateStaffAccount = () => {
    setShowCreateStaffModal(true);
  };

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <KTCard>
        <KTCardBody>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h3 className="card-title">Account Management</h3>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-solid me-2"
                style={{ width: "300px" }}
                placeholder="Search accounts (Email or Phone)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select form-select-solid me-2"
                style={{ width: "150px" }}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AccountStatus | "")
                }
              >
                {Object.values(AccountStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {activeTab === "Staff" && (
                <button
                  className="btn btn-primary"
                  onClick={handleCreateStaffAccount}
                >
                  Create Staff Account
                </button>
              )}
            </div>
          </div>

          <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "Member" ? "active" : ""}`}
                onClick={() => handleTabChange("Member")}
              >
                Member Accounts
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "Staff" ? "active" : ""}`}
                onClick={() => handleTabChange("Staff")}
              >
                Staff Accounts
              </a>
            </li>
          </ul>

          {isLoading || isFetching ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <KTTable
                columns={columns}
                data={data != undefined ? data.data || [] : []}
                totalCount={data != undefined ? data.totalCount || 0 : 0}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                loading={isLoading || isFetching}
                totalPages={data != undefined ? data.totalPages || 0 : 0}
              />
              {(isLoading || isFetching) && (
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </KTCardBody>
      </KTCard>
      <CreateStaffModal
        show={showCreateStaffModal}
        onHide={() => setShowCreateStaffModal(false)}
      />
      <CreateShopModal
        show={showCreateShopModal}
        onHide={() => setShowCreateShopModal(false)}
        staffId={selectedStaffId}
      />
    </Content>
  );
};

export default AccountManagement;
