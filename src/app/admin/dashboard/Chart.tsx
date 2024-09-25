/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useThemeMode } from "../../../_metronic/partials";
import {
  AccountApi,
  DashboardApi,
  OrderApi,
  ShopApi,
  ShopDetailResponse,
  TransactionApi,
} from "../../../api";
import { KTIcon } from "../../../_metronic/helpers";

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
    // Các cấu hình biểu đồ khác ...
  };
};

const Chart: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [revenueData, setRevenueData] = useState<number[]>([]);
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
    <div className="row --gap-5">
      {/* Wrapper column that spans the entire width */}
      <div className="col-24">
        <div className="row">
          {/* Revenue column */}
          <div className="col-xl">
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
                <div
                  ref={chartRef}
                  id="kt_charts_widget_3_chart"
                  style={{ height: "350px" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Totals column */}
        </div>
      </div>
    </div>
  );
};

export { Chart };
