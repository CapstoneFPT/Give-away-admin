import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import {
  ConsignSaleApi,
  ConsignSaleStatus,
  ShopApi,
  ConsignSaleType,
} from "../../../api";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth";
import { KTTable } from "../../../_metronic/helpers/components/KTTable";
import {
  consignSaleColumns,
  consignAuctionColumns,
  customerSaleColumns,
} from "./_columns";
import { Tabs, Tab } from "react-bootstrap";
import ExportConsignSaleToExcelModal from "./ExportConsignSaleToExcelModal";

const ConsignTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [consignorName, setConsignorName] = useState("");
  const [consignorPhone, setConsignorPhone] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ConsignSaleStatus | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [shops, setShops] = useState<Array<{ id: string; name: string }>>([]);
  const [consignType, setConsignType] = useState<ConsignSaleType>(
    ConsignSaleType.ConsignedForSale
  );
  const { currentUser } = useAuth();
  const pageSize = 10;
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  useEffect(() => {
    if (currentUser?.role === "Admin") {
      const fetchShops = async () => {
        try {
          const shopApi = new ShopApi();
          const response = await shopApi.apiShopsGet();
          if (response.data && response.data.data) {
            setShops(
              response.data.data.map((shop) => ({
                id: shop.shopId!,
                name: shop.address!,
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching shops:", error);
        }
      };
      fetchShops();
    }
  }, [currentUser?.role]);

  const fetchData = useCallback(
    async (page: number, pageSize: number, type: ConsignSaleType) => {
      try {
        const consignSaleApi = new ConsignSaleApi();
        const shopId =
          currentUser?.role === "Admin"
            ? selectedShop || undefined
            : currentUser?.shopId;

        const response = await consignSaleApi.apiConsignsalesGet(
          page,
          pageSize,
          shopId,
          searchTerm, // This will work for both consignSaleCode and consignmentCode
          undefined,
          undefined,
          statusFilter || undefined,
          type,
          undefined,
          consignorName, // This will work for both consignor and customer name
          consignorPhone // This will work for both consignor and customer phone
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
      currentUser?.role,
      currentUser?.shopId,
      selectedShop,
    ]
  );

  const { data, isLoading, error, refetch } = useQuery(
    [
      "Consign",
      searchTerm,
      consignorName,
      consignorPhone,
      statusFilter,
      currentPage,
      selectedShop,
      consignType,
    ],
    async () => {
      const response = await fetchData(currentPage, pageSize, consignType)
      return response
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: false,
      enabled: currentUser?.role === "Admin" ? selectedShop !== null : true,
    }
  );
  console.log(data);
  useEffect(() => {
    if (currentUser?.role === "Admin") {
      refetch();
    }
  }, [selectedShop, currentUser?.role, refetch]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleConsignTypeChange = (type: ConsignSaleType) => {
    setIsTabSwitching(true);
    setConsignType(type);
    setCurrentPage(1);
    setSearchTerm("");
    setConsignorName("");
    setConsignorPhone("");
    setStatusFilter(null);
    // Use setTimeout to ensure state updates before refetching
    setTimeout(() => {
      refetch().then(() => {
        setIsTabSwitching(false);
      });
    }, 0);
  };
  const handleExport = async (filters: any) => {
    try {
      const consignSaleApi = new ConsignSaleApi();
      const response = await consignSaleApi.apiConsignsalesExportExcelGet(
        filters.consignSaleCode,
        filters.memberName,
        filters.phone,
        currentUser?.role === "Admin" ? filters.shopId : currentUser?.shopId,
        filters.email,
        filters.statuses.length > 0 ? filters.statuses : undefined,
        filters.types.length > 0 ? filters.types : undefined,
        filters.consignSaleMethods.length > 0 ? filters.consignSaleMethods : undefined,
        filters.startDate,
        filters.endDate,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ConsignmentReport_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting consignments:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "searchTerm":
        setSearchTerm(value);
        break;
      case "consignorName":
        setConsignorName(value);
        break;
      case "consignorPhone":
        setConsignorPhone(value);
        break;
    }
    setCurrentPage(1);
    refetch();
  };

  const renderFilters = () => {
    const commonFilters = (
      <>
        <input
          type="text"
          name="searchTerm"
          className="form-control form-control-solid w-250px me-2"
          placeholder="Search by Sale Code"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="consignorName"
          className="form-control form-control-solid w-225px me-2"
          placeholder="Search by Name"
          value={consignorName}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="consignorPhone"
          className="form-control form-control-solid w-225px me-2"
          placeholder="Search by Phone"
          value={consignorPhone}
          onChange={handleSearchChange}
        />
        {consignType !== ConsignSaleType.CustomerSale && (
          <select
            name="statusFilter"
            className="form-select form-select-solid w-200px me-2"
            value={statusFilter || ""}
            onChange={(e) => {
              setStatusFilter(e.target.value as ConsignSaleStatus);
              setCurrentPage(1);
              refetch();
            }}
          >
            <option value="">All Statuses</option>
            {Object.values(ConsignSaleStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
        {currentUser?.role === "Admin" && (
          <select
            name="shopFilter"
            className="form-select form-select-solid w-200px me-2"
            value={selectedShop || ""}
            onChange={(e) => {
              setSelectedShop(e.target.value || null);
              setCurrentPage(1);
              refetch();
            }}
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        )}
        <button
          className="btn btn-primary"
          onClick={() => setShowExportModal(true)}
        >
          Export to Excel
        </button>
      </>
    );

    return (
      <div className="card-toolbar">
        <div className="d-flex align-items-center">{commonFilters}</div>
      </div>
    );
  };

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Content>
      <div className={`card`}>
        <div className="card-header border-0 pt-5">
          <Tabs
            activeKey={consignType}
            onSelect={(k) => handleConsignTypeChange(k as ConsignSaleType)}
            className="mb-3"
          >
            <Tab
              eventKey={ConsignSaleType.ConsignedForSale}
              title="Consign Sale"
            />
            <Tab
              eventKey={ConsignSaleType.ConsignedForAuction}
              title="Consign Auction"
            />
            <Tab
              eventKey={ConsignSaleType.CustomerSale}
              title="Customer Sale"
            />
          </Tabs>
        </div>

        {renderFilters()}

        {isTabSwitching ? (
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
            columns={
              consignType === ConsignSaleType.ConsignedForSale
                ? consignSaleColumns
                : consignType === ConsignSaleType.ConsignedForAuction
                  ? consignAuctionColumns
                  : customerSaleColumns
            }
            data={data != undefined ? data.data || [] : []}
            totalCount={data != undefined ? data.totalCount || 0 : 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            loading={isLoading}
            totalPages={data != undefined ? data.totalPages || 0 : 0}
          />
        )}
      </div>
      <ExportConsignSaleToExcelModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </Content>
  );
};

export default ConsignTable;
