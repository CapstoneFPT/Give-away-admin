import React, { useCallback, useEffect, useRef, useState } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "../../../_metronic/assets/ts/_utils";
import { useThemeMode } from "../../../_metronic/partials";
import { DashboardApi, ShopApi, ShopDetailResponse } from "../../../api";
import { showAlert } from "../../../utils/Alert";

type Props = {
  className: string;
};

const Chart: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2024"); // Default year
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [shops, setShops] = useState<ShopDetailResponse[]>([]); // State to store shops
  const [isYearInputDisabled, setIsYearInputDisabled] = useState<boolean>(true); // Disable year input initially
  const [inputYear, setInputYear] = useState<string>("2024"); // New state for input year

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
    fetchShops(); // Fetch shops when the component mounts
  }, []);

  useEffect(() => {
    if (selectedShopId) {
      fetchRevenueData(selectedShopId, Number(selectedYear));
      setIsYearInputDisabled(false); // Enable year input when a shop is selected
    } else {
      setIsYearInputDisabled(true); // Disable year input if no shop is selected
    }
  }, [selectedYear, selectedShopId]);

  const fetchShops = async () => {
    const shopAPI = new ShopApi();
    const shopResponse = await shopAPI.apiShopsGet();
    console.log(shopResponse);

    // Safely handle the case where data might be null or undefined
    if (shopResponse.data.resultStatus === "Success" && shopResponse.data) {
      setShops(shopResponse.data.data ?? []); //
    } else {
      setShops([]); // Default to an empty array if no valid data
    }
  };

  const fetchRevenueData = async (shopId: string, year: number) => {
    const revenueAPI = new DashboardApi();
    const revRespond = await revenueAPI.shopShopIdMonthlyOfflineRevenueGet(
      shopId,
      year
    );

    // Provide a default value of 0 for any undefined revenue
    const formattedData = revRespond.data.monthlyRevenue!.map(
      (item) => item.revenue ?? 0
    );

    setRevenueData(formattedData);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputYear(e.target.value);
  };

  const handleYearKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const year = parseInt(inputYear, 10);
      if (
        !isNaN(year) &&
        year >= 2000 &&
        year <= 3000 &&
        inputYear.length === 4
      ) {
        setSelectedYear(inputYear);
      } else {
        // Reset to previous valid year if input is invalid
        setInputYear(selectedYear);
        showAlert(
          "error",
          "Please enter a valid 4-digit year between 2000 and 3000."
        );
      }
    }
  };

  const handleShopChange = (shopId: string) => {
    setSelectedShopId(shopId);
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
          {/* Shop Selection */}
          <select
            value={selectedShopId}
            onChange={(e) => handleShopChange(e.target.value)}
            className="form-control"
          >
            <option value="">Select Shop</option>
            {shops.map((shop) => (
              <option key={shop.shopId} value={shop.shopId}>
                {shop.address}
              </option>
            ))}
          </select>

          {/* Year Selection */}
          <input
            type="text"
            value={inputYear}
            onChange={handleYearChange}
            onKeyPress={handleYearKeyPress}
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
  );
};

export { Chart };

function getChartOptions(revenueData: number[]): ApexOptions {
  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-gray-200");
  const baseColor = getCSSVariableValue("--bs-success");
  const lightColor = getCSSVariableValue("--bs-success-light");

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
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
      crosshairs: {
        position: "front",
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return val + " VND";
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  };
}
