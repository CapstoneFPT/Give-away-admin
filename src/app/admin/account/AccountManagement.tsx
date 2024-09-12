import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { KTCard, KTCardBody } from "../../../_metronic/helpers";
import { AccountApi, AccountStatus, Roles } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import { formatBalance } from "../../pages/utils/utils";

const AccountManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Member" | "Staff">("Member");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  console.log(statusFilter);
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

  const { data, isLoading, error } = useQuery(
    ["accounts", searchTerm, statusFilter, currentPage, activeTab],
    () => fetchAccounts(currentPage, pageSize),
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
        Header: "Balance",
        accessor: "balance",
        Cell: ({ value }: { value: number }) => formatBalance(value),
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Actions",
        accessor: "accountId",
        Cell: ({ value }: { value: string }) => (
          <button
            className="btn btn-sm btn-light-primary"
            onClick={() => handleEdit(value)}
          >
            Edit
          </button>
        ),
      },
    ];

    if (activeTab === "Staff") {
      return [
        ...baseColumns.slice(0, 6),
        {
          Header: "Shop ID",
          accessor: "shopId",
          Cell: ({ value }: { value: string | null }) => value || "N/A",
        },
        ...baseColumns.slice(6),
      ];
    }

    return baseColumns;
  }, [activeTab]);

  const handleEdit = (accountId: string) => {
    console.log("Edit account:", accountId);
  };

  const handleCreateStaffAccount = () => {
    console.log("Create staff account");
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
                <option value="">All Statuses</option>
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
              data={data?.data || []}
              totalCount={data?.totalCount || 0}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              loading={isLoading}
              totalPages={data?.totalPages || 0}
            />
          )}
        </KTCardBody>
      </KTCard>
    </Content>
  );
};

export default AccountManagement;
