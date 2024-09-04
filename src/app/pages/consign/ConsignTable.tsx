import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { KTCardBody, KTIcon } from "../../../_metronic/helpers";
import { ConsignSaleApi, ConsignSaleListResponse, ConsignSaleStatus } from "../../../api";
import { formatBalance } from "../utils/utils";
import { Link } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import axios from "axios";
import { useAuth } from "../../modules/auth";
import { KTTable } from '../../../_metronic/helpers/components/KTTable';
import { Column } from "react-table";
import consignSaleColumns from "./_columns";

const ConsignTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [consignorName, setConsignorName] = useState("");
  const [consignorPhone, setConsignorPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConsignSaleStatus | null>(null);
  const { currentUser } = useAuth();
  const pageSize = 10;

  

  const fetchData = React.useCallback(
    async (pageIndex: number, pageSize: number, sortBy: any) => {
      try {
        const consignSaleApi = new ConsignSaleApi();
        const response = await consignSaleApi.apiConsignsalesGet(
          pageIndex + 1,
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
          pageCount: Math.ceil(response.data.totalCount! / pageSize),
          totalCount: response.data.totalCount!,
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    [searchTerm, consignorName, consignorPhone, statusFilter, currentUser?.shopId]
  );

  const { data, isLoading, error } = useQuery(
    ["Consign", searchTerm, consignorName, consignorPhone, statusFilter],
    () => fetchData(0, pageSize, []),
    { refetchOnWindowFocus: false, keepPreviousData: true }
  );

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
                onChange={(e) => setStatusFilter(e.target.value as ConsignSaleStatus)}
              >
                <option value="">All Statuses</option>
                {Object.values(ConsignSaleStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <a href="#" className="btn btn-sm btn-light-primary">
              <KTIcon iconName="plus" className="fs-2" />
              New Consignment
            </a>
          </div>
        </div>

        <KTTable
          columns={consignSaleColumns}
          data={data?.data || []}
          totalCount={data?.totalCount || 0}
          pageCount={data?.pageCount || 0}
          fetchData={fetchData}
          loading={isLoading}
        />
      </div>
    </Content>
  );
};



export default ConsignTable;
