import React, { useCallback, useEffect, useRef, useState } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "../../../_metronic/assets/ts/_utils";
import { useThemeMode } from "../../../_metronic/partials";
import {
  AccountApi,
  DashboardApi,
  OrderApi,
  ShopApi,
  ShopDetailResponse,
  TransactionApi,
} from "../../../api";
import { showAlert } from "../../../utils/Alert";
import { KTIcon } from "../../../_metronic/helpers"; // Import your icon component

type Props = {
  className: string;
};

const getChartOptions = (revenueData: number[]): ApexOptions => {
  return {
    series: [
      {
        name: "Revenue",
        data: revenueData,
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    // ... other chart options ...
  };
};

const Chart: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [shops, setShops] = useState<ShopDetailResponse[]>([]);
  const [isYearInputDisabled, setIsYearInputDisabled] = useState<boolean>(true);
  const [inputYear, setInputYear] = useState<string>("2024");

  const refreshMode = useCallback(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(revenueData)
    );
    if (chart) {
      chart.render();
    }

    return chart;
  }, [revenueData]);

  useEffect(() => {
    const chart = refreshMode();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode, revenueData, refreshMode]);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalStaff();
    fetchTotalOrders();
    fetchTotalTransactions();
  }, []);

  useEffect(() => {
    if (selectedShopId) {
      fetchRevenueData(selectedShopId, Number(selectedYear));
      setIsYearInputDisabled(false);
    } else {
      setIsYearInputDisabled(true);
    }
  }, [selectedYear, selectedShopId]);

  const fetchShops = async () => {
    const shopAPI = new ShopApi();
    const shopResponse = await shopAPI.apiShopsGet();
    if (shopResponse.data.resultStatus === "Success" && shopResponse.data) {
      setShops(shopResponse.data.data ?? []);
    } else {
      setShops([]);
    }
  };

  const fetchTotalUsers = async () => {
    const accountAPI = new AccountApi();
    const usersResponse = await accountAPI.apiAccountsGet();
    setTotalUsers(usersResponse.data.totalCount ?? 0);
  };

  const fetchTotalStaff = async () => {
    const accountAPI = new AccountApi();
    const staffResponse = await accountAPI.apiAccountsGet(
      null!,
      null!,
      null!,
      null!,
      "Staff"
    );
    setTotalStaff(staffResponse.data.totalCount ?? 0);
  };

  const fetchTotalOrders = async () => {
    const orderAPI = new OrderApi();
    const ordersResponse = await orderAPI.apiOrdersGet();
    setTotalOrders(ordersResponse.data.totalCount ?? 0);
  };

  const fetchTotalTransactions = async () => {
    const transactionAPI = new TransactionApi();
    const transactionsResponse = await transactionAPI.apiTransactionsGet();
    setTotalTransactions([transactionsResponse.data?.data?.totalCount ?? 0]);
  };

  const fetchRevenueData = async (shopId: string, year: number) => {
    const revenueAPI = new DashboardApi();
    const revRespond = await revenueAPI.shopShopIdMonthlyOfflineRevenueGet(
      shopId,
      year
    );

    const formattedData = revRespond.data.monthlyRevenue!.map(
      (item) => item.revenue ?? 0
    );

    setRevenueData(formattedData);
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Revenue for {selectedYear}
          </span>
          <span className="text-muted fw-semibold fs-7">
            Monthly revenue data
          </span>
        </h3>
        <div className="card-toolbar">
          <select
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            className="form-control"
          >
            <option value="">Select Shop</option>
            {shops.map((shop) => (
              <option key={shop.shopId} value={shop.shopId}>
                {shop.address}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={inputYear}
            onChange={(e) => setInputYear(e.target.value)}
            placeholder="Enter year and press Enter"
            className="form-control"
            disabled={isYearInputDisabled}
          />
        </div>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <div className="card border">
              <div className="card-body d-flex align-items-center">
                <KTIcon iconName="user" className="fs-2 text-primary me-3" />
                <div>
                  <h4>Total Users</h4>
                  <p>{totalUsers}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border">
              <div className="card-body d-flex align-items-center">
                <KTIcon iconName="group" className="fs-2 text-success me-3" />
                <div>
                  <h4>Total Staff</h4>
                  <p>{totalStaff}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border">
              <div className="card-body d-flex align-items-center">
                <KTIcon
                  iconName="shopping-cart"
                  className="fs-2 text-warning me-3"
                />
                <div>
                  <h4>Total Orders</h4>
                  <p>{totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border">
              <div className="card-body d-flex align-items-center">
                <KTIcon iconName="money" className="fs-2 text-danger me-3" />
                <div>
                  <h4>Total Transactions</h4>
                  <p>{totalTransactions[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={chartRef}
          id="kt_charts_widget_3_chart"
          style={{ height: "350px" }}
        ></div>
      </div>
    </div>
  );
};

export { Chart };
