import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
// import { KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { ConsignSaleApi, ConsignSaleStatus } from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import consignSaleColumns from "./_columns";

const ConsignTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [consignorName, setConsignorName] = useState("");
  const [consignorPhone, setConsignorPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConsignSaleStatus | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useAuth();
  const pageSize = 10;

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const consignSaleApi = new ConsignSaleApi();
        const response = await consignSaleApi.apiConsignsalesGet(
          page,
          pageSize,
          currentUser?.shopId,
          searchTerm,
          null!,
          null!,
          statusFilter as ConsignSaleStatus,
          null!,
          null!,
          consignorName,
          consignorPhone
        );

        if (!response || !response.data) {
          throw new Error("No data received from the API");
        }

        return {
          data: response.data.items || [],
          pageCount: response.data.totalPages || 0,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    [
      searchTerm,
      consignorName,
      consignorPhone,
      statusFilter,
      currentUser?.shopId,
    ]
  );

  const { data, isLoading, error } = useQuery(
    [
      "Consign",
      searchTerm,
      consignorName,
      consignorPhone,
      statusFilter,
      currentPage,
    ],
    () => fetchData(currentPage, pageSize),
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <div className={`card`}>
        <div className="card-header border-0 pt-5">
          <div className="card-toolbar">
            <div className="d-flex align-items-center">
              <input
                type="text"
                name="consignSaleCode"
                className="form-control form-control-solid w-250px me-2"
                placeholder="Search by Consignment Code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                name="consignorName"
                className="form-control form-control-solid w-225px me-2"
                placeholder="Search by Consignor Name"
                value={consignorName}
                onChange={(e) => setConsignorName(e.target.value)}
              />
              <input
                type="text"
                name="consignorPhone"
                className="form-control form-control-solid w-225px me-2"
                placeholder="Search by Consignor Phone"
                value={consignorPhone}
                onChange={(e) => setConsignorPhone(e.target.value)}
              />
              <select
                name="statusFilter"
                className="form-select form-select-solid w-200px me-2"
                value={statusFilter || ""}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ConsignSaleStatus)
                }
              >
                <option value="">All Statuses</option>
                {Object.values(ConsignSaleStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <KTTable
          columns={consignSaleColumns}
          data={data?.data || []}
          totalCount={data?.totalCount || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          loading={isLoading}
          totalPages={data?.totalPages || 0}
        />
      </div>
    </Content>
  );
};

export default ConsignTable;
